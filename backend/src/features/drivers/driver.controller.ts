import { Request, Response } from "express";
import { driverService } from "./driver.service";
import { DriverStatus } from "@prisma/client";

export class DriverController {
  async getDriverById(req: Request, res: Response): Promise<void> {
    const driver = await driverService.getDriverById(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: driver,
    });
  }

  async getDriverByUserId(req: Request, res: Response): Promise<void> {
    const driver = await driverService.getDriverByUserId(req.params.userId as string);
    res.status(200).json({
      status: "success",
      data: driver,
    });
  }

  async createDriver(req: Request, res: Response): Promise<void> {
    const { userId, licenseNumber, licenseClass, licenseExpiry, status, rating } = req.body;
    const driver = await driverService.createDriver({
      userId,
      licenseNumber,
      licenseClass,
      licenseExpiry: new Date(licenseExpiry),
      status,
      rating,
    });
    res.status(201).json({
      status: "success",
      data: driver,
    });
  }

  async updateDriver(req: Request, res: Response): Promise<void> {
    const { licenseNumber, licenseClass, licenseExpiry, status, rating } = req.body;
    const updateData: any = {
      licenseNumber,
      licenseClass,
      status,
      rating,
    };
    if (licenseExpiry) {
      updateData.licenseExpiry = new Date(licenseExpiry);
    }
    const driver = await driverService.updateDriver(req.params.id as string, updateData);
    res.status(200).json({
      status: "success",
      data: driver,
    });
  }

  async deleteDriver(req: Request, res: Response): Promise<void> {
    const driver = await driverService.deleteDriver(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: driver,
    });
  }

  async listDrivers(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const status = req.query.status as DriverStatus | undefined;

    const result = await driverService.listDrivers({ page, limit, status });
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

export const driverController = new DriverController();
