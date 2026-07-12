import { ComplianceStatus, RiskLevel } from "@/features/drivers/types";

export interface HighRiskDriverRecord {
  id: string;
  name: string;
  employeeId: string;
  safetyScore: number;
  riskLevel: RiskLevel;
  complianceStatus: ComplianceStatus;
  licenseExpiry: string;
}

export interface TrendDataPoint {
  label: string;
  value: number;
}

export interface DistributionDataPoint {
  label: string;
  count: number;
  color: string;
}

export interface SafetyReportData {
  complianceRate: number;
  averageSafetyScore: number;
  expiredLicenses: number;
  expiringMedicalCertificates: number;

  complianceTrend: TrendDataPoint[];
  safetyScoreDistribution: DistributionDataPoint[];
  licenseExpiryTrend: TrendDataPoint[];
  medicalExpiryTrend: TrendDataPoint[];
  riskDistribution: DistributionDataPoint[];

  highRiskDrivers: HighRiskDriverRecord[];
}
