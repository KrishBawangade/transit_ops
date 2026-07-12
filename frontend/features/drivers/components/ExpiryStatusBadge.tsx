"use client";

import React, { memo } from "react";
import { DocumentStatus } from "../types";

interface ExpiryStatusBadgeProps {
  status: DocumentStatus;
}

export const ExpiryStatusBadge = memo(function ExpiryStatusBadge({
  status
}: ExpiryStatusBadgeProps) {
  let classes = "";
  switch (status) {
    case "Valid":
      classes = "bg-success-light text-success border-success/20";
      break;
    case "Expiring Soon":
      classes = "bg-warning-light text-warning border-warning/20";
      break;
    case "Expired":
      classes = "bg-error-light text-error border-error/20";
      break;
    default:
      classes = "bg-gray-100 text-text-secondary border-gray-200";
  }

  return (
    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border uppercase tracking-wider select-none ${classes}`}>
      {status}
    </span>
  );
});
