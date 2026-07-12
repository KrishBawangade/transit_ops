"use client";

import React from "react";
import { FileText, Download, Printer, ShieldAlert, Award, Calendar } from "lucide-react";
import { useSafetyReports } from "../../hooks/useSafetyReports";
import { ReportSummaryCards } from "../../components/ReportSummaryCards";
import { ReportFilters } from "../../components/ReportFilters";
import { ComplianceRateChart } from "../../components/ComplianceRateChart";
import { SafetyScoreChart } from "../../components/SafetyScoreChart";
import { ExpiryTrendChart } from "../../components/ExpiryTrendChart";
import { ComplianceStatusBadge } from "@/features/drivers/components/ComplianceStatusBadge";
import { RiskLevelBadge } from "@/features/drivers/components/RiskLevelBadge";

export function SafetyReports() {
  const {
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
    setRiskLevel
  } = useSafetyReports();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("Downloading Safety Reports PDF sheet...");
  };

  const handleDownloadExcel = () => {
    alert("Downloading Safety Analytics Excel sheet...");
  };

  const buttonClass = "flex h-9 items-center gap-1.5 px-3 border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer select-none font-semibold text-xs";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight font-sans">Safety Reports</h2>
          <p className="text-sm text-text-secondary font-sans mt-0.5">
            Analyze driver compliance, safety trends, and document validity.
          </p>
        </div>
        
        {/* Export options */}
        <div className="flex items-center gap-2 select-none">
          <button onClick={handleDownloadPDF} className={buttonClass}>
            <Download size={14} />
            <span>Download PDF</span>
          </button>
          <button onClick={handleDownloadExcel} className={buttonClass}>
            <Download size={14} />
            <span>Download Excel</span>
          </button>
          <button onClick={handlePrint} className={buttonClass}>
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        driver={driver}
        onDriverChange={setDriver}
        department={department}
        onDepartmentChange={setDepartment}
        licenseType={licenseType}
        onLicenseTypeChange={setLicenseType}
        complianceStatus={complianceStatus}
        onComplianceStatusChange={setComplianceStatus}
        riskLevel={riskLevel}
        onRiskLevelChange={setRiskLevel}
      />

      {error && (
        <div className="p-4 bg-error-light text-error rounded-m text-xs font-semibold border border-error/20">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6 animate-pulse select-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : !data ? (
        <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card">
          <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">No Report Data Available</h3>
          <p className="text-sm text-text-secondary max-w-sm mt-1">
            There is no analytical record in the selected scope range.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <ReportSummaryCards data={data} />

          {/* Charts Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComplianceRateChart trend={data.complianceTrend} />
            <SafetyScoreChart distribution={data.safetyScoreDistribution} />
            <div className="lg:col-span-2">
              <ExpiryTrendChart
                licenseTrend={data.licenseExpiryTrend}
                medicalTrend={data.medicalExpiryTrend}
              />
            </div>
          </div>

          {/* High-Risk Drivers Table Section */}
          {data.highRiskDrivers.length > 0 && (
            <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-border-app flex items-center gap-2 select-none">
                <ShieldAlert size={16} className="text-error" />
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Urgent High-Risk Safety Targets
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-border-app text-[11px] font-semibold text-text-secondary uppercase tracking-wider select-none">
                      <th className="p-4">Driver</th>
                      <th className="p-4">Employee ID</th>
                      <th className="p-4 text-right pr-12">Safety Score</th>
                      <th className="p-4 text-center">Compliance Status</th>
                      <th className="p-4 text-center">Risk Level</th>
                      <th className="p-4">License Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {data.highRiskDrivers.map((rec) => (
                      <tr key={rec.id} className="hover:bg-error-light/5 transition-colors">
                        <td className="p-4 font-medium text-text-primary">
                          {rec.name}
                        </td>
                        <td className="p-4 font-mono text-xs text-text-secondary">
                          {rec.employeeId}
                        </td>
                        <td className="p-4 text-xs font-mono text-right pr-12 font-bold text-error">
                          {rec.safetyScore} <span className="text-[10px] text-text-muted font-sans font-normal">/100</span>
                        </td>
                        <td className="p-4 text-center">
                          <ComplianceStatusBadge status={rec.complianceStatus} />
                        </td>
                        <td className="p-4 text-center">
                          <RiskLevelBadge riskLevel={rec.riskLevel} />
                        </td>
                        <td className="p-4 text-xs font-mono text-text-secondary">
                          {rec.licenseExpiry}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
