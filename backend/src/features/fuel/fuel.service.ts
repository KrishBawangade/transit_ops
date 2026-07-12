import { fuelRepository, FuelLogWithRelations } from "./fuel.repository";
import { ExpenseCategory, Prisma } from "@prisma/client";
import { vehicleService } from "../vehicles/vehicle.service";
import { driverService } from "../drivers/driver.service";
import { expenseRepository } from "../expenses/expense.repository";
import { NotFoundError, BadRequestError } from "../../shared/errors/app-error";

export class FuelService {
  async getFuelLogById(id: string): Promise<FuelLogWithRelations> {
    const log = await fuelRepository.findById(id);
    if (!log) {
      throw new NotFoundError(`Fuel log with ID ${id} not found`);
    }
    return log;
  }

  async createFuelLog(data: Prisma.FuelLogUncheckedCreateInput): Promise<FuelLogWithRelations> {
    // 1. Verify vehicle and driver exist
    const vehicle = await vehicleService.getVehicleById(data.vehicleId);
    const driver = await driverService.getDriverById(data.driverId);

    // 2. Validate quantity and cost
    const qty = Number(data.quantity);
    const costAmount = Number(data.cost);
    if (qty <= 0) {
      throw new BadRequestError("Fuel quantity must be greater than zero");
    }
    if (costAmount <= 0) {
      throw new BadRequestError("Fuel cost must be greater than zero");
    }

    // 3. Validate odometer
    if (data.odometer < vehicle.currentOdometer) {
      throw new BadRequestError(
        `Odometer reading (${data.odometer}) cannot be less than vehicle's current odometer (${vehicle.currentOdometer})`
      );
    }

    const log = await fuelRepository.create(data);

    // 4. Update vehicle odometer
    await vehicleService.updateVehicle(vehicle.id, { currentOdometer: log.odometer });

    // 5. Automatically create corresponding fuel expense
    await expenseRepository.create({
      amount: costAmount,
      category: ExpenseCategory.FUEL,
      description: `Fuel purchase: ${qty}L fuel log`,
      loggedById: driver.userId,
      vehicleId: log.vehicleId,
      tripId: log.tripId,
      fuelLogId: log.id,
      expenseDate: log.refueledAt || new Date(),
    });

    return log;
  }

  async updateFuelLog(
    id: string,
    data: Prisma.FuelLogUpdateInput | Prisma.FuelLogUncheckedUpdateInput
  ): Promise<FuelLogWithRelations> {
    const existingLog = await this.getFuelLogById(id);

    const updatedLog = await fuelRepository.update(id, data);

    // If odometer was updated and it's higher than the vehicle's current odometer, update vehicle
    if (data.odometer) {
      const odo = typeof data.odometer === "number" ? data.odometer : (data.odometer as any).set;
      if (odo) {
        const vehicle = await vehicleService.getVehicleById(updatedLog.vehicleId);
        if (odo > vehicle.currentOdometer) {
          await vehicleService.updateVehicle(vehicle.id, { currentOdometer: odo });
        }
      }
    }

    // Update the corresponding Expense amount/date if fuel cost was updated
    if (data.cost || data.quantity || data.refueledAt) {
      const expenses = await expenseRepository.list({ vehicleId: updatedLog.vehicleId, category: ExpenseCategory.FUEL });
      const linkedExpense = expenses.data.find((e) => e.fuelLogId === updatedLog.id);
      if (linkedExpense) {
        await expenseRepository.update(linkedExpense.id, {
          amount: updatedLog.cost,
          description: `Fuel purchase: ${updatedLog.quantity}L fuel log`,
          expenseDate: updatedLog.refueledAt,
        });
      }
    }

    return updatedLog;
  }

  async deleteFuelLog(id: string): Promise<FuelLogWithRelations> {
    const log = await this.getFuelLogById(id);
    const deletedLog = await fuelRepository.softDelete(id);

    // Find and delete the linked fuel expense
    const expenses = await expenseRepository.list({ vehicleId: log.vehicleId, category: ExpenseCategory.FUEL });
    const linkedExpense = expenses.data.find((e) => e.fuelLogId === log.id);
    if (linkedExpense) {
      await expenseRepository.softDelete(linkedExpense.id);
    }

    return deletedLog;
  }

  async listFuelLogs(params: {
    page?: number;
    limit?: number;
    vehicleId?: string;
    driverId?: string;
    tripId?: string;
  }): Promise<{ data: FuelLogWithRelations[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const { data, total } = await fuelRepository.list({
      skip,
      take: limit,
      vehicleId: params.vehicleId,
      driverId: params.driverId,
      tripId: params.tripId,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

export const fuelService = new FuelService();
