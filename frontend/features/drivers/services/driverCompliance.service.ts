import { DriverCompliance, ComplianceHistoryRecord, SafetyViolation } from "../types";

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
      // Seed default compliance records with detailed fields
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
          notes: "All credentials are active and up to date. Excellent driving scorecard.",
          phoneNumber: "+1 (555) 304-9821",
          email: "alex.r@transitops.com",
          department: "Long Haul Cargo",
          issuingAuthority: "Texas DMV",
          medicalCertificateNumber: "MC-88290",
          medicalStatus: "Fit for Duty",
          medicalHospital: "Houston General Health"
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
          notes: "Commercial license renewal notification sent. Scheduled for license update test next Tuesday.",
          phoneNumber: "+1 (555) 298-3490",
          email: "dave.m@transitops.com",
          department: "Heavy Distribution",
          issuingAuthority: "California DMV",
          medicalCertificateNumber: "MC-44102",
          medicalStatus: "Fit with Glasses Limitation",
          medicalHospital: "Sutter Health Care"
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
          notes: "Medical certification expired. Driver is currently grounded until clearance form is submitted.",
          phoneNumber: "+1 (555) 890-3482",
          email: "elena.r@transitops.com",
          department: "Passenger Transit",
          issuingAuthority: "New York DMV",
          medicalCertificateNumber: "MC-90214",
          medicalStatus: "Suspended (Pending EKG)",
          medicalHospital: "NY Presbyterian Hospital"
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
          notes: "Defensive driver certification active. Shift schedules are compliant.",
          phoneNumber: "+1 (555) 438-9210",
          email: "marcus.v@transitops.com",
          department: "Light Logistics",
          issuingAuthority: "Illinois DMV",
          medicalCertificateNumber: "MC-10294",
          medicalStatus: "Fit for Duty",
          medicalHospital: "Chicago Mercy Medical"
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
          notes: "Heavy commercial license has expired. Scheduled renewal was missed. Suspended from active routes.",
          phoneNumber: "+1 (555) 902-8419",
          email: "sarah.j@transitops.com",
          department: "Long Haul Cargo",
          issuingAuthority: "Florida DMV",
          medicalCertificateNumber: "MC-55928",
          medicalStatus: "Fit for Duty",
          medicalHospital: "Miami Health Center"
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
          notes: "Both medical certificate and van permit expire in under 30 days. Renewal applications are pending processing.",
          phoneNumber: "+1 (555) 671-9024",
          email: "jameson.b@transitops.com",
          department: "Local Courier Service",
          issuingAuthority: "Nevada DMV",
          medicalCertificateNumber: "MC-33019",
          medicalStatus: "Fit for Duty",
          medicalHospital: "Las Vegas Valley Clinic"
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
