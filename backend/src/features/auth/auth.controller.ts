import { Request, Response } from "express";
import { authService } from "./auth.service";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { userData, driverData } = req.body;
    const { password, ...restUserData } = userData;
    const data = await authService.register(
      {
        ...restUserData,
        passwordHash: password,
      },
      driverData
    );
    res.status(201).json({
      status: "success",
      data,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password, passwordHash } = req.body;
    const data = await authService.login({
      email,
      password,
      passwordHash,
    });
    res.status(200).json({
      status: "success",
      data,
    });
  }
}

export const authController = new AuthController();
