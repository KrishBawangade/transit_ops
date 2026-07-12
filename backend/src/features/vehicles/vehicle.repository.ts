import { prisma } from "../../shared/database/prisma";
import { Vehicle, Prisma, VehicleStatus } from "@prisma/client";

export class VehicleRepository {
  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: {
        registrationNumber,
        deletedAt: null,
      },
    });
  }

  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return prisma.vehicle.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(id: string): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async list(params: {
    skip?: number;
    take?: number;
    status?: VehicleStatus;
  }): Promise<{ data: Vehicle[]; total: number }> {
    const { skip, take, status } = params;
    const where: Prisma.VehicleWhereInput = {
      deletedAt: null,
      ...(status !== undefined && { status }),
    };

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.vehicle.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const vehicleRepository = new VehicleRepository();
