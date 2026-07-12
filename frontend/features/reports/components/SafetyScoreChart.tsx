"use client";

import React, { memo } from "react";
import { Award } from "lucide-react";
import { DistributionDataPoint } from "../types";

interface SafetyScoreChartProps {
  distribution: DistributionDataPoint[];
}

export const SafetyScoreChart = memo(function SafetyScoreChart({
  distribution
}: SafetyScoreChartProps) {
  const width = 400;
  const height = 120;
  const paddingLeft = 40;
  const paddingTop = 20;

  const barWidth = 45;
  const spacing = 40;

  // Maximum count is 2 (or let's scale it based on actual counts dynamically!)
  const maxCount = Math.max(...distribution.map((d) => d.count), 2);

  const bars = distribution.map((d, i) => {
    const x = paddingLeft + spacing / 2 + i * (barWidth + spacing);
    const barHeight = (d.count / maxCount) * height;
    const y = paddingTop + height - barHeight;
    return { x, y, w: barWidth, h: barHeight, label: d.label, count: d.count, color: d.color };
  });

  return (
    <div className="bg-surface-app border border-border-app rounded-m p-5 shadow-card space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 select-none border-b border-divider-app pb-2.5">
        <Award size={16} className="text-primary" />
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Safety Score Distribution</h4>
      </div>

      <div className="h-44 relative w-full">
        <svg viewBox="0 0 440 160" className="w-full h-full" preserveAspectRatio="none">
          {/* Horizontal grid lines */}
          <line x1="40" y1="20" x2="420" y2="20" stroke="#F1F5F9" strokeWidth="1" />
          <text x="15" y="24" className="text-[10px] fill-text-muted font-mono">{maxCount}</text>

          <line x1="40" y1="80" x2="420" y2="80" stroke="#F1F5F9" strokeWidth="1" />
          <text x="15" y="84" className="text-[10px] fill-text-muted font-mono">{Math.floor(maxCount / 2)}</text>

          <line x1="40" y1="140" x2="420" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />
          <text x="15" y="144" className="text-[10px] fill-text-muted font-mono">0</text>

          {/* Bar elements */}
          {bars.map((b, i) => (
            <g key={i} className="group cursor-pointer">
              {/* Vertical Rect */}
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={Math.max(b.h, 2)}
                fill={b.color}
                rx="4"
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
              {/* Value text above bar */}
              <text x={b.x + b.w / 2} y={b.y - 8} textAnchor="middle" className="text-[10px] font-bold fill-text-primary">
                {b.count} {b.count === 1 ? "Driver" : "Drivers"}
              </text>
              {/* Bottom Label */}
              <text x={b.x + b.w / 2} y="156" textAnchor="middle" className="text-[10px] fill-text-secondary font-medium">
                {b.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
});
