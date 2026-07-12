import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateCreateVehicle(req: Request, res: Response, next: NextFunction) {
  const { registrationNumber, make, model, year, status, maxPayloadCapacity, fuelType, currentOdometer } = req.body;

  if (!registrationNumber || typeof registrationNumber !== "string") {
    return next(new BadRequestError("registrationNumber is required and must be a string"));
  }
  if (!make || typeof make !== "string") {
    return next(new BadRequestError("make is required and must be a string"));
  }
  if (!model || typeof model !== "string") {
    return next(new BadRequestError("model is required and must be a string"));
  }
  if (year === undefined || typeof year !== "number" || year < 1900) {
    return next(new BadRequestError("year is required and must be a valid number"));
  }
  if (maxPayloadCapacity === undefined || isNaN(Number(maxPayloadCapacity)) || Number(maxPayloadCapacity) <= 0) {
    return next(new BadRequestError("maxPayloadCapacity is required and must be a positive number"));
  }
  if (!fuelType || !["DIESEL", "PETROL", "ELECTRIC", "CNG", "HYBRID"].includes(fuelType)) {
    return next(new BadRequestError("fuelType is required and must be one of: DIESEL, PETROL, ELECTRIC, CNG, HYBRID"));
  }
  if (status && !["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"].includes(status)) {
    return next(new BadRequestError("status must be one of: AVAILABLE, ON_TRIP, IN_SHOP, RETIRED"));
  }
  if (currentOdometer !== undefined && (typeof currentOdometer !== "number" || currentOdometer < 0)) {
    return next(new BadRequestError("currentOdometer must be a non-negative number"));
  }

  next();
}

export function validateUpdateVehicle(req: Request, res: Response, next: NextFunction) {
  const { registrationNumber, make, model, year, status, maxPayloadCapacity, fuelType, currentOdometer } = req.body;

  if (registrationNumber !== undefined && typeof registrationNumber !== "string") {
    return next(new BadRequestError("registrationNumber must be a string"));
  }
  if (make !== undefined && typeof make !== "string") {
    return next(new BadRequestError("make must be a string"));
  }
  if (model !== undefined && typeof model !== "string") {
    return next(new BadRequestError("model must be a string"));
  }
  if (year !== undefined && (typeof year !== "number" || year < 1900)) {
    return next(new BadRequestError("year must be a valid number"));
  }
  if (maxPayloadCapacity !== undefined && (isNaN(Number(maxPayloadCapacity)) || Number(maxPayloadCapacity) <= 0)) {
    return next(new BadRequestError("maxPayloadCapacity must be a positive number"));
  }
  if (fuelType !== undefined && !["DIESEL", "PETROL", "ELECTRIC", "CNG", "HYBRID"].includes(fuelType)) {
    return next(new BadRequestError("fuelType must be one of: DIESEL, PETROL, ELECTRIC, CNG, HYBRID"));
  }
  if (status !== undefined && !["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"].includes(status)) {
    return next(new BadRequestError("status must be one of: AVAILABLE, ON_TRIP, IN_SHOP, RETIRED"));
  }
  if (currentOdometer !== undefined && (typeof currentOdometer !== "number" || currentOdometer < 0)) {
    return next(new BadRequestError("currentOdometer must be a non-negative number"));
  }

  next();
}
