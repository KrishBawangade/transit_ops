import { expenseRepository, ExpenseWithRelations } from "./expense.repository";
import { ExpenseCategory, Prisma } from "@prisma/client";
import { userService } from "../users/user.service";
import { vehicleService } from "../vehicles/vehicle.service";
import { NotFoundError, BadRequestError } from "../../shared/errors/app-error";

export class ExpenseService {
  async getExpenseById(id: string): Promise<ExpenseWithRelations> {
    const expense = await expenseRepository.findById(id);
    if (!expense) {
      throw new NotFoundError(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async createExpense(data: Prisma.ExpenseUncheckedCreateInput): Promise<ExpenseWithRelations> {
    // 1. Verify user exists
    await userService.getUserById(data.loggedById);

    // 2. Verify amount is positive
    const amt = Number(data.amount);
    if (amt <= 0) {
      throw new BadRequestError("Expense amount must be greater than zero");
    }

    // 3. Verify vehicle exists if provided
    if (data.vehicleId) {
      await vehicleService.getVehicleById(data.vehicleId);
    }

    return expenseRepository.create(data);
  }

  async updateExpense(
    id: string,
    data: Prisma.ExpenseUpdateInput | Prisma.ExpenseUncheckedUpdateInput
  ): Promise<ExpenseWithRelations> {
    await this.getExpenseById(id);

    if (data.amount !== undefined) {
      const amt = Number(data.amount);
      if (amt <= 0) {
        throw new BadRequestError("Expense amount must be greater than zero");
      }
    }

    return expenseRepository.update(id, data);
  }

  async deleteExpense(id: string): Promise<ExpenseWithRelations> {
    await this.getExpenseById(id);
    return expenseRepository.softDelete(id);
  }

  async listExpenses(params: {
    page?: number;
    limit?: number;
    vehicleId?: string;
    tripId?: string;
    category?: ExpenseCategory;
  }): Promise<{ data: ExpenseWithRelations[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const { data, total } = await expenseRepository.list({
      skip,
      take: limit,
      vehicleId: params.vehicleId,
      tripId: params.tripId,
      category: params.category,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

export const expenseService = new ExpenseService();
