import { apiClient } from "./api-client";
import { FuelLog, PaginatedResponse } from "../types";

export interface ListFuelLogsParams {
  page?: number;
  limit?: number;
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
}

export interface CreateFuelLogDto {
  vehicleId: string;
  driverId: string;
  tripId?: string;
  quantity: number;
  cost: number;
  odometer: number;
  refueledAt?: string; // ISO String Date
  receiptUrl?: string;
}

export interface UpdateFuelLogDto {
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  quantity?: number;
  cost?: number;
  odometer?: number;
  refueledAt?: string;
  receiptUrl?: string;
}

export const fuelService = {
  async listFuelLogs(params?: ListFuelLogsParams): Promise<PaginatedResponse<FuelLog>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.vehicleId !== undefined) queryParams.vehicleId = params.vehicleId;
      if (params.driverId !== undefined) queryParams.driverId = params.driverId;
      if (params.tripId !== undefined) queryParams.tripId = params.tripId;
    }
    return apiClient.get<PaginatedResponse<FuelLog>>("/fuel", { params: queryParams });
  },

  async getFuelLogById(id: string): Promise<FuelLog> {
    return apiClient.get<FuelLog>(`/fuel/${id}`);
  },

  async createFuelLog(dto: CreateFuelLogDto): Promise<FuelLog> {
    return apiClient.post<FuelLog>("/fuel", dto);
  },

  async updateFuelLog(id: string, dto: UpdateFuelLogDto): Promise<FuelLog> {
    return apiClient.put<FuelLog>(`/fuel/${id}`, dto);
  },

  async deleteFuelLog(id: string): Promise<boolean> {
    await apiClient.delete(`/fuel/${id}`);
    return true;
  }
};
