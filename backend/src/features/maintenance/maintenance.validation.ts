import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateCreateMaintenanceLog(req: Request, res: Response, next: NextFunction) {
  const { vehicleId, loggedById, description, type, status, cost, odometerAtService, startDate, endDate } = req.body;

  if (!vehicleId || typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId is required"));
  }
  if (!loggedById || typeof loggedById !== "string") {
    return next(new BadRequestError("loggedById is required"));
  }
  if (!description || typeof description !== "string") {
    return next(new BadRequestError("description is required"));
  }
  if (!type || !["PREVENTIVE", "REPAIR", "INSPECTION"].includes(type)) {
    return next(new BadRequestError("type is required and must be one of: PREVENTIVE, REPAIR, INSPECTION"));
  }
  if (status && !["OPEN", "COMPLETED", "CANCELLED"].includes(status)) {
    return next(new BadRequestError("status must be one of: OPEN, COMPLETED, CANCELLED"));
  }
  if (cost !== undefined && (isNaN(Number(cost)) || Number(cost) < 0)) {
    return next(new BadRequestError("cost must be a non-negative number"));
  }
  if (odometerAtService === undefined || typeof odometerAtService !== "number" || odometerAtService < 0) {
    return next(new BadRequestError("odometerAtService is required and must be a non-negative number"));
  }
  if (startDate && isNaN(Date.parse(startDate))) {
    return next(new BadRequestError("startDate must be a valid date"));
  }
  if (endDate && isNaN(Date.parse(endDate))) {
    return next(new BadRequestError("endDate must be a valid date"));
  }

  next();
}

export function validateUpdateMaintenanceLog(req: Request, res: Response, next: NextFunction) {
  const { vehicleId, loggedById, description, type, status, cost, odometerAtService, startDate, endDate } = req.body;

  if (vehicleId !== undefined && typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId must be a string"));
  }
  if (loggedById !== undefined && typeof loggedById !== "string") {
    return next(new BadRequestError("loggedById must be a string"));
  }
  if (description !== undefined && typeof description !== "string") {
    return next(new BadRequestError("description must be a string"));
  }
  if (type !== undefined && !["PREVENTIVE", "REPAIR", "INSPECTION"].includes(type)) {
    return next(new BadRequestError("type must be one of: PREVENTIVE, REPAIR, INSPECTION"));
  }
  if (status !== undefined && !["OPEN", "COMPLETED", "CANCELLED"].includes(status)) {
    return next(new BadRequestError("status must be one of: OPEN, COMPLETED, CANCELLED"));
  }
  if (cost !== undefined && (isNaN(Number(cost)) || Number(cost) < 0)) {
    return next(new BadRequestError("cost must be a non-negative number"));
  }
  if (odometerAtService !== undefined && (typeof odometerAtService !== "number" || odometerAtService < 0)) {
    return next(new BadRequestError("odometerAtService must be a non-negative number"));
  }
  if (startDate !== undefined && isNaN(Date.parse(startDate))) {
    return next(new BadRequestError("startDate must be a valid date"));
  }
  if (endDate !== undefined && isNaN(Date.parse(endDate))) {
    return next(new BadRequestError("endDate must be a valid date"));
  }

  next();
}
