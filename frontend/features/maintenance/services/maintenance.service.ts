import { apiClient } from "@/lib/core/services/api-client";
import { MaintenanceLog, MaintenanceStatus, MaintenanceType, PaginatedResponse } from "@/lib/core/types";

export interface ListMaintenanceLogsParams {
  page?: number;
  limit?: number;
  vehicleId?: string;
  status?: MaintenanceStatus;
  type?: MaintenanceType;
}

export interface CreateMaintenanceLogDto {
  vehicleId: string;
  loggedById: string;
  description: string;
  type: MaintenanceType;
  status?: MaintenanceStatus;
  cost?: number;
  odometerAtService: number;
  startDate?: string; // ISO string date
  endDate?: string;
}

export interface UpdateMaintenanceLogDto {
  vehicleId?: string;
  loggedById?: string;
  description?: string;
  type?: MaintenanceType;
  status?: MaintenanceStatus;
  cost?: number;
  odometerAtService?: number;
  startDate?: string;
  endDate?: string;
}

export const maintenanceService = {
  async listMaintenanceLogs(params?: ListMaintenanceLogsParams): Promise<PaginatedResponse<MaintenanceLog>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.vehicleId !== undefined) queryParams.vehicleId = params.vehicleId;
      if (params.status !== undefined) queryParams.status = params.status;
      if (params.type !== undefined) queryParams.type = params.type;
    }
    return apiClient.get<PaginatedResponse<MaintenanceLog>>("/maintenance", { params: queryParams });
  },

  async getMaintenanceLogById(id: string): Promise<MaintenanceLog> {
    return apiClient.get<MaintenanceLog>(`/maintenance/${id}`);
  },

  async createMaintenanceLog(dto: CreateMaintenanceLogDto): Promise<MaintenanceLog> {
    return apiClient.post<MaintenanceLog>("/maintenance", dto);
  },

  async updateMaintenanceLog(id: string, dto: UpdateMaintenanceLogDto): Promise<MaintenanceLog> {
    return apiClient.put<MaintenanceLog>(`/maintenance/${id}`, dto);
  },

  async deleteMaintenanceLog(id: string): Promise<boolean> {
    await apiClient.delete(`/maintenance/${id}`);
    return true;
  }
};
