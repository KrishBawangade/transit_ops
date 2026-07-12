"use client";

import React, { memo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DriverCompliance } from "../types";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";
import { DriverActions } from "./DriverActions";

interface DriverComplianceTableProps {
  records: DriverCompliance[];
  totalItems: number;
  totalPages: number;
  page: number;
  onPageChange: (val: number) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onViewClick: (record: DriverCompliance) => void;
}

export const DriverComplianceTable = memo(function DriverComplianceTable({
  records,
  totalItems,
  totalPages,
  page,
  onPageChange,
  sortBy,
  sortOrder,
  onSort,
  onViewClick
}: DriverComplianceTableProps) {
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ChevronsUpDown size={12} className="text-text-muted transition-colors group-hover:text-text-secondary" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  };

  const headerClass = "p-4 font-semibold uppercase tracking-wider text-text-secondary text-[11px] cursor-pointer select-none group hover:bg-gray-100 transition-colors";

  // Pagination bounds
  const pageSize = 5;
  const startEntry = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalItems);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-border-app">
              <th onClick={() => onSort("name")} className={headerClass}>
                <div className="flex items-center gap-1.5">
                  <span>Driver</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-text-secondary text-[11px] select-none">
                Employee ID
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-text-secondary text-[11px] select-none">
                License Number
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-text-secondary text-[11px] select-none">
                License Type
              </th>
              <th onClick={() => onSort("licenseExpiry")} className={headerClass}>
                <div className="flex items-center gap-1.5">
                  <span>License Expiry</span>
                  {renderSortIcon("licenseExpiry")}
                </div>
              </th>
              <th onClick={() => onSort("medicalExpiry")} className={headerClass}>
                <div className="flex items-center gap-1.5">
                  <span>Medical Expiry</span>
                  {renderSortIcon("medicalExpiry")}
                </div>
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-text-secondary text-[11px] select-none text-center">
                Compliance Status
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-text-secondary text-[11px] select-none text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-primary-light/20 transition-colors">
                <td className="p-4 font-medium text-text-primary">
                  {rec.name}
                </td>
                <td className="p-4 font-mono text-xs text-text-secondary">
                  {rec.employeeId}
                </td>
                <td className="p-4 font-mono font-semibold text-xs text-primary">
                  {rec.licenseNumber}
                </td>
                <td className="p-4 text-xs font-semibold text-text-secondary">
                  {rec.licenseType}
                </td>
                <td className="p-4 text-xs font-mono text-text-secondary">
                  {rec.licenseExpiry}
                </td>
                <td className="p-4 text-xs font-mono text-text-secondary">
                  {rec.medicalExpiry}
                </td>
                <td className="p-4 text-center">
                  <ComplianceStatusBadge status={rec.status} />
                </td>
                <td className="p-4">
                  <DriverActions record={rec} onView={onViewClick} />
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
