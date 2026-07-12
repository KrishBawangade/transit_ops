import { apiClient } from "@/lib/core/services/api-client";

export interface DashboardAlert {
  type: string;
  title: string;
  severity: "warning" | "critical";
}

export interface LivePipelineItem {
  id: string;
  vehicle: string;
  driver: string;
  route: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface DashboardMetrics {
  metrics: {
    activeFleet: {
      active: number;
      total: number;
      utilizationRate: number;
    };
    activeDrivers: {
      active: number;
      total: number;
    };
    tripsInTransit: number;
    activeAlertsCount: number;
    alerts: DashboardAlert[];
  };
  livePipeline: LivePipelineItem[];
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    return apiClient.get<DashboardMetrics>("/dashboard/metrics");
  }
};
