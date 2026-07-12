// ==========================================
// ENUMS / STRINGS UNIONS
// ==========================================

export type Role = "FLEET_MANAGER" | "DRIVER" | "SAFETY_OFFICER" | "FINANCIAL_ANALYST";

export type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";

export type FuelType = "DIESEL" | "PETROL" | "ELECTRIC" | "CNG" | "HYBRID";

export type DriverStatus = "ACTIVE" | "ON_TRIP" | "SUSPENDED" | "INACTIVE";

export type TripStatus = "SCHEDULED" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

export type MaintenanceType = "PREVENTIVE" | "REPAIR" | "INSPECTION";

export type MaintenanceStatus = "OPEN" | "COMPLETED" | "CANCELLED";

export type ExpenseCategory = "FUEL" | "TOLL" | "MAINTENANCE" | "REPAIR" | "INSURANCE" | "OTHER";

// ==========================================
// DB MODELS
// ==========================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Driver {
  id: string;
  userId: string;
  user?: User;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiry: string; // ISO string date
  status: DriverStatus;
  rating?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  status: VehicleStatus;
  maxPayloadCapacity: number;
  fuelType: FuelType;
  currentOdometer: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Trip {
  id: string;
  tripNumber: string;
  driverId: string;
  driver?: Driver;
  vehicleId: string;
  vehicle?: Vehicle;
  status: TripStatus;
  startLocation: string;
  endLocation: string;
  cargoWeight: number;
  cargoDescription?: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string | null;
  actualEnd?: string | null;
  odometerAtStart?: number | null;
  odometerAtEnd?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  loggedById: string;
  loggedBy?: User;
  description: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  cost: number;
  odometerAtService: number;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  driverId: string;
  driver?: Driver;
  tripId?: string | null;
  trip?: Trip | null;
  quantity: number;
  cost: number;
  odometer: number;
  refueledAt: string;
  receiptUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  loggedById: string;
  loggedBy?: User;
  vehicleId?: string | null;
  vehicle?: Vehicle | null;
  tripId?: string | null;
  trip?: Trip | null;
  fuelLogId?: string | null;
  fuelLog?: FuelLog | null;
  maintenanceLogId?: string | null;
  maintenanceLog?: MaintenanceLog | null;
  expenseDate: string;
  receiptUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ==========================================
// API SHAPES (PAGINATION / COMMON RESPONSES)
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  status: string;
  message: string;
}
