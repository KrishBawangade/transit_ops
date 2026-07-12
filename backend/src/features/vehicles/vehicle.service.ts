import { vehicleRepository } from "./vehicle.repository";
import { Vehicle, Prisma, VehicleStatus } from "@prisma/client";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error";

export class VehicleService {
  async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async createVehicle(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    const existingVehicle = await vehicleRepository.findByRegistrationNumber(data.registrationNumber);
    if (existingVehicle) {
      throw new ConflictError(`Vehicle with registration number ${data.registrationNumber} already exists`);
    }
    return vehicleRepository.create(data);
  }

  async updateVehicle(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    // Check if vehicle exists
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }

    if (data.registrationNumber) {
      const regNum = typeof data.registrationNumber === "string" ? data.registrationNumber : data.registrationNumber.set;
      if (regNum) {
        const existingVehicle = await vehicleRepository.findByRegistrationNumber(regNum);
        if (existingVehicle && existingVehicle.id !== id) {
          throw new ConflictError(`Vehicle with registration number ${regNum} already exists`);
        }
      }
    }

    return vehicleRepository.update(id, data);
  }

  async deleteVehicle(id: string): Promise<Vehicle> {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }
    return vehicleRepository.softDelete(id);
  }

  async listVehicles(params: {
    page?: number;
    limit?: number;
    status?: VehicleStatus;
  }): Promise<{ data: Vehicle[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const { data, total } = await vehicleRepository.list({
      skip,
      take: limit,
      status: params.status,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

export const vehicleService = new VehicleService();
