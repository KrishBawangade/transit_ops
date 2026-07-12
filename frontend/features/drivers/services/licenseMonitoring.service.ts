import { LicenseMonitoringRecord, DocumentStatus } from "../types";

const LICENSES_STORAGE_KEY = "transit_ops_licenses_monitoring";

const getOffsetDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

const calculateRemainingDays = (expiryStr: string): number => {
  const expiryDate = new Date(expiryStr);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDocumentStatus = (days: number): DocumentStatus => {
  if (days <= 0) return "Expired";
  if (days <= 30) return "Expiring Soon";
  return "Valid";
};

export const licenseMonitoringService = {
  getLicenseMonitoringRecords(): Promise<LicenseMonitoringRecord[]> {
    if (typeof window === "undefined") {
      return Promise.resolve([]);
    }
    const data = localStorage.getItem(LICENSES_STORAGE_KEY);
    if (!data) {
      // Seed default license records
      // We will map corresponding drivers with matching dates
      const seedProfiles = [
        {
          id: "dc-101",
          name: "Alex Rivera",
          employeeId: "EMP-101",
          licenseNumber: "DL-908234",
          licenseExpiryOffset: 180,
          medicalExpiryOffset: 220
        },
        {
          id: "dc-102",
          name: "Dave Miller",
          employeeId: "EMP-102",
          licenseNumber: "DL-772183",
          licenseExpiryOffset: 12,
          medicalExpiryOffset: 90
        },
        {
          id: "dc-103",
          name: "Elena Rostova",
          employeeId: "EMP-103",
          licenseNumber: "DL-661092",
          licenseExpiryOffset: 120,
          medicalExpiryOffset: -5
        },
        {
          id: "dc-104",
          name: "Marcus Vance",
          employeeId: "EMP-104",
          licenseNumber: "DL-552109",
          licenseExpiryOffset: 80,
          medicalExpiryOffset: 150
        },
        {
          id: "dc-105",
          name: "Sarah Jenkins",
          employeeId: "EMP-105",
          licenseNumber: "DL-882012",
          licenseExpiryOffset: -12,
          medicalExpiryOffset: 45
        },
        {
          id: "dc-106",
          name: "Jameson Blake",
          employeeId: "EMP-106",
          licenseNumber: "DL-441234",
          licenseExpiryOffset: 25,
          medicalExpiryOffset: 15
        }
      ];

      const initial: LicenseMonitoringRecord[] = seedProfiles.map((p) => {
        const licenseExpiry = getOffsetDate(p.licenseExpiryOffset);
        const medicalExpiry = getOffsetDate(p.medicalExpiryOffset);

        const lDays = calculateRemainingDays(licenseExpiry);
        const mDays = calculateRemainingDays(medicalExpiry);

        const licenseStatus = getDocumentStatus(lDays);
        const medicalStatus = getDocumentStatus(mDays);

        const daysRemaining = Math.min(lDays, mDays);
        const overallStatus = getDocumentStatus(daysRemaining);

        return {
          id: p.id,
          name: p.name,
          employeeId: p.employeeId,
          licenseNumber: p.licenseNumber,
          licenseExpiry,
          medicalExpiry,
          daysRemaining,
          licenseStatus,
          medicalStatus,
          overallStatus
        };
      });

      localStorage.setItem(LICENSES_STORAGE_KEY, JSON.stringify(initial));
      return Promise.resolve(initial);
    }
    
    // Always recalculate dynamically based on active dates to prevent caching stale "daysRemaining"
    try {
      const parsed: LicenseMonitoringRecord[] = JSON.parse(data);
      const updated = parsed.map((rec) => {
        const lDays = calculateRemainingDays(rec.licenseExpiry);
        const mDays = calculateRemainingDays(rec.medicalExpiry);

        const licenseStatus = getDocumentStatus(lDays);
        const medicalStatus = getDocumentStatus(mDays);

        const daysRemaining = Math.min(lDays, mDays);
        const overallStatus = getDocumentStatus(daysRemaining);

        return {
          ...rec,
          daysRemaining,
          licenseStatus,
          medicalStatus,
          overallStatus
        };
      });
      return Promise.resolve(updated);
    } catch {
      return Promise.resolve([]);
    }
  }
};
