"use client";

import React, { memo } from "react";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface ExpiryAlertCardProps {
  expiredCount: number;
  expiringCount: number;
}

export const ExpiryAlertCard = memo(function ExpiryAlertCard({
  expiredCount,
  expiringCount
}: ExpiryAlertCardProps) {
  if (expiredCount === 0 && expiringCount === 0) return null;

  return (
    <div className="space-y-3 select-none">
      {expiredCount > 0 && (
        <div className="p-4 bg-error-light/30 border border-error/20 text-error rounded-m flex items-start gap-3 shadow-small animate-fadeIn">
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Critical Expiry Warning</h4>
            <p className="text-xs font-semibold text-text-primary mt-1">
              There are {expiredCount} drivers with expired credentials (licenses or medical certificates). Grounding procedures must be verified.
            </p>
          </div>
        </div>
      )}

      {expiringCount > 0 && (
        <div className="p-4 bg-warning-light/30 border border-warning/20 text-warning rounded-m flex items-start gap-3 shadow-small animate-fadeIn">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Upcoming Document Renewals</h4>
            <p className="text-xs font-semibold text-text-primary mt-1">
              There are {expiringCount} drivers with documents expiring within the next 30 days. Renewal reminders should be dispatched.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
