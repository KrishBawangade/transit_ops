import { Request, Response } from "express";
import { reportService } from "./report.service";

export class ReportController {
  async getFleetReport(req: Request, res: Response): Promise<void> {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    
    const data = await reportService.getFleetReport({ startDate, endDate });
    res.status(200).json({
      status: "success",
      data,
    });
  }
}

export const reportController = new ReportController();
