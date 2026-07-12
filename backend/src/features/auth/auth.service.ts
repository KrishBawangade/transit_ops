import { userService } from "../users/user.service";
import { userRepository } from "../users/user.repository";
import { driverRepository } from "../drivers/driver.repository";
import { verifyPassword } from "../../shared/utils/password";
import { generateToken } from "../../shared/utils/jwt";
import { UnauthorizedError, ConflictError } from "../../shared/errors/app-error";
import { User, Role } from "@prisma/client";

export class AuthService {
  async register(
    userData: {
      email: string;
      passwordHash: string; // Plain password passed from controller to hash
      firstName: string;
      lastName: string;
      phone?: string;
      role: Role;
      avatarUrl?: string;
    },
    driverData?: {
      licenseNumber?: string;
      licenseClass?: string;
      licenseExpiry?: Date | string;
    }
  ): Promise<{ user: User; token: string }> {
    // 1. Create the user
    const user = await userService.createUser(userData);

    // 2. If the user is a DRIVER, automatically create an associated driver profile
    if (user.role === Role.DRIVER) {
      const licenseNumber =
        driverData?.licenseNumber || `DL-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const licenseClass = driverData?.licenseClass || "Class A CDL";
      const licenseExpiry = driverData?.licenseExpiry
        ? new Date(driverData.licenseExpiry)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5); // 5 years default expiration

      await driverRepository.create({
        userId: user.id,
        licenseNumber,
        licenseClass,
        licenseExpiry,
      });
    }

    // 3. Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(credentials: {
    email: string;
    password?: string;
    passwordHash?: string; // support either naming from client
  }): Promise<{ user: Omit<User, "passwordHash">; token: string }> {
    const user = await userRepository.findByEmail(credentials.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const plainPassword = credentials.password || credentials.passwordHash;
    if (!plainPassword) {
      throw new UnauthorizedError("Password is required");
    }

    const isMatch = await verifyPassword(plainPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }
}

export const authService = new AuthService();
