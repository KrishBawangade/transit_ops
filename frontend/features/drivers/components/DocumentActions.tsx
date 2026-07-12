"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Eye, Printer } from "lucide-react";

interface DocumentActionsProps {
  driverId: string;
}

export const DocumentActions = memo(function DocumentActions({
  driverId
}: DocumentActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-end gap-2.5 select-none">
      <Link
        href={`/drivers/${driverId}/compliance`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 cursor-pointer"
        title="View Compliance Details"
      >
        <Eye size={14} />
        <span>View Details</span>
      </Link>
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 cursor-pointer"
        title="Print Record"
      >
        <Printer size={14} />
        <span>Print</span>
      </button>
    </div>
  );
});
