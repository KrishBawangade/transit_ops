import React, { memo } from "react";
import { VehicleStatus } from "../types";

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
}

export const VehicleStatusBadge = memo(function VehicleStatusBadge({
  status,
}: VehicleStatusBadgeProps) {
  let colorClasses = "";

  switch (status) {
    case "Available":
      colorClasses = "bg-success-light text-success border-success/20";
      break;
    case "On Trip":
      colorClasses = "bg-info-light text-info border-info/20";
      break;
    case "In Shop":
      colorClasses = "bg-warning-light text-warning border-warning/20";
      break;
    case "Retired":
      colorClasses = "bg-gray-100 text-text-secondary border-border-app";
      break;
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-circular border leading-none ${colorClasses}`}
    >
      {status}
    </span>
  );
});
