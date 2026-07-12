import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateCreateFuelLog(req: Request, res: Response, next: NextFunction) {
  const { vehicleId, driverId, tripId, quantity, cost, odometer, refueledAt, receiptUrl } = req.body;

  if (!vehicleId || typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId is required"));
  }
  if (!driverId || typeof driverId !== "string") {
    return next(new BadRequestError("driverId is required"));
  }
  if (tripId !== undefined && typeof tripId !== "string") {
    return next(new BadRequestError("tripId must be a string"));
  }
  if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) <= 0) {
    return next(new BadRequestError("quantity is required and must be a positive number"));
  }
  if (cost === undefined || isNaN(Number(cost)) || Number(cost) <= 0) {
    return next(new BadRequestError("cost is required and must be a positive number"));
  }
  if (odometer === undefined || typeof odometer !== "number" || odometer < 0) {
    return next(new BadRequestError("odometer is required and must be a non-negative number"));
  }
  if (refueledAt && isNaN(Date.parse(refueledAt))) {
    return next(new BadRequestError("refueledAt must be a valid date"));
  }
  if (receiptUrl !== undefined && typeof receiptUrl !== "string") {
    return next(new BadRequestError("receiptUrl must be a string"));
  }

  next();
}

export function validateUpdateFuelLog(req: Request, res: Response, next: NextFunction) {
  const { vehicleId, driverId, tripId, quantity, cost, odometer, refueledAt, receiptUrl } = req.body;

  if (vehicleId !== undefined && typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId must be a string"));
  }
  if (driverId !== undefined && typeof driverId !== "string") {
    return next(new BadRequestError("driverId must be a string"));
  }
  if (tripId !== undefined && typeof tripId !== "string") {
    return next(new BadRequestError("tripId must be a string"));
  }
  if (quantity !== undefined && (isNaN(Number(quantity)) || Number(quantity) <= 0)) {
    return next(new BadRequestError("quantity must be a positive number"));
  }
  if (cost !== undefined && (isNaN(Number(cost)) || Number(cost) <= 0)) {
    return next(new BadRequestError("cost must be a positive number"));
  }
  if (odometer !== undefined && (typeof odometer !== "number" || odometer < 0)) {
    return next(new BadRequestError("odometer must be a non-negative number"));
  }
  if (refueledAt !== undefined && isNaN(Date.parse(refueledAt))) {
    return next(new BadRequestError("refueledAt must be a valid date"));
  }
  if (receiptUrl !== undefined && typeof receiptUrl !== "string") {
    return next(new BadRequestError("receiptUrl must be a string"));
  }

  next();
}
