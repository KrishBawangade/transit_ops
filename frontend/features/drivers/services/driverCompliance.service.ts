import { DriverCompliance, ComplianceHistoryRecord, SafetyViolation } from "../types";
import { apiClient } from "@/lib/core/services/api-client";
import { PaginatedResponse } from "@/lib/core/types";

const COMPLIANCE_STORAGE_KEY = "transit_ops_driver_compliance";

const getOffsetDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

export const driverComplianceService = {
  async getComplianceRecords(): Promise<DriverCompliance[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<any>>("/drivers", {
        params: { limit: 100 }
      });
      const drivers = response.data || [];
      return drivers.map((driver: any) => {
        const name = driver.user 
          ? `${driver.user.firstName} ${driver.user.lastName}` 
          : "Unassigned User";
        
        const expiryDate = new Date(driver.licenseExpiry);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let status: "Compliant" | "Expiring Soon" | "Expired" = "Compliant";
        if (diffDays < 0) {
          status = "Expired";
        } else if (diffDays <= 30) {
          status = "Expiring Soon";
        }

        let licenseType: any = "Heavy Vehicle";
        const licenseClassLower = (driver.licenseClass || "").toLowerCase();
        if (licenseClassLower.includes("class b")) {
          licenseType = "Bus";
        } else if (licenseClassLower.includes("class c")) {
          licenseType = "Light Vehicle";
        }

        const medExpiry = new Date(expiryDate.getTime() - 90 * 24 * 60 * 60 * 1000); // medical expires 90 days before license

        return {
          id: driver.id,
          name,
          employeeId: driver.id.substring(0, 8).toUpperCase(),
          licenseNumber: driver.licenseNumber,
          licenseType,
          licenseExpiry: driver.licenseExpiry.split("T")[0],
          medicalExpiry: medExpiry.toISOString().split("T")[0],
          status,
          notes: `Profile integrated with database. Credentials issued under ${driver.licenseClass || "Class A CDL"}.`,
          phoneNumber: driver.user?.phone || "+1 (555) 010-0000",
          email: driver.user?.email || "No email info",
          department: "Fleet Operations",
          issuingAuthority: "State DMV Bureau",
          medicalCertificateNumber: `MC-${driver.licenseNumber.replace(/\D/g, "") || "88290"}`,
          medicalStatus: driver.status === "ACTIVE" || driver.status === "ON_TRIP" ? "Fit for Duty" : "Grounded",
          medicalHospital: "Central Health Services"
        };
      });
    } catch (error) {
      console.error("Failed to fetch compliance records from backend", error);
      return [];
    }
  },

  getComplianceRecordById(id: string): Promise<DriverCompliance | null> {
    return this.getComplianceRecords().then((records) => {
      const found = records.find((r) => r.id === id || r.employeeId === id);
      return found || null;
    });
  },

  getComplianceHistory(driverId: string): Promise<ComplianceHistoryRecord[]> {
    // Return mock check history records
    const mockHistory: ComplianceHistoryRecord[] = [
      {
        id: "ch-1",
        checkDate: getOffsetDate(-2),
        checkedBy: "Officer Jane Doe",
        status: "Compliant",
        remarks: "Bi-annual document checks. Licenses match driver status roster."
      },
      {
        id: "ch-2",
        checkDate: getOffsetDate(-30),
        checkedBy: "Lead Inspector John Smith",
        status: "Expiring Soon",
        remarks: "Warning flag triggers. Instructed driver to register medical test schedule."
      },
      {
        id: "ch-3",
        checkDate: getOffsetDate(-180),
        checkedBy: "Officer Jane Doe",
        status: "Compliant",
        remarks: "Compliance audits completed successfully with no exceptions."
      }
    ];
    return Promise.resolve(mockHistory);
  },

  getSafetyViolations(driverId: string): Promise<SafetyViolation[]> {
    // Return mock violations logs
    const mockViolations: SafetyViolation[] = [
      {
        id: "sv-1",
        date: getOffsetDate(-10),
        type: "HOS Rest Violation",
        severity: "Medium",
        status: "Resolved",
        remarks: "Logged 15 minutes over active drive time limits. Driver received caution review."
      },
      {
        id: "sv-2",
        date: getOffsetDate(-45),
        type: "Speeding Alert",
        severity: "Low",
        status: "Resolved",
        remarks: "Speed limit exceeded by 8km/h on highway sector 4. Logged on dispatch telematics."
      }
    ];
    return Promise.resolve(mockViolations);
  }
};
