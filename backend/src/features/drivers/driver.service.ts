import { driverRepository, DriverWithUser } from "./driver.repository";
import { DriverStatus, Prisma } from "@prisma/client";
import { userService } from "../users/user.service";
import { NotFoundError, ConflictError, BadRequestError } from "../../shared/errors/app-error";

export class DriverService {
  async getDriverById(id: string): Promise<DriverWithUser> {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundError(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async getDriverByUserId(userId: string): Promise<DriverWithUser> {
    const driver = await driverRepository.findByUserId(userId);
    if (!driver) {
      throw new NotFoundError(`Driver with User ID ${userId} not found`);
    }
    return driver;
  }

  async createDriver(data: Prisma.DriverUncheckedCreateInput): Promise<DriverWithUser> {
    // 1. Verify user exists
    const user = await userService.getUserById(data.userId);

    // 2. Verify user has the DRIVER role
    if (user.role !== "DRIVER") {
      throw new BadRequestError(`Cannot create a driver profile for a user with role ${user.role}`);
    }

    // 3. Verify driver profile doesn't already exist for this user
    const existingDriverProfile = await driverRepository.findByUserId(data.userId);
    if (existingDriverProfile) {
      throw new ConflictError(`Driver profile already exists for User ID ${data.userId}`);
    }

    // 4. Verify license number uniqueness
    const existingLicense = await driverRepository.findByLicenseNumber(data.licenseNumber);
    if (existingLicense) {
      throw new ConflictError(`Driver with license number ${data.licenseNumber} already exists`);
    }

    return driverRepository.create(data);
  }

  async updateDriver(
    id: string,
    data: Prisma.DriverUpdateInput | Prisma.DriverUncheckedUpdateInput
  ): Promise<DriverWithUser> {
    await this.getDriverById(id);

    if (data.licenseNumber) {
      const licenseNumber = typeof data.licenseNumber === "string" ? data.licenseNumber : data.licenseNumber.set;
      if (licenseNumber) {
        const existingLicense = await driverRepository.findByLicenseNumber(licenseNumber);
        if (existingLicense && existingLicense.id !== id) {
          throw new ConflictError(`Driver with license number ${licenseNumber} already exists`);
        }
      }
    }

    return driverRepository.update(id, data);
  }

  async deleteDriver(id: string): Promise<DriverWithUser> {
    await this.getDriverById(id);
    return driverRepository.softDelete(id);
  }

  async listDrivers(params: {
    page?: number;
    limit?: number;
    status?: DriverStatus;
  }): Promise<{ data: DriverWithUser[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const { data, total } = await driverRepository.list({
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

export const driverService = new DriverService();
