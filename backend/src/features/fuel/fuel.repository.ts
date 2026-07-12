import { prisma } from "../../shared/database/prisma";
import { FuelLog, Prisma, Vehicle, Driver, User, Trip } from "@prisma/client";

export type FuelLogWithRelations = FuelLog & {
  vehicle: Vehicle;
  driver: Driver & { user: User };
  trip: Trip | null;
};

export class FuelRepository {
  async findById(id: string): Promise<FuelLogWithRelations | null> {
    return prisma.fuelLog.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        vehicle: true,
        driver: {
          include: {
            user: true,
          },
        },
        trip: true,
      },
    }) as Promise<FuelLogWithRelations | null>;
  }

  async create(
    data: Prisma.FuelLogCreateInput | Prisma.FuelLogUncheckedCreateInput
  ): Promise<FuelLogWithRelations> {
    return prisma.fuelLog.create({
      data,
      include: {
        vehicle: true,
        driver: {
          include: {
            user: true,
          },
        },
        trip: true,
      },
    }) as Promise<FuelLogWithRelations>;
  }

  async update(
    id: string,
    data: Prisma.FuelLogUpdateInput | Prisma.FuelLogUncheckedUpdateInput
  ): Promise<FuelLogWithRelations> {
    return prisma.fuelLog.update({
      where: {
        id,
      },
      data,
      include: {
        vehicle: true,
        driver: {
          include: {
            user: true,
          },
        },
        trip: true,
      },
    }) as Promise<FuelLogWithRelations>;
  }

  async softDelete(id: string): Promise<FuelLogWithRelations> {
    return prisma.fuelLog.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        vehicle: true,
        driver: {
          include: {
            user: true,
          },
        },
        trip: true,
      },
    }) as Promise<FuelLogWithRelations>;
  }

  async list(params: {
    skip?: number;
    take?: number;
    vehicleId?: string;
    driverId?: string;
    tripId?: string;
  }): Promise<{ data: FuelLogWithRelations[]; total: number }> {
    const { skip, take, vehicleId, driverId, tripId } = params;
    const where: Prisma.FuelLogWhereInput = {
      deletedAt: null,
      ...(vehicleId !== undefined && { vehicleId }),
      ...(driverId !== undefined && { driverId }),
      ...(tripId !== undefined && { tripId }),
    };

    const [data, total] = await Promise.all([
      prisma.fuelLog.findMany({
        where,
        skip,
        take,
        include: {
          vehicle: true,
          driver: {
            include: {
              user: true,
            },
          },
          trip: true,
        },
        orderBy: {
          refueledAt: "desc",
        },
      }) as Promise<FuelLogWithRelations[]>,
      prisma.fuelLog.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const fuelRepository = new FuelRepository();
