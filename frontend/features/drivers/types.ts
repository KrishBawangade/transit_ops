export type LicenseType = "Heavy Vehicle" | "Light Vehicle" | "Bus" | "Van";

export type ComplianceStatus = "Compliant" | "Expiring Soon" | "Expired";

export interface DriverCompliance {
  id: string;
  name: string;
  employeeId: string;
  licenseNumber: string;
  licenseType: LicenseType;
  licenseExpiry: string; // YYYY-MM-DD
  medicalExpiry: string; // YYYY-MM-DD
  status: ComplianceStatus;
  notes?: string;
}
