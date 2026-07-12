"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

interface DriverSafetyActionsProps {
  driverId: string;
}

export const DriverSafetyActions = memo(function DriverSafetyActions({
  driverId
}: DriverSafetyActionsProps) {
  return (
    <div className="flex items-center justify-end select-none">
      <Link
        href={`/drivers/${driverId}/compliance`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1.5 py-1 cursor-pointer"
      >
        <Eye size={14} />
        <span>View Details</span>
      </Link>
    </div>
  );
});
