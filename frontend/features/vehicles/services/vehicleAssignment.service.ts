import { VehicleAssignment, Driver } from "../types";
import { apiClient } from "@/lib/core/services/api-client";
import { PaginatedResponse } from "@/lib/core/types";

// Inner interfaces matching backend response shapes
interface ApiUser {
  firstName: string;
  lastName: string;
}

interface ApiDriver {
  id: string;
  user: ApiUser;
}

interface ApiVehicle {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
}

interface ApiTrip {
  id: string;
  tripNumber: string;
  driverId: string;
  driver: ApiDriver;
  vehicleId: string;
  vehicle: ApiVehicle;
  status: "SCHEDULED" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
  scheduledStart: string;
  scheduledEnd: string;
  cargoDescription?: string | null;
}

export const vehicleAssignmentService = {
  async getDrivers(): Promise<Driver[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<ApiDriver>>("/drivers", {
        params: { limit: 100, status: "ACTIVE" }
      });
      return response.data.map((d) => ({
        id: d.id,
        name: `${d.user.firstName} ${d.user.lastName}`
      }));
    } catch (error) {
      console.error("Failed to fetch drivers for assignments", error);
      return [];
    }
  },

  async getAssignments(): Promise<VehicleAssignment[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<ApiTrip>>("/trips", {
        params: { limit: 100 }
      });
      return response.data.map((trip) => {
        let uiStatus: "Assigned" | "Available" | "Inactive" = "Assigned";
        if (trip.status === "COMPLETED") {
          uiStatus = "Available";
        } else if (trip.status === "CANCELLED") {
          uiStatus = "Inactive";
        }

        return {
          id: trip.id,
          vehicleId: trip.vehicleId,
          vehicleName: `${trip.vehicle.make} ${trip.vehicle.model}`,
          registrationNumber: trip.vehicle.registrationNumber,
          driverId: trip.driverId,
          driverName: `${trip.driver.user.firstName} ${trip.driver.user.lastName}`,
          assignmentDate: trip.scheduledStart ? trip.scheduledStart.split("T")[0] : new Date().toISOString().split("T")[0],
          status: uiStatus,
          remarks: trip.cargoDescription || "Scheduled logistics route."
        };
      });
    } catch (error) {
      console.error("Failed to fetch vehicle assignments", error);
      return [];
    }
  },

  async assignVehicle(vehicleId: string, driverId: string, date: string, remarks?: string): Promise<VehicleAssignment> {
    // Map assignment to a scheduled Trip in the backend
    const scheduledStart = new Date(date).toISOString();
    const scheduledEnd = new Date(new Date(date).getTime() + 8 * 60 * 60 * 1000).toISOString(); // 8hr default

    const payload = {
      driverId,
      vehicleId,
      status: "SCHEDULED",
      startLocation: "Depot A",
      endLocation: "Warehouse B",
      cargoWeight: 15.5,
      cargoDescription: remarks || "Automated fleet assignment",
      scheduledStart,
      scheduledEnd
    };

    const trip = await apiClient.post<ApiTrip>("/trips", payload);

    return {
      id: trip.id,
      vehicleId: trip.vehicleId,
      vehicleName: `${trip.vehicle.make} ${trip.vehicle.model}`,
      registrationNumber: trip.vehicle.registrationNumber,
      driverId: trip.driverId,
      driverName: `${trip.driver.user.firstName} ${trip.driver.user.lastName}`,
      assignmentDate: trip.scheduledStart.split("T")[0],
      status: "Assigned",
      remarks: trip.cargoDescription || undefined
    };
  },

  async reassignVehicle(assignmentId: string, newDriverId: string): Promise<VehicleAssignment> {
    // Map reassignment to updating the driverId on the Trip
    const trip = await apiClient.put<ApiTrip>(`/trips/${assignmentId}`, {
      driverId: newDriverId
    });

    return {
      id: trip.id,
      vehicleId: trip.vehicleId,
      vehicleName: `${trip.vehicle.make} ${trip.vehicle.model}`,
      registrationNumber: trip.vehicle.registrationNumber,
      driverId: trip.driverId,
      driverName: `${trip.driver.user.firstName} ${trip.driver.user.lastName}`,
      assignmentDate: trip.scheduledStart.split("T")[0],
      status: "Assigned",
      remarks: trip.cargoDescription || undefined
    };
  },

  async unassignVehicle(assignmentId: string): Promise<boolean> {
    // Map unassigning to cancelling the trip
    await apiClient.patch(`/trips/${assignmentId}/status`, {
      status: "CANCELLED"
    });
    return true;
  }
};
