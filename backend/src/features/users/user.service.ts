import { userRepository } from "./user.repository";
import { User, Prisma, Role } from "@prisma/client";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error";
import { hashPassword } from "../../shared/utils/password";

export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError(`User with email ${data.email} already exists`);
    }
    const passwordHash = await hashPassword(data.passwordHash);
    return userRepository.create({
      ...data,
      passwordHash,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    await this.getUserById(id);

    if (data.email) {
      const existingUser = await userRepository.findByEmail(data.email as string);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError(`User with email ${data.email} already exists`);
      }
    }

    if (data.passwordHash) {
      data.passwordHash = await hashPassword(data.passwordHash as string);
    }

    return userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<User> {
    await this.getUserById(id);
    return userRepository.softDelete(id);
  }

  async listUsers(params: {
    page?: number;
    limit?: number;
    role?: Role;
    isActive?: boolean;
  }): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const { data, total } = await userRepository.list({
      skip,
      take: limit,
      role: params.role,
      isActive: params.isActive,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

export const userService = new UserService();
