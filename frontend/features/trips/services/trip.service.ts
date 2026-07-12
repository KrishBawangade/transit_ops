import { apiClient } from "@/lib/core/services/api-client";
import { Trip, TripStatus, PaginatedResponse } from "@/lib/core/types";

export interface ListTripsParams {
  page?: number;
  limit?: number;
  driverId?: string;
  vehicleId?: string;
  status?: TripStatus;
}

export interface CreateTripDto {
  tripNumber?: string;
  driverId: string;
  vehicleId: string;
  status?: TripStatus;
  startLocation: string;
  endLocation: string;
  cargoWeight: number;
  cargoDescription?: string;
  scheduledStart: string; // ISO string date
  scheduledEnd: string; // ISO string date
  actualStart?: string;
  actualEnd?: string;
  odometerAtStart?: number;
  odometerAtEnd?: number;
}

export interface UpdateTripDto {
  driverId?: string;
  vehicleId?: string;
  status?: TripStatus;
  startLocation?: string;
  endLocation?: string;
  cargoWeight?: number;
  cargoDescription?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  odometerAtStart?: number;
  odometerAtEnd?: number;
}

export interface TransitionStatusDto {
  actualStart?: string;
  actualEnd?: string;
  odometerAtStart?: number;
  odometerAtEnd?: number;
}

export const tripService = {
  async listTrips(params?: ListTripsParams): Promise<PaginatedResponse<Trip>> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.driverId !== undefined) queryParams.driverId = params.driverId;
      if (params.vehicleId !== undefined) queryParams.vehicleId = params.vehicleId;
      if (params.status !== undefined) queryParams.status = params.status;
    }
    return apiClient.get<PaginatedResponse<Trip>>("/trips", { params: queryParams });
  },

  async getTripById(id: string): Promise<Trip> {
    return apiClient.get<Trip>(`/trips/${id}`);
  },

  async createTrip(dto: CreateTripDto): Promise<Trip> {
    return apiClient.post<Trip>("/trips", dto);
  },

  async updateTrip(id: string, dto: UpdateTripDto): Promise<Trip> {
    return apiClient.put<Trip>(`/trips/${id}`, dto);
  },

  async transitionTripStatus(id: string, status: TripStatus, dto?: TransitionStatusDto): Promise<Trip> {
    return apiClient.patch<Trip>(`/trips/${id}/status`, { status, ...dto });
  },

  async deleteTrip(id: string): Promise<boolean> {
    await apiClient.delete(`/trips/${id}`);
    return true;
  }
};
