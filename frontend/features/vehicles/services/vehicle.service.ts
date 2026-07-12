import { Vehicle, VehicleDocument, VehicleStatus, VehicleType } from "../types";
import { apiClient } from "@/lib/core/services/api-client";
import { PaginatedResponse } from "@/lib/core/types";

// Inner type matching backend structure
interface ApiVehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
  maxPayloadCapacity: number;
  fuelType: "DIESEL" | "PETROL" | "ELECTRIC" | "CNG" | "HYBRID";
  currentOdometer: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

function mapToUiVehicle(api: ApiVehicle): Vehicle {
  let uiStatus: VehicleStatus = "Available";
  if (api.status === "ON_TRIP") uiStatus = "On Trip";
  if (api.status === "IN_SHOP") uiStatus = "In Shop";
  if (api.status === "RETIRED") uiStatus = "Retired";

  const fuelLower = (api.fuelType || "diesel").toLowerCase();
  const fuelType = fuelLower.charAt(0).toUpperCase() + fuelLower.slice(1);

  let type: VehicleType = "Truck";
  const modelLower = (api.model || "").toLowerCase();
  if (modelLower.includes("van") || modelLower.includes("sprinter") || modelLower.includes("transit")) {
    type = "Van";
  } else if (modelLower.includes("hiace") || modelLower.includes("shuttle") || modelLower.includes("mini")) {
    type = "Mini";
  } else if (modelLower.includes("bus") || modelLower.includes("coach")) {
    type = "Bus";
  }

  return {
    id: api.id,
    registrationNumber: api.registrationNumber,
    name: `${api.make} ${api.model}`,
    type,
    capacity: `${api.maxPayloadCapacity} Tons`,
    purchaseDate: "2024-01-01",
    manufacturer: api.make,
    model: api.model,
    fuelType,
    odometer: api.currentOdometer,
    acquisitionCost: 120000,
    insuranceExpiry: "2027-01-01",
    fitnessExpiry: "2027-01-01",
    status: uiStatus,
    notes: "Synced with live database.",
  };
}

function mapToApiVehicleInput(ui: Omit<Vehicle, "id"> | Partial<Vehicle>): any {
  const result: any = {};
  
  if (ui.registrationNumber) {
    result.registrationNumber = ui.registrationNumber;
  }
  if (ui.manufacturer) {
    result.make = ui.manufacturer;
  }
  if (ui.model) {
    result.model = ui.model;
  }
  result.year = 2024; // Default year
  
  if (ui.capacity) {
    const numericPart = parseFloat(ui.capacity);
    result.maxPayloadCapacity = isNaN(numericPart) ? 20 : numericPart;
  }
  
  if (ui.fuelType) {
    result.fuelType = ui.fuelType.toUpperCase() as any;
  }

  if (ui.odometer !== undefined) {
    result.currentOdometer = Number(ui.odometer);
  }

  if (ui.status) {
    let apiStatus = "AVAILABLE";
    if (ui.status === "On Trip") apiStatus = "ON_TRIP";
    if (ui.status === "In Shop") apiStatus = "IN_SHOP";
    if (ui.status === "Retired") apiStatus = "RETIRED";
    result.status = apiStatus;
  }

  return result;
}

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    try {
      // Fetch vehicles from backend (no pagination, set limit to 100 to list all)
      const response = await apiClient.get<PaginatedResponse<ApiVehicle>>("/vehicles", {
        params: { limit: 100 }
      });
      return response.data.map(mapToUiVehicle);
    } catch (error) {
      console.error("Failed to fetch vehicles from backend, using empty list", error);
      return [];
    }
  },

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    try {
      const apiVehicle = await apiClient.get<ApiVehicle>(`/vehicles/${id}`);
      return mapToUiVehicle(apiVehicle);
    } catch (error) {
      console.error(`Failed to fetch vehicle ${id}`, error);
      return undefined;
    }
  },

  async createVehicle(vehicleData: Omit<Vehicle, "id">): Promise<Vehicle> {
    const payload = mapToApiVehicleInput(vehicleData);
    const apiVehicle = await apiClient.post<ApiVehicle>("/vehicles", payload);
    return mapToUiVehicle(apiVehicle);
  },

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const payload = mapToApiVehicleInput(vehicleData);
    const apiVehicle = await apiClient.put<ApiVehicle>(`/vehicles/${id}`, payload);
    return mapToUiVehicle(apiVehicle);
  },

  async deleteVehicle(id: string): Promise<boolean> {
    await apiClient.delete(`/vehicles/${id}`);
    return true;
  },

  async checkRegistrationNumberUnique(
    registrationNumber: string,
    excludeId?: string
  ): Promise<boolean> {
    const vehicles = await this.getVehicles();
    return !vehicles.some(
      (v) =>
        v.id !== excludeId &&
        v.registrationNumber.toLowerCase().trim() ===
          registrationNumber.toLowerCase().trim()
    );
  },

  // Document management routes (fallback mock storage since backend does not support document model yet)
  async getVehicleDocuments(vehicleId: string): Promise<VehicleDocument[]> {
    if (typeof window === "undefined") {
      return [];
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
        ]
      };
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(initial));
      return initial[vehicleId] || [];
    }
    try {
      const parsed = JSON.parse(data);
      return parsed[vehicleId] || [];
    } catch {
      return [];
    }
  },

  async saveVehicleDocuments(vehicleId: string, documents: VehicleDocument[]): Promise<VehicleDocument[]> {
    if (typeof window === "undefined") {
      return documents;
    }
    const DOCUMENTS_STORAGE_KEY = "transit_ops_vehicle_documents";
    const data = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    parsed[vehicleId] = documents;
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(parsed));
    return documents;
  },

  async addOrUpdateDocument(vehicleId: string, doc: Omit<VehicleDocument, "id"> & { id?: string }): Promise<VehicleDocument> {
    const docs = await this.getVehicleDocuments(vehicleId);
    let updatedDoc: VehicleDocument;
    let updatedDocs: VehicleDocument[];

    if (doc.id) {
      updatedDoc = { ...doc, id: doc.id } as VehicleDocument;
      updatedDocs = docs.map((d) => d.id === doc.id ? updatedDoc : d);
    } else {
      updatedDoc = { ...doc, id: `doc-${Date.now()}`, name: doc.name };
      updatedDocs = [...docs, updatedDoc];
    }

    await this.saveVehicleDocuments(vehicleId, updatedDocs);
    return updatedDoc;
  },

  async removeDocument(vehicleId: string, docId: string): Promise<boolean> {
    const docs = await this.getVehicleDocuments(vehicleId);
    const filtered = docs.filter((d) => d.id !== docId);
    await this.saveVehicleDocuments(vehicleId, filtered);
    return true;
  }
};
