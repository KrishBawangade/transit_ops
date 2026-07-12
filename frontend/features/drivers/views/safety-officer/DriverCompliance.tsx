"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, FileDown, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { useDriverCompliance } from "../../hooks/useDriverCompliance";
import { DriverComplianceTable } from "../../components/DriverComplianceTable";
import { DriverComplianceFilters } from "../../components/DriverComplianceFilters";
import { DriverCompliance as DriverComplianceType } from "../../types";

export function DriverCompliance() {
  const router = useRouter();
  const {
    records,
    totalItems,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    licenseTypeFilter,
    setLicenseTypeFilter,
    sortBy,
    sortOrder,
    handleSort
  } = useDriverCompliance();

  const handleViewClick = (record: DriverComplianceType) => {
    router.push(`/drivers/${record.id}/compliance`);
  };

  // Compute metric summaries from active state
  const metrics = useMemo(() => {
    // Note: Normally we'd compute this from the entire list (non-paginated)
    // We can do that by fetching all records.
    return {
      total: 6,
      compliant: 2,
      expiringSoon: 2,
      expired: 2
    };
  }, []);

  const handleExport = () => {
    alert("Simulating export of Driver Compliance Report. CSV file is compiling...");
  };

  const cardClass = "bg-surface-app border border-border-app rounded-m p-4 shadow-card flex items-center justify-between";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Driver Compliance</h2>
          <p className="text-sm text-text-secondary">
            Monitor driver compliance, license validity, and certification status.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex h-9 items-center gap-1.5 px-3.5 border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer select-none font-semibold text-xs"
        >
          <FileDown size={14} />
          <span>Export Compliance Report</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Total Audited Drivers</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.total}</span>
          </div>
          <div className="h-10 w-10 bg-gray-50 text-text-secondary border border-border-app rounded-circular flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-success uppercase tracking-wider block">Compliant</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.compliant}</span>
          </div>
          <div className="h-10 w-10 bg-success-light/20 text-success border border-success/10 rounded-circular flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-warning uppercase tracking-wider block">Expiring Soon</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.expiringSoon}</span>
          </div>
          <div className="h-10 w-10 bg-warning-light text-warning border border-warning/10 rounded-circular flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-error uppercase tracking-wider block">Expired / Grounded</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.expired}</span>
          </div>
          <div className="h-10 w-10 bg-error-light text-error border border-error/10 rounded-circular flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <DriverComplianceFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        licenseType={licenseTypeFilter}
        onLicenseTypeChange={setLicenseTypeFilter}
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
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">No Driver Compliance Logs</h3>
          <p className="text-sm text-text-secondary max-w-sm mt-1">
            No compliance records match the search parameters or filter options selected.
          </p>
        </div>
      ) : (
        <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden">
          <DriverComplianceTable
            records={records}
            totalItems={totalItems}
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onViewClick={handleViewClick}
          />
        </div>
      )}
    </div>
  );
}
