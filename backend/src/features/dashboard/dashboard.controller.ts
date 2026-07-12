import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

export class DashboardController {
  async getMetrics(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getMetrics();
    res.status(200).json({
      status: "success",
      data,
    });
  }
}

export const dashboardController = new DashboardController();
