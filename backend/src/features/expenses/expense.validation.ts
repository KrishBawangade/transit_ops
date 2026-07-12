import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateCreateExpense(req: Request, res: Response, next: NextFunction) {
  const { amount, category, description, loggedById, vehicleId, tripId, fuelLogId, maintenanceLogId, expenseDate, receiptUrl } = req.body;

  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
    return next(new BadRequestError("amount is required and must be a positive number"));
  }
  if (!category || !["FUEL", "TOLL", "MAINTENANCE", "REPAIR", "INSURANCE", "OTHER"].includes(category)) {
    return next(new BadRequestError("category is required and must be one of: FUEL, TOLL, MAINTENANCE, REPAIR, INSURANCE, OTHER"));
  }
  if (!description || typeof description !== "string") {
    return next(new BadRequestError("description is required"));
  }
  if (!loggedById || typeof loggedById !== "string") {
    return next(new BadRequestError("loggedById is required"));
  }
  if (vehicleId !== undefined && typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId must be a string"));
  }
  if (tripId !== undefined && typeof tripId !== "string") {
    return next(new BadRequestError("tripId must be a string"));
  }
  if (fuelLogId !== undefined && typeof fuelLogId !== "string") {
    return next(new BadRequestError("fuelLogId must be a string"));
  }
  if (maintenanceLogId !== undefined && typeof maintenanceLogId !== "string") {
    return next(new BadRequestError("maintenanceLogId must be a string"));
  }
  if (expenseDate && isNaN(Date.parse(expenseDate))) {
    return next(new BadRequestError("expenseDate must be a valid date"));
  }
  if (receiptUrl !== undefined && typeof receiptUrl !== "string") {
    return next(new BadRequestError("receiptUrl must be a string"));
  }

  next();
}

export function validateUpdateExpense(req: Request, res: Response, next: NextFunction) {
  const { amount, category, description, loggedById, vehicleId, tripId, fuelLogId, maintenanceLogId, expenseDate, receiptUrl } = req.body;

  if (amount !== undefined && (isNaN(Number(amount)) || Number(amount) <= 0)) {
    return next(new BadRequestError("amount must be a positive number"));
  }
  if (category !== undefined && !["FUEL", "TOLL", "MAINTENANCE", "REPAIR", "INSURANCE", "OTHER"].includes(category)) {
    return next(new BadRequestError("category must be one of: FUEL, TOLL, MAINTENANCE, REPAIR, INSURANCE, OTHER"));
  }
  if (description !== undefined && typeof description !== "string") {
    return next(new BadRequestError("description must be a string"));
  }
  if (loggedById !== undefined && typeof loggedById !== "string") {
    return next(new BadRequestError("loggedById must be a string"));
  }
  if (vehicleId !== undefined && typeof vehicleId !== "string") {
    return next(new BadRequestError("vehicleId must be a string"));
  }
  if (tripId !== undefined && typeof tripId !== "string") {
    return next(new BadRequestError("tripId must be a string"));
  }
  if (fuelLogId !== undefined && typeof fuelLogId !== "string") {
    return next(new BadRequestError("fuelLogId must be a string"));
  }
  if (maintenanceLogId !== undefined && typeof maintenanceLogId !== "string") {
    return next(new BadRequestError("maintenanceLogId must be a string"));
  }
  if (expenseDate !== undefined && isNaN(Date.parse(expenseDate))) {
    return next(new BadRequestError("expenseDate must be a valid date"));
  }
  if (receiptUrl !== undefined && typeof receiptUrl !== "string") {
    return next(new BadRequestError("receiptUrl must be a string"));
  }

  next();
}
