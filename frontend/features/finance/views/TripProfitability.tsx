"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  Route, 
  IndianRupee, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  Truck,
  User
} from "lucide-react";
import { loadFinanceData, TripProfitabilityRecord } from "../mockData";

export default function TripProfitability() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  const [sortBy, setSortBy] = useState<"margin" | "revenue" | "netProfit">("margin");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [routeFilter, setRouteFilter] = useState("All");

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

  // 1. Calculations & Sorting
  const processedData = useMemo(() => {
    if (!financeData) return null;

    const { tripProfitability } = financeData;

    // Filter trips
    const filteredTrips = tripProfitability.filter((t: TripProfitabilityRecord) => {
      if (routeFilter === "All") return true;
      return t.route.includes(routeFilter);
    });

    // Sort trips
    const sortedTrips = [...filteredTrips].sort((a: TripProfitabilityRecord, b: TripProfitabilityRecord) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (sortOrder === "desc") {
        return (valB as number) - (valA as number);
      } else {
        return (valA as number) - (valB as number);
      }
    });

    // Compute aggregate metrics
    const totalRev = filteredTrips.reduce((sum: number, t: TripProfitabilityRecord) => sum + t.revenue, 0);
    const totalCost = filteredTrips.reduce((sum: number, t: TripProfitabilityRecord) => sum + t.totalExpenses, 0);
    const totalProfit = totalRev - totalCost;
    const avgMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;

    // Route profitability comparison
    const routeMargins: Record<string, { rev: number, cost: number }> = {};
    tripProfitability.forEach((t: TripProfitabilityRecord) => {
      if (!routeMargins[t.route]) {
        routeMargins[t.route] = { rev: 0, cost: 0 };
      }
      routeMargins[t.route].rev += t.revenue;
      routeMargins[t.route].cost += t.totalExpenses;
    });

    const routeMarginLeaderboard = Object.entries(routeMargins).map(([name, data]) => {
      const profit = data.rev - data.cost;
      const margin = data.rev > 0 ? (profit / data.rev) * 100 : 0;
      return { name, margin };
    }).sort((a, b) => b.margin - a.margin);

    return {
      sortedTrips,
      totalRev,
      totalProfit,
      avgMargin,
      routeMarginLeaderboard
    };
  }, [financeData, sortBy, sortOrder, routeFilter]);

  if (!financeData || !processedData) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { sortedTrips, totalRev, totalProfit, avgMargin, routeMarginLeaderboard } = processedData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="trip-profitability-title">Trip & Route Profitability</h1>
          <p className="text-sm text-text-secondary">Analyze net operating margins of individual dispatches by overlaying revenues against driver, toll, fuel, and maintenance indices.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="h-9 border border-border-app rounded-m text-xs px-3 bg-surface-app text-text-primary focus:outline-none cursor-pointer shadow-small"
          >
            <option value="All">All Highway Corridors</option>
            <option value="Pune">Pune Express</option>
            <option value="Bangalore">Bangalore Corridor</option>
            <option value="Mumbai">Mumbai Route</option>
            <option value="Delhi">Delhi Route</option>
          </select>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-primary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Aggregate Net Margin</span>
            <div className="text-2xl font-bold text-text-primary">{avgMargin.toFixed(1)}%</div>
            <span className="text-[10px] text-text-muted">Target operational goal is 35%</span>
          </div>
          <div className="h-10 w-10 bg-primary-light text-primary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-secondary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Total Net Profit</span>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalProfit)}</div>
            <span className="text-[10px] text-text-muted">Gross: {formatCurrency(totalRev)}</span>
          </div>
          <div className="h-10 w-10 bg-secondary-light text-secondary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-success/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Highest Margin Corridor</span>
            <div className="text-2xl font-bold text-text-primary">
              {routeMarginLeaderboard[0]?.margin.toFixed(0)}% Margin
            </div>
            <span className="text-[10px] text-text-muted truncate block max-w-[200px]">
              {routeMarginLeaderboard[0]?.name}
            </span>
          </div>
          <div className="h-10 w-10 bg-success-light text-success rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <Route size={20} />
          </div>
        </div>
      </div>

      {/* Sorting / Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small items-center justify-between">
        <div className="text-xs font-semibold text-text-primary flex items-center gap-1.5 self-start sm:self-center">
          <span>Sort Ledger by:</span>
          {["margin", "revenue", "netProfit"].map((field) => (
            <button
              key={field}
              onClick={() => {
                if (sortBy === field) {
                  setSortOrder(o => o === "desc" ? "asc" : "desc");
                } else {
                  setSortBy(field as any);
                  setSortOrder("desc");
                }
              }}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-all cursor-pointer ${sortBy === field ? "bg-primary text-text-on-primary border-primary" : "bg-gray-50 text-text-secondary hover:bg-gray-100 border-border-app"}`}
            >
              {field === "margin" ? "Profit Margin" : field === "revenue" ? "Billing Yield" : "Net Profit"}
              {sortBy === field && (sortOrder === "desc" ? " ↓" : " ↑")}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-text-muted">
          Click column headers or sorting pills to arrange.
        </div>
      </div>

      {/* Main Profits Ledger Table */}
      <div className="bg-surface-app border border-border-app rounded-m shadow-card flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary">
                <th className="p-4">Trip Number</th>
                <th className="p-4">Route / Corridor</th>
                <th className="p-4">Asset / Driver</th>
                <th className="p-4 text-right">Billing Yield</th>
                <th className="p-4 text-right">Fuel Cost</th>
                <th className="p-4 text-right">Toll Cost</th>
                <th className="p-4 text-right">Driver Fee</th>
                <th className="p-4 text-right">Allocated Maint.</th>
                <th className="p-4 text-right">Net Profit</th>
                <th className="p-4 text-right">Operating Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {sortedTrips.map((t) => (
                <tr key={t.tripNumber} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-primary">{t.tripNumber}</td>
                  <td className="p-4 font-semibold text-text-primary">{t.route}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-text-secondary flex items-center gap-1">
                        <Truck size={10} className="text-text-muted" />
                        <span>{t.vehicleNumber}</span>
                      </span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <User size={10} className="text-text-muted" />
                        <span>{t.driverName}</span>
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-text-primary">{formatCurrency(t.revenue)}</td>
                  <td className="p-4 text-right text-text-secondary">{formatCurrency(t.fuelCost)}</td>
                  <td className="p-4 text-right text-text-secondary">{formatCurrency(t.tollCost)}</td>
                  <td className="p-4 text-right text-text-secondary">{formatCurrency(t.driverSalary)}</td>
                  <td className="p-4 text-right text-text-secondary">{formatCurrency(t.maintenanceCost)}</td>
                  <td className="p-4 text-right font-bold text-text-primary">{formatCurrency(t.netProfit)}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-block px-2.5 py-0.5 font-bold text-[10px] rounded-circular border
                      ${t.margin >= 65 ? "bg-success-light text-success border-success/20" : 
                        t.margin >= 55 ? "bg-info-light text-info border-info/20" : 
                        "bg-warning-light text-warning border-warning/20"}
                    `}>
                      {t.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-[11px] text-text-secondary flex justify-between">
          <span>Allocated maintenance cost calculated as standard wear-and-tear coefficients relative to kilometers run.</span>
          <span>Showing {sortedTrips.length} completed trips</span>
        </div>
      </div>

      {/* Margins Leaderboards by Highway Corridor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Route margins */}
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card">
          <h3 className="font-semibold text-text-primary text-sm">Corridor Net Margin Efficiency</h3>
          <p className="text-xs text-text-secondary">Average net operating margins by logistics highway segments.</p>
          
          <div className="mt-6 space-y-4">
            {routeMarginLeaderboard.map((item, idx) => {
              const margin = item.margin;
              
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-text-primary">{item.name}</span>
                    <span className="font-bold text-text-primary">{margin.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                    <div 
                      className={`h-full rounded-circular ${margin >= 65 ? "bg-success" : margin >= 55 ? "bg-primary" : "bg-warning"}`} 
                      style={{ width: `${margin}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI observations */}
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border-app">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <h3 className="font-semibold text-text-primary text-sm">AI Profitability Analysis</h3>
            </div>
            
            <ul className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <li className="flex gap-2 items-start">
                <span className="h-1.5 w-1.5 rounded-circular bg-primary mt-1.5 shrink-0" />
                <span><strong>EV Semis</strong> generate a <strong>74-76% margin</strong> compared to the diesel average of <strong>50-60%</strong>. Expanding EV logistics will boost net yield by ₹4.2 Lakhs annually.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="h-1.5 w-1.5 rounded-circular bg-primary mt-1.5 shrink-0" />
                <span>The <strong>Pune → Nagpur Corridor</strong> reports the lowest margin (50.0%) due to excessive tolls and diesel refueling cost spikes outside municipal zones.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="h-1.5 w-1.5 rounded-circular bg-primary mt-1.5 shrink-0" />
                <span>Reducing diesel route durations by 5% through dynamic GPS waypoint optimization will elevate average margin indices to 54.2%.</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 text-center p-2.5 bg-primary-light/50 border border-primary/10 rounded-m text-xs text-primary font-semibold">
            AI recommendations updated 1 hour ago
          </div>
        </div>
      </div>
    </div>
  );
}
