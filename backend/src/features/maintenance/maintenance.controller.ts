import { Request, Response } from "express";
import { maintenanceService } from "./maintenance.service";
import { MaintenanceStatus, MaintenanceType } from "@prisma/client";

export class MaintenanceController {
  async getMaintenanceLogById(req: Request, res: Response): Promise<void> {
    const log = await maintenanceService.getMaintenanceLogById(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: log,
    });
  }

  async createMaintenanceLog(req: Request, res: Response): Promise<void> {
    const { vehicleId, loggedById, description, type, status, cost, odometerAtService, startDate, endDate } = req.body;
    const log = await maintenanceService.createMaintenanceLog({
      vehicleId,
      loggedById,
      description,
      type,
      status,
      cost: cost !== undefined ? Number(cost) : undefined,
      odometerAtService,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
    res.status(201).json({
      status: "success",
      data: log,
    });
  }

  async updateMaintenanceLog(req: Request, res: Response): Promise<void> {
    const { vehicleId, loggedById, description, type, status, cost, odometerAtService, startDate, endDate } = req.body;
    const updateData: any = {
      vehicleId,
      loggedById,
      description,
      type,
      status,
      odometerAtService,
    };
    if (cost !== undefined) {
      updateData.cost = Number(cost);
    }
    if (startDate) {
      updateData.startDate = new Date(startDate);
    }
    if (endDate) {
      updateData.endDate = new Date(endDate);
    }

    const log = await maintenanceService.updateMaintenanceLog(req.params.id as string, updateData);
    res.status(200).json({
      status: "success",
      data: log,
    });
  }

  async deleteMaintenanceLog(req: Request, res: Response): Promise<void> {
    const log = await maintenanceService.deleteMaintenanceLog(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: log,
    });
  }

  async listMaintenanceLogs(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const vehicleId = req.query.vehicleId as string | undefined;
    const status = req.query.status as MaintenanceStatus | undefined;
    const type = req.query.type as MaintenanceType | undefined;

    const result = await maintenanceService.listMaintenanceLogs({ page, limit, vehicleId, status, type });
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

export const maintenanceController = new MaintenanceController();
