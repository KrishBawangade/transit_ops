import { VehicleAssignment, Driver } from "../types";
import { vehicleService } from "./vehicle.service";

const ASSIGNMENTS_STORAGE_KEY = "transit_ops_vehicle_assignments";

const MOCK_DRIVERS: Driver[] = [
  { id: "dr-1", name: "Alex Rivera" },
  { id: "dr-2", name: "Sarah Connor" },
  { id: "dr-3", name: "David Chen" },
  { id: "dr-4", name: "Marcus Vance" },
  { id: "dr-5", name: "Elena Rostova" },
  { id: "dr-6", name: "John Doe" }
];

export const vehicleAssignmentService = {
  getDrivers(): Promise<Driver[]> {
    return Promise.resolve(MOCK_DRIVERS);
  },

  getAssignments(): Promise<VehicleAssignment[]> {
    if (typeof window === "undefined") {
      return Promise.resolve([]);
    }
    const data = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (!data) {
      // Seed default assignments
      const initial: VehicleAssignment[] = [
        {
          id: "asg-1",
          vehicleId: "v-1",
          vehicleName: "Volvo FH16",
          registrationNumber: "TX-8821",
          driverId: "dr-1",
          driverName: "Alex Rivera",
          assignmentDate: "2024-03-12",
          status: "Assigned",
          remarks: "Regular long-haul cargo distribution routes."
        },
        {
          id: "asg-2",
          vehicleId: "v-3",
          vehicleName: "Ford Transit",
          registrationNumber: "NY-9011",
          driverId: "dr-2",
          driverName: "Sarah Connor",
          assignmentDate: "2024-06-20",
          status: "Assigned",
          remarks: "Local delivery routing."
        },
        {
          id: "asg-3",
          vehicleId: "v-4",
          vehicleName: "Mercedes Sprinter",
          registrationNumber: "IL-7710",
          driverId: "dr-3",
          driverName: "David Chen",
          assignmentDate: "2023-01-10",
          status: "Inactive",
          remarks: "Placed inactive while vehicle undergoes transmission overhaul."
        }
      ];
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(initial));
      return Promise.resolve(initial);
    }
    try {
      return Promise.resolve(JSON.parse(data));
    } catch {
      return Promise.resolve([]);
    }
  },

  saveAssignments(assignments: VehicleAssignment[]): Promise<VehicleAssignment[]> {
    if (typeof window === "undefined") {
      return Promise.resolve(assignments);
    }
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
    return Promise.resolve(assignments);
  },

  assignVehicle(vehicleId: string, driverId: string, date: string, remarks?: string): Promise<VehicleAssignment> {
    return Promise.all([
      this.getAssignments(),
      vehicleService.getVehicleById(vehicleId),
      this.getDrivers()
    ]).then(([assignments, vehicle, drivers]) => {
      if (!vehicle) {
        return Promise.reject(new Error("Vehicle not found."));
      }
      const driver = drivers.find((d) => d.id === driverId);
      if (!driver) {
        return Promise.reject(new Error("Driver not found."));
      }

      // Check if vehicle is already actively assigned
      const alreadyAssigned = assignments.some(
        (a) => a.vehicleId === vehicleId && a.status === "Assigned"
      );
      if (alreadyAssigned) {
        return Promise.reject(new Error("Vehicle is already assigned to an active driver."));
      }

      const newAssignment: VehicleAssignment = {
        id: `asg-${Date.now()}`,
        vehicleId: vehicleId,
        vehicleName: vehicle.name || `${vehicle.manufacturer} ${vehicle.model}`,
        registrationNumber: vehicle.registrationNumber,
        driverId: driverId,
        driverName: driver.name,
        assignmentDate: date,
        status: "Assigned",
        remarks: remarks
      };

      const updatedAssignments = [...assignments, newAssignment];
      return this.saveAssignments(updatedAssignments).then(() => newAssignment);
    });
  },

  reassignVehicle(assignmentId: string, newDriverId: string): Promise<VehicleAssignment> {
    return Promise.all([
      this.getAssignments(),
      this.getDrivers()
    ]).then(([assignments, drivers]) => {
      const index = assignments.findIndex((a) => a.id === assignmentId);
      if (index === -1) {
        return Promise.reject(new Error("Assignment record not found."));
      }
      const driver = drivers.find((d) => d.id === newDriverId);
      if (!driver) {
        return Promise.reject(new Error("Driver not found."));
      }

      const updated = {
        ...assignments[index],
        driverId: newDriverId,
        driverName: driver.name,
        assignmentDate: new Date().toISOString().split("T")[0]
      };

      const updatedList = [...assignments];
      updatedList[index] = updated;

      return this.saveAssignments(updatedList).then(() => updated);
    });
  },

  unassignVehicle(assignmentId: string): Promise<boolean> {
    return this.getAssignments().then((assignments) => {
      const index = assignments.findIndex((a) => a.id === assignmentId);
      if (index === -1) {
        return Promise.reject(new Error("Assignment record not found."));
      }

      const updated = {
        ...assignments[index],
        status: "Available" as const
      };

      const updatedList = [...assignments];
      updatedList[index] = updated;

      return this.saveAssignments(updatedList).then(() => true);
    });
  }
};
