"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronDown, 
  Truck, 
  Activity, 
  Gauge, 
  Fuel, 
  Wrench, 
  Users, 
  Route, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Filter, 
  DollarSign, 
  Award,
  ChevronRight,
  ShieldAlert,
  BarChart4
} from "lucide-react";
import Link from "next/link";

// Mock Data Definitions
interface VehiclePerformance {
  id: string;
  model: string;
  driver: string;
  status: "Active" | "Idle" | "Maintenance" | "Offline";
  distanceCovered: number;
  fuelEfficiency: string; // e.g. "8.2 L/100km" or "0.45 kWh/km"
  healthScore: number; // 0 - 100
}

interface DriverSafetyReport {
  name: string;
  tripsCompleted: number;
  distanceDriven: number;
  safetyScore: number;
  violations: number;
}

interface MaintenanceHistoryItem {
  id: string;
  vehicleId: string;
  issue: string;
  cost: number;
  completedDate: string;
  type: "Scheduled" | "Unscheduled";
}

export default function FleetReport() {
  // 1. Date Range & General States
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "quarter" | "custom">("30days");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<"pdf" | "excel" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Search & Filter state for Vehicle Performance
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Custom range picker variables
  const [startDate, setStartDate] = useState("2026-06-12");
  const [endDate, setEndDate] = useState("2026-07-12");

  // 2. Simulated Dynamic Metrics based on date selection
  const metricsModifier = useMemo(() => {
    switch (dateRange) {
      case "7days":
        return { distance: 10450, spend: 3250, trips: 36, utilization: 81.2, fuel: 1980 };
      case "quarter":
        return { distance: 135890, spend: 38900, trips: 462, utilization: 86.8, fuel: 26400 };
      case "custom":
        return { distance: 58200, spend: 14500, trips: 182, utilization: 83.1, fuel: 11200 };
      case "30days":
      default:
        return { distance: 45230, spend: 12450, trips: 148, utilization: 84.5, fuel: 8420 };
    }
  }, [dateRange]);

  // 3. Mock Data Lists
  const vehiclePerformanceList: VehiclePerformance[] = [
    { id: "V-8821", model: "Volvo FH16 (Diesel)", driver: "Alex Rivera", status: "Active", distanceCovered: 4210, fuelEfficiency: "28.5 L/100km", healthScore: 92 },
    { id: "V-2210", model: "Peterbilt 579 (Diesel)", driver: "Dave Miller", status: "Active", distanceCovered: 3890, fuelEfficiency: "30.2 L/100km", healthScore: 88 },
    { id: "V-1102", model: "Tesla Semi Gen 1 (EV)", driver: "Elena Rostova", status: "Maintenance", distanceCovered: 2450, fuelEfficiency: "1.15 kWh/km", healthScore: 64 },
    { id: "V-5582", model: "Mack Anthem (Diesel)", driver: "Marcus Vance", status: "Active", distanceCovered: 5120, fuelEfficiency: "27.8 L/100km", healthScore: 95 },
    { id: "V-7710", model: "Scania R500 (Hybrid)", driver: "Sarah Jenkins", status: "Idle", distanceCovered: 1820, fuelEfficiency: "24.1 L/100km", healthScore: 91 },
    { id: "V-4412", model: "Kenworth T680 (Diesel)", driver: "Jameson Blake", status: "Offline", distanceCovered: 0, fuelEfficiency: "N/A", healthScore: 78 }
  ];

  const driverSafetyList: DriverSafetyReport[] = [
    { name: "Alex Rivera", tripsCompleted: 34, distanceDriven: 4210, safetyScore: 96, violations: 0 },
    { name: "Elena Rostova", tripsCompleted: 22, distanceDriven: 2450, safetyScore: 94, violations: 1 },
    { name: "Marcus Vance", tripsCompleted: 38, distanceDriven: 5120, safetyScore: 89, violations: 3 },
    { name: "Sarah Jenkins", tripsCompleted: 15, distanceDriven: 1820, safetyScore: 98, violations: 0 },
    { name: "Dave Miller", tripsCompleted: 31, distanceDriven: 3890, safetyScore: 91, violations: 1 }
  ];

  const maintenanceHistoryList: MaintenanceHistoryItem[] = [
    { id: "WO-3020", vehicleId: "V-7710", issue: "Compressor failure replacement", cost: 620, completedDate: "2026-07-08", type: "Unscheduled" },
    { id: "WO-3018", vehicleId: "V-8821", issue: "Standard 50k Odometer Lube & Oil Swap", cost: 350, completedDate: "2026-07-05", type: "Scheduled" },
    { id: "WO-3015", vehicleId: "V-5582", vehicleName: "Mack Anthem", issue: "Air braking hose line diagnostic check", cost: 180, completedDate: "2026-07-02", type: "Scheduled" } as any,
    { id: "WO-3010", vehicleId: "V-2210", issue: "Transmission shift solenoid overhaul", cost: 1450, completedDate: "2026-06-25", type: "Unscheduled" }
  ];

  // 4. Filters & Searches logic for Vehicle Performance
  const filteredVehicles = useMemo(() => {
    return vehiclePerformanceList.filter(v => {
      const matchesSearch = v.id.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                            v.model.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                            v.driver.toLowerCase().includes(vehicleSearch.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vehicleSearch, statusFilter]);

  // 5. Trigger Exports
  const handleExport = (type: "pdf" | "excel") => {
    setIsExporting(type);
    setIsExportDropdownOpen(false);
    
    // Simulate generation lag
    setTimeout(() => {
      setIsExporting(null);
      setToastMessage(`Report successfully exported as ${type.toUpperCase()}! File downloaded.`);
      setTimeout(() => setToastMessage(null), 4500);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-6 animate-fadeIn">

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-800 text-text-on-primary text-xs px-4 py-3 rounded-m shadow-dialog animate-fadeIn transition-all duration-300">
          <CheckCircle2 size={16} className="text-success" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-border-app pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary-light text-primary rounded border border-primary/10">
              Executive View
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-info-light text-info rounded border border-info/10">
              Operations Audit
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1.5 tracking-tight flex items-center gap-2">
            Transit Fleet Report
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Systemized review of operations efficiency, fuel usage logs, active maintenance buffers, and safety score audits.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          
          {/* Date Picker Controls */}
          <div className="flex items-center bg-surface-app border border-border-app p-1 rounded-m shadow-small text-xs font-bold text-text-secondary">
            <button 
              onClick={() => setDateRange("7days")}
              className={`px-3 py-1.5 rounded-m transition-all cursor-pointer ${dateRange === "7days" ? "bg-primary text-text-on-primary shadow-small" : "hover:text-text-primary"}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setDateRange("30days")}
              className={`px-3 py-1.5 rounded-m transition-all cursor-pointer ${dateRange === "30days" ? "bg-primary text-text-on-primary shadow-small" : "hover:text-text-primary"}`}
            >
              30 Days
            </button>
            <button 
              onClick={() => setDateRange("quarter")}
              className={`px-3 py-1.5 rounded-m transition-all cursor-pointer ${dateRange === "quarter" ? "bg-primary text-text-on-primary shadow-small" : "hover:text-text-primary"}`}
            >
              Quarter
            </button>
            <button 
              onClick={() => setDateRange("custom")}
              className={`px-3 py-1.5 rounded-m transition-all cursor-pointer ${dateRange === "custom" ? "bg-primary text-text-on-primary shadow-small" : "hover:text-text-primary"}`}
            >
              Custom
            </button>
          </div>

          {/* Date picker inputs (only shown when Custom is selected) */}
          {dateRange === "custom" && (
            <div className="flex items-center gap-2 bg-surface-app border border-border-app px-3.5 py-1.5 rounded-m shadow-small text-xs">
              <Calendar size={13} className="text-text-muted" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-transparent text-text-primary outline-none focus:text-primary font-semibold"
              />
              <span className="text-text-muted font-bold">—</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-transparent text-text-primary outline-none focus:text-primary font-semibold"
              />
            </div>
          )}

          {/* Export Dropdown Trigger */}
          <div className="relative">
            <button
              id="export-dropdown-btn"
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="flex h-9 items-center gap-1.5 px-4 rounded-m bg-primary text-text-on-primary text-xs font-bold hover:bg-primary/95 transition-all shadow-small cursor-pointer"
            >
              {isExporting ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-circular animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span>Export Audit Report</span>
              <ChevronDown size={12} className="opacity-80" />
            </button>

            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-app border border-border-app rounded-m shadow-dialog z-30 py-1.5 text-xs text-text-primary font-bold">
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary flex items-center gap-2 cursor-pointer"
                >
                  <FileText size={14} className="text-text-secondary" />
                  <span>Download PDF Audit</span>
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-secondary flex items-center gap-2 cursor-pointer"
                >
                  <BarChart4 size={14} className="text-text-secondary" />
                  <span>Export Excel CSV</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Fleet Overview (KPI Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        
        {/* KPI: Total Vehicles */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-primary/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Total Vehicles</span>
            <span className="text-3xl font-extrabold text-text-primary mt-1.5 block">24</span>
          </div>
          <span className="text-[10px] text-text-muted mt-4 block">Listed in registry</span>
        </div>

        {/* KPI: Active Vehicles */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Active Vehicles</span>
            <span className="text-3xl font-extrabold text-success mt-1.5 block">15</span>
          </div>
          <span className="text-[10px] text-success font-semibold mt-4 flex items-center gap-0.5">
            <TrendingUp size={12} /> 62.5% load rate
          </span>
        </div>

        {/* KPI: Idle Vehicles */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-warning/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Idle Vehicles</span>
            <span className="text-3xl font-extrabold text-warning mt-1.5 block">5</span>
          </div>
          <span className="text-[10px] text-text-muted mt-4 block">Awaiting dispatch</span>
        </div>

        {/* KPI: Under Maintenance */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-error/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">In Service Bay</span>
            <span className="text-3xl font-extrabold text-error mt-1.5 block">4</span>
          </div>
          <span className="text-[10px] text-error font-semibold mt-4 block">1 safety lock</span>
        </div>

        {/* KPI: Total Distance */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-info/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Distance Total</span>
            <span className="text-3xl font-extrabold text-text-primary mt-1.5 block">
              {metricsModifier.distance.toLocaleString()} km
            </span>
          </div>
          <span className="text-[10px] text-text-muted mt-4 block">All logged dispatches</span>
        </div>

        {/* KPI: Utilization Rate */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-secondary/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Utilization</span>
            <span className="text-3xl font-extrabold text-secondary mt-1.5 block">
              {metricsModifier.utilization}%
            </span>
          </div>
          <span className="text-[10px] text-secondary font-semibold mt-4 flex items-center gap-0.5">
            <TrendingUp size={12} /> Target: 80.0%
          </span>
        </div>

      </div>

      {/* Main Grid: split 2/3 and 1/3 layout to handle multiple widgets without clutter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column (2/3): Table, Analytics charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 3. Vehicle Performance Section */}
          <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-app pb-3 mb-1">
              <div>
                <h3 className="font-bold text-text-primary text-base">Vehicle Performance Metrics</h3>
                <p className="text-xs text-text-secondary">Odometer telemetry logging, health indexing, and average fuel spend.</p>
              </div>

              {/* Controls inside card */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2 text-text-muted" />
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Search Vehicle ID..."
                    className="h-8 pl-8 pr-3 w-36 rounded border border-border-app bg-gray-50 text-[11px] text-text-primary focus:outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 border border-border-app bg-gray-50 rounded px-2 text-[11px] text-text-secondary focus:outline-none font-semibold"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Idle">Idle</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-app text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="px-5 py-3">Vehicle ID</th>
                    <th className="px-5 py-3">Model Specification</th>
                    <th className="px-5 py-3">Driver</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Distance (KM)</th>
                    <th className="px-5 py-3">Efficiency</th>
                    <th className="px-5 py-3 text-right">Health Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50/45 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-primary">{vehicle.id}</td>
                      <td className="px-5 py-4 font-semibold text-text-primary">{vehicle.model}</td>
                      <td className="px-5 py-4 font-medium text-text-secondary">{vehicle.driver}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                          ${vehicle.status === "Active" ? "bg-success-light text-success border-success/20" : ""}
                          ${vehicle.status === "Idle" ? "bg-warning-light text-warning border-warning/20" : ""}
                          ${vehicle.status === "Maintenance" ? "bg-error-light text-error border-error/20" : ""}
                          ${vehicle.status === "Offline" ? "bg-gray-100 text-text-secondary border-gray-200" : ""}
                        `}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-text-primary">
                        {vehicle.distanceCovered.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-text-secondary font-semibold">{vehicle.fuelEfficiency}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-bold ${vehicle.healthScore > 85 ? "text-success" : vehicle.healthScore > 70 ? "text-warning" : "text-error"}`}>
                            {vehicle.healthScore}%
                          </span>
                          <div className="h-1.5 w-12 bg-gray-100 rounded-circular overflow-hidden">
                            <div 
                              className={`h-full rounded-circular ${vehicle.healthScore > 85 ? "bg-success" : vehicle.healthScore > 70 ? "bg-warning" : "bg-error"}`}
                              style={{ width: `${vehicle.healthScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Fleet Utilization Analytics */}
          <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-4">
            <div>
              <h3 className="font-bold text-text-primary text-base">Fleet Utilization Analytics</h3>
              <p className="text-xs text-text-secondary">Visual analysis of Active vs. Standby (Idle) operational hours log.</p>
            </div>

            {/* Simulated Utilization Trend Graph (SVG) */}
            <div className="bg-gray-50 border border-border-app p-4 rounded-m h-60 flex flex-col justify-between">
              
              {/* Graphic Plot Area */}
              <div className="flex-1 w-full relative pt-4">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line 
                      key={i} 
                      x1="0%" 
                      y1={`${ratio * 100}%`} 
                      x2="100%" 
                      y2={`${ratio * 100}%`} 
                      stroke="#E5E7EB" 
                      strokeWidth="1" 
                      strokeDasharray="4 4"
                    />
                  ))}
                  
                  {/* Active Line (Primary Blue Gradient Area) */}
                  <path
                    d="M0,80 Q100,30 200,60 T400,20 T600,45 T800,10 L1000,30 L1000,100 L0,100 Z"
                    fill="url(#activeGrad)"
                    className="opacity-35"
                    style={{ transform: "scaleY(0.85)" }}
                  />
                  <path
                    d="M0,80 Q100,30 200,60 T400,20 T600,45 T800,10 L1000,30"
                    fill="none"
                    stroke="var(--color-primary, #3B82F6)"
                    strokeWidth="3"
                    style={{ transform: "scaleY(0.85)" }}
                  />

                  {/* Idle Line (Secondary Gold) */}
                  <path
                    d="M0,50 Q100,80 200,40 T400,70 T600,60 T800,85 L1000,60"
                    fill="none"
                    stroke="var(--color-warning, #F59E0B)"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    style={{ transform: "scaleY(0.85)" }}
                  />

                  {/* Definitions for Gradients */}
                  <defs>
                    <linearGradient id="activeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary, #3B82F6)" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-text-secondary font-bold border-t border-gray-200 pt-2 mt-2 px-1">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="flex gap-4 text-xs font-bold justify-end">
              <span className="flex items-center gap-1.5 text-text-primary">
                <span className="h-3 w-3 bg-primary rounded-circular inline-block"></span>
                Active Dispatch ({metricsModifier.utilization}%)
              </span>
              <span className="flex items-center gap-1.5 text-text-secondary">
                <span className="h-3 w-3 bg-warning rounded-circular inline-block"></span>
                Idle / Depot Standby
              </span>
            </div>
          </div>

        </div>

        {/* Right column (1/3): Fuel, Driver, Maintenance and Alerts */}
        <div className="space-y-8">
          
          {/* 5. Fuel Analytics Section */}
          <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-app pb-2">
              <Fuel className="text-secondary" size={18} />
              <h3 className="font-bold text-text-primary text-base">Fuel Consumption Audit</h3>
            </div>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-border-app">
                <span className="text-text-secondary font-semibold">Total Consumed</span>
                <span className="font-extrabold text-text-primary">{metricsModifier.fuel.toLocaleString()} Litres</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-border-app">
                <span className="text-text-secondary font-semibold">Total Cost</span>
                <span className="font-extrabold text-secondary">${(metricsModifier.fuel * 1.45).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-border-app">
                <span className="text-text-secondary font-semibold">Average Fleet Efficiency</span>
                <span className="font-extrabold text-success">27.6 L/100km</span>
              </div>
            </div>

            {/* Simple Fuel Eff Grid bar visual comparison */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Fuel Type Allocation Cost per KM</span>
              <div className="space-y-1.5">
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
                    <span>Diesel Combustion (V-8821)</span>
                    <span>$0.42 / km</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded">
                    <div className="h-full bg-primary rounded" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
                    <span>Electric Battery (V-1102)</span>
                    <span>$0.14 / km</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded">
                    <div className="h-full bg-success rounded" style={{ width: "26%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 9. Fleet Insights / Recommendation Alerts */}
          <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-app pb-2">
              <ShieldAlert className="text-error animate-pulse" size={18} />
              <h3 className="font-bold text-text-primary text-base">Fleet Intelligence Alerts</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-error-light/20 border border-error/20 rounded flex gap-2.5 items-start">
                <AlertTriangle size={15} className="text-error shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">Engine Health Alert</span>
                  <p className="text-[10px] text-text-secondary">Vehicle V-1102 health index fell below threshold (64%). Battery module cooling exception logged.</p>
                </div>
              </div>

              <div className="p-3.5 bg-warning-light/35 border border-warning/20 rounded flex gap-2.5 items-start">
                <Info size={15} className="text-warning shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">Maintenance Warning</span>
                  <p className="text-[10px] text-text-secondary">Kenworth T680 (V-4412) is overdue for preventive engine lubrication checks by 120km.</p>
                </div>
              </div>

              <div className="p-3.5 bg-primary-light/20 border border-primary/20 rounded flex gap-2.5 items-start">
                <Sparkles size={15} className="text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">Efficiency Recommender</span>
                  <p className="text-[10px] text-text-secondary">Rerouting Volvo (V-8821) via Chicago bypass saves estimated 12% idling fuel losses.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Spacing Divider */}
      <div className="border-t border-border-app my-4"></div>

      {/* Grid: Bottom row layout widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 6. Maintenance Report Widget */}
        <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border-app pb-2">
              <Wrench className="text-primary" size={16} />
              <h3 className="font-bold text-text-primary text-base">Service & Repair Report</h3>
            </div>

            {/* Cost breakdown */}
            <div className="grid grid-cols-2 gap-3 text-center bg-gray-50 border border-border-app p-3 rounded">
              <div>
                <span className="text-[9px] font-bold text-text-secondary uppercase">Active Bay Cost</span>
                <span className="block text-base font-extrabold text-text-primary mt-0.5">
                  ${(metricsModifier.spend * 0.65).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="border-l border-gray-200">
                <span className="text-[9px] font-bold text-text-secondary uppercase">Scheduled Checks</span>
                <span className="block text-base font-extrabold text-success mt-0.5">
                  ${(metricsModifier.spend * 0.35).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Upcoming items preview */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Upcoming Service Queues</span>
              <div className="divide-y divide-gray-100 text-xs">
                {maintenanceHistoryList.slice(0, 3).map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-text-primary">{item.vehicleId}</span>
                      <span className="text-[10px] text-text-secondary block truncate max-w-[150px]">{item.issue}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-text-primary block">${item.cost}</span>
                      <span className="text-[9px] text-text-muted block">{item.completedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Link 
            href="/maintenance"
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1.5 mt-2"
          >
            <span>Navigate to Maintenance bay</span>
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* 7. Driver Performance Audits */}
        <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-app pb-2">
            <Users className="text-secondary" size={16} />
            <h3 className="font-bold text-text-primary text-base">Driver Performance Audits</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {driverSafetyList.map((driver) => (
              <div key={driver.name} className="flex items-center justify-between border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-bold text-text-primary">{driver.name}</span>
                  <span className="text-[10px] text-text-secondary block">
                    {driver.tripsCompleted} Completed trips • {driver.distanceDriven} km
                  </span>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    {driver.safetyScore >= 95 ? (
                      <Award size={13} className="text-success shrink-0" />
                    ) : driver.violations > 2 ? (
                      <AlertTriangle size={13} className="text-error shrink-0" />
                    ) : null}
                    <span className={`font-bold ${driver.safetyScore >= 90 ? "text-success" : driver.safetyScore >= 80 ? "text-warning" : "text-error"}`}>
                      {driver.safetyScore}
                    </span>
                  </div>
                  <span className="text-[9px] text-text-secondary block">
                    {driver.violations > 0 ? `${driver.violations} violation warnings` : "Clean safety slate"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Trip Analytics & Operational Volume */}
        <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border-app pb-2">
              <Route className="text-info" size={16} />
              <h3 className="font-bold text-text-primary text-base">Trip Analytics Overview</h3>
            </div>

            {/* Summary statistics grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5 bg-gray-50 border border-border-app p-2.5 rounded">
                <span className="text-[9px] font-bold text-text-secondary uppercase">Trips Initiated</span>
                <span className="block text-xl font-extrabold text-text-primary">{metricsModifier.trips}</span>
              </div>
              <div className="space-y-0.5 bg-gray-50 border border-border-app p-2.5 rounded">
                <span className="text-[9px] font-bold text-text-secondary uppercase">Average Duration</span>
                <span className="block text-xl font-extrabold text-text-primary">3.2 hours</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-text-secondary font-semibold">
                  <span>Completed Dispatches</span>
                  <span className="font-bold text-text-primary">{Math.floor(metricsModifier.trips * 0.95)}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-success rounded-circular" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-text-secondary font-semibold">
                  <span>Delayed / Stalled dispatches</span>
                  <span className="font-bold text-text-primary">{Math.ceil(metricsModifier.trips * 0.05)}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-warning rounded-circular" style={{ width: "5%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <Link 
            href="/trips"
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1.5 mt-2"
          >
            <span>Open live tracking maps</span>
            <ChevronRight size={13} />
          </Link>
        </div>

      </div>

      {/* Spacing Divider */}
      <div className="border-t border-border-app my-4"></div>

      {/* 10. Report Export Section */}
      <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1">
          <h3 className="font-bold text-text-primary text-base">Generate & Download Executive Reports</h3>
          <p className="text-xs text-text-secondary">
            Get offline access to full operational audits, distance logs, and compliance records for meetings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
            className="flex h-10 items-center gap-1.5 px-4 rounded-m border border-primary text-primary text-xs font-bold hover:bg-primary-light active:scale-95 transition-all shadow-small cursor-pointer disabled:opacity-50"
          >
            {isExporting === "pdf" ? (
              <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-circular animate-spin" />
            ) : (
              <FileText size={14} />
            )}
            <span>Download PDF Report</span>
          </button>
          
          <button
            onClick={() => handleExport("excel")}
            disabled={isExporting !== null}
            className="flex h-10 items-center gap-1.5 px-4 rounded-m bg-primary text-text-on-primary text-xs font-bold hover:bg-primary/95 active:scale-95 transition-all shadow-small cursor-pointer disabled:opacity-50"
          >
            {isExporting === "excel" ? (
              <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-circular animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>Export Excel Sheet</span>
          </button>
        </div>
      </div>

    </div>
  );
}
