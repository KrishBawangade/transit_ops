"use client";

import React, { memo } from "react";
import { ShieldCheck, Award, ShieldAlert, Activity } from "lucide-react";
import { SafetyReportData } from "../types";

interface ReportSummaryCardsProps {
  data: SafetyReportData;
}

export const ReportSummaryCards = memo(function ReportSummaryCards({
  data
}: ReportSummaryCardsProps) {
  const cardClass = "bg-surface-app border border-border-app rounded-m p-4 shadow-card flex items-center justify-between";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none animate-fadeIn">
      {/* Compliance Rate */}
      <div className={cardClass}>
        <div>
          <span className="text-[10px] font-bold text-success uppercase tracking-wider block">Compliance Rate</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-text-primary">{data.complianceRate}</span>
            <span className="text-xs text-text-muted">%</span>
          </div>
        </div>
        <div className="h-10 w-10 bg-success-light/20 text-success border border-success/10 rounded-circular flex items-center justify-center">
          <ShieldCheck size={18} />
        </div>
      </div>

      {/* Average Safety Score */}
      <div className={cardClass}>
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Average Safety Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-text-primary">{data.averageSafetyScore}</span>
            <span className="text-xs text-text-muted">/100</span>
          </div>
        </div>
        <div className="h-10 w-10 bg-primary-light text-primary border border-primary/10 rounded-circular flex items-center justify-center">
          <Award size={18} />
        </div>
      </div>

      {/* Drivers with Expired Licenses */}
      <div className={cardClass}>
        <div>
          <span className="text-[10px] font-bold text-error uppercase tracking-wider block">Expired Licenses</span>
          <span className="text-2xl font-bold text-text-primary mt-1 block">{data.expiredLicenses}</span>
        </div>
        <div className="h-10 w-10 bg-error-light text-error border border-error/10 rounded-circular flex items-center justify-center">
          <ShieldAlert size={18} />
        </div>
      </div>

      {/* Drivers with Expiring Medical Certificates */}
      <div className={cardClass}>
        <div>
          <span className="text-[10px] font-bold text-warning uppercase tracking-wider block">Expiring Medical Certs</span>
          <span className="text-2xl font-bold text-text-primary mt-1 block">{data.expiringMedicalCertificates}</span>
        </div>
        <div className="h-10 w-10 bg-warning-light text-warning border border-warning/10 rounded-circular flex items-center justify-center">
          <Activity size={18} />
        </div>
      </div>
    </div>
  );
});
