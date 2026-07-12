import { prisma } from "../../shared/database/prisma";
import { Expense, Prisma, ExpenseCategory, User, Vehicle, Trip, FuelLog, MaintenanceLog } from "@prisma/client";

export type ExpenseWithRelations = Expense & {
  loggedBy: User;
  vehicle: Vehicle | null;
  trip: Trip | null;
  fuelLog: FuelLog | null;
  maintenanceLog: MaintenanceLog | null;
};

export class ExpenseRepository {
  async findById(id: string): Promise<ExpenseWithRelations | null> {
    return prisma.expense.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        loggedBy: true,
        vehicle: true,
        trip: true,
        fuelLog: true,
        maintenanceLog: true,
      },
    }) as Promise<ExpenseWithRelations | null>;
  }

  async create(
    data: Prisma.ExpenseCreateInput | Prisma.ExpenseUncheckedCreateInput
  ): Promise<ExpenseWithRelations> {
    return prisma.expense.create({
      data,
      include: {
        loggedBy: true,
        vehicle: true,
        trip: true,
        fuelLog: true,
        maintenanceLog: true,
      },
    }) as Promise<ExpenseWithRelations>;
  }

  async update(
    id: string,
    data: Prisma.ExpenseUpdateInput | Prisma.ExpenseUncheckedUpdateInput
  ): Promise<ExpenseWithRelations> {
    return prisma.expense.update({
      where: {
        id,
      },
      data,
      include: {
        loggedBy: true,
        vehicle: true,
        trip: true,
        fuelLog: true,
        maintenanceLog: true,
      },
    }) as Promise<ExpenseWithRelations>;
  }

  async softDelete(id: string): Promise<ExpenseWithRelations> {
    return prisma.expense.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        loggedBy: true,
        vehicle: true,
        trip: true,
        fuelLog: true,
        maintenanceLog: true,
      },
    }) as Promise<ExpenseWithRelations>;
  }

  async list(params: {
    skip?: number;
    take?: number;
    vehicleId?: string;
    tripId?: string;
    category?: ExpenseCategory;
  }): Promise<{ data: ExpenseWithRelations[]; total: number }> {
    const { skip, take, vehicleId, tripId, category } = params;
    const where: Prisma.ExpenseWhereInput = {
      deletedAt: null,
      ...(vehicleId !== undefined && { vehicleId }),
      ...(tripId !== undefined && { tripId }),
      ...(category !== undefined && { category }),
    };

    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take,
        include: {
          loggedBy: true,
          vehicle: true,
          trip: true,
          fuelLog: true,
          maintenanceLog: true,
        },
        orderBy: {
          expenseDate: "desc",
        },
      }) as Promise<ExpenseWithRelations[]>,
      prisma.expense.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const expenseRepository = new ExpenseRepository();
