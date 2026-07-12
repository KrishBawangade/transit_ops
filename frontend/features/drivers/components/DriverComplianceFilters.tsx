"use client";

import React, { memo } from "react";
import { Search } from "lucide-react";
import { ComplianceStatus, LicenseType } from "../types";

interface DriverComplianceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  licenseType: string;
  onLicenseTypeChange: (val: string) => void;
}

export const DriverComplianceFilters = memo(function DriverComplianceFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  licenseType,
  onLicenseTypeChange
}: DriverComplianceFiltersProps) {
  const inputClass = "h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 focus:bg-surface-app text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small";
  const selectClass = "h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer";

  return (
    <div className="flex flex-col md:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small md:items-center select-none">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
        <input
          type="text"
          placeholder="Search by driver name, employee ID, license number..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full ${inputClass}`}
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Compliance:</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">License:</span>
          <select
            value={licenseType}
            onChange={(e) => onLicenseTypeChange(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Types</option>
            <option value="Heavy Vehicle">Heavy Vehicle</option>
            <option value="Light Vehicle">Light Vehicle</option>
            <option value="Bus">Bus</option>
            <option value="Van">Van</option>
          </select>
        </div>
      </div>
    </div>
  );
});
