"use client";

import React, { memo } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { Vehicle } from "../types";
import { SortField, SortOrder } from "../hooks/useVehicleFilters";
import { VehicleStatusBadge } from "./VehicleStatusBadge";
import { VehicleActions } from "./VehicleActions";

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRetireClick: (vehicle: Vehicle) => void;
  onDeleteClick: (vehicle: Vehicle) => void;
}

export const VehicleTable = memo(function VehicleTable({
  vehicles,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  page,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onRetireClick,
  onDeleteClick,
}: VehicleTableProps) {
  
  const renderSortIcon = (field: SortField) => {
    const isSorted = sortBy === field;
    return (
      <span className="inline-flex shrink-0 w-4 h-4 items-center justify-center ml-1.5 pointer-events-none">
        {isSorted ? (
          sortOrder === "asc" ? (
            <ChevronUp size={14} className="text-primary animate-fadeIn" />
          ) : (
            <ChevronDown size={14} className="text-primary animate-fadeIn" />
          )
        ) : (
          <ChevronDown size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    );
  };

  const HeaderCell = ({
    field,
    label,
    align = "left",
  }: {
    field: SortField;
    label: string;
    align?: "left" | "right" | "center";
  }) => {
    const flexAlign = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
    const textAlign = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
    
    return (
      <th
        onClick={() => onSort(field)}
        className={`p-4 cursor-pointer hover:bg-gray-100/60 transition-colors select-none group sticky top-0 bg-gray-50 z-10 shadow-[inset_0_-1px_0_rgba(229,231,235,1)] ${textAlign}`}
      >
        <div className={`flex items-center text-xs font-semibold text-text-secondary uppercase tracking-wider ${flexAlign}`}>
          <span>{label}</span>
          {renderSortIcon(field)}
        </div>
      </th>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-surface-app border border-border-app rounded-m p-12 flex flex-col items-center justify-center shadow-card space-y-4 animate-fadeIn">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-circular animate-spin"></div>
        <span className="text-xs text-text-secondary font-medium">Loading vehicle data...</span>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card animate-fadeIn">
        <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
          <Truck size={24} />
        </div>
        <h3 className="text-base font-semibold text-text-primary">No Vehicles Found</h3>
        <p className="text-sm text-text-secondary max-w-sm mt-1">
          We couldn't find any vehicles matching your filter criteria. Try updating search queries or dropdown selections.
        </p>
      </div>
    );
  }

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalItems);

  return (
    <div className="bg-surface-app border border-border-app rounded-m shadow-card flex flex-col overflow-hidden animate-fadeIn">
      {/* Scrollable Table Content Container */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-gray-50 border-b border-border-app">
              <HeaderCell field="registrationNumber" label="Reg Number" />
              <HeaderCell field="name" label="Vehicle Name / Model" />
              <HeaderCell field="type" label="Type" />
              <HeaderCell field="capacity" label="Capacity" />
              <HeaderCell field="odometer" label="Odometer" align="right" />
              <HeaderCell field="acquisitionCost" label="Cost" align="right" />
              <HeaderCell field="status" label="Status" align="center" />
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right sticky top-0 bg-gray-50 z-10 shadow-[inset_0_-1px_0_rgba(229,231,235,1)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-primary-light/20 transition-colors duration-150">
                <td className="p-4 font-mono font-semibold text-xs text-primary">
                  {v.registrationNumber}
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-text-primary">{v.name}</span>
                    <span className="text-xs text-text-secondary">
                      {v.manufacturer} {v.model}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-xs text-text-secondary font-medium">{v.type}</td>
                <td className="p-4 text-xs text-text-secondary font-medium">{v.capacity}</td>
                <td className="p-4 text-xs text-text-primary font-semibold font-mono text-right">
                  {v.odometer.toLocaleString()} km
                </td>
                <td className="p-4 text-xs text-text-primary font-semibold font-mono text-right">
                  {v.acquisitionCost ? (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(v.acquisitionCost)
                  ) : (
                    "$0"
                  )}
                </td>
                <td className="p-4 text-center">
                  <VehicleStatusBadge status={v.status} />
                </td>
                <td className="p-4 text-right">
                  <VehicleActions
                    vehicleId={v.id}
                    status={v.status}
                    onRetire={() => onRetireClick(v)}
                    onDelete={() => onDeleteClick(v)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border-app flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
        <span className="text-xs text-text-secondary select-none">
          Showing <span className="font-semibold text-text-primary">{startEntry}</span> to{" "}
          <span className="font-semibold text-text-primary">{endEntry}</span> of{" "}
          <span className="font-semibold text-text-primary">{totalItems}</span> entries
        </span>

        <div className="flex items-center gap-1.5 text-xs font-semibold select-none">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous Page"
            className="flex h-8 w-8 items-center justify-center border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-all cursor-pointer shadow-small"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center px-3 h-8 border border-border-app rounded-m bg-surface-app text-text-secondary font-medium shadow-small">
            Page {page} of {totalPages}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next Page"
            className="flex h-8 w-8 items-center justify-center border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-all cursor-pointer shadow-small"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});
