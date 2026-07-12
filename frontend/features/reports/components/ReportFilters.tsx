"use client";

import React, { memo } from "react";
import { Filter, Calendar, Users, Briefcase, Award, ShieldCheck, ShieldAlert } from "lucide-react";

interface ReportFiltersProps {
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  driver: string;
  onDriverChange: (val: string) => void;
  department: string;
  onDepartmentChange: (val: string) => void;
  licenseType: string;
  onLicenseTypeChange: (val: string) => void;
  complianceStatus: string;
  onComplianceStatusChange: (val: string) => void;
  riskLevel: string;
  onRiskLevelChange: (val: string) => void;
}

export const ReportFilters = memo(function ReportFilters({
  dateRange,
  onDateRangeChange,
  driver,
  onDriverChange,
  department,
  onDepartmentChange,
  licenseType,
  onLicenseTypeChange,
  complianceStatus,
  onComplianceStatusChange,
  riskLevel,
  onRiskLevelChange
}: ReportFiltersProps) {
  const selectWrapperClass = "relative w-full select-none";
  const selectClass = "w-full h-9 pl-9 pr-8 rounded-m border border-border-app bg-surface-app text-xs text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small appearance-none font-medium";
  const arrowClass = "absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-text-muted h-0 w-0";

  return (
    <div className="bg-surface-app border border-border-app p-4 rounded-m shadow-small space-y-4">
      <div className="flex items-center gap-2 select-none border-b border-divider-app pb-2">
        <Filter size={14} className="text-text-secondary" />
        <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Report Filters</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Date Range Selector */}
        <div className={selectWrapperClass}>
          <Calendar className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className={selectClass}
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="This Year">This Year</option>
          </select>
          <div className={arrowClass}></div>
        </div>

        {/* Driver Selector */}
        <div className={selectWrapperClass}>
          <Users className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={driver}
            onChange={(e) => onDriverChange(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Drivers</option>
            <option value="Alex Rivera">Alex Rivera</option>
            <option value="Dave Miller">Dave Miller</option>
            <option value="Elena Rostova">Elena Rostova</option>
            <option value="Marcus Vance">Marcus Vance</option>
            <option value="Sarah Jenkins">Sarah Jenkins</option>
            <option value="Jameson Blake">Jameson Blake</option>
          </select>
          <div className={arrowClass}></div>
        </div>

        {/* Department Selector */}
        <div className={selectWrapperClass}>
          <Briefcase className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Departments</option>
            <option value="Long Haul Cargo">Long Haul Cargo</option>
            <option value="Heavy Distribution">Heavy Distribution</option>
            <option value="Passenger Transit">Passenger Transit</option>
            <option value="Light Logistics">Light Logistics</option>
            <option value="Local Courier Service">Local Courier Service</option>
          </select>
          <div className={arrowClass}></div>
        </div>

        {/* License Type Selector */}
        <div className={selectWrapperClass}>
          <Award className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={licenseType}
            onChange={(e) => onLicenseTypeChange(e.target.value)}
            className={selectClass}
          >
            <option value="All">All License Types</option>
            <option value="Heavy Vehicle">Heavy Vehicle</option>
            <option value="Light Vehicle">Light Vehicle</option>
            <option value="Bus">Bus</option>
            <option value="Van">Van</option>
          </select>
          <div className={arrowClass}></div>
        </div>

        {/* Compliance Status Selector */}
        <div className={selectWrapperClass}>
          <ShieldCheck className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={complianceStatus}
            onChange={(e) => onComplianceStatusChange(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Compliance</option>
            <option value="Compliant">Compliant</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
          <div className={arrowClass}></div>
        </div>

        {/* Risk Level Selector */}
        <div className={selectWrapperClass}>
          <ShieldAlert className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={riskLevel}
            onChange={(e) => onRiskLevelChange(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
          <div className={arrowClass}></div>
        </div>
      </div>
    </div>
  );
});
