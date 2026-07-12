"use client";

import React, { memo } from "react";
import { Search, CreditCard, Activity } from "lucide-react";

interface LicenseMonitoringFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  licenseStatus: string;
  onLicenseStatusChange: (val: string) => void;
  medicalStatus: string;
  onMedicalStatusChange: (val: string) => void;
}

export const LicenseMonitoringFilters = memo(function LicenseMonitoringFilters({
  search,
  onSearchChange,
  licenseStatus,
  onLicenseStatusChange,
  medicalStatus,
  onMedicalStatusChange
}: LicenseMonitoringFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-surface-app border border-border-app p-4 rounded-m shadow-small">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-2.5 text-text-muted" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by driver, employee ID, license number..."
          className="w-full h-9 pl-[40px] pr-[16px] rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-surface-app transition-all shadow-small focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* License status */}
        <div className="relative w-full sm:w-44 select-none">
          <CreditCard className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={licenseStatus}
            onChange={(e) => onLicenseStatusChange(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-m border border-border-app bg-surface-app text-xs text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small appearance-none font-medium"
          >
            <option value="All">All License Status</option>
            <option value="Valid">Valid License</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired License</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-text-muted h-0 w-0"></div>
        </div>

        {/* Medical status */}
        <div className="relative w-full sm:w-44 select-none">
          <Activity className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={medicalStatus}
            onChange={(e) => onMedicalStatusChange(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-m border border-border-app bg-surface-app text-xs text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small appearance-none font-medium"
          >
            <option value="All">All Medical Status</option>
            <option value="Valid">Valid Medical</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired Medical</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-text-muted h-0 w-0"></div>
        </div>
      </div>
    </div>
  );
});
