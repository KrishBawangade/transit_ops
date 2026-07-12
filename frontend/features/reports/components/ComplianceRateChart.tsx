"use client";

import React, { memo } from "react";
import { ShieldCheck } from "lucide-react";
import { TrendDataPoint } from "../types";

interface ComplianceRateChartProps {
  trend: TrendDataPoint[];
}

export const ComplianceRateChart = memo(function ComplianceRateChart({
  trend
}: ComplianceRateChartProps) {
  const width = 420;
  const height = 120;
  const paddingLeft = 45;
  const paddingTop = 20;

  const points = trend.map((t, i) => {
    const x = paddingLeft + (i * (width - paddingLeft)) / (trend.length - 1);
    const percentageOffset = (t.value - 70) / 20; 
    const y = paddingTop + height - percentageOffset * height;
    return { x, y, label: t.label, val: t.value };
  });

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const fillD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + height} L ${points[0].x} ${paddingTop + height} Z`;

  return (
    <div className="bg-surface-app border border-border-app rounded-m p-5 shadow-card space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 select-none border-b border-divider-app pb-2.5">
        <ShieldCheck size={16} className="text-success" />
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Compliance Rate Trend</h4>
      </div>

      <div className="h-44 relative w-full">
        <svg viewBox="0 0 460 160" className="w-full h-full" preserveAspectRatio="none">
          <line x1="45" y1="20" x2="440" y2="20" stroke="#F1F5F9" strokeWidth="1" />
          <text x="15" y="24" className="text-[10px] fill-text-muted font-mono">90%</text>

          <line x1="45" y1="80" x2="440" y2="80" stroke="#F1F5F9" strokeWidth="1" />
          <text x="15" y="84" className="text-[10px] fill-text-muted font-mono">80%</text>

          <line x1="45" y1="140" x2="440" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />
          <text x="15" y="144" className="text-[10px] fill-text-muted font-mono">70%</text>

          <path d={fillD} fill="url(#complianceGrad)" opacity="0.15" />

          <path d={pathD} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="8" fill="#10B981" opacity="0" className="hover:opacity-20 transition-opacity" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[9px] font-bold fill-text-primary hidden group-hover:block font-mono">
                {p.val}%
              </text>
            </g>
          ))}

          {points.map((p, i) => (
            <text key={i} x={p.x} y="156" textAnchor="middle" className="text-[10px] fill-text-secondary font-medium font-sans">
              {p.label}
            </text>
          ))}

          <defs>
            <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
});
