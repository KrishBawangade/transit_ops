import { Request, Response } from "express";
import { fuelService } from "./fuel.service";

export class FuelController {
  async getFuelLogById(req: Request, res: Response): Promise<void> {
    const log = await fuelService.getFuelLogById(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: log,
    });
  }

  async createFuelLog(req: Request, res: Response): Promise<void> {
    const { vehicleId, driverId, tripId, quantity, cost, odometer, refueledAt, receiptUrl } = req.body;
    const log = await fuelService.createFuelLog({
      vehicleId,
      driverId,
      tripId,
      quantity: Number(quantity),
      cost: Number(cost),
      odometer: Number(odometer),
      refueledAt: refueledAt ? new Date(refueledAt) : undefined,
      receiptUrl,
    });
    res.status(201).json({
      status: "success",
      data: log,
    });
  }

  async updateFuelLog(req: Request, res: Response): Promise<void> {
    const { vehicleId, driverId, tripId, quantity, cost, odometer, refueledAt, receiptUrl } = req.body;
    const updateData: any = {
      vehicleId,
      driverId,
      tripId,
      receiptUrl,
    };
    if (quantity !== undefined) {
      updateData.quantity = Number(quantity);
    }
    if (cost !== undefined) {
      updateData.cost = Number(cost);
    }
    if (odometer !== undefined) {
      updateData.odometer = Number(odometer);
    }
    if (refueledAt) {
      updateData.refueledAt = new Date(refueledAt);
    }

    const log = await fuelService.updateFuelLog(req.params.id as string, updateData);
    res.status(200).json({
      status: "success",
      data: log,
    });
  }

  async deleteFuelLog(req: Request, res: Response): Promise<void> {
    const log = await fuelService.deleteFuelLog(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: log,
    });
  }

  async listFuelLogs(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const vehicleId = req.query.vehicleId as string | undefined;
    const driverId = req.query.driverId as string | undefined;
    const tripId = req.query.tripId as string | undefined;

    const result = await fuelService.listFuelLogs({ page, limit, vehicleId, driverId, tripId });
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

export const fuelController = new FuelController();
