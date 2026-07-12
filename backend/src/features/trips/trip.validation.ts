import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateCreateTrip(req: Request, res: Response, next: NextFunction) {
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

  if (tripNumber !== undefined && typeof tripNumber !== "string") {
    return next(new BadRequestError("tripNumber must be a string"));
  }
  if (!driverId || typeof driverId !== "string") {
    return next(new BadRequestError("driverId is required"));
  }
  if (!vehicleId || typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId is required"));
  }
  if (status && !["SCHEDULED", "DISPATCHED", "COMPLETED", "CANCELLED"].includes(status)) {
    return next(new BadRequestError("status must be a valid TripStatus enum"));
  }
  if (!startLocation || typeof startLocation !== "string") {
    return next(new BadRequestError("startLocation is required"));
  }
  if (!endLocation || typeof endLocation !== "string") {
    return next(new BadRequestError("endLocation is required"));
  }
  if (cargoWeight === undefined || isNaN(Number(cargoWeight)) || Number(cargoWeight) < 0) {
    return next(new BadRequestError("cargoWeight is required and must be a non-negative number"));
  }
  if (cargoDescription !== undefined && typeof cargoDescription !== "string") {
    return next(new BadRequestError("cargoDescription must be a string"));
  }
  if (!scheduledStart || isNaN(Date.parse(scheduledStart))) {
    return next(new BadRequestError("scheduledStart is required and must be a valid date"));
  }
  if (!scheduledEnd || isNaN(Date.parse(scheduledEnd))) {
    return next(new BadRequestError("scheduledEnd is required and must be a valid date"));
  }

  next();
}

export function validateUpdateTrip(req: Request, res: Response, next: NextFunction) {
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

  if (tripNumber !== undefined && typeof tripNumber !== "string") {
    return next(new BadRequestError("tripNumber must be a string"));
  }
  if (driverId !== undefined && typeof driverId !== "string") {
    return next(new BadRequestError("driverId must be a string"));
  }
  if (vehicleId !== undefined && typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId must be a string"));
  }
  if (status !== undefined && !["SCHEDULED", "DISPATCHED", "COMPLETED", "CANCELLED"].includes(status)) {
    return next(new BadRequestError("status must be a valid TripStatus enum"));
  }
  if (startLocation !== undefined && typeof startLocation !== "string") {
    return next(new BadRequestError("startLocation must be a string"));
  }
  if (endLocation !== undefined && typeof endLocation !== "string") {
    return next(new BadRequestError("endLocation must be a string"));
  }
  if (cargoWeight !== undefined && (isNaN(Number(cargoWeight)) || Number(cargoWeight) < 0)) {
    return next(new BadRequestError("cargoWeight must be a non-negative number"));
  }
  if (cargoDescription !== undefined && typeof cargoDescription !== "string") {
    return next(new BadRequestError("cargoDescription must be a string"));
  }
  if (scheduledStart !== undefined && isNaN(Date.parse(scheduledStart))) {
    return next(new BadRequestError("scheduledStart must be a valid date"));
  }
  if (scheduledEnd !== undefined && isNaN(Date.parse(scheduledEnd))) {
    return next(new BadRequestError("scheduledEnd must be a valid date"));
  }
  if (actualStart !== undefined && isNaN(Date.parse(actualStart))) {
    return next(new BadRequestError("actualStart must be a valid date"));
  }
  if (actualEnd !== undefined && isNaN(Date.parse(actualEnd))) {
    return next(new BadRequestError("actualEnd must be a valid date"));
  }
  if (odometerAtStart !== undefined && (typeof odometerAtStart !== "number" || odometerAtStart < 0)) {
    return next(new BadRequestError("odometerAtStart must be a non-negative number"));
  }
  if (odometerAtEnd !== undefined && (typeof odometerAtEnd !== "number" || odometerAtEnd < 0)) {
    return next(new BadRequestError("odometerAtEnd must be a non-negative number"));
  }

  next();
}

export function validateTransitionTripStatus(req: Request, res: Response, next: NextFunction) {
  const { status, odometerAtEnd, actualStart, actualEnd } = req.body;

  if (!status || !["SCHEDULED", "DISPATCHED", "COMPLETED", "CANCELLED"].includes(status)) {
    return next(new BadRequestError("status is required and must be a valid TripStatus enum"));
  }
  if (status === "COMPLETED" && (odometerAtEnd === undefined || odometerAtEnd === null || typeof odometerAtEnd !== "number" || odometerAtEnd < 0)) {
    return next(new BadRequestError("odometerAtEnd is required and must be a non-negative number to complete the trip"));
  }
  if (actualStart !== undefined && isNaN(Date.parse(actualStart))) {
    return next(new BadRequestError("actualStart must be a valid date"));
  }
  if (actualEnd !== undefined && isNaN(Date.parse(actualEnd))) {
    return next(new BadRequestError("actualEnd must be a valid date"));
  }

  next();
}
