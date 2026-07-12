"use client";

import React, { memo } from "react";
import { Search } from "lucide-react";

interface VehicleSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const VehicleSearch = memo(function VehicleSearch({
  value,
  onChange,
}: VehicleSearchProps) {
  return (
    <div className="relative flex-1 w-full md:w-auto">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-muted pointer-events-none">
        <Search size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search registration number..."
        aria-label="Search registration number"
        className="w-full h-9 pl-10 pr-4 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-surface-app transition-all shadow-small focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
});
