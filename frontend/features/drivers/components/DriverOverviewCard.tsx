"use client";

import React, { memo } from "react";
import { User, Phone, Mail, Award, Activity } from "lucide-react";
import { DriverCompliance } from "../types";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";

interface DriverOverviewCardProps {
  record: DriverCompliance;
}

export const DriverOverviewCard = memo(function DriverOverviewCard({
  record
}: DriverOverviewCardProps) {
  const labelClass = "text-text-secondary font-medium block text-xs";
  const valClass = "text-text-primary font-semibold block text-xs mt-1";
  
  return (
    <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4 animate-fadeIn">
      <div className="pb-3 border-b border-divider-app flex items-center gap-2 select-none">
        <User size={16} className="text-primary" />
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Compliance Profile Overview
        </h3>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
        <div>
          <span className={labelClass}>Driver Name</span>
          <span className={valClass}>{record.name}</span>
        </div>
        <div>
          <span className={labelClass}>Employee ID</span>
          <span className={`${valClass} font-mono`}>{record.employeeId}</span>
        </div>
        <div>
          <span className={labelClass}>Compliance status</span>
          <div className="mt-1">
            <ComplianceStatusBadge status={record.status} />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Phone size={13} />
            <span className={labelClass}>Phone Number</span>
          </div>
          <span className={valClass}>{record.phoneNumber || "N/A"}</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Mail size={13} />
            <span className={labelClass}>Email Address</span>
          </div>
          <span className={`${valClass} break-all`}>{record.email || "N/A"}</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Activity size={13} />
            <span className={labelClass}>Department</span>
          </div>
          <span className={valClass}>{record.department || "N/A"}</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Award size={13} />
            <span className={labelClass}>License Type Group</span>
          </div>
          <span className={valClass}>{record.licenseType}</span>
        </div>
      </dl>
    </div>
  );
});
