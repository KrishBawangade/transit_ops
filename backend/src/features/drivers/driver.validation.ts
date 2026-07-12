import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateCreateDriver(req: Request, res: Response, next: NextFunction) {
  const { userId, licenseNumber, licenseClass, licenseExpiry, status, rating } = req.body;

  if (!userId || typeof userId !== "string") {
    return next(new BadRequestError("userId is required and must be a string"));
  }
  if (!licenseNumber || typeof licenseNumber !== "string") {
    return next(new BadRequestError("licenseNumber is required and must be a string"));
  }
  if (!licenseClass || typeof licenseClass !== "string") {
    return next(new BadRequestError("licenseClass is required and must be a string"));
  }
  if (!licenseExpiry || isNaN(Date.parse(licenseExpiry))) {
    return next(new BadRequestError("licenseExpiry is required and must be a valid date"));
  }
  if (status && !["ACTIVE", "ON_TRIP", "SUSPENDED", "INACTIVE"].includes(status)) {
    return next(new BadRequestError("status must be a valid DriverStatus enum"));
  }
  if (rating !== undefined && (typeof rating !== "number" || rating < 0 || rating > 5)) {
    return next(new BadRequestError("rating must be a number between 0 and 5"));
  }

  next();
}

export function validateUpdateDriver(req: Request, res: Response, next: NextFunction) {
  const { licenseNumber, licenseClass, licenseExpiry, status, rating } = req.body;

  if (licenseNumber !== undefined && typeof licenseNumber !== "string") {
    return next(new BadRequestError("licenseNumber must be a string"));
  }
  if (licenseClass !== undefined && typeof licenseClass !== "string") {
    return next(new BadRequestError("licenseClass must be a string"));
  }
  if (licenseExpiry !== undefined && isNaN(Date.parse(licenseExpiry))) {
    return next(new BadRequestError("licenseExpiry must be a valid date"));
  }
  if (status !== undefined && !["ACTIVE", "ON_TRIP", "SUSPENDED", "INACTIVE"].includes(status)) {
    return next(new BadRequestError("status must be a valid DriverStatus enum"));
  }
  if (rating !== undefined && (typeof rating !== "number" || rating < 0 || rating > 5)) {
    return next(new BadRequestError("rating must be a number between 0 and 5"));
  }

  next();
}
