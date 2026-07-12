import { Request, Response } from "express";
import { userService } from "./user.service";
import { Role } from "@prisma/client";

export class UserController {
  async getUserById(req: Request, res: Response): Promise<void> {
    const user = await userService.getUserById(req.params.id as string);
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({
      status: "success",
      data: userWithoutPassword,
    });
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const { email, password, firstName, lastName, role, phone, isActive, avatarUrl } = req.body;
    const user = await userService.createUser({
      email,
      passwordHash: password, // userService will hash it
      firstName,
      lastName,
      role,
      phone,
      isActive,
      avatarUrl,
    });
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({
      status: "success",
      data: userWithoutPassword,
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { email, password, passwordHash, firstName, lastName, role, phone, isActive, avatarUrl } = req.body;
    const plainPassword = password || passwordHash;
    const updateData: any = {
      email,
      firstName,
      lastName,
      role,
      phone,
      isActive,
      avatarUrl,
    };
    if (plainPassword) {
      updateData.passwordHash = plainPassword; // userService hashes it
    }
    const user = await userService.updateUser(req.params.id as string, updateData);
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({
      status: "success",
      data: userWithoutPassword,
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const user = await userService.deleteUser(req.params.id as string);
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({
      status: "success",
      data: userWithoutPassword,
    });
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const role = req.query.role as Role | undefined;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;

    const result = await userService.listUsers({ page, limit, role, isActive });
    const sanitizedData = result.data.map(({ passwordHash: _, ...u }) => u);

    res.status(200).json({
      status: "success",
      data: sanitizedData,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  }
}

export const userController = new UserController();
