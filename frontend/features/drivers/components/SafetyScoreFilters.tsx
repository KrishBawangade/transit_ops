"use client";

import React, { memo } from "react";
import { Search, ShieldAlert, Percent } from "lucide-react";

interface SafetyScoreFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  riskLevel: string;
  onRiskLevelChange: (val: string) => void;
  scoreRange: string;
  onScoreRangeChange: (val: string) => void;
}

export const SafetyScoreFilters = memo(function SafetyScoreFilters({
  search,
  onSearchChange,
  riskLevel,
  onRiskLevelChange,
  scoreRange,
  onScoreRangeChange
}: SafetyScoreFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-surface-app border border-border-app p-4 rounded-m shadow-small">
      {/* Search Field */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-2.5 text-text-muted" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by driver name, employee ID..."
          className="w-full h-9 pl-[40px] pr-[16px] rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-surface-app transition-all shadow-small focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Risk Level */}
        <div className="relative w-full sm:w-44 select-none">
          <ShieldAlert className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={riskLevel}
            onChange={(e) => onRiskLevelChange(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-m border border-border-app bg-surface-app text-xs text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small appearance-none font-medium"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-text-muted h-0 w-0"></div>
        </div>

        {/* Safety Score Range */}
        <div className="relative w-full sm:w-48 select-none">
          <Percent className="absolute left-3 top-2.5 text-text-muted pointer-events-none" size={14} />
          <select
            value={scoreRange}
            onChange={(e) => onScoreRangeChange(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-m border border-border-app bg-surface-app text-xs text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small appearance-none font-medium"
          >
            <option value="All">All Score Ranges</option>
            <option value="90-100">90 – 100 (Excellent)</option>
            <option value="75-89">75 – 89 (Good)</option>
            <option value="60-74">60 – 74 (Fair)</option>
            <option value="Below 60">Below 60 (Risk)</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-text-muted h-0 w-0"></div>
        </div>
      </div>
    </div>
  );
});
