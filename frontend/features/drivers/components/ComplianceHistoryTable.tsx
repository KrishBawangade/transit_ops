"use client";

import React, { memo } from "react";
import { History } from "lucide-react";
import { ComplianceHistoryRecord } from "../types";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";

interface ComplianceHistoryTableProps {
  history: ComplianceHistoryRecord[];
}

export const ComplianceHistoryTable = memo(function ComplianceHistoryTable({
  history
}: ComplianceHistoryTableProps) {
  return (
    <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden animate-fadeIn">
      <div className="p-4 bg-gray-50 border-b border-border-app flex items-center gap-2 select-none">
        <History size={16} className="text-text-secondary" />
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Compliance Check Logs & History
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-border-app text-[11px] font-semibold text-text-secondary uppercase tracking-wider select-none">
              <th className="p-4">Check Date</th>
              <th className="p-4">Audited By</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Auditor Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-primary-light/10 transition-colors">
                <td className="p-4 font-mono text-xs text-text-secondary">
                  {h.checkDate}
                </td>
                <td className="p-4 font-medium text-text-primary">
                  {h.checkedBy}
                </td>
                <td className="p-4 text-center">
                  <ComplianceStatusBadge status={h.status} />
                </td>
                <td className="p-4 text-xs text-text-secondary">
                  {h.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
