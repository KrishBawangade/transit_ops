import { DriverCompliance } from "../types";

const COMPLIANCE_STORAGE_KEY = "transit_ops_driver_compliance";

const getOffsetDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

export const driverComplianceService = {
  getComplianceRecords(): Promise<DriverCompliance[]> {
    if (typeof window === "undefined") {
      return Promise.resolve([]);
    }
    const data = localStorage.getItem(COMPLIANCE_STORAGE_KEY);
    if (!data) {
      // Seed default compliance records
      const initial: DriverCompliance[] = [
        {
          id: "dc-101",
          name: "Alex Rivera",
          employeeId: "EMP-101",
          licenseNumber: "DL-908234",
          licenseType: "Heavy Vehicle",
          licenseExpiry: getOffsetDate(180),
          medicalExpiry: getOffsetDate(220),
          status: "Compliant",
          notes: "All credentials are active and up to date. Excellent driving scorecard."
        },
        {
          id: "dc-102",
          name: "Dave Miller",
          employeeId: "EMP-102",
          licenseNumber: "DL-772183",
          licenseType: "Heavy Vehicle",
          licenseExpiry: getOffsetDate(12), // Expiring in 12 days
          medicalExpiry: getOffsetDate(90),
          status: "Expiring Soon",
          notes: "Commercial license renewal notification sent. Scheduled for license update test next Tuesday."
        },
        {
          id: "dc-103",
          name: "Elena Rostova",
          employeeId: "EMP-103",
          licenseNumber: "DL-661092",
          licenseType: "Bus",
          licenseExpiry: getOffsetDate(120),
          medicalExpiry: getOffsetDate(-5), // Expired 5 days ago
          status: "Expired",
          notes: "Medical certification expired. Driver is currently grounded until clearance form is submitted."
        },
        {
          id: "dc-104",
          name: "Marcus Vance",
          employeeId: "EMP-104",
          licenseNumber: "DL-552109",
          licenseType: "Light Vehicle",
          licenseExpiry: getOffsetDate(80),
          medicalExpiry: getOffsetDate(150),
          status: "Compliant",
          notes: "Defensive driver certification active. Shift schedules are compliant."
        },
        {
          id: "dc-105",
          name: "Sarah Jenkins",
          employeeId: "EMP-105",
          licenseNumber: "DL-882012",
          licenseType: "Heavy Vehicle",
          licenseExpiry: getOffsetDate(-12), // Expired 12 days ago
          medicalExpiry: getOffsetDate(45),
          status: "Expired",
          notes: "Heavy commercial license has expired. Scheduled renewal was missed. Suspended from active routes."
        },
        {
          id: "dc-106",
          name: "Jameson Blake",
          employeeId: "EMP-106",
          licenseNumber: "DL-441234",
          licenseType: "Van",
          licenseExpiry: getOffsetDate(25), // Expiring in 25 days
          medicalExpiry: getOffsetDate(15), // Expiring in 15 days
          status: "Expiring Soon",
          notes: "Both medical certificate and van permit expire in under 30 days. Renewal applications are pending processing."
        }
      ];
      localStorage.setItem(COMPLIANCE_STORAGE_KEY, JSON.stringify(initial));
      return Promise.resolve(initial);
    }
    try {
      return Promise.resolve(JSON.parse(data));
    } catch {
      return Promise.resolve([]);
    }
  },

  saveComplianceRecords(records: DriverCompliance[]): Promise<DriverCompliance[]> {
    if (typeof window === "undefined") {
      return Promise.resolve(records);
    }
    localStorage.setItem(COMPLIANCE_STORAGE_KEY, JSON.stringify(records));
    return Promise.resolve(records);
  }
};
