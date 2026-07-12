"use client";

import React, { memo } from "react";

interface AssignmentStatusBadgeProps {
  status: "Assigned" | "Available" | "Inactive";
}

export const AssignmentStatusBadge = memo(function AssignmentStatusBadge({
  status
}: AssignmentStatusBadgeProps) {
  let colorClass = "bg-gray-100 text-text-secondary border-gray-200";

  if (status === "Assigned") {
    colorClass = "bg-success-light text-success border-success/20";
  } else if (status === "Available") {
    colorClass = "bg-primary-light text-primary border-primary/20";
  }

  return (
    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border uppercase tracking-wider select-none ${colorClass}`}>
      {status}
    </span>
  );
});
