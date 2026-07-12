"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Fuel, 
  TrendingUp, 
  Truck, 
  IndianRupee, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowDown
} from "lucide-react";
import { loadFinanceData, FuelEfficiencyRecord, syncFinanceDataWithBackend } from "../mockData";

export default function FuelCostAnalysis() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  const [fuelTypeFilter, setFuelTypeFilter] = useState<"All" | "Diesel" | "Electric">("All");

  useEffect(() => {
    setFinanceData(loadFinanceData());
    syncFinanceDataWithBackend();
    const handleUpdate = () => setFinanceData(loadFinanceData());
    window.addEventListener("finance_data_update", handleUpdate);
    return () => window.removeEventListener("finance_data_update", handleUpdate);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. Calculations & Leaderboards
  const fuelMetrics = useMemo(() => {
    if (!financeData) return null;

    const { fuelEfficiencies } = financeData;

    // Filter based on dropdown
    const filteredEffs = fuelEfficiencies.filter((f: FuelEfficiencyRecord) => {
      if (fuelTypeFilter === "Diesel") return f.fuelType === "Diesel";
      if (fuelTypeFilter === "Electric") return f.fuelType === "Electric";
      return true;
    });

    // Sum totals
    const totalFuelCost = filteredEffs.reduce((sum: number, f: FuelEfficiencyRecord) => sum + f.totalCost, 0);
    const totalDistance = filteredEffs.reduce((sum: number, f: FuelEfficiencyRecord) => sum + f.totalDistanceKm, 0);
    
    // Average cost per km
    const avgCostPerKm = totalDistance > 0 ? totalFuelCost / totalDistance : 0;

    // Sort by cost (highest fuel-consuming vehicles first)
    const sortedVehicles = [...filteredEffs].sort((a: FuelEfficiencyRecord, b: FuelEfficiencyRecord) => b.totalCost - a.totalCost);

    return {
      filteredEffs,
      totalFuelCost,
      totalDistance,
      avgCostPerKm,
      sortedVehicles
    };
  }, [financeData, fuelTypeFilter]);

  if (!financeData || !fuelMetrics) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { totalFuelCost, totalDistance, avgCostPerKm, sortedVehicles } = fuelMetrics;

  // Monthly fuel cost trend mock data (Jan to Jun 2026)
  const monthlyFuelTrends = [
    { month: "Jan", cost: 68000 },
    { month: "Feb", cost: 72000 },
    { month: "Mar", cost: 69500 },
    { month: "Apr", cost: 74000 },
    { month: "May", cost: 71000 },
    { month: "Jun", cost: 70500 },
  ];

  // SVG Trend Chart Configuration
  const trendVals = monthlyFuelTrends.map(t => t.cost);
  const trendMax = Math.max(...trendVals) * 1.15;
  const trendMin = 0;
  const svgW = 550;
  const svgH = 150;
  const padL = 50;
  const padR = 15;
  const padT = 15;
  const padB = 25;

  const getCoordinates = (idx: number, val: number) => {
    const total = monthlyFuelTrends.length;
    const x = padL + (idx / (total - 1)) * (svgW - padL - padR);
    const y = svgH - padB - ((val - trendMin) / (trendMax - trendMin)) * (svgH - padB - padT);
    return { x, y };
  };

  const trendPoints = monthlyFuelTrends.map((t, i) => getCoordinates(i, t.cost));
  const trendPath = trendPoints.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, "");
  const trendArea = trendPoints.length > 0
    ? `${trendPath} L ${trendPoints[trendPoints.length - 1].x} ${svgH - padB} L ${trendPoints[0].x} ${svgH - padB} Z`
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="fuel-analysis-title">Fuel Cost & Efficiency Analysis</h1>
          <p className="text-sm text-text-secondary">Audit fuel expenses, map average cost per kilometer, and evaluate diesel vs electric efficiency gaps.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={fuelTypeFilter}
            onChange={(e) => setFuelTypeFilter(e.target.value as any)}
            className="h-9 border border-border-app rounded-m text-xs px-3 bg-surface-app text-text-primary focus:outline-none cursor-pointer shadow-small"
          >
            <option value="All">All Engine Categories</option>
            <option value="Diesel">Diesel Semis Only</option>
            <option value="Electric">Electric Semis Only</option>
          </select>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-primary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Aggregate Fuel Cost</span>
            <div className="text-2xl font-bold text-text-primary">{formatCurrency(totalFuelCost)}</div>
            <span className="text-[10px] text-text-muted">Filtered category spend</span>
          </div>
          <div className="h-10 w-10 bg-primary-light text-primary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <Fuel size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-secondary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Average Cost/km</span>
            <div className="text-2xl font-bold text-text-primary">₹{avgCostPerKm.toFixed(2)}</div>
            <span className="text-[10px] text-text-muted">Total cost / {totalDistance.toLocaleString()} km</span>
          </div>
          <div className="h-10 w-10 bg-secondary-light text-secondary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <Activity size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-success/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">EV vs Diesel Delta</span>
            <div className="text-2xl font-bold text-success">86% Cost Savings</div>
            <span className="text-[10px] text-success font-semibold flex items-center gap-0.5 mt-0.5 animate-pulse">
              <ArrowDown size={12} />
              <span>EV Semis cost ₹0.48/km vs Diesel ₹3.40/km</span>
            </span>
          </div>
          <div className="h-10 w-10 bg-success-light text-success rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend line chart */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">Monthly Fuel Cost Trend</h3>
            <p className="text-xs text-text-secondary">Fluctuation of total monthly fuel and energy expense.</p>
            
            <div className="mt-6">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible select-none">
                {/* Horizontal Grid lines */}
                {[0, 1, 2, 3, 4].map((grid, index) => {
                  const y = svgH - padB - (index / 4) * (svgH - padB - padT);
                  const val = trendMin + (index / 4) * (trendMax - trendMin);
                  return (
                    <g key={grid}>
                      <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                      <text x={padL - 8} y={y + 4} textAnchor="end" className="text-[9px] font-medium fill-text-muted">
                        ₹{(val / 1000).toFixed(0)}k
                      </text>
                    </g>
                  );
                })}

                <path d={trendArea} fill="url(#fuelTrendGrad)" opacity="0.1" />
                <path d={trendPath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

                <defs>
                  <linearGradient id="fuelTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {monthlyFuelTrends.map((t, idx) => {
                  const p = trendPoints[idx];
                  return (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
                      <text x={p.x} y={svgH - 8} textAnchor="middle" className="text-[10px] font-semibold fill-text-secondary">
                        {t.month}
                      </text>
                      <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[9px] font-bold fill-primary">
                        ₹{(t.cost / 1000).toFixed(0)}k
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-text-secondary flex justify-between items-center bg-gray-50/50 p-2.5 rounded">
            <span className="flex items-center gap-1">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span>Fuel expenses are stabilized due to rising EV routes loading.</span>
            </span>
          </div>
        </div>

        {/* Cost per km bar chart comparison */}
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">Operating Cost Comparison</h3>
            <p className="text-xs text-text-secondary">Average cost per kilometer (Diesel vs Electric Semis).</p>
            
            <div className="mt-8 space-y-6">
              {[
                { name: "Scania R500 (Diesel)", cost: 3.52, color: "bg-warning", lightColor: "bg-warning-light" },
                { name: "Volvo FH16 (Diesel)", cost: 3.30, color: "bg-warning", lightColor: "bg-warning-light" },
                { name: "Kenworth T680 (Diesel)", cost: 3.08, color: "bg-warning", lightColor: "bg-warning-light" },
                { name: "Tesla Semi G1 (Electric)", cost: 0.50, color: "bg-success", lightColor: "bg-success-light animate-pulse" },
                { name: "Tesla Semi G2 (Electric)", cost: 0.46, color: "bg-success", lightColor: "bg-success-light animate-pulse" }
              ].map((item, idx) => {
                const maxVal = 4.0;
                const percent = (item.cost / maxVal) * 100;
                
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-primary truncate">{item.name}</span>
                      <span className="font-bold text-text-primary">₹{item.cost.toFixed(2)}/km</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-circular overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-circular transition-all duration-500`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-text-muted text-center font-medium">
            EV fleet expansion reduces cost basis by 86% per kilometer.
          </div>
        </div>

      </div>

      {/* Table: Cost per Vehicle Leaderboard */}
      <div className="bg-surface-app border border-border-app rounded-m shadow-card flex flex-col justify-between">
        <div>
          <div className="p-4 border-b border-border-app flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary">Asset Efficiency Leaderboard</h3>
              <p className="text-xs text-text-secondary">Granular cost audit of vehicle fuel yields and consumption indices.</p>
            </div>
            <span className="px-2 py-0.5 bg-gray-100 text-text-secondary text-[10px] font-bold rounded">
              Total items: {sortedVehicles.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Reg Number</th>
                  <th className="p-4">Model Description</th>
                  <th className="p-4">Energy Category</th>
                  <th className="p-4 text-right">Distance Run (km)</th>
                  <th className="p-4 text-right">Fuel Consumed</th>
                  <th className="p-4 text-right">Energy Bill</th>
                  <th className="p-4 text-right">Fuel Efficiency</th>
                  <th className="p-4 text-right">Cost/km</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {sortedVehicles.map((v, index) => (
                  <tr key={v.vehicleNumber} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-text-secondary">{index + 1}</td>
                    <td className="p-4 font-mono font-semibold text-text-primary">{v.vehicleNumber}</td>
                    <td className="p-4 text-text-secondary">{v.model}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 font-semibold text-[10px] rounded-circular border 
                        ${v.fuelType === "Electric" ? "bg-success-light text-success border-success/20" : "bg-warning-light text-warning border-warning/20"}`}
                      >
                        {v.fuelType}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-text-primary">{v.totalDistanceKm.toLocaleString()}</td>
                    <td className="p-4 text-right font-medium text-text-primary">
                      {v.totalFuelLitersOrKwh.toLocaleString()} {v.fuelType === "Electric" ? "kWh" : "Liters"}
                    </td>
                    <td className="p-4 text-right font-bold text-text-primary">₹{v.totalCost.toLocaleString()}</td>
                    <td className="p-4 text-right font-semibold text-text-primary">{v.efficiency}</td>
                    <td className="p-4 text-right font-bold text-primary">₹{v.costPerKm.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-[11px] text-text-secondary flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success" />
          <span>Fuel logs are cross-referenced with telematics odometer records to ensure 100% auditable fuel claims.</span>
        </div>
      </div>
    </div>
  );
}
