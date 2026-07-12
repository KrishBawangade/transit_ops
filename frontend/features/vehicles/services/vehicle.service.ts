import { Vehicle, VehicleDocument } from "../types";

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

  getVehicleDocuments(vehicleId: string): Promise<VehicleDocument[]> {
    if (typeof window === "undefined") {
      return Promise.resolve([]);
    }
    const DOCUMENTS_STORAGE_KEY = "transit_ops_vehicle_documents";
    
    const getFutureDate = (daysAhead: number) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      return d.toISOString().split("T")[0];
    };

    const getPastDate = (daysAgo: number) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split("T")[0];
    };

    const data = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!data) {
      const initial: Record<string, VehicleDocument[]> = {
        "v-1": [
          { id: "doc-1", name: "Registration Certificate (RC)", documentNumber: "RC-TX8821", issueDate: getPastDate(300), expiryDate: getFutureDate(3000), fileName: "rc_volvo.pdf" },
          { id: "doc-2", name: "Insurance", documentNumber: "INS-TX8821", issueDate: getPastDate(300), expiryDate: getFutureDate(300), fileName: "insurance_volvo.pdf" },
          { id: "doc-3", name: "Fitness Certificate", documentNumber: "FIT-TX8821", issueDate: getPastDate(300), expiryDate: getFutureDate(200), fileName: "fitness_volvo.pdf" },
          { id: "doc-4", name: "Pollution Certificate (PUC)", documentNumber: "PUC-TX8821", issueDate: getPastDate(100), expiryDate: getFutureDate(12), fileName: "puc_volvo.pdf" },
          { id: "doc-5", name: "Permit", documentNumber: "PER-TX8821", issueDate: getPastDate(300), expiryDate: getFutureDate(600), fileName: "permit_volvo.pdf" }
        ],
        "v-2": [
          { id: "doc-6", name: "Registration Certificate (RC)", documentNumber: "RC-CA4412", issueDate: getPastDate(400), expiryDate: getFutureDate(2600), fileName: "rc_kenworth.pdf" },
          { id: "doc-7", name: "Insurance", documentNumber: "INS-CA4412", issueDate: getPastDate(400), expiryDate: getFutureDate(18), fileName: "insurance_kenworth.pdf" },
          { id: "doc-8", name: "Fitness Certificate", documentNumber: "FIT-CA4412", issueDate: getPastDate(400), expiryDate: getPastDate(12), fileName: "fitness_kenworth.pdf" },
          { id: "doc-9", name: "Pollution Certificate (PUC)", documentNumber: "PUC-CA4412", issueDate: getPastDate(150), expiryDate: getFutureDate(15), fileName: "puc_kenworth.pdf" },
          { id: "doc-10", name: "Permit", documentNumber: "PER-CA4412", issueDate: getPastDate(400), expiryDate: getFutureDate(500), fileName: "permit_kenworth.pdf" }
        ]
      };
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(initial));
      return Promise.resolve(initial[vehicleId] || []);
    }
    try {
      const parsed = JSON.parse(data);
      return Promise.resolve(parsed[vehicleId] || []);
    } catch {
      return Promise.resolve([]);
    }
  },

  saveVehicleDocuments(vehicleId: string, documents: VehicleDocument[]): Promise<VehicleDocument[]> {
    if (typeof window === "undefined") {
      return Promise.resolve(documents);
    }
    const DOCUMENTS_STORAGE_KEY = "transit_ops_vehicle_documents";
    const data = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    parsed[vehicleId] = documents;
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(parsed));
    return Promise.resolve(documents);
  },

  addOrUpdateDocument(vehicleId: string, doc: Omit<VehicleDocument, "id"> & { id?: string }): Promise<VehicleDocument> {
    return this.getVehicleDocuments(vehicleId).then((docs) => {
      let updatedDoc: VehicleDocument;
      let updatedDocs: VehicleDocument[];

      if (doc.id) {
        updatedDoc = { ...doc, id: doc.id } as VehicleDocument;
        updatedDocs = docs.map((d) => d.id === doc.id ? updatedDoc : d);
      } else {
        updatedDoc = { ...doc, id: `doc-${Date.now()}`, name: doc.name };
        updatedDocs = [...docs, updatedDoc];
      }

      return this.saveVehicleDocuments(vehicleId, updatedDocs).then(() => updatedDoc);
    });
  },

  removeDocument(vehicleId: string, docId: string): Promise<boolean> {
    return this.getVehicleDocuments(vehicleId).then((docs) => {
      const filtered = docs.filter((d) => d.id !== docId);
      return this.saveVehicleDocuments(vehicleId, filtered).then(() => true);
    });
  }
};
