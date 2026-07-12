"use client";

import { useState, useEffect, useCallback } from "react";
import { SafetyReportData } from "../types";
import { safetyReportsService } from "../services/safetyReports.service";

export function useSafetyReports() {
  const [data, setData] = useState<SafetyReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [driver, setDriver] = useState("All");
  const [department, setDepartment] = useState("All");
  const [licenseType, setLicenseType] = useState("All");
  const [complianceStatus, setComplianceStatus] = useState("All");
  const [riskLevel, setRiskLevel] = useState("All");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        dateRange,
        driver,
        department,
        licenseType,
        complianceStatus,
        riskLevel
      };
      const res = await safetyReportsService.getSafetyReportsData(filters);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load safety reports data.");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, driver, department, licenseType, complianceStatus, riskLevel]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange,
    driver,
    setDriver,
    department,
    setDepartment,
    licenseType,
    setLicenseType,
    complianceStatus,
    setComplianceStatus,
    riskLevel,
    setRiskLevel,
    refresh: loadData
  };
}
