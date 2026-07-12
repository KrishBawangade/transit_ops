import { prisma } from "../../shared/database/prisma";
import { Driver, Prisma, DriverStatus, User } from "@prisma/client";

export type DriverWithUser = Driver & { user: User };

export class DriverRepository {
  async findById(id: string): Promise<DriverWithUser | null> {
    return prisma.driver.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: true,
      },
    }) as Promise<DriverWithUser | null>;
  }

  async findByUserId(userId: string): Promise<DriverWithUser | null> {
    return prisma.driver.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        user: true,
      },
    }) as Promise<DriverWithUser | null>;
  }

  async findByLicenseNumber(licenseNumber: string): Promise<DriverWithUser | null> {
    return prisma.driver.findFirst({
      where: {
        licenseNumber,
        deletedAt: null,
      },
      include: {
        user: true,
      },
    }) as Promise<DriverWithUser | null>;
  }

  async create(data: Prisma.DriverCreateInput | Prisma.DriverUncheckedCreateInput): Promise<DriverWithUser> {
    return prisma.driver.create({
      data,
      include: {
        user: true,
      },
    }) as Promise<DriverWithUser>;
  }

  async update(
    id: string,
    data: Prisma.DriverUpdateInput | Prisma.DriverUncheckedUpdateInput
  ): Promise<DriverWithUser> {
    return prisma.driver.update({
      where: {
        id,
      },
      data,
      include: {
        user: true,
      },
    }) as Promise<DriverWithUser>;
  }

  async softDelete(id: string): Promise<DriverWithUser> {
    return prisma.driver.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        user: true,
      },
    }) as Promise<DriverWithUser>;
  }

  async list(params: {
    skip?: number;
    take?: number;
    status?: DriverStatus;
  }): Promise<{ data: DriverWithUser[]; total: number }> {
    const { skip, take, status } = params;
    const where: Prisma.DriverWhereInput = {
      deletedAt: null,
      ...(status !== undefined && { status }),
    };

    const [data, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        skip,
        take,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }) as Promise<DriverWithUser[]>,
      prisma.driver.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const driverRepository = new DriverRepository();
