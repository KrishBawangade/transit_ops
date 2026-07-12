"use client";

import { useState, useEffect, useCallback } from "react";
import { DriverCompliance, ComplianceHistoryRecord, SafetyViolation } from "../types";
import { driverComplianceService } from "../services/driverCompliance.service";

export function useDriverComplianceDetails(id: string) {
  const [record, setRecord] = useState<DriverCompliance | null>(null);
  const [history, setHistory] = useState<ComplianceHistoryRecord[]>([]);
  const [violations, setViolations] = useState<SafetyViolation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const driverData = await driverComplianceService.getComplianceRecordById(id);
      if (!driverData) {
        setError("Driver compliance record not found");
        setRecord(null);
      } else {
        setRecord(driverData);
        // Load associated sub-histories
        const [historyData, violationsData] = await Promise.all([
          driverComplianceService.getComplianceHistory(id),
          driverComplianceService.getSafetyViolations(id)
        ]);
        setHistory(historyData);
        setViolations(violationsData);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading driver compliance details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

  return {
    record,
    history,
    violations,
    isLoading,
    error,
    refresh: loadData
  };
}
