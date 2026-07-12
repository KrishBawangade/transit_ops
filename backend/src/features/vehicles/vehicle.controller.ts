import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";
import { VehicleStatus } from "@prisma/client";

export class VehicleController {
  async getVehicleById(req: Request, res: Response): Promise<void> {
    const vehicle = await vehicleService.getVehicleById(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: vehicle,
    });
  }

  async createVehicle(req: Request, res: Response): Promise<void> {
    const { registrationNumber, make, model, year, status, maxPayloadCapacity, fuelType, currentOdometer } = req.body;
    const vehicle = await vehicleService.createVehicle({
      registrationNumber,
      make,
      model,
      year,
      status,
      maxPayloadCapacity,
      fuelType,
      currentOdometer,
    });
    res.status(201).json({
      status: "success",
      data: vehicle,
    });
  }

  async updateVehicle(req: Request, res: Response): Promise<void> {
    const { registrationNumber, make, model, year, status, maxPayloadCapacity, fuelType, currentOdometer } = req.body;
    const vehicle = await vehicleService.updateVehicle(req.params.id as string, {
      registrationNumber,
      make,
      model,
      year,
      status,
      maxPayloadCapacity,
      fuelType,
      currentOdometer,
    });
    res.status(200).json({
      status: "success",
      data: vehicle,
    });
  }

  async deleteVehicle(req: Request, res: Response): Promise<void> {
    const vehicle = await vehicleService.deleteVehicle(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: vehicle,
    });
  }

  async listVehicles(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const status = req.query.status as VehicleStatus | undefined;

    const result = await vehicleService.listVehicles({ page, limit, status });
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

export const vehicleController = new VehicleController();
