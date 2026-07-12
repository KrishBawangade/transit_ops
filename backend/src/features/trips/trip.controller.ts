import { Request, Response } from "express";
import { tripService } from "./trip.service";
import { TripStatus } from "@prisma/client";

export class TripController {
  async getTripById(req: Request, res: Response): Promise<void> {
    const trip = await tripService.getTripById(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: trip,
    });
  }

  async createTrip(req: Request, res: Response): Promise<void> {
    const {
      tripNumber,
      driverId,
      vehicleId,
      status,
      startLocation,
      endLocation,
      cargoWeight,
      cargoDescription,
      scheduledStart,
      scheduledEnd,
    } = req.body;

    const trip = await tripService.createTrip({
      tripNumber,
      driverId,
      vehicleId,
      status,
      startLocation,
      endLocation,
      cargoWeight: Number(cargoWeight),
      cargoDescription,
      scheduledStart: new Date(scheduledStart),
      scheduledEnd: new Date(scheduledEnd),
    });

    res.status(201).json({
      status: "success",
      data: trip,
    });
  }

  async updateTrip(req: Request, res: Response): Promise<void> {
    const {
      tripNumber,
      driverId,
      vehicleId,
      status,
      startLocation,
      endLocation,
      cargoWeight,
      cargoDescription,
      scheduledStart,
      scheduledEnd,
      actualStart,
      actualEnd,
      odometerAtStart,
      odometerAtEnd,
    } = req.body;

    const updateData: any = {
      tripNumber,
      driverId,
      vehicleId,
      status,
      startLocation,
      endLocation,
      cargoDescription,
      odometerAtStart,
      odometerAtEnd,
    };

    if (cargoWeight !== undefined) {
      updateData.cargoWeight = Number(cargoWeight);
    }
    if (scheduledStart) {
      updateData.scheduledStart = new Date(scheduledStart);
    }
    if (scheduledEnd) {
      updateData.scheduledEnd = new Date(scheduledEnd);
    }
    if (actualStart) {
      updateData.actualStart = new Date(actualStart);
    }
    if (actualEnd) {
      updateData.actualEnd = new Date(actualEnd);
    }

    const trip = await tripService.updateTrip(req.params.id as string, updateData);
    res.status(200).json({
      status: "success",
      data: trip,
    });
  }

  async transitionTripStatus(req: Request, res: Response): Promise<void> {
    const { status, odometerAtEnd, actualStart, actualEnd } = req.body;
    const updateData: any = {
      odometerAtEnd,
    };
    if (actualStart) {
      updateData.actualStart = new Date(actualStart);
    }
    if (actualEnd) {
      updateData.actualEnd = new Date(actualEnd);
    }

    const trip = await tripService.transitionTripStatus(req.params.id as string, status as TripStatus, updateData);
    res.status(200).json({
      status: "success",
      data: trip,
    });
  }

  async deleteTrip(req: Request, res: Response): Promise<void> {
    const trip = await tripService.deleteTrip(req.params.id as string);
    res.status(200).json({
      status: "success",
      data: trip,
    });
  }

  async listTrips(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const driverId = req.query.driverId as string | undefined;
    const vehicleId = req.query.vehicleId as string | undefined;
    const status = req.query.status as TripStatus | undefined;

    const result = await tripService.listTrips({ page, limit, driverId, vehicleId, status });
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

export const tripController = new TripController();
