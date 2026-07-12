import { apiClient } from "@/lib/core/services/api-client";

export interface DateRange {
  start: string;
  end: string;
}

export interface ReportSummary {
  distanceTraveled: number;
  totalSpend: number;
  tripsCompleted: number;
  fuelQuantity: number;
  fuelCost: number;
  utilizationRate: number;
}

export interface VehiclePerformanceItem {
  id: string;
  model: string;
  driver: string;
  status: "Active" | "Idle" | "Maintenance" | "Offline";
  distanceCovered: number;
  fuelEfficiency: string;
  healthScore: number;
}

export interface DriverSafetyItem {
  name: string;
  tripsCompleted: number;
  distanceDriven: number;
  safetyScore: number;
  violations: number;
}

export interface MaintenanceHistoryItem {
  id: string;
  vehicleId: string;
  issue: string;
  cost: number;
  completedDate: string;
  type: "Scheduled" | "Unscheduled";
}

export interface FleetReportData {
  dateRange: DateRange;
  summary: ReportSummary;
  vehiclePerformance: VehiclePerformanceItem[];
  driverSafety: DriverSafetyItem[];
  maintenanceHistory: MaintenanceHistoryItem[];
}

export interface ReportParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export const reportService = {
  async getFleetReport(params?: ReportParams): Promise<FleetReportData> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.startDate !== undefined) queryParams.startDate = params.startDate;
      if (params.endDate !== undefined) queryParams.endDate = params.endDate;
    }
    return apiClient.get<FleetReportData>("/reports/fleet", { params: queryParams });
  }
};
