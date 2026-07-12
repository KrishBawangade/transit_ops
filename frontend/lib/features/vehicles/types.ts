export type VehicleType = "Van" | "Truck" | "Mini" | "Bus";

export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";

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
