export type VehicleType = "Van" | "Truck" | "Mini" | "Bus";

export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";

export interface VehicleDocument {
  id: string;
  name: string; // e.g. "Registration Certificate (RC)", "Insurance", etc.
  documentNumber: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  fileName?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: VehicleType;
  capacity: string;
  purchaseDate: string; // YYYY-MM-DD
  manufacturer: string;
  model: string;
  fuelType: string;
  odometer: number;
  acquisitionCost: number;
  insuranceExpiry: string; // YYYY-MM-DD
  fitnessExpiry: string; // YYYY-MM-DD
  status: VehicleStatus;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
}

export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  vehicleName: string;
  registrationNumber: string;
  driverId: string;
  driverName: string;
  assignmentDate: string; // YYYY-MM-DD
  status: "Assigned" | "Available" | "Inactive";
  remarks?: string;
}
