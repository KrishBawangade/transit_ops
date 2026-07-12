import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateCreateUser(req: Request, res: Response, next: NextFunction) {
  const { email, password, firstName, lastName, role, phone, isActive, avatarUrl } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return next(new BadRequestError("A valid email is required"));
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return next(new BadRequestError("password is required and must be at least 6 characters"));
  }
  if (!firstName || typeof firstName !== "string") {
    return next(new BadRequestError("firstName is required"));
  }
  if (!lastName || typeof lastName !== "string") {
    return next(new BadRequestError("lastName is required"));
  }
  if (!role || !["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"].includes(role)) {
    return next(new BadRequestError("A valid role is required"));
  }
  if (phone !== undefined && typeof phone !== "string") {
    return next(new BadRequestError("phone must be a string"));
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return next(new BadRequestError("isActive must be a boolean"));
  }
  if (avatarUrl !== undefined && typeof avatarUrl !== "string") {
    return next(new BadRequestError("avatarUrl must be a string"));
  }

  next();
}

export function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
  const { email, password, passwordHash, firstName, lastName, role, phone, isActive, avatarUrl } = req.body;

  if (email !== undefined && (typeof email !== "string" || !email.includes("@"))) {
    return next(new BadRequestError("email must be a valid email string"));
  }
  const plainPassword = password || passwordHash;
  if (plainPassword !== undefined && (typeof plainPassword !== "string" || plainPassword.length < 6)) {
    return next(new BadRequestError("password must be a string of at least 6 characters"));
  }
  if (firstName !== undefined && typeof firstName !== "string") {
    return next(new BadRequestError("firstName must be a string"));
  }
  if (lastName !== undefined && typeof lastName !== "string") {
    return next(new BadRequestError("lastName must be a string"));
  }
  if (role !== undefined && !["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"].includes(role)) {
    return next(new BadRequestError("role must be a valid role enum"));
  }
  if (phone !== undefined && typeof phone !== "string") {
    return next(new BadRequestError("phone must be a string"));
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return next(new BadRequestError("isActive must be a boolean"));
  }
  if (avatarUrl !== undefined && typeof avatarUrl !== "string") {
    return next(new BadRequestError("avatarUrl must be a string"));
  }

  next();
}
