"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  PiggyBank, 
  IndianRupee, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  HelpCircle,
  Clock
} from "lucide-react";
import { loadFinanceData, BudgetRecord } from "../mockData";

export default function BudgetsForecasts() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  const [forecastPeriod, setForecastPeriod] = useState<"3months" | "6months" | "1year">("3months");

  useEffect(() => {
    setFinanceData(loadFinanceData());
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

  // 1. Calculate Budget Totals
  const budgetSummary = useMemo(() => {
    if (!financeData) return null;

    const { budgets } = financeData;

    const totalBudget = budgets.reduce((sum: number, b: BudgetRecord) => sum + b.budgeted, 0);
    const totalSpent = budgets.reduce((sum: number, b: BudgetRecord) => sum + b.actual, 0);
    const remaining = Math.max(0, totalBudget - totalSpent);
    const spentPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      remaining,
      spentPercent
    };
  }, [financeData]);

  if (!financeData || !budgetSummary) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { budgets } = financeData;
  const { totalBudget, totalSpent, remaining, spentPercent } = budgetSummary;

  // Forecast data (past actuals + predicted future months)
  const forecastTrend = [
    { label: "Mar", cost: 215000, type: "actual" },
    { label: "Apr", cost: 230000, type: "actual" },
    { label: "May", cost: 225000, type: "actual" },
    { label: "Jun (Actual)", cost: totalSpent, type: "actual" },
    { label: "Jul (Forecast)", cost: totalSpent * 1.02, type: "forecast" },
    { label: "Aug (Forecast)", cost: totalSpent * 0.98, type: "forecast" },
    { label: "Sep (Forecast)", cost: totalSpent * 0.95, type: "forecast" }
  ];

  // SVG Forecast Chart Configuration
  const values = forecastTrend.map(f => f.cost);
  const maxVal = Math.max(...values) * 1.15;
  const minVal = 0;
  const svgW = 550;
  const svgH = 150;
  const padL = 50;
  const padR = 15;
  const padT = 15;
  const padB = 25;

  const getCoordinates = (idx: number, val: number) => {
    const total = forecastTrend.length;
    const x = padL + (idx / (total - 1)) * (svgW - padL - padR);
    const y = svgH - padB - ((val - minVal) / (maxVal - minVal)) * (svgH - padB - padT);
    return { x, y };
  };

  const points = forecastTrend.map((f, i) => getCoordinates(i, f.cost));
  const trendPath = points.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="budgets-forecasts-title">Budgets & Spend Forecasts</h1>
          <p className="text-sm text-text-secondary">Compare planned budget caps with actual operating costs and model predictive forecasts for next-month expenses.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {["3months", "6months", "1year"].map((p) => (
            <button
              key={p}
              onClick={() => setForecastPeriod(p as any)}
              className={`h-9 px-3 rounded-m text-xs font-semibold border transition-all cursor-pointer ${forecastPeriod === p ? "bg-primary text-text-on-primary border-primary shadow-small" : "bg-surface-app text-text-secondary border-border-app hover:bg-gray-50"}`}
            >
              {p === "3months" ? "3-Month Model" : p === "6months" ? "6-Month Model" : "12-Month Model"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-primary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Aggregate Allocated Budget</span>
            <div className="text-2xl font-bold text-text-primary">{formatCurrency(totalBudget)}</div>
            <span className="text-[10px] text-text-muted">Target budget ceiling</span>
          </div>
          <div className="h-10 w-10 bg-primary-light text-primary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <PiggyBank size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-secondary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Spent to Date</span>
            <div className="text-2xl font-bold text-text-primary">{formatCurrency(totalSpent)}</div>
            <span className="text-[10px] text-text-muted">({spentPercent.toFixed(1)}% of ceiling utilized)</span>
          </div>
          <div className="h-10 w-10 bg-secondary-light text-secondary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-success/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Remaining Balance</span>
            <div className="text-2xl font-bold text-success">{formatCurrency(remaining)}</div>
            <span className="text-[10px] text-text-muted">Available cushion</span>
          </div>
          <div className="h-10 w-10 bg-success-light text-success rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Grid: Budgets Breakdown + Forecast Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budgets breakdown table */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-m shadow-card flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border-app flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Departmental Cost Audits</h3>
                <p className="text-xs text-text-secondary">Line items comparing allocated allowances against actual ledger expenditures.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary">
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Budgeted</th>
                    <th className="p-4 text-right">Actual Spent</th>
                    <th className="p-4">Spend Progress</th>
                    <th className="p-4 text-right">Overrun / Under</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {budgets.map((b: BudgetRecord) => {
                    const diff = b.budgeted - b.actual;
                    const percent = Math.min(100, (b.actual / b.budgeted) * 100);
                    const overrun = b.actual > b.budgeted;
                    
                    return (
                      <tr key={b.category} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-semibold text-text-primary">{b.category}</td>
                        <td className="p-4 text-right font-medium text-text-primary">{formatCurrency(b.budgeted)}</td>
                        <td className="p-4 text-right font-semibold text-text-primary">{formatCurrency(b.actual)}</td>
                        <td className="p-4 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-full bg-gray-100 rounded-circular overflow-hidden">
                              <div 
                                className={`h-full rounded-circular transition-all duration-500 ${overrun ? "bg-error" : "bg-primary"}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="font-bold text-text-secondary text-[10px]">{percent.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className={`p-4 text-right font-semibold ${overrun ? "text-error" : "text-success"}`}>
                          {overrun ? `+${formatCurrency(Math.abs(diff))}` : `-${formatCurrency(Math.abs(diff))}`}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 font-bold text-[10px] rounded-circular border
                            ${overrun ? "bg-error-light text-error border-error/20 animate-pulse" : "bg-success-light text-success border-success/20"}`}
                          >
                            {overrun ? "Overrun" : "Under"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 text-[11px] text-text-secondary flex justify-between">
            <span>Any budget overruns are automatically highlighted in the system control panel.</span>
            <span>Allocated targets set for Fiscal 2026.</span>
          </div>
        </div>

        {/* Forecast Area line chart */}
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">Predictive Spending Curve</h3>
            <p className="text-xs text-text-secondary">Historical actual spends linked with AI-modeled monthly projections.</p>
            
            <div className="mt-6">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible select-none">
                {/* Horizontal gridlines */}
                {[0, 1, 2, 3, 4].map((grid, index) => {
                  const y = svgH - padB - (index / 4) * (svgH - padB - padT);
                  const val = minVal + (index / 4) * (maxVal - minVal);
                  return (
                    <g key={grid}>
                      <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                      <text x={padL - 8} y={y + 4} textAnchor="end" className="text-[9px] font-medium fill-text-muted">
                        ₹{(val / 1000).toFixed(0)}k
                      </text>
                    </g>
                  );
                })}

                <path d={trendPath} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />

                {/* Subdivide into actual line vs forecast line */}
                {points.map((p, idx) => {
                  const item = forecastTrend[idx];
                  const isForecast = item.type === "forecast";
                  
                  return (
                    <g key={idx}>
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={isForecast ? "3" : "4"} 
                        fill={isForecast ? "#FFFFFF" : "#6366F1"} 
                        stroke="#6366F1" 
                        strokeWidth="2" 
                      />
                      <text x={p.x} y={svgH - 8} textAnchor="middle" className="text-[8px] font-semibold fill-text-secondary">
                        {item.label}
                      </text>
                      <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[8px] font-bold fill-indigo-600">
                        ₹{(item.cost / 1000).toFixed(0)}k
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
            <div className="flex gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-circular bg-indigo-600" />
                <span>Actuals</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-circular border border-indigo-600 bg-white" />
                <span>AI Forecast</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Budget optimization insights panel */}
      <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col md:flex-row gap-4 items-start">
        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-circular flex items-center justify-center shrink-0">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-text-primary text-sm">AI Spend Projections & Budget Optimization</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Based on current actual expenditures, total expenses are on track to close Q3 at <strong>98.2% of budgeted limits</strong>.
            However, <strong>Repairs</strong> have currently exceeded targets by <strong>13.6% (₹3,400 overrun)</strong>, driven by Scania gearbox maintenance issues.
            We recommend prioritizing the transition of long-distance cargo tasks to the <strong>Tesla Semi EV fleet</strong>. This is forecasted to recoup ₹14,000 in fuel allocation buffers next month, fully absorbing the maintenance deficit.
          </p>
        </div>
      </div>

    </div>
  );
}
