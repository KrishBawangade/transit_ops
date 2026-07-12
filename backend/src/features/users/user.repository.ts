import { prisma } from "../../shared/database/prisma";
import { User, Prisma, Role } from "@prisma/client";

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(id: string): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async list(params: {
    skip?: number;
    take?: number;
    role?: Role;
    isActive?: boolean;
  }): Promise<{ data: User[]; total: number }> {
    const { skip, take, role, isActive } = params;
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(role !== undefined && { role }),
      ...(isActive !== undefined && { isActive }),
    };

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const userRepository = new UserRepository();
