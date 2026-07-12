"use client";

import React, { memo } from "react";
import { Eye } from "lucide-react";
import { DriverCompliance } from "../types";

interface DriverActionsProps {
  record: DriverCompliance;
  onView: (record: DriverCompliance) => void;
}

export const DriverActions = memo(function DriverActions({
  record,
  onView
}: DriverActionsProps) {
  return (
    <div className="flex items-center justify-end select-none">
      <button
        onClick={() => onView(record)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1.5 py-1 cursor-pointer"
      >
        <Eye size={14} />
        <span>View Compliance</span>
      </button>
    </div>
  );
});
