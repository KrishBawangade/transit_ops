"use client";

import React, { memo } from "react";
import { AlertCircle } from "lucide-react";
import { TrendDataPoint } from "../types";

interface ExpiryTrendChartProps {
  licenseTrend: TrendDataPoint[];
  medicalTrend: TrendDataPoint[];
}

export const ExpiryTrendChart = memo(function ExpiryTrendChart({
  licenseTrend,
  medicalTrend
}: ExpiryTrendChartProps) {
  const width = 420;
  const height = 120;
  const paddingLeft = 45;
  const paddingTop = 20;

  const pointsL = licenseTrend.map((t, i) => {
    const x = paddingLeft + (i * (width - paddingLeft)) / (licenseTrend.length - 1);
    const y = paddingTop + height - (t.value / 2) * height; // Max value is 2
    return { x, y, label: t.label, val: t.value };
  });

  const pointsM = medicalTrend.map((t, i) => {
    const x = paddingLeft + (i * (width - paddingLeft)) / (medicalTrend.length - 1);
    const y = paddingTop + height - (t.value / 2) * height;
    return { x, y, label: t.label, val: t.value };
  });

  const pathL = pointsL.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const pathM = pointsM.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  return (
    <div className="bg-surface-app border border-border-app rounded-m p-5 shadow-card space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-divider-app pb-2.5 gap-2 select-none">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-warning" />
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Document Expiration Forecast</h4>
        </div>
        {/* Legends */}
        <div className="flex items-center gap-3 text-[10px] font-semibold">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-primary"></span>
            <span className="text-text-secondary">Licenses Expirations</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-warning"></span>
            <span className="text-text-secondary">Medical Certificates</span>
          </div>
        </div>
      </div>

      <div className="h-44 relative w-full">
        <svg viewBox="0 0 460 160" className="w-full h-full" preserveAspectRatio="none">
          <line x1="45" y1="20" x2="440" y2="20" stroke="#F1F5F9" strokeWidth="1" />
          <text x="15" y="24" className="text-[10px] fill-text-muted font-mono">2</text>

          <line x1="45" y1="80" x2="440" y2="80" stroke="#F1F5F9" strokeWidth="1" />
          <text x="15" y="84" className="text-[10px] fill-text-muted font-mono">1</text>

          <line x1="45" y1="140" x2="440" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />
          <text x="15" y="144" className="text-[10px] fill-text-muted font-mono">0</text>

          {/* License Line */}
          <path d={pathL} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Medical Line */}
          <path d={pathM} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points L */}
          {pointsL.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" />
          ))}

          {/* Points M */}
          {pointsM.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
          ))}

          {/* Bottom Labels */}
          {pointsL.map((p, i) => (
            <text key={i} x={p.x} y="156" textAnchor="middle" className="text-[10px] fill-text-secondary font-medium">
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
});
