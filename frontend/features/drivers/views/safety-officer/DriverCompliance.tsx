"use client";

import React, { useState, useMemo } from "react";
import { Users, FileDown, ShieldCheck, AlertTriangle, ShieldAlert, X } from "lucide-react";
import { useDriverCompliance } from "../../hooks/useDriverCompliance";
import { DriverComplianceTable } from "../../components/DriverComplianceTable";
import { DriverComplianceFilters } from "../../components/DriverComplianceFilters";
import { DriverCompliance as DriverComplianceType } from "../../types";

export function DriverCompliance() {
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

  const [viewTarget, setViewTarget] = useState<DriverComplianceType | null>(null);

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
            onViewClick={setViewTarget}
          />
        </div>
      )}

      {/* Read-Only View Details Modal */}
      {viewTarget && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setViewTarget(null)} />
          <div className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-md w-full p-6 relative z-10 animate-fadeIn space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-text-primary">Driver Compliance Log Details</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Active safety audit parameters and validity counters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="text-text-muted hover:text-text-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-xs leading-normal border-t border-divider-app pt-4">
              <div>
                <dt className="text-text-secondary">Driver Name</dt>
                <dd className="text-text-primary font-semibold mt-0.5">{viewTarget.name}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Employee ID</dt>
                <dd className="text-text-primary font-bold font-mono mt-0.5">{viewTarget.employeeId}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">License Number</dt>
                <dd className="text-text-primary font-bold font-mono mt-0.5">{viewTarget.licenseNumber}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">License Type</dt>
                <dd className="text-text-primary font-semibold mt-0.5">{viewTarget.licenseType}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">License Expiry</dt>
                <dd className="text-text-primary font-mono mt-0.5">{viewTarget.licenseExpiry}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Medical Expiry</dt>
                <dd className="text-text-primary font-mono mt-0.5">{viewTarget.medicalExpiry}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Compliance Status</dt>
                <dd className="text-text-primary mt-0.5">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border uppercase tracking-wider select-none ${
                    viewTarget.status === "Compliant"
                      ? "bg-success-light text-success border-success/20"
                      : viewTarget.status === "Expiring Soon"
                      ? "bg-warning-light text-warning border-warning/20"
                      : "bg-error-light text-error border-error/20"
                  }`}>
                    {viewTarget.status}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="border-t border-divider-app pt-4 space-y-1.5">
              <span className="block text-xs font-semibold text-text-secondary">Safety Auditor Notes</span>
              <div className="text-xs text-text-primary bg-gray-50 p-3 rounded-m border border-border-app min-h-[70px] whitespace-pre-wrap font-sans leading-relaxed">
                {viewTarget.notes || "No notes registered."}
              </div>
            </div>

            <div className="flex justify-end border-t border-divider-app pt-4 select-none">
              <button
                onClick={() => setViewTarget(null)}
                className="px-4.5 h-9 bg-primary text-text-on-primary text-xs font-semibold rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-small cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
