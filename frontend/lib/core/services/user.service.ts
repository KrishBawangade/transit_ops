import { apiClient } from "./api-client";
import { User, Role, PaginatedResponse } from "../types";

export interface ListUsersParams {
  page?: number;
  limit?: number;
  role?: Role;
  isActive?: boolean;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  passwordHash?: string; // Standardized password parameter
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  isActive?: boolean;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  phone?: string;
  isActive?: boolean;
  avatarUrl?: string;
}

export const userService = {
  async listUsers(params?: ListUsersParams): Promise<PaginatedResponse<User>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.role !== undefined) queryParams.role = params.role;
      if (params.isActive !== undefined) queryParams.isActive = params.isActive;
    }
    return apiClient.get<PaginatedResponse<User>>("/users", { params: queryParams });
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async createUser(dto: CreateUserDto): Promise<User> {
    const payload = {
      ...dto,
      passwordHash: dto.passwordHash || dto.password, // Standardize naming
    };
    return apiClient.post<User>("/users", payload);
  },

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const payload = {
      ...dto,
      passwordHash: dto.passwordHash || dto.password,
    };
    return apiClient.put<User>(`/users/${id}`, payload);
  },

  async deleteUser(id: string): Promise<boolean> {
    await apiClient.delete(`/users/${id}`);
    return true;
  }
};
