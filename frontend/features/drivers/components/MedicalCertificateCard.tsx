"use client";

import React, { memo } from "react";
import { Activity, AlertCircle, ShieldAlert } from "lucide-react";
import { DriverCompliance } from "../types";

interface MedicalCertificateCardProps {
  record: DriverCompliance;
}

export const MedicalCertificateCard = memo(function MedicalCertificateCard({
  record
}: MedicalCertificateCardProps) {
  // Calculate remaining days
  const expiryDate = new Date(record.medicalExpiry);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let warningMessage = "";
  let warningClass = "";

  if (diffDays <= 0) {
    warningMessage = "Medical fitness certificate has EXPIRED. The driver cannot operate commercial vehicles until medical checks are resolved.";
    warningClass = "p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-semibold flex items-center gap-2 animate-fadeIn";
  } else if (diffDays <= 30) {
    warningMessage = `Medical certificate expires soon (in ${diffDays} days). Renewal health checks should be scheduled.`;
    warningClass = "p-3 bg-warning-light/20 border border-warning/20 rounded-m text-xs text-warning font-semibold flex items-center gap-2 animate-fadeIn";
  }

  const labelClass = "text-text-secondary font-medium block text-xs";
  const valClass = "text-text-primary font-semibold block text-xs mt-1";

  return (
    <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4 animate-fadeIn">
      <div className="pb-3 border-b border-divider-app flex items-center gap-2 select-none">
        <Activity size={16} className="text-primary" />
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Medical Fitness & Certification
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
          <span className={labelClass}>Certificate Number</span>
          <span className={`${valClass} font-mono text-primary`}>{record.medicalCertificateNumber || "MC-PENDING"}</span>
        </div>
        <div>
          <span className={labelClass}>Medical Status / Decs</span>
          <span className={valClass}>{record.medicalStatus || "N/A"}</span>
        </div>
        <div>
          <span className={labelClass}>Certified Facility / Hospital</span>
          <span className={valClass}>{record.medicalHospital || "N/A"}</span>
        </div>
        <div>
          <span className={labelClass}>Fitness Expiry Date</span>
          <span className={`${valClass} font-mono`}>{record.medicalExpiry}</span>
        </div>
        <div>
          <span className={labelClass}>Certification Status</span>
          <span className={valClass}>
            {diffDays <= 0 ? (
              <span className="text-error font-bold">Expired ({Math.abs(diffDays)} days ago)</span>
            ) : diffDays <= 30 ? (
              <span className="text-warning font-bold">Expiring Soon ({diffDays} days remaining)</span>
            ) : (
              <span className="text-success font-bold">Fit for Duty</span>
            )}
          </span>
        </div>
      </dl>
    </div>
  );
});
