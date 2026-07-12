import { Request, Response } from "express";
import { expenseService } from "./expense.service";
import { ExpenseCategory } from "@prisma/client";

export class ExpenseController {
  async getExpenseById(req: Request, res: Response): Promise<void> {
    const expense = await expenseService.getExpenseById(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: expense,
    });
  }

  async createExpense(req: Request, res: Response): Promise<void> {
    const { amount, category, description, loggedById, vehicleId, tripId, fuelLogId, maintenanceLogId, expenseDate, receiptUrl } = req.body;
    const expense = await expenseService.createExpense({
      amount: Number(amount),
      category,
      description,
      loggedById,
      vehicleId,
      tripId,
      fuelLogId,
      maintenanceLogId,
      expenseDate: expenseDate ? new Date(expenseDate) : undefined,
      receiptUrl,
    });
    res.status(201).json({
      status: "success",
      data: expense,
    });
  }

  async updateExpense(req: Request, res: Response): Promise<void> {
    const { amount, category, description, loggedById, vehicleId, tripId, fuelLogId, maintenanceLogId, expenseDate, receiptUrl } = req.body;
    const updateData: any = {
      category,
      description,
      loggedById,
      vehicleId,
      tripId,
      fuelLogId,
      maintenanceLogId,
      receiptUrl,
    };
    if (amount !== undefined) {
      updateData.amount = Number(amount);
    }
    if (expenseDate) {
      updateData.expenseDate = new Date(expenseDate);
    }

    const expense = await expenseService.updateExpense(req.params.id as string, updateData);
    res.status(200).json({
      status: "success",
      data: expense,
    });
  }

  async deleteExpense(req: Request, res: Response): Promise<void> {
    const expense = await expenseService.deleteExpense(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: expense,
    });
  }

  async listExpenses(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const vehicleId = req.query.vehicleId as string | undefined;
    const tripId = req.query.tripId as string | undefined;
    const category = req.query.category as ExpenseCategory | undefined;

    const result = await expenseService.listExpenses({ page, limit, vehicleId, tripId, category });
    res.status(200).json({
      status: "success",
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  }
}

export const expenseController = new ExpenseController();
