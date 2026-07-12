import { apiClient } from "./api-client";
import { User, Role } from "../types";

export interface AuthResponse {
  user: Omit<User, "passwordHash">;
  token: string;
}

export interface RegisterDto {
  email: string;
  passwordHash: string; // Wait, plain password is typed passwordHash in register dto backend, let's check
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  driverData?: {
    licenseNumber?: string;
    licenseClass?: string;
    licenseExpiry?: string;
  };
}

export interface LoginDto {
  email: string;
  password?: string;
  passwordHash?: string;
}

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  logout(): void {
    apiClient.clearToken();
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }
};
