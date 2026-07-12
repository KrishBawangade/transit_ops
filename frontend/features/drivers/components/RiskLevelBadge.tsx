"use client";

import React, { memo } from "react";
import { RiskLevel } from "../types";

interface RiskLevelBadgeProps {
  riskLevel: RiskLevel;
}

export const RiskLevelBadge = memo(function RiskLevelBadge({
  riskLevel
}: RiskLevelBadgeProps) {
  let classes = "";
  switch (riskLevel) {
    case "Low":
      classes = "bg-success-light text-success border-success/20";
      break;
    case "Medium":
      classes = "bg-warning-light text-warning border-warning/20";
      break;
    case "High":
      classes = "bg-error-light text-error border-error/20";
      break;
    default:
      classes = "bg-gray-100 text-text-secondary border-gray-200";
  }

  return (
    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border uppercase tracking-wider select-none ${classes}`}>
      {riskLevel} Risk
    </span>
  );
});
