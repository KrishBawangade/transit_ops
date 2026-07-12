import { SafetyReportData, HighRiskDriverRecord } from "../types";

export const safetyReportsService = {
  getSafetyReportsData(filters?: {
    dateRange?: string;
    driver?: string;
    department?: string;
    licenseType?: string;
    complianceStatus?: string;
    riskLevel?: string;
  }): Promise<SafetyReportData> {
    // Return mock analytical report data
    const mockData: SafetyReportData = {
      complianceRate: 83.3, // 5 out of 6 drivers
      averageSafetyScore: 72.8,
      expiredLicenses: 1, // Sarah Jenkins
      expiringMedicalCertificates: 1, // Jameson Blake
      
      complianceTrend: [
        { label: "Jan", value: 78 },
        { label: "Feb", value: 80 },
        { label: "Mar", value: 82 },
        { label: "Apr", value: 85 },
        { label: "May", value: 83 },
        { label: "Jun", value: 83.3 }
      ],
      
      safetyScoreDistribution: [
        { label: "90-100", count: 2, color: "#10B981" }, // Low Risk (Alex, Marcus)
        { label: "75-89", count: 1, color: "#3B82F6" },  // Dave
        { label: "60-74", count: 1, color: "#F59E0B" },  // Sarah
        { label: "Below 60", count: 2, color: "#EF4444" } // Elena, Jameson
      ],
      
      licenseExpiryTrend: [
        { label: "Jul", value: 1 }, // Dave (12 days)
        { label: "Aug", value: 1 }, // Jameson (25)
        { label: "Sep", value: 0 },
        { label: "Oct", value: 1 }, // Marcus (80)
        { label: "Nov", value: 1 }, // Elena (120)
        { label: "Dec", value: 1 }  // Alex (180)
      ],
      
      medicalExpiryTrend: [
        { label: "Jul", value: 1 }, // Jameson (15 days)
        { label: "Aug", value: 0 },
        { label: "Sep", value: 1 }, // Dave (90)
        { label: "Oct", value: 0 },
        { label: "Nov", value: 1 }, // Marcus (150)
        { label: "Dec", value: 1 }  // Alex (220)
      ],
      
      riskDistribution: [
        { label: "Low Risk", count: 2, color: "#10B981" },
        { label: "Medium Risk", count: 2, color: "#F59E0B" },
        { label: "High Risk", count: 2, color: "#EF4444" }
      ],
      
      highRiskDrivers: [
        {
          id: "dc-106",
          name: "Jameson Blake",
          employeeId: "EMP-106",
          safetyScore: 45,
          riskLevel: "High",
          complianceStatus: "Expiring Soon",
          licenseExpiry: "25 days remaining"
        },
        {
          id: "dc-103",
          name: "Elena Rostova",
          employeeId: "EMP-103",
          safetyScore: 58,
          riskLevel: "High",
          complianceStatus: "Expired",
          licenseExpiry: "120 days remaining"
        }
      ]
    };

    // Simulate simple filter processing if needed
    if (filters) {
      if (filters.riskLevel && filters.riskLevel !== "All") {
        mockData.highRiskDrivers = mockData.highRiskDrivers.filter(
          (d) => d.riskLevel === filters.riskLevel
        );
      }
    }

    return Promise.resolve(mockData);
  }
};
