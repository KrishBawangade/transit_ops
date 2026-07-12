"use client";

import React, { memo } from "react";
import { AlertCircle, CreditCard, ShieldAlert } from "lucide-react";
import { DriverCompliance } from "../types";

interface LicenseCardProps {
  record: DriverCompliance;
}

export const LicenseCard = memo(function LicenseCard({
  record
}: LicenseCardProps) {
  // Calculate remaining days
  const expiryDate = new Date(record.licenseExpiry);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let warningMessage = "";
  let warningClass = "";

  if (diffDays <= 0) {
    warningMessage = "This commercial driving license has EXPIRED. The driver must be grounded immediately.";
    warningClass = "p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-semibold flex items-center gap-2 animate-fadeIn";
  } else if (diffDays <= 30) {
    warningMessage = `This license is expiring soon (in ${diffDays} days). Please initiate the renewal application immediately.`;
    warningClass = "p-3 bg-warning-light/20 border border-warning/20 rounded-m text-xs text-warning font-semibold flex items-center gap-2 animate-fadeIn";
  }

  const labelClass = "text-text-secondary font-medium block text-xs";
  const valClass = "text-text-primary font-semibold block text-xs mt-1";

  return (
    <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4 animate-fadeIn">
      <div className="pb-3 border-b border-divider-app flex items-center gap-2 select-none">
        <CreditCard size={16} className="text-primary" />
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Commercial License Details
        </h3>
      </div>

      {warningMessage && (
        <div className={warningClass}>
          {diffDays <= 0 ? <ShieldAlert size={15} /> : <AlertCircle size={15} />}
          <span>{warningMessage}</span>
        </div>
      )}

      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
        <div>
          <span className={labelClass}>License Number</span>
          <span className={`${valClass} font-mono text-primary`}>{record.licenseNumber}</span>
        </div>
        <div>
          <span className={labelClass}>License Category</span>
          <span className={valClass}>{record.licenseType}</span>
        </div>
        <div>
          <span className={labelClass}>Issuing Authority</span>
          <span className={valClass}>{record.issuingAuthority || "N/A"}</span>
        </div>
        <div>
          <span className={labelClass}>License Expiry Date</span>
          <span className={`${valClass} font-mono`}>{record.licenseExpiry}</span>
        </div>
        <div>
          <span className={labelClass}>Licensing Status</span>
          <span className={valClass}>
            {diffDays <= 0 ? (
              <span className="text-error font-bold">Expired ({Math.abs(diffDays)} days ago)</span>
            ) : diffDays <= 30 ? (
              <span className="text-warning font-bold">Expiring Soon ({diffDays} days remaining)</span>
            ) : (
              <span className="text-success font-bold">Active and Compliant</span>
            )}
          </span>
        </div>
      </dl>
    </div>
  );
});
