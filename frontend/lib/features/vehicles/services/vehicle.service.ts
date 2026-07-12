import { Vehicle } from "../types";

const STORAGE_KEY = "transit_ops_vehicles";

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "v-1",
    registrationNumber: "TX-8821",
    name: "Volvo FH16",
    type: "Truck",
    capacity: "25 Tons",
    purchaseDate: "2024-03-12",
    manufacturer: "Volvo",
    model: "FH16",
    fuelType: "Diesel",
    odometer: 142800,
    acquisitionCost: 135000,
    insuranceExpiry: "2027-03-12",
    fitnessExpiry: "2027-03-12",
    status: "On Trip",
    notes: "Main line hauler.",
  },
  {
    id: "v-2",
    registrationNumber: "CA-4412",
    name: "Kenworth T680",
    type: "Truck",
    capacity: "30 Tons",
    purchaseDate: "2024-05-15",
    manufacturer: "Kenworth",
    model: "T680",
    fuelType: "Diesel",
    odometer: 98200,
    acquisitionCost: 145000,
    insuranceExpiry: "2026-05-15",
    fitnessExpiry: "2026-05-15",
    status: "Available",
    notes: "Excellent fuel efficiency.",
  },
  {
    id: "v-3",
    registrationNumber: "NY-9011",
    name: "Ford Transit",
    type: "Van",
    capacity: "1.5 Tons",
    purchaseDate: "2023-08-20",
    manufacturer: "Ford",
    model: "Transit",
    fuelType: "Gasoline",
    odometer: 42100,
    acquisitionCost: 45000,
    insuranceExpiry: "2026-08-20",
    fitnessExpiry: "2026-08-20",
    status: "Available",
    notes: "Local delivery vehicle.",
  },
  {
    id: "v-4",
    registrationNumber: "IL-7710",
    name: "Mercedes Sprinter",
    type: "Van",
    capacity: "2.0 Tons",
    purchaseDate: "2023-01-10",
    manufacturer: "Mercedes-Benz",
    model: "Sprinter",
    fuelType: "Diesel",
    odometer: 115000,
    acquisitionCost: 55000,
    insuranceExpiry: "2026-01-10",
    fitnessExpiry: "2025-12-10",
    status: "In Shop",
    notes: "Transmission service in progress.",
  },
  {
    id: "v-5",
    registrationNumber: "FL-3392",
    name: "Toyota HiAce",
    type: "Mini",
    capacity: "12 Seats",
    purchaseDate: "2023-11-05",
    manufacturer: "Toyota",
    model: "HiAce",
    fuelType: "Gasoline",
    odometer: 65000,
    acquisitionCost: 38000,
    insuranceExpiry: "2026-11-05",
    fitnessExpiry: "2026-11-05",
    status: "Available",
    notes: "Shuttle service for staff.",
  },
  {
    id: "v-6",
    registrationNumber: "NV-1024",
    name: "MCI D4500",
    type: "Bus",
    capacity: "55 Seats",
    purchaseDate: "2018-04-18",
    manufacturer: "Motor Coach Industries",
    model: "D4500",
    fuelType: "Diesel",
    odometer: 230000,
    acquisitionCost: 220000,
    insuranceExpiry: "2025-04-18",
    fitnessExpiry: "2025-04-18",
    status: "Retired",
    notes: "Retired from active fleet due to age and mileage.",
  }
];

export const vehicleService = {
  getVehicles(): Promise<Vehicle[]> {
    if (typeof window === "undefined") {
      return Promise.resolve(MOCK_VEHICLES);
    }
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_VEHICLES));
      return Promise.resolve(MOCK_VEHICLES);
    }
    try {
      return Promise.resolve(JSON.parse(data));
    } catch {
      return Promise.resolve(MOCK_VEHICLES);
    }
  },

  getVehicleById(id: string): Promise<Vehicle | undefined> {
    return this.getVehicles().then((vehicles) =>
      vehicles.find((v) => v.id === id)
    );
  },

  createVehicle(vehicleData: Omit<Vehicle, "id">): Promise<Vehicle> {
    return this.getVehicles().then((vehicles) => {
      const isUnique = !vehicles.some(
        (v) =>
          v.registrationNumber.toLowerCase().trim() ===
          vehicleData.registrationNumber.toLowerCase().trim()
      );
      if (!isUnique) {
        return Promise.reject(new Error("Registration Number must be unique."));
      }

      const newVehicle: Vehicle = {
        ...vehicleData,
        id: `v-${Date.now()}`,
      };

      const updated = [...vehicles, newVehicle];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return newVehicle;
    });
  },

  updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.getVehicles().then((vehicles) => {
      const index = vehicles.findIndex((v) => v.id === id);
      if (index === -1) {
        return Promise.reject(new Error("Vehicle not found."));
      }

      if (vehicleData.registrationNumber) {
        const isUnique = !vehicles.some(
          (v) =>
            v.id !== id &&
            v.registrationNumber.toLowerCase().trim() ===
              vehicleData.registrationNumber!.toLowerCase().trim()
        );
        if (!isUnique) {
          return Promise.reject(new Error("Registration Number must be unique."));
        }
      }

      const updatedVehicle = {
        ...vehicles[index],
        ...vehicleData,
      };

      const updated = [...vehicles];
      updated[index] = updatedVehicle;

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updatedVehicle;
    });
  },

  deleteVehicle(id: string): Promise<boolean> {
    return this.getVehicles().then((vehicles) => {
      const updated = vehicles.filter((v) => v.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return true;
    });
  },

  checkRegistrationNumberUnique(
    registrationNumber: string,
    excludeId?: string
  ): Promise<boolean> {
    return this.getVehicles().then((vehicles) => {
      return !vehicles.some(
        (v) =>
          v.id !== excludeId &&
          v.registrationNumber.toLowerCase().trim() ===
            registrationNumber.toLowerCase().trim()
      );
    });
  },
};
