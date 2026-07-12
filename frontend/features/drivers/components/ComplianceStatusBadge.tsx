"use client";

import React, { memo } from "react";
import { ComplianceStatus } from "../types";

interface ComplianceStatusBadgeProps {
  status: ComplianceStatus;
}

export const ComplianceStatusBadge = memo(function ComplianceStatusBadge({
  status
}: ComplianceStatusBadgeProps) {
  let colorClass = "bg-gray-100 text-text-secondary border-gray-200";

  if (status === "Compliant") {
    colorClass = "bg-success-light text-success border-success/20";
  } else if (status === "Expiring Soon") {
    colorClass = "bg-warning-light text-warning border-warning/20";
  } else if (status === "Expired") {
    colorClass = "bg-error-light text-error border-error/20";
  }

  return (
    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border uppercase tracking-wider select-none ${colorClass}`}>
      {status}
    </span>
  );
});
