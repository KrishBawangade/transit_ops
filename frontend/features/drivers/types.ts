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
  phoneNumber?: string;
  email?: string;
  department?: string;
  issuingAuthority?: string;
  medicalCertificateNumber?: string;
  medicalStatus?: string;
  medicalHospital?: string;
}

export interface ComplianceHistoryRecord {
  id: string;
  checkDate: string; // YYYY-MM-DD
  checkedBy: string;
  status: ComplianceStatus;
  remarks: string;
}

export interface SafetyViolation {
  id: string;
  date: string; // YYYY-MM-DD
  type: string;
  severity: "Low" | "Medium" | "High";
  status: "Resolved" | "Pending Action";
  remarks: string;
}
