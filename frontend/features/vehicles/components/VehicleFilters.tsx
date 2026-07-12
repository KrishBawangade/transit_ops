"use client";

import React, { memo } from "react";
import { VehicleType, VehicleStatus } from "../types";

interface VehicleFiltersProps {
  type: VehicleType | "All";
  onTypeChange: (type: VehicleType | "All") => void;
  status: VehicleStatus | "All";
  onStatusChange: (status: VehicleStatus | "All") => void;
}

export const VehicleFilters = memo(function VehicleFilters({
  type,
  onTypeChange,
  status,
  onStatusChange,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as VehicleType | "All")}
        aria-label="Filter by Vehicle Type"
        className="w-full md:w-[140px] h-9 px-3 border border-border-app rounded-m text-xs font-semibold text-text-secondary hover:text-text-primary bg-gray-50 hover:bg-gray-100/80 focus:outline-none focus:border-primary focus:bg-surface-app transition-all shadow-small focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        <option value="All">All Types</option>
        <option value="Van">Van</option>
        <option value="Truck">Truck</option>
        <option value="Mini">Mini</option>
        <option value="Bus">Bus</option>
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as VehicleStatus | "All")}
        aria-label="Filter by Status"
        className="w-full md:w-[140px] h-9 px-3 border border-border-app rounded-m text-xs font-semibold text-text-secondary hover:text-text-primary bg-gray-50 hover:bg-gray-100/80 focus:outline-none focus:border-primary focus:bg-surface-app transition-all shadow-small focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        <option value="All">All Statuses</option>
        <option value="Available">Available</option>
        <option value="On Trip">On Trip</option>
        <option value="In Shop">In Shop</option>
        <option value="Retired">Retired</option>
      </select>
    </div>
  );
});
