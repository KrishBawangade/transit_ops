import { apiClient } from "./api-client";
import { Expense, ExpenseCategory, PaginatedResponse } from "../types";

export interface ListExpensesParams {
  page?: number;
  limit?: number;
  vehicleId?: string;
  tripId?: string;
  category?: ExpenseCategory;
}

export interface CreateExpenseDto {
  amount: number;
  category: ExpenseCategory;
  description: string;
  loggedById: string;
  vehicleId?: string;
  tripId?: string;
  fuelLogId?: string;
  maintenanceLogId?: string;
  expenseDate?: string; // ISO string date
  receiptUrl?: string;
}

export interface UpdateExpenseDto {
  amount?: number;
  category?: ExpenseCategory;
  description?: string;
  loggedById?: string;
  vehicleId?: string;
  tripId?: string;
  fuelLogId?: string;
  maintenanceLogId?: string;
  expenseDate?: string;
  receiptUrl?: string;
}

export const expenseService = {
  async listExpenses(params?: ListExpensesParams): Promise<PaginatedResponse<Expense>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.vehicleId !== undefined) queryParams.vehicleId = params.vehicleId;
      if (params.tripId !== undefined) queryParams.tripId = params.tripId;
      if (params.category !== undefined) queryParams.category = params.category;
    }
    return apiClient.get<PaginatedResponse<Expense>>("/expenses", { params: queryParams });
  },

  async getExpenseById(id: string): Promise<Expense> {
    return apiClient.get<Expense>(`/expenses/${id}`);
  },

  async createExpense(dto: CreateExpenseDto): Promise<Expense> {
    return apiClient.post<Expense>("/expenses", dto);
  },

  async updateExpense(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    return apiClient.put<Expense>(`/expenses/${id}`, dto);
  },

  async deleteExpense(id: string): Promise<boolean> {
    await apiClient.delete(`/expenses/${id}`);
    return true;
  }
};
