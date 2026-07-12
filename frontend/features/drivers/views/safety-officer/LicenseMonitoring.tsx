"use client";

import React, { useMemo } from "react";
import { CreditCard, AlertTriangle, ShieldAlert, ShieldCheck, FileDown, Activity } from "lucide-react";
import { useLicenseMonitoring } from "../../hooks/useLicenseMonitoring";
import { LicenseMonitoringTable } from "../../components/LicenseMonitoringTable";
import { LicenseMonitoringFilters } from "../../components/LicenseMonitoringFilters";
import { ExpiryAlertCard } from "../../components/ExpiryAlertCard";

export function LicenseMonitoring() {
  const {
    records,
    allRecords,
    totalItems,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
    search,
    setSearch,
    licenseStatusFilter,
    setLicenseStatusFilter,
    medicalStatusFilter,
    setMedicalStatusFilter,
    sortBy,
    sortOrder,
    handleSort
  } = useLicenseMonitoring();

  // Compute metrics dynamically from the raw registry
  const metrics = useMemo(() => {
    const validLicenses = allRecords.filter((r) => r.licenseStatus === "Valid").length;
    const expiringSoon = allRecords.filter((r) => r.daysRemaining > 0 && r.daysRemaining <= 30).length;
    const expiredLicenses = allRecords.filter((r) => r.licenseStatus === "Expired").length;
    const expiredMedical = allRecords.filter((r) => r.medicalStatus === "Expired").length;

    // Alert counts
    const expiredCount = allRecords.filter((r) => r.overallStatus === "Expired").length;
    const expiringCount = allRecords.filter((r) => r.overallStatus === "Expiring Soon").length;

    return {
      validLicenses,
      expiringSoon,
      expiredLicenses,
      expiredMedical,
      expiredCount,
      expiringCount
    };
  }, [allRecords]);

  const handleExport = () => {
    alert("Simulating export of Licenses Expiry Audit Sheet. Report CSV compiling...");
  };

  const cardClass = "bg-surface-app border border-border-app rounded-m p-4 shadow-card flex items-center justify-between";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">License & Certificate Monitoring</h2>
          <p className="text-sm text-text-secondary">
            Track driver licenses and medical certificates before they expire.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex h-9 items-center gap-1.5 px-3.5 border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer select-none font-semibold text-xs animate-fadeIn"
        >
          <FileDown size={14} />
          <span>Export Expiry Report</span>
        </button>
      </div>

      {/* Expiry Warning Banners */}
      {!isLoading && (
        <ExpiryAlertCard
          expiredCount={metrics.expiredCount}
          expiringCount={metrics.expiringCount}
        />
      )}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-success uppercase tracking-wider block">Valid Licenses</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.validLicenses}</span>
          </div>
          <div className="h-10 w-10 bg-success-light/20 text-success border border-success/10 rounded-circular flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-warning uppercase tracking-wider block">Expiring Within 30 Days</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.expiringSoon}</span>
          </div>
          <div className="h-10 w-10 bg-warning-light text-warning border border-warning/10 rounded-circular flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-error uppercase tracking-wider block">Expired Licenses</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.expiredLicenses}</span>
          </div>
          <div className="h-10 w-10 bg-error-light text-error border border-error/10 rounded-circular flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-error uppercase tracking-wider block">Expired Med Certs</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.expiredMedical}</span>
          </div>
          <div className="h-10 w-10 bg-error-light text-error border border-error/10 rounded-circular flex items-center justify-center">
            <Activity size={18} />
          </div>
        </div>
      </div>

      {/* Filtering Toolbar */}
      <LicenseMonitoringFilters
        search={search}
        onSearchChange={setSearch}
        licenseStatus={licenseStatusFilter}
        onLicenseStatusChange={setLicenseStatusFilter}
        medicalStatus={medicalStatusFilter}
        onMedicalStatusChange={setMedicalStatusFilter}
      />

      {/* Main Table Content */}
      {error && (
        <div className="p-4 bg-error-light text-error rounded-m text-xs font-semibold border border-error/20">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4 animate-pulse select-none">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      ) : totalItems === 0 ? (
        <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card">
          <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
            <CreditCard size={24} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">No License Records Found</h3>
          <p className="text-sm text-text-secondary max-w-sm mt-1">
            No driver licenses or medical certificates match the active search filters.
          </p>
        </div>
      ) : (
        <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden">
          <LicenseMonitoringTable
            records={records}
            totalItems={totalItems}
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
      )}
    </div>
  );
}
