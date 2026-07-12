"use client";

import React, { memo } from "react";
import Link from "next/link";
import { VehicleStatus } from "../types";

interface VehicleActionsProps {
  vehicleId: string;
  status: VehicleStatus;
  onRetire: () => void;
  onDelete: () => void;
}

export const VehicleActions = memo(function VehicleActions({
  vehicleId,
  status,
  onRetire,
  onDelete,
}: VehicleActionsProps) {
  const isRetired = status === "Retired";

  return (
    <div className="flex items-center justify-end gap-2 text-xs font-semibold select-none">
      <Link
        href={`/vehicles/${vehicleId}`}
        aria-label={`View details of vehicle ${vehicleId}`}
        className="text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 cursor-pointer"
      >
        View
      </Link>
      <span className="text-divider-app text-[10px] pointer-events-none" aria-hidden="true">|</span>
      <Link
        href={`/vehicles/${vehicleId}/edit`}
        aria-label={`Edit details of vehicle ${vehicleId}`}
        className="text-secondary hover:text-secondary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded px-1 cursor-pointer"
      >
        Edit
      </Link>
      <span className="text-divider-app text-[10px] pointer-events-none" aria-hidden="true">|</span>
      <button
        onClick={onRetire}
        disabled={isRetired}
        aria-label={`Retire vehicle ${vehicleId}`}
        className="text-warning hover:text-warning/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-warning/20 rounded px-1 disabled:text-text-muted disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
      >
        Retire
      </button>
      <span className="text-divider-app text-[10px] pointer-events-none" aria-hidden="true">|</span>
      <button
        onClick={onDelete}
        aria-label={`Delete vehicle ${vehicleId}`}
        className="text-error hover:text-error/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-error/20 rounded px-1 cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
});
