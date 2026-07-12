"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  CreditCard, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Fuel,
  Wrench,
  User,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { loadFinanceData, resetFinanceData, ExpenseRecord, MonthlyTrend, BudgetRecord } from "../mockData";

export default function FinancialDashboard() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  const [activeTrendIndex, setActiveTrendIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data from localStorage (or fallback to defaults)
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setFinanceData(loadFinanceData());
      setIsRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    setFinanceData(loadFinanceData());

    // Listen for global data updates
    const handleUpdate = () => {
      setFinanceData(loadFinanceData());
    };
    window.addEventListener("finance_data_update", handleUpdate);
    return () => window.removeEventListener("finance_data_update", handleUpdate);
  }, []);

  // Format currency in Lakhs or standard INR format
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  // 1. Calculations based on dynamic state
  const computedStats = useMemo(() => {
    if (!financeData) return null;

    const { expenses, tripProfitability, budgets } = financeData;

    // Calculate category totals
    const categoryTotals: Record<string, number> = {
      Fuel: 0,
      Maintenance: 0,
      "Driver Salary": 0,
      Toll: 0,
      Insurance: 0,
      Repairs: 0,
      Miscellaneous: 0
    };

    expenses.forEach((e: ExpenseRecord) => {
      if (categoryTotals[e.category] !== undefined) {
        categoryTotals[e.category] += e.amount;
      } else {
        categoryTotals["Miscellaneous"] += e.amount;
      }
    });

    const totalExp = Object.values(categoryTotals).reduce((sum: number, v: number) => sum + v, 0);

    // Dynamic budgets overrun warning
    const overrunBudgets = budgets.filter((b: BudgetRecord) => b.actual > b.budgeted);

    return {
      categoryTotals,
      totalExp,
      overrunBudgets
    };
  }, [financeData]);

  if (!financeData || !computedStats) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-text-secondary">Loading financial ledger...</span>
        </div>
      </div>
    );
  }

  const { kpis, monthlyTrends, expenses, tripProfitability, insights } = financeData;
  const { categoryTotals, totalExp, overrunBudgets } = computedStats;

  // Conic gradient string generator for donut chart
  const donutGradient = (() => {
    let cumulativePercent = 0;
    const colors = [
      "#2563EB", // Fuel - Blue
      "#0F766E", // Maintenance - Teal
      "#F59E0B", // Driver Salary - Amber
      "#10B981", // Toll - Green
      "#8B5CF6", // Insurance - Purple
      "#EF4444", // Repairs - Red
      "#6B7280"  // Misc - Gray
    ];
    
    const segments = Object.entries(categoryTotals).map(([cat, amount], idx) => {
      const pct = totalExp > 0 ? (amount / totalExp) * 100 : 0;
      const start = cumulativePercent;
      cumulativePercent += pct;
      return {
        cat,
        pct,
        start,
        end: cumulativePercent,
        color: colors[idx % colors.length]
      };
    });

    const gradientStr = segments
      .map(s => `${s.color} ${s.start.toFixed(1)}% ${s.end.toFixed(1)}%`)
      .join(", ");

    return {
      style: { background: `conic-gradient(${gradientStr})` },
      segments
    };
  })();

  // 2. SVG Revenue vs Expense Trend Configs
  const trendMax = 400000;
  const trendMin = 0;
  const chartWidth = 550;
  const chartHeight = 160;
  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const getCoordinates = (index: number, val: number) => {
    const totalPoints = monthlyTrends.length;
    const x = paddingLeft + (index / (totalPoints - 1)) * (chartWidth - paddingLeft - paddingRight);
    // Y-coordinate formula: mapping from values in [trendMin, trendMax] to [chartHeight - paddingBottom, paddingTop]
    const y = chartHeight - paddingBottom - ((val - trendMin) / (trendMax - trendMin)) * (chartHeight - paddingBottom - paddingTop);
    return { x, y };
  };

  // Generate SVG paths
  const revenuePoints = monthlyTrends.map((t: MonthlyTrend, idx: number) => getCoordinates(idx, t.revenue));
  const expensesPoints = monthlyTrends.map((t: MonthlyTrend, idx: number) => getCoordinates(idx, t.expenses));

  const revenuePath = revenuePoints.reduce((path: string, p: { x: number, y: number }, idx: number) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  const expensesPath = expensesPoints.reduce((path: string, p: { x: number, y: number }, idx: number) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  const revenueArea = revenuePoints.length > 0 
    ? `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x} ${chartHeight - paddingBottom} L ${revenuePoints[0].x} ${chartHeight - paddingBottom} Z`
    : "";

  const expensesArea = expensesPoints.length > 0 
    ? `${expensesPath} L ${expensesPoints[expensesPoints.length - 1].x} ${chartHeight - paddingBottom} L ${expensesPoints[0].x} ${chartHeight - paddingBottom} Z`
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="finance-dashboard-title">Financial Control Dashboard</h1>
          <p className="text-sm text-text-secondary">Executive overview of financial health, operating costs, margins, and AI budget analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex h-9 items-center justify-center gap-1.5 px-3 rounded-m border border-border-app bg-surface-app text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors shadow-small disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>Sync Ledger</span>
          </button>
          <button
            onClick={() => {
              if (confirm("Reset financial logs back to original mock defaults?")) {
                resetFinanceData();
                alert("Finance data reset successfully!");
              }
            }}
            className="flex h-9 items-center justify-center gap-1.5 px-3 rounded-m bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-text-secondary transition-colors"
          >
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Revenue",
            value: formatCurrency(kpis.revenue),
            subtext: "LTD Earnings",
            trend: `+${kpis.revenueTrend}%`,
            trendUp: true,
            icon: TrendingUp,
            color: "text-primary",
            bgColor: "bg-primary-light"
          },
          {
            title: "Operating Expenses",
            value: formatCurrency(kpis.expenses),
            subtext: "Including Salaries & Fuel",
            trend: `${kpis.expensesTrend}%`,
            trendUp: false, // Downward expense trend is positive
            icon: CreditCard,
            color: "text-secondary",
            bgColor: "bg-secondary-light"
          },
          {
            title: "Net Profit",
            value: formatCurrency(kpis.netProfit),
            subtext: "Gross Revenue - Costs",
            trend: `+${kpis.netProfitTrend}%`,
            trendUp: true,
            icon: IndianRupee,
            color: "text-success",
            bgColor: "bg-success-light"
          },
          {
            title: "Profit Margin",
            value: `${kpis.profitMargin}%`,
            subtext: "Avg. profitability rate",
            trend: `+${kpis.profitMarginTrend}%`,
            trendUp: true,
            icon: TrendingUp,
            color: "text-info",
            bgColor: "bg-info-light"
          }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{card.title}</span>
                  <div className="text-2xl font-bold text-text-primary mt-1">{card.value}</div>
                </div>
                <div className={`h-10 w-10 rounded-m ${card.bgColor} ${card.color} flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={20} />
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-text-muted">{card.subtext}</span>
                <span className={`font-semibold flex items-center gap-0.5 ${card.trendUp ? "text-success" : "text-error"}`}>
                  {card.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exception Alerts Banner (if budget overrun exists) */}
      {overrunBudgets.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-error-light border border-error/20 rounded-m text-error animate-fadeIn">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold">Financial Alerts: Departmental Budget Breaches Detected</h4>
            <p className="text-xs text-error/90 mt-1">
              Actual expenditures have exceeded budgeted allocations in the following categories:{" "}
              {overrunBudgets.map((b: BudgetRecord) => `${b.category} (+₹${(b.actual - b.budgeted).toLocaleString()})`).join(", ")}.
              Review budgets inside the forecasts tab.
            </p>
          </div>
          <Link href="/budgets-forecasts" className="text-xs font-bold underline hover:text-error/85 transition-colors self-center">
            Review Budgets
          </Link>
        </div>
      )}

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue vs Expenses Trend Line/Area Chart */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-m shadow-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Operating Trends</h3>
                <p className="text-xs text-text-secondary">Monthly comparison of gross revenue vs operating costs.</p>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-text-primary">
                  <div className="h-2 w-3 rounded-full bg-primary" />
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-text-primary">
                  <div className="h-2 w-3 rounded-full bg-teal-700" />
                  <span>Expenses</span>
                </div>
              </div>
            </div>
            
            {/* Interactive SVG Chart */}
            <div className="mt-6 relative">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-auto overflow-visible select-none"
              >
                {/* Horizontal Gridlines */}
                {[0, 1, 2, 3, 4].map((grid, index) => {
                  const val = trendMin + (index / 4) * (trendMax - trendMin);
                  const y = chartHeight - paddingBottom - (index / 4) * (chartHeight - paddingBottom - paddingTop);
                  return (
                    <g key={grid}>
                      <line 
                        x1={paddingLeft} 
                        y1={y} 
                        x2={chartWidth - paddingRight} 
                        y2={y} 
                        stroke="#F1F5F9" 
                        strokeWidth="1" 
                      />
                      <text 
                        x={paddingLeft - 8} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="text-[9px] font-medium fill-text-muted"
                      >
                        {val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Areas */}
                <path d={revenueArea} fill="url(#revenueGrad)" opacity="0.1" />
                <path d={expensesArea} fill="url(#expenseGrad)" opacity="0.08" />

                {/* Line Paths */}
                <path 
                  d={revenuePath} 
                  fill="none" 
                  stroke="#2563EB" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d={expensesPath} 
                  fill="none" 
                  stroke="#0F766E" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F766E" />
                    <stop offset="100%" stopColor="#0F766E" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Data point circles and hover indicators */}
                {monthlyTrends.map((t: MonthlyTrend, idx: number) => {
                  const revP = revenuePoints[idx];
                  const expP = expensesPoints[idx];
                  const active = activeTrendIndex === idx;

                  return (
                    <g key={idx}>
                      {/* Vertical line indicator on active hover */}
                      {active && (
                        <line 
                          x1={revP.x} 
                          y1={paddingTop} 
                          x2={revP.x} 
                          y2={chartHeight - paddingBottom} 
                          stroke="#94A3B8" 
                          strokeWidth="1.5" 
                          strokeDasharray="4 4" 
                        />
                      )}
                      
                      {/* Points */}
                      <circle 
                        cx={revP.x} 
                        cy={revP.y} 
                        r={active ? 5 : 3} 
                        fill="#FFFFFF" 
                        stroke="#2563EB" 
                        strokeWidth={active ? 3 : 2} 
                      />
                      <circle 
                        cx={expP.x} 
                        cy={expP.y} 
                        r={active ? 5 : 3} 
                        fill="#FFFFFF" 
                        stroke="#0F766E" 
                        strokeWidth={active ? 3 : 2} 
                      />

                      {/* X-Axis labels */}
                      <text 
                        x={revP.x} 
                        y={chartHeight - 8} 
                        textAnchor="middle" 
                        className={`text-[10px] font-semibold transition-colors ${active ? "fill-primary" : "fill-text-secondary"}`}
                      >
                        {t.month}
                      </text>
                    </g>
                  );
                })}

                {/* Invisible hover zones */}
                {monthlyTrends.map((t: MonthlyTrend, idx: number) => {
                  const revP = revenuePoints[idx];
                  const sliceWidth = (chartWidth - paddingLeft - paddingRight) / (monthlyTrends.length - 1);
                  const hoverX = revP.x - sliceWidth / 2;
                  
                  return (
                    <rect
                      key={idx}
                      x={idx === 0 ? paddingLeft : hoverX}
                      y={paddingTop}
                      width={idx === 0 || idx === monthlyTrends.length - 1 ? sliceWidth / 2 : sliceWidth}
                      height={chartHeight - paddingTop - paddingBottom}
                      fill="transparent"
                      className="cursor-crosshair"
                      onMouseEnter={() => setActiveTrendIndex(idx)}
                      onMouseLeave={() => setActiveTrendIndex(null)}
                    />
                  );
                })}
              </svg>

              {/* Chart Tooltip Overlay */}
              {activeTrendIndex !== null && (
                <div 
                  className="absolute bg-surface-app border border-border-app p-3 rounded-m shadow-dialog text-xs space-y-1.5 animate-fadeIn z-10"
                  style={{
                    left: `${Math.min(380, Math.max(70, getCoordinates(activeTrendIndex, 0).x - 60))}px`,
                    top: "10px"
                  }}
                >
                  <div className="font-semibold text-text-primary border-b border-gray-100 pb-1 text-center">
                    {monthlyTrends[activeTrendIndex].month} 2026 Summary
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-text-secondary">Revenue:</span>
                    <span className="font-semibold text-primary">{formatCurrency(monthlyTrends[activeTrendIndex].revenue)}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-text-secondary">Expenses:</span>
                    <span className="font-semibold text-teal-700">{formatCurrency(monthlyTrends[activeTrendIndex].expenses)}</span>
                  </div>
                  <div className="flex justify-between gap-6 border-t border-dashed border-gray-100 pt-1">
                    <span className="text-text-secondary">Net Profit:</span>
                    <span className="font-bold text-success">{formatCurrency(monthlyTrends[activeTrendIndex].netProfit)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-text-secondary flex justify-between items-center">
            <span>Hover over chart columns to view granular monthly figures.</span>
            <Link href="/revenue-analytics" className="text-primary font-semibold hover:underline flex items-center gap-0.5">
              <span>View Revenue Details</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Expenses Category breakdown Donut chart */}
        <div className="bg-surface-app border border-border-app rounded-m shadow-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">Expense Categories</h3>
            <p className="text-xs text-text-secondary">Current category breakdown of ₹{totalExp.toLocaleString()} operating costs.</p>
            
            {/* Conic Gradient Donut Container */}
            <div className="mt-6 flex justify-center">
              <div 
                className="h-[130px] w-[130px] rounded-circular relative flex items-center justify-center shadow-small transition-transform hover:scale-[1.02] duration-200"
                style={donutGradient.style}
              >
                {/* Center Cutout */}
                <div className="h-[84px] w-[84px] rounded-circular bg-surface-app shadow-inner flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Total spend</span>
                  <span className="text-sm font-bold text-text-primary mt-0.5">
                    ₹{totalExp >= 100000 ? `${(totalExp / 100000).toFixed(2)}L` : totalExp.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Segment Labels Grid */}
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {donutGradient.segments.slice(0, 6).map((seg, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-circular shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-text-secondary truncate flex-1">{seg.cat}</span>
                  <span className="font-bold text-text-primary">{seg.pct.toFixed(0)}%</span>
                </div>
              ))}
              <div className="flex items-center gap-2 col-span-2 border-t border-gray-100 pt-2 mt-1">
                <div className="h-2 w-2 rounded-circular bg-gray-500 shrink-0" />
                <span className="text-text-secondary truncate flex-1">Miscellaneous</span>
                <span className="font-bold text-text-primary">
                  {((categoryTotals["Miscellaneous"] / totalExp) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
            <span className="text-text-muted">Dynamic updates enabled</span>
            <Link href="/expense-management" className="text-primary font-semibold hover:underline flex items-center gap-0.5">
              <span>Manage Expenses</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* Lower Row: Top Cost Vehicles + Recent Financial Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Top Cost-Incurring Vehicles */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-m shadow-card flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border-app flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Fleet Cost Summary</h3>
                <p className="text-xs text-text-secondary">Comparison of operational costs for high-utilization vehicles.</p>
              </div>
              <Link href="/fuel-cost-analysis" className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
                <span>Fuel analysis</span>
                <ExternalLink size={12} />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary">
                    <th className="p-4">Reg Number</th>
                    <th className="p-4">Vehicle Model</th>
                    <th className="p-4">Engine Type</th>
                    <th className="p-4 text-right">Distance (km)</th>
                    <th className="p-4 text-right">Total Cost</th>
                    <th className="p-4 text-right">Cost/km</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {[
                    { reg: "MH-12-AS-4501", model: "Scania R500", type: "Diesel", dist: 12200, cost: 42944, costKm: 3.52 },
                    { reg: "MH-12-JK-8821", model: "Volvo FH16", type: "Diesel", dist: 14500, cost: 47850, costKm: 3.30 },
                    { reg: "MH-12-TR-3340", model: "Kenworth T680", type: "Diesel", dist: 8800, cost: 27104, costKm: 3.08 },
                    { reg: "MH-12-OP-1102", model: "Tesla Semi (Gen 1)", type: "Electric", dist: 15400, cost: 7700, costKm: 0.50 },
                    { reg: "MH-12-EE-9011", model: "Tesla Semi (Gen 2)", type: "Electric", dist: 18200, cost: 8372, costKm: 0.46 }
                  ].map((v) => (
                    <tr key={v.reg} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono font-semibold text-text-primary">{v.reg}</td>
                      <td className="p-4 text-text-secondary">{v.model}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 font-semibold text-[10px] rounded-circular border ${v.type === "Electric" ? "bg-success-light text-success border-success/20" : "bg-warning-light text-warning border-warning/20"}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-text-primary">{v.dist.toLocaleString()}</td>
                      <td className="p-4 text-right font-semibold text-text-primary">₹{v.cost.toLocaleString()}</td>
                      <td className="p-4 text-right font-medium text-text-primary">₹{v.costKm.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-[11px] text-text-secondary flex justify-between">
            <span>Electric freight assets demonstrate a 85% cost advantage per km.</span>
            <Link href="/trip-profitability" className="font-semibold text-primary hover:underline">Compare Profit Margins</Link>
          </div>
        </div>

        {/* Right Column: Recent Financial Transactions Feed */}
        <div className="bg-surface-app border border-border-app rounded-m shadow-card flex flex-col justify-between p-5">
          <div className="space-y-4">
            <div className="pb-3 border-b border-border-app flex justify-between items-center">
              <h3 className="font-semibold text-text-primary">Recent Transactions</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-text-secondary text-[10px] font-bold rounded-circular">
                Ledger feed
              </span>
            </div>

            <div className="space-y-3">
              {expenses.slice(0, 4).map((exp: ExpenseRecord) => {
                const getIconConfig = (cat: string) => {
                  switch (cat) {
                    case "Fuel": return { icon: Fuel, color: "text-primary bg-primary-light" };
                    case "Maintenance":
                    case "Repairs": return { icon: Wrench, color: "text-teal-700 bg-teal-50" };
                    case "Driver Salary": return { icon: User, color: "text-amber-600 bg-amber-50" };
                    default: return { icon: CreditCard, color: "text-gray-500 bg-gray-100" };
                  }
                };
                const config = getIconConfig(exp.category);
                const TransIcon = config.icon;

                return (
                  <div key={exp.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-m transition-colors">
                    <div className={`h-8 w-8 rounded-m flex items-center justify-center shrink-0 ${config.color}`}>
                      <TransIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-primary truncate">{exp.description}</span>
                        <span className="text-xs font-bold text-text-primary shrink-0">₹{exp.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-text-secondary">
                        <span>{exp.category} • {exp.expenseDate}</span>
                        <span className="flex items-center gap-0.5 text-success font-semibold">
                          <ShieldCheck size={12} />
                          <span>Approved</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
            <span className="text-text-muted">Showing 4 most recent</span>
            <Link href="/expense-management" className="text-primary font-semibold hover:underline flex items-center gap-0.5">
              <span>View Ledger</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* AI Financial Insights Highlight Widget */}
      <div className="bg-surface-app border border-border-app p-4 rounded-m shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-circular bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">AI Financial Insights Highlight</h4>
            <p className="text-xs text-text-secondary mt-0.5">
              "{insights[1]?.text || 'Loading insights...'}"
            </p>
          </div>
        </div>
        <Link 
          href="/financial-insights" 
          className="h-8 shrink-0 flex items-center justify-center px-3 rounded-m border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 text-xs font-semibold transition-colors"
        >
          Explore All AI Insights
        </Link>
      </div>
    </div>
  );
}
