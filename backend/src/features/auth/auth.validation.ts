import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../shared/errors/app-error";

export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const { userData, driverData } = req.body;

  if (!userData) {
    return next(new BadRequestError("userData is required"));
  }

  const { email, password, firstName, lastName, role } = userData;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return next(new BadRequestError("A valid email is required"));
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return next(new BadRequestError("Password is required and must be at least 6 characters"));
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

  if (role === "DRIVER" && driverData) {
    const { licenseExpiry } = driverData;
    if (licenseExpiry && isNaN(Date.parse(licenseExpiry))) {
      return next(new BadRequestError("licenseExpiry must be a valid date"));
    }
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password, passwordHash } = req.body;

  if (!email || typeof email !== "string") {
    return next(new BadRequestError("email is required"));
  }

  const plainPassword = password || passwordHash;
  if (!plainPassword || typeof plainPassword !== "string") {
    return next(new BadRequestError("password is required"));
  }

  next();
}
