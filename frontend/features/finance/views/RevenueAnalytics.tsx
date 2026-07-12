"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  Calendar, 
  Filter, 
  Search,
  IndianRupee,
  Route,
  Truck,
  ArrowUpRight,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { loadFinanceData, TripProfitabilityRecord } from "../mockData";

export default function RevenueAnalytics() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  const [dateFilter, setDateFilter] = useState<"7days" | "30days" | "year">("30days");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<"All" | "Diesel" | "Electric">("All");
  const [routeSearch, setRouteSearch] = useState("");

  useEffect(() => {
    setFinanceData(loadFinanceData());
    const handleUpdate = () => setFinanceData(loadFinanceData());
    window.addEventListener("finance_data_update", handleUpdate);
    return () => window.removeEventListener("finance_data_update", handleUpdate);
  }, []);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. Dynamic Calculations & Filters
  const analytics = useMemo(() => {
    if (!financeData) return null;

    const { tripProfitability } = financeData;

    // Filter trips
    const filteredTrips = tripProfitability.filter((t: TripProfitabilityRecord) => {
      // Route search filter
      const matchesRoute = t.route.toLowerCase().includes(routeSearch.toLowerCase());
      
      // Vehicle type filter
      let matchesVehicle = true;
      if (vehicleTypeFilter === "Diesel") {
        matchesVehicle = !t.vehicleNumber.includes("EE") && !t.vehicleNumber.includes("OP");
      } else if (vehicleTypeFilter === "Electric") {
        matchesVehicle = t.vehicleNumber.includes("EE") || t.vehicleNumber.includes("OP");
      }

      return matchesRoute && matchesVehicle;
    });

    // Sum revenue
    const totalRev = filteredTrips.reduce((sum: number, t: TripProfitabilityRecord) => sum + t.revenue, 0);
    const avgRevPerTrip = filteredTrips.length > 0 ? totalRev / filteredTrips.length : 0;

    // Aggregate by route
    const routeRevenue: Record<string, number> = {};
    filteredTrips.forEach((t: TripProfitabilityRecord) => {
      routeRevenue[t.route] = (routeRevenue[t.route] || 0) + t.revenue;
    });

    const sortedRoutes = Object.entries(routeRevenue)
      .map(([name, val]) => ({ name, val }))
      .sort((a, b) => b.val - a.val);

    // Aggregate by vehicle
    const vehicleRevenue: Record<string, number> = {};
    filteredTrips.forEach((t: TripProfitabilityRecord) => {
      const label = `${t.vehicleNumber} (${t.vehicleNumber.includes("EE") || t.vehicleNumber.includes("OP") ? "EV" : "Diesel"})`;
      vehicleRevenue[label] = (vehicleRevenue[label] || 0) + t.revenue;
    });

    const sortedVehicles = Object.entries(vehicleRevenue)
      .map(([name, val]) => ({ name, val }))
      .sort((a, b) => b.val - a.val);

    return {
      filteredTrips,
      totalRev,
      avgRevPerTrip,
      sortedRoutes,
      sortedVehicles
    };
  }, [financeData, vehicleTypeFilter, routeSearch]);

  if (!financeData || !analytics) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { filteredTrips, totalRev, avgRevPerTrip, sortedRoutes, sortedVehicles } = analytics;

  // Mock revenue trend data depending on date filter
  const trendData = (() => {
    if (dateFilter === "7days") {
      return [
        { label: "Mon", val: 32000 },
        { label: "Tue", val: 41000 },
        { label: "Wed", val: 38000 },
        { label: "Thu", val: 49000 },
        { label: "Fri", val: 45000 },
        { label: "Sat", val: 52000 },
        { label: "Sun", val: 58000 }
      ];
    } else if (dateFilter === "year") {
      return [
        { label: "Q1", val: 890000 },
        { label: "Q2", val: 980000 },
        { label: "Q3", val: 1040000 },
        { label: "Q4", val: 1120000 }
      ];
    } else {
      // 30 days summary (4 weeks)
      return [
        { label: "Week 1", val: 78000 },
        { label: "Week 2", val: 85000 },
        { label: "Week 3", val: 92000 },
        { label: "Week 4", val: 87500 }
      ];
    }
  })();

  // SVG Trend Chart Variables
  const trendVals = trendData.map(d => d.val);
  const maxTrendVal = Math.max(...trendVals) * 1.15;
  const minTrendVal = 0;
  const svgW = 550;
  const svgH = 160;
  const padL = 50;
  const padR = 15;
  const padT = 15;
  const padB = 25;

  const getCoordinates = (idx: number, val: number) => {
    const total = trendData.length;
    const x = padL + (idx / (total - 1)) * (svgW - padL - padR);
    const y = svgH - padB - ((val - minTrendVal) / (maxTrendVal - minTrendVal)) * (svgH - padB - padT);
    return { x, y };
  };

  const trendPoints = trendData.map((d, i) => getCoordinates(i, d.val));
  const trendPath = trendPoints.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, "");
  const trendArea = trendPoints.length > 0
    ? `${trendPath} L ${trendPoints[trendPoints.length - 1].x} ${svgH - padB} L ${trendPoints[0].x} ${svgH - padB} Z`
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="revenue-analytics-title">Revenue Analytics</h1>
          <p className="text-sm text-text-secondary">Analyze sources of income, top-performing delivery corridors, and vehicle asset yields.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["7days", "30days", "year"].map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f as any)}
              className={`h-9 px-3 rounded-m text-xs font-semibold border transition-all cursor-pointer ${dateFilter === f ? "bg-primary text-text-on-primary border-primary shadow-small" : "bg-surface-app text-text-secondary border-border-app hover:bg-gray-50"}`}
            >
              {f === "7days" ? "7 Days" : f === "30days" ? "30 Days" : "Full Year"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-primary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Gross Revenue Yield</span>
            <div className="text-2xl font-bold text-text-primary">{formatCurrency(totalRev)}</div>
            <span className="text-[10px] text-text-muted">Filtered based on active query</span>
          </div>
          <div className="h-10 w-10 bg-primary-light text-primary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-secondary/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Average Bill/Trip</span>
            <div className="text-2xl font-bold text-text-primary">{formatCurrency(avgRevPerTrip)}</div>
            <span className="text-[10px] text-text-muted">Total divided by {filteredTrips.length} active trips</span>
          </div>
          <div className="h-10 w-10 bg-secondary-light text-secondary rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <Route size={20} />
          </div>
        </div>
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex items-center justify-between group hover:border-success/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase">Revenue Growth</span>
            <div className="text-2xl font-bold text-success">+9.4% YoY</div>
            <span className="text-[10px] text-success font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={12} />
              <span>Above annual target</span>
            </span>
          </div>
          <div className="h-10 w-10 bg-success-light text-success rounded-m flex items-center justify-center shadow-small group-hover:scale-105 transition-all">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search active routes (e.g. Pune, Bangalore)..."
            value={routeSearch}
            onChange={(e) => setRouteSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-secondary" />
          <select
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value as any)}
            className="h-9 border border-border-app rounded-m text-xs px-3 bg-gray-50 text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="All">All Vehicle Types</option>
            <option value="Diesel">Diesel Assets Only</option>
            <option value="Electric">Electric Assets Only</option>
          </select>
        </div>
      </div>

      {/* Trend & Route/Vehicle Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">Revenue Velocity</h3>
            <p className="text-xs text-text-secondary">Gross sales progression matching the selected time envelope.</p>
            
            <div className="mt-6">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible select-none">
                {/* Gridlines */}
                {[0, 1, 2, 3, 4].map((grid, index) => {
                  const y = svgH - padB - (index / 4) * (svgH - padB - padT);
                  const val = minTrendVal + (index / 4) * (maxTrendVal - minTrendVal);
                  return (
                    <g key={grid}>
                      <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                      <text x={padL - 8} y={y + 4} textAnchor="end" className="text-[9px] font-medium fill-text-muted">
                        ₹{val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                      </text>
                    </g>
                  );
                })}

                <path d={trendArea} fill="url(#revAnalyticsGrad)" opacity="0.1" />
                <path d={trendPath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

                <defs>
                  <linearGradient id="revAnalyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {trendData.map((d, idx) => {
                  const p = trendPoints[idx];
                  return (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
                      <text x={p.x} y={svgH - 8} textAnchor="middle" className="text-[10px] font-semibold fill-text-secondary">
                        {d.label}
                      </text>
                      {/* Floating numbers on points */}
                      <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[9px] font-bold fill-primary">
                        ₹{d.val >= 100000 ? `${(d.val / 100000).toFixed(1)}L` : `${(d.val / 1000).toFixed(0)}k`}
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
              <span>Earnings peaked in {dateFilter === "7days" ? "Sunday" : dateFilter === "year" ? "Q4" : "Week 3"} due to retail shipment dispatches.</span>
            </span>
          </div>
        </div>

        {/* Route / Vehicle Leaderboard Bar Chart */}
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">Yield by Corridor</h3>
            <p className="text-xs text-text-secondary">Total revenue generated by the top 4 active routes.</p>
            
            <div className="mt-6 space-y-4">
              {sortedRoutes.slice(0, 4).map((route, idx) => {
                const maxVal = sortedRoutes[0]?.val || 1;
                const percent = (route.val / maxVal) * 100;
                
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-primary truncate max-w-[150px]">{route.name}</span>
                      <span className="font-bold text-text-primary">{formatCurrency(route.val)}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-circular transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {sortedRoutes.length === 0 && (
                <div className="text-center text-xs text-text-secondary py-12">No active routes matching query filters.</div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-text-secondary flex justify-between items-center">
            <span>EV vs Diesel yields can be filtered.</span>
          </div>
        </div>

      </div>

      {/* Grid: Revenue by Vehicle and Top Performing Trips list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue by Vehicle */}
        <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">Asset Revenue Yield</h3>
            <p className="text-xs text-text-secondary">Billing contribution of individual fleet vehicles.</p>
            
            <div className="mt-6 space-y-4">
              {sortedVehicles.slice(0, 5).map((veh, idx) => {
                const maxVal = sortedVehicles[0]?.val || 1;
                const percent = (veh.val / maxVal) * 100;
                
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-semibold text-text-primary truncate">{veh.name}</span>
                      <span className="font-bold text-text-primary">{formatCurrency(veh.val)}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-circular transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-text-muted">
            Includes both EV Semis & conventional Heavy Diesel assets.
          </div>
        </div>

        {/* Top Performing Trips Table (List of all filtered trips) */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-m shadow-card flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border-app">
              <h3 className="font-semibold text-text-primary">Trip Yields Ledger</h3>
              <p className="text-xs text-text-secondary">Granular revenue breakdown of matching dispatched trips.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary">
                    <th className="p-4">Trip #</th>
                    <th className="p-4">Route Segment</th>
                    <th className="p-4">Driver Name</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredTrips.map((trip: TripProfitabilityRecord) => (
                    <tr key={trip.tripNumber} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono font-semibold text-primary">{trip.tripNumber}</td>
                      <td className="p-4 text-text-primary font-medium">{trip.route}</td>
                      <td className="p-4 text-text-secondary">{trip.driverName}</td>
                      <td className="p-4 font-mono text-text-secondary">{trip.vehicleNumber}</td>
                      <td className="p-4 text-right font-bold text-text-primary">{formatCurrency(trip.revenue)}</td>
                    </tr>
                  ))}
                  {filteredTrips.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs text-text-secondary">
                        No trips matches search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-[11px] text-text-secondary flex justify-between">
            <span>Aggregated results represent 100% data integrity.</span>
            <span>Total rows: {filteredTrips.length}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
