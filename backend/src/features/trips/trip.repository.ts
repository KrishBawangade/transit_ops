import { prisma } from "../../shared/database/prisma";
import { Trip, Prisma, TripStatus, Driver, Vehicle, User } from "@prisma/client";

export type TripWithRelations = Trip & {
  driver: Driver & { user: User };
  vehicle: Vehicle;
};

export class TripRepository {
  async findById(id: string): Promise<TripWithRelations | null> {
    return prisma.trip.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
      },
    }) as Promise<TripWithRelations | null>;
  }

  async findByTripNumber(tripNumber: string): Promise<TripWithRelations | null> {
    return prisma.trip.findFirst({
      where: {
        tripNumber,
        deletedAt: null,
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
      },
    }) as Promise<TripWithRelations | null>;
  }

  async create(data: Prisma.TripCreateInput | Prisma.TripUncheckedCreateInput): Promise<TripWithRelations> {
    return prisma.trip.create({
      data,
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
      },
    }) as Promise<TripWithRelations>;
  }

  async update(
    id: string,
    data: Prisma.TripUpdateInput | Prisma.TripUncheckedUpdateInput
  ): Promise<TripWithRelations> {
    return prisma.trip.update({
      where: {
        id,
      },
      data,
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
      },
    }) as Promise<TripWithRelations>;
  }

  async softDelete(id: string): Promise<TripWithRelations> {
    return prisma.trip.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
      },
    }) as Promise<TripWithRelations>;
  }

  async list(params: {
    skip?: number;
    take?: number;
    driverId?: string;
    vehicleId?: string;
    status?: TripStatus;
  }): Promise<{ data: TripWithRelations[]; total: number }> {
    const { skip, take, driverId, vehicleId, status } = params;
    const where: Prisma.TripWhereInput = {
      deletedAt: null,
      ...(driverId !== undefined && { driverId }),
      ...(vehicleId !== undefined && { vehicleId }),
      ...(status !== undefined && { status }),
    };

    const [data, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take,
        include: {
          driver: {
            include: {
              user: true,
            },
          },
          vehicle: true,
        },
        orderBy: {
          scheduledStart: "desc",
        },
      }) as Promise<TripWithRelations[]>,
      prisma.trip.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const tripRepository = new TripRepository();
