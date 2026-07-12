import { prisma } from "../../shared/database/prisma";
import { MaintenanceLog, Prisma, MaintenanceStatus, MaintenanceType, Vehicle, User } from "@prisma/client";

export type MaintenanceLogWithRelations = MaintenanceLog & {
  vehicle: Vehicle;
  loggedBy: User;
};

export class MaintenanceRepository {
  async findById(id: string): Promise<MaintenanceLogWithRelations | null> {
    return prisma.maintenanceLog.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        vehicle: true,
        loggedBy: true,
      },
    }) as Promise<MaintenanceLogWithRelations | null>;
  }

  async create(
    data: Prisma.MaintenanceLogCreateInput | Prisma.MaintenanceLogUncheckedCreateInput
  ): Promise<MaintenanceLogWithRelations> {
    return prisma.maintenanceLog.create({
      data,
      include: {
        vehicle: true,
        loggedBy: true,
      },
    }) as Promise<MaintenanceLogWithRelations>;
  }

  async update(
    id: string,
    data: Prisma.MaintenanceLogUpdateInput | Prisma.MaintenanceLogUncheckedUpdateInput
  ): Promise<MaintenanceLogWithRelations> {
    return prisma.maintenanceLog.update({
      where: {
        id,
      },
      data,
      include: {
        vehicle: true,
        loggedBy: true,
      },
    }) as Promise<MaintenanceLogWithRelations>;
  }

  async softDelete(id: string): Promise<MaintenanceLogWithRelations> {
    return prisma.maintenanceLog.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        vehicle: true,
        loggedBy: true,
      },
    }) as Promise<MaintenanceLogWithRelations>;
  }

  async list(params: {
    skip?: number;
    take?: number;
    vehicleId?: string;
    status?: MaintenanceStatus;
    type?: MaintenanceType;
  }): Promise<{ data: MaintenanceLogWithRelations[]; total: number }> {
    const { skip, take, vehicleId, status, type } = params;
    const where: Prisma.MaintenanceLogWhereInput = {
      deletedAt: null,
      ...(vehicleId !== undefined && { vehicleId }),
      ...(status !== undefined && { status }),
      ...(type !== undefined && { type }),
    };

    const [data, total] = await Promise.all([
      prisma.maintenanceLog.findMany({
        where,
        skip,
        take,
        include: {
          vehicle: true,
          loggedBy: true,
        },
        orderBy: {
          startDate: "desc",
        },
      }) as Promise<MaintenanceLogWithRelations[]>,
      prisma.maintenanceLog.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const maintenanceRepository = new MaintenanceRepository();
