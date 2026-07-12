import { apiClient } from "@/lib/core/services/api-client";
import { Driver, DriverStatus, PaginatedResponse } from "@/lib/core/types";

export interface ListDriversParams {
  page?: number;
  limit?: number;
  status?: DriverStatus;
}

export interface CreateDriverDto {
  userId: string;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiry: string; // ISO string date
  status?: DriverStatus;
  rating?: number;
}

export interface UpdateDriverDto {
  userId?: string;
  licenseNumber?: string;
  licenseClass?: string;
  licenseExpiry?: string;
  status?: DriverStatus;
  rating?: number;
}

export const driverService = {
  async listDrivers(params?: ListDriversParams): Promise<PaginatedResponse<Driver>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.status !== undefined) queryParams.status = params.status;
    }
    return apiClient.get<PaginatedResponse<Driver>>("/drivers", { params: queryParams });
  },

  async getDriverById(id: string): Promise<Driver> {
    return apiClient.get<Driver>(`/drivers/${id}`);
  },

  async getDriverByUserId(userId: string): Promise<Driver> {
    return apiClient.get<Driver>(`/drivers/user/${userId}`);
  },

  async createDriver(dto: CreateDriverDto): Promise<Driver> {
    return apiClient.post<Driver>("/drivers", dto);
  },

  async updateDriver(id: string, dto: UpdateDriverDto): Promise<Driver> {
    return apiClient.put<Driver>(`/drivers/${id}`, dto);
  },

  async deleteDriver(id: string): Promise<boolean> {
    await apiClient.delete(`/drivers/${id}`);
    return true;
  }
};
