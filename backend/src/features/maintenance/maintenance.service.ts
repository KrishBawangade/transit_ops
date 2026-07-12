import { maintenanceRepository, MaintenanceLogWithRelations } from "./maintenance.repository";
import { MaintenanceStatus, MaintenanceType, VehicleStatus, ExpenseCategory, Prisma } from "@prisma/client";
import { vehicleService } from "../vehicles/vehicle.service";
import { userService } from "../users/user.service";
import { expenseRepository } from "../expenses/expense.repository";
import { NotFoundError, BadRequestError } from "../../shared/errors/app-error";

export class MaintenanceService {
  async getMaintenanceLogById(id: string): Promise<MaintenanceLogWithRelations> {
    const log = await maintenanceRepository.findById(id);
    if (!log) {
      throw new NotFoundError(`Maintenance log with ID ${id} not found`);
    }
    return log;
  }

  async createMaintenanceLog(data: Prisma.MaintenanceLogUncheckedCreateInput): Promise<MaintenanceLogWithRelations> {
    // 1. Verify vehicle and user exist
    const vehicle = await vehicleService.getVehicleById(data.vehicleId);
    await userService.getUserById(data.loggedById);

    // 2. Validate odometer
    if (data.odometerAtService < vehicle.currentOdometer) {
      throw new BadRequestError(
        `odometerAtService (${data.odometerAtService}) cannot be less than vehicle's current odometer (${vehicle.currentOdometer})`
      );
    }

    // 3. Validate cost
    const costAmount = data.cost !== undefined ? Number(data.cost) : 0;
    if (costAmount < 0) {
      throw new BadRequestError("Maintenance cost cannot be negative");
    }

    // 4. Handle end date if status is completed
    if (data.status === MaintenanceStatus.COMPLETED && !data.endDate) {
      data.endDate = new Date();
    }

    const log = await maintenanceRepository.create(data);

    // 5. Update vehicle status and log expense if completed
    if (log.status === MaintenanceStatus.OPEN) {
      await vehicleService.updateVehicle(vehicle.id, { status: VehicleStatus.IN_SHOP });
    } else if (log.status === MaintenanceStatus.COMPLETED) {
      await vehicleService.updateVehicle(vehicle.id, {
        status: VehicleStatus.AVAILABLE,
        currentOdometer: log.odometerAtService,
      });

      if (costAmount > 0) {
        await expenseRepository.create({
          amount: costAmount,
          category: ExpenseCategory.MAINTENANCE,
          description: `Maintenance Log Expense: ${log.description}`,
          loggedById: log.loggedById,
          vehicleId: log.vehicleId,
          maintenanceLogId: log.id,
          expenseDate: log.endDate || new Date(),
        });
      }
    }

    return log;
  }

  async updateMaintenanceLog(
    id: string,
    data: Prisma.MaintenanceLogUpdateInput | Prisma.MaintenanceLogUncheckedUpdateInput
  ): Promise<MaintenanceLogWithRelations> {
    const existingLog = await this.getMaintenanceLogById(id);

    // Track status transitions
    const oldStatus = existingLog.status;
    const newStatus = data.status || oldStatus;

    if (newStatus === MaintenanceStatus.COMPLETED && oldStatus === MaintenanceStatus.OPEN) {
      data.endDate = data.endDate || new Date();
    }

    const updatedLog = await maintenanceRepository.update(id, data);

    // Handle status side-effects
    if (oldStatus === MaintenanceStatus.OPEN && newStatus === MaintenanceStatus.COMPLETED) {
      await vehicleService.updateVehicle(updatedLog.vehicleId, {
        status: VehicleStatus.AVAILABLE,
        currentOdometer: updatedLog.odometerAtService,
      });

      const costAmount = Number(updatedLog.cost);
      if (costAmount > 0) {
        // Create matching maintenance expense if it doesn't already exist
        const existingExpense = await expenseRepository.list({
          vehicleId: updatedLog.vehicleId,
          category: ExpenseCategory.MAINTENANCE,
        });

        const hasExpense = existingExpense.data.some((e) => e.maintenanceLogId === updatedLog.id);
        if (!hasExpense) {
          await expenseRepository.create({
            amount: costAmount,
            category: ExpenseCategory.MAINTENANCE,
            description: `Maintenance Log Expense: ${updatedLog.description}`,
            loggedById: updatedLog.loggedById,
            vehicleId: updatedLog.vehicleId,
            maintenanceLogId: updatedLog.id,
            expenseDate: updatedLog.endDate || new Date(),
          });
        }
      }
    } else if (oldStatus === MaintenanceStatus.OPEN && newStatus === MaintenanceStatus.CANCELLED) {
      await vehicleService.updateVehicle(updatedLog.vehicleId, { status: VehicleStatus.AVAILABLE });
    }

    return updatedLog;
  }

  async deleteMaintenanceLog(id: string): Promise<MaintenanceLogWithRelations> {
    const log = await this.getMaintenanceLogById(id);

    // If the vehicle was in the shop for this log, mark it available
    if (log.status === MaintenanceStatus.OPEN) {
      await vehicleService.updateVehicle(log.vehicleId, { status: VehicleStatus.AVAILABLE });
    }

    const deletedLog = await maintenanceRepository.softDelete(id);

    // Clean up any linked expense
    const expenses = await expenseRepository.list({ vehicleId: log.vehicleId, category: ExpenseCategory.MAINTENANCE });
    const linkedExpense = expenses.data.find((e) => e.maintenanceLogId === log.id);
    if (linkedExpense) {
      await expenseRepository.softDelete(linkedExpense.id);
    }

    return deletedLog;
  }

  async listMaintenanceLogs(params: {
    page?: number;
    limit?: number;
    vehicleId?: string;
    status?: MaintenanceStatus;
    type?: MaintenanceType;
  }): Promise<{ data: MaintenanceLogWithRelations[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const { data, total } = await maintenanceRepository.list({
      skip,
      take: limit,
      vehicleId: params.vehicleId,
      status: params.status,
      type: params.type,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

export const maintenanceService = new MaintenanceService();
