"use client";

import React, { memo } from "react";
import { ShieldAlert } from "lucide-react";
import { SafetyViolation } from "../types";

interface SafetyViolationTableProps {
  violations: SafetyViolation[];
}

export const SafetyViolationTable = memo(function SafetyViolationTable({
  violations
}: SafetyViolationTableProps) {
  return (
    <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden animate-fadeIn">
      <div className="p-4 bg-gray-50 border-b border-border-app flex items-center gap-2 select-none">
        <ShieldAlert size={16} className="text-error" />
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Safety Violations & Telematics Warnings
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-border-app text-[11px] font-semibold text-text-secondary uppercase tracking-wider select-none">
              <th className="p-4">Violation Date</th>
              <th className="p-4">Violation Type</th>
              <th className="p-4 text-center">Severity</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Auditor Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {violations.map((v) => (
              <tr key={v.id} className="hover:bg-error-light/5 transition-colors">
                <td className="p-4 font-mono text-xs text-text-secondary">
                  {v.date}
                </td>
                <td className="p-4 font-semibold text-text-primary">
                  {v.type}
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border uppercase tracking-wider ${
                    v.severity === "High"
                      ? "bg-error-light text-error border-error/20"
                      : v.severity === "Medium"
                      ? "bg-warning-light text-warning border-warning/20"
                      : "bg-gray-100 text-text-secondary border-gray-200"
                  }`}>
                    {v.severity}
                  </span>
                </td>
                <td className="p-4 text-center text-xs font-semibold">
                  <span className={v.status === "Resolved" ? "text-success" : "text-warning"}>
                    {v.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-text-secondary">
                  {v.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
