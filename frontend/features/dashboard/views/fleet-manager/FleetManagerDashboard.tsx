"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Truck, 
  Users, 
  MapPin, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ShieldAlert, 
  CheckCircle2,
  Navigation,
  ExternalLink,
  Battery,
  Fuel,
  Wrench,
  Search,
  Filter,
  RefreshCw,
  Activity,
  Calendar,
  AlertCircle,
  Play,
  X,
  Sparkles,
  ChevronRight,
  FileText,
  Layers
} from "lucide-react";
import Link from "next/link";

// Types definition for self-contained components
interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Idle" | "Maintenance" | "Offline";
  fuelType: "Electric" | "Diesel";
  fuelLevel: number;
  speed: number;
  driver: string;
  engineTemp: number;
  batteryHealth?: number;
  lastService: string;
}

interface Alert {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  time: string;
  severity: "critical" | "warning";
  resolved: boolean;
}

interface Trip {
  id: string;
  vehicle: string;
  driver: string;
  route: string;
  status: "In Transit" | "Delayed" | "Loading" | "Completed";
  eta: string;
  progress: number;
}

export default function FleetManagerDashboard() {
  // 1. Core State
  const [activeTab, setActiveTab] = useState<"overview" | "vehicles" | "alerts">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");
  
  // Modals state for Operations Playbook actions
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Form states for dialog simulations
  const [dispatchForm, setDispatchForm] = useState({ vehicleId: "", driverId: "", route: "" });
  const [maintenanceForm, setMaintenanceForm] = useState({ vehicleId: "", issue: "", severity: "warning" });

  // 2. Mock Data State
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: "V-8821", name: "Volvo FH16", type: "Heavy Duty Cargo", status: "Active", fuelType: "Diesel", fuelLevel: 72, speed: 84, driver: "Alex Rivera", engineTemp: 98, lastService: "2026-05-10" },
    { id: "V-7710", name: "Scania R500", type: "Heavy Duty Cargo", status: "Active", fuelType: "Diesel", fuelLevel: 45, speed: 112, driver: "Sarah Connor", engineTemp: 85, lastService: "2026-06-01" },
    { id: "V-9011", name: "Tesla Semi (Gen 2)", type: "Electric Freighter", status: "Active", fuelType: "Electric", fuelLevel: 89, speed: 62, driver: "David Chen", engineTemp: 32, batteryHealth: 96, lastService: "2026-04-18" },
    { id: "V-4412", name: "Kenworth T680", type: "Heavy Duty Cargo", status: "Idle", fuelType: "Diesel", fuelLevel: 91, speed: 0, driver: "Marcus Vance", engineTemp: 24, lastService: "2026-06-25" },
    { id: "V-2210", name: "Peterbilt 579", type: "Heavy Duty Cargo", status: "Maintenance", fuelType: "Diesel", fuelLevel: 15, speed: 0, driver: "None", engineTemp: 20, lastService: "2026-02-14" },
    { id: "V-3340", name: "Freightliner Cascadia", type: "Heavy Duty Cargo", status: "Offline", fuelType: "Diesel", fuelLevel: 60, speed: 0, driver: "None", engineTemp: 18, lastService: "2026-01-20" },
    { id: "V-1102", name: "Tesla Semi (Gen 1)", type: "Electric Freighter", status: "Active", fuelType: "Electric", fuelLevel: 18, speed: 75, driver: "Elena Rostova", engineTemp: 35, batteryHealth: 91, lastService: "2026-05-22" },
    { id: "V-5582", name: "Mack Anthem", type: "Heavy Duty Cargo", status: "Active", fuelType: "Diesel", fuelLevel: 58, speed: 55, driver: "John Doe", engineTemp: 80, lastService: "2026-06-12" }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "ALT-204", title: "Engine Coolant Temp High (98°C)", assetId: "V-8821", assetName: "Volvo FH16", time: "5m ago", severity: "warning", resolved: false },
    { id: "ALT-203", title: "Speeding Alert (112 km/h in 80 zone)", assetId: "V-7710", assetName: "Scania R500", time: "12m ago", severity: "critical", resolved: false },
    { id: "ALT-202", title: "Low Charge Warning (18% SOC)", assetId: "V-1102", assetName: "Tesla Semi (Gen 1)", time: "25m ago", severity: "critical", resolved: false },
    { id: "ALT-201", title: "Critical Fuel Level (15%)", assetId: "V-2210", assetName: "Peterbilt 579", time: "1h ago", severity: "warning", resolved: false }
  ]);

  const [trips, setTrips] = useState<Trip[]>([
    { id: "TRP-9482", vehicle: "Volvo FH16 (V-8821)", driver: "Alex Rivera", route: "SFO Hub → LAX Terminal", status: "In Transit", eta: "14:35 (In 45m)", progress: 85 },
    { id: "TRP-9483", vehicle: "Scania R500 (V-7710)", driver: "Sarah Connor", route: "Chicago Depot → Detroit Dock", status: "Delayed", eta: "16:10 (+30m)", progress: 60 },
    { id: "TRP-9484", vehicle: "Tesla Semi (V-9011)", driver: "David Chen", route: "Phoenix Plant → El Paso Hub", status: "In Transit", eta: "18:50 (In 5h)", progress: 35 },
    { id: "TRP-9485", vehicle: "Kenworth T680 (V-4412)", driver: "Marcus Vance", route: "Miami Port → Atlanta Yard", status: "Loading", eta: "Departs 12:45", progress: 5 },
    { id: "TRP-9486", vehicle: "Tesla Semi (V-1102)", driver: "Elena Rostova", route: "Seattle Depot → Portland Yard", status: "In Transit", eta: "13:40 (In 1h 20m)", progress: 70 }
  ]);

  // 3. Dynamic Calculation Metrics
  const calculatedMetrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === "Active").length;
    const maintenanceVehicles = vehicles.filter(v => v.status === "Maintenance").length;
    const activeDrivers = vehicles.filter(v => v.driver !== "None").length;
    const activeAlerts = alerts.filter(a => !a.resolved).length;
    const criticalAlertsCount = alerts.filter(a => a.severity === "critical" && !a.resolved).length;
    
    // Utilization Rate
    const utilizationRate = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
    
    // Average Fleet Fuel / Battery Level
    const avgFuel = Math.round(vehicles.reduce((acc, curr) => acc + curr.fuelLevel, 0) / totalVehicles);

    return {
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      activeDrivers,
      activeAlerts,
      criticalAlertsCount,
      utilizationRate,
      avgFuel
    };
  }, [vehicles, alerts]);

  // 4. Simulated Real-Time Updates Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      // Slightly modify vehicle telemetry to simulate live data stream
      setVehicles(prev => prev.map(v => {
        if (v.status === "Active") {
          // Adjust speed slightly (+/- 4km/h)
          const speedDelta = Math.floor(Math.random() * 9) - 4;
          const newSpeed = Math.max(40, Math.min(120, v.speed + speedDelta));
          // Slowly decrease fuel/battery level
          const fuelLeak = Math.random() > 0.7 ? 1 : 0;
          const newFuel = Math.max(5, v.fuelLevel - fuelLeak);
          // Modulate engine temperature
          const tempDelta = Math.floor(Math.random() * 5) - 2;
          const newTemp = Math.max(70, Math.min(105, v.engineTemp + tempDelta));
          
          return {
            ...v,
            speed: newSpeed,
            fuelLevel: newFuel,
            engineTemp: newTemp
          };
        }
        return v;
      }));

      // Update ETA details and Trip Progress
      setTrips(prev => prev.map(t => {
        if (t.status === "In Transit") {
          const progressDelta = Math.random() > 0.6 ? 1 : 0;
          const newProgress = Math.min(99, t.progress + progressDelta);
          return { ...t, progress: newProgress };
        }
        return t;
      }));

      // Update sync time caption
      const now = new Date();
      setLastSyncTime(`Last updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // 5. Handlers
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(`Synced at: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      
      // Auto resolve one random resolved warning alert for demonstration
      const unresolved = alerts.filter(a => !a.resolved);
      if (unresolved.length > 0) {
        const randomIndex = Math.floor(Math.random() * unresolved.length);
        const alertToResolve = unresolved[randomIndex];
        showToast(`System auto-resolved Exception: ${alertToResolve.id}`);
        setAlerts(prev => prev.map(a => a.id === alertToResolve.id ? { ...a, resolved: true } : a));
      }
    }, 800);
  };

  const showToast = (message: string) => {
    setActionSuccessMessage(message);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    showToast(`Successfully cleared Exception notification ${alertId}`);
  };

  const executeDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchForm.vehicleId || !dispatchForm.driverId || !dispatchForm.route) {
      alert("Please fill all dispatch parameters.");
      return;
    }

    const targetVehicle = vehicles.find(v => v.id === dispatchForm.vehicleId);
    if (!targetVehicle) return;

    // Transition vehicle status
    setVehicles(prev => prev.map(v => 
      v.id === dispatchForm.vehicleId 
        ? { ...v, status: "Active", driver: dispatchForm.driverId, speed: 65 } 
        : v
    ));

    // Append new active trip
    const newTripId = `TRP-${Math.floor(Math.random() * 9000) + 1000}`;
    const newTrip: Trip = {
      id: newTripId,
      vehicle: `${targetVehicle.name} (${targetVehicle.id})`,
      driver: dispatchForm.driverId,
      route: dispatchForm.route,
      status: "In Transit",
      eta: "Calculated (In 2h)",
      progress: 0
    };

    setTrips(prev => [newTrip, ...prev]);
    setActiveActionModal(null);
    showToast(`Dispatched ${targetVehicle.name} with ${dispatchForm.driverId} on route ${dispatchForm.route}`);
    setDispatchForm({ vehicleId: "", driverId: "", route: "" });
  };

  const executeMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceForm.vehicleId || !maintenanceForm.issue) {
      alert("Please specify a vehicle and details of the mechanical exception.");
      return;
    }

    // Set vehicle status to maintenance
    setVehicles(prev => prev.map(v => 
      v.id === maintenanceForm.vehicleId 
        ? { ...v, status: "Maintenance", speed: 0, driver: "None" } 
        : v
    ));

    // Append a critical alert
    const newAlertId = `ALT-${Math.floor(Math.random() * 100) + 300}`;
    const targetVehicle = vehicles.find(v => v.id === maintenanceForm.vehicleId);
    const newAlert: Alert = {
      id: newAlertId,
      title: `${maintenanceForm.issue} (Scheduled)`,
      assetId: maintenanceForm.vehicleId,
      assetName: targetVehicle?.name || "Unknown Vehicle",
      time: "Just now",
      severity: maintenanceForm.severity as "critical" | "warning",
      resolved: false
    };

    setAlerts(prev => [newAlert, ...prev]);
    setActiveActionModal(null);
    showToast(`Logged maintenance task for ${targetVehicle?.name}. Exception alert ${newAlertId} raised.`);
    setMaintenanceForm({ vehicleId: "", issue: "", severity: "warning" });
  };

  // 6. Filtering & Searching Logic for Vehicles tab
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.driver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  const activeAlertsList = useMemo(() => {
    return alerts.filter(a => !a.resolved);
  }, [alerts]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-4">
      
      {/* Dynamic Toast feedback */}
      {actionSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-800 text-text-on-primary text-xs px-4 py-3 rounded-m shadow-dialog animate-fadeIn transition-all duration-300">
          <Sparkles size={16} className="text-warning animate-pulse" />
          <span>{actionSuccessMessage}</span>
          <button 
            onClick={() => setActionSuccessMessage(null)}
            className="ml-2 hover:bg-gray-800 rounded p-0.5 text-text-muted hover:text-text-on-primary"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header and Sync Control Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-app pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary-light text-primary rounded border border-primary/10">
              Operations Center
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-secondary-light text-secondary rounded border border-secondary/10">
              Fleet Manager Panel
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1.5 tracking-tight flex items-center gap-2">
            Transit Fleet Monitor
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Comprehensive telemetry, active dispatch control lists, and vehicle diagnostics metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <div className="text-xs text-text-secondary flex items-center gap-1.5 bg-surface-app border border-border-app px-3.5 py-2 rounded-m shadow-small">
            <Clock size={14} className="text-text-muted" />
            <span>{lastSyncTime}</span>
          </div>
          <button
            id="refresh-btn"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`flex h-9 w-9 items-center justify-center rounded-m border border-border-app bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 active:scale-95 transition-all shadow-small cursor-pointer disabled:opacity-50`}
            title="Refresh Fleet Data"
          >
            <RefreshCw size={15} className={`${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Quick Action Hub Toolbar */}
      <div className="bg-surface-app border border-border-app p-3.5 rounded-m shadow-small flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-warning shrink-0 animate-pulse" size={16} />
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Operational Shortcuts:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/maintenance"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-light hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-m transition-all cursor-pointer active:scale-95 shadow-small"
          >
            <Wrench size={13} />
            <span>Maintenance Hub</span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-info-light hover:bg-info/10 border border-info/20 text-info text-xs font-bold rounded-m transition-all cursor-pointer active:scale-95 shadow-small"
          >
            <FileText size={13} />
            <span>Fleet Reports</span>
          </Link>
          <Link
            href="/lifecycle"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-light hover:bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold rounded-m transition-all cursor-pointer active:scale-95 shadow-small"
          >
            <Layers size={13} />
            <span>Asset Lifecycle</span>
          </Link>
          <Link
            href="/vehicles/assignments"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-light hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-m transition-all cursor-pointer active:scale-95 shadow-small"
          >
            <Users size={13} />
            <span>Manage Assignments</span>
          </Link>
          <button
            onClick={() => setActiveActionModal("dispatch")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-light hover:bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold rounded-m transition-all cursor-pointer active:scale-95 shadow-small"
          >
            <Play size={13} />
            <span>Dispatch Cargo</span>
          </button>
          <button
            onClick={() => setActiveActionModal("maintenance")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-warning-light hover:bg-warning-light border border-warning/20 text-warning text-xs font-bold rounded-m transition-all cursor-pointer active:scale-95 shadow-small"
            style={{ color: "#D97706" }}
          >
            <AlertTriangle size={13} />
            <span>Log Exception</span>
          </button>
          <button
            onClick={() => {
              handleManualRefresh();
              showToast("Diagnostics scan initiated. Reviewing telemetry logs.");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-text-primary text-xs font-bold rounded-m transition-all cursor-pointer active:scale-95 shadow-small"
          >
            <Activity size={13} />
            <span>Run System Scan</span>
          </button>
        </div>
      </div>

      {/* Secondary Feature Tabs Navigation */}
      <div className="flex border-b border-border-app gap-4 overflow-x-auto pb-px">
        <button
          id="tab-overview"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-semibold tracking-tight transition-all relative whitespace-nowrap cursor-pointer px-1
            ${activeTab === "overview" 
              ? "text-primary border-b-2 border-primary" 
              : "text-text-secondary hover:text-text-primary"
            }
          `}
        >
          Overview & Insights
        </button>
        <button
          id="tab-vehicles"
          onClick={() => setActiveTab("vehicles")}
          className={`pb-3 text-sm font-semibold tracking-tight transition-all relative whitespace-nowrap cursor-pointer px-1 flex items-center gap-1.5
            ${activeTab === "vehicles" 
              ? "text-primary border-b-2 border-primary" 
              : "text-text-secondary hover:text-text-primary"
            }
          `}
        >
          Active Fleet Roster
          <span className="px-1.5 py-0.2 bg-gray-100 text-[10px] text-text-secondary rounded-circular">
            {vehicles.length}
          </span>
        </button>
        <button
          id="tab-alerts"
          onClick={() => setActiveTab("alerts")}
          className={`pb-3 text-sm font-semibold tracking-tight transition-all relative whitespace-nowrap cursor-pointer px-1 flex items-center gap-1.5
            ${activeTab === "alerts" 
              ? "text-primary border-b-2 border-primary" 
              : "text-text-secondary hover:text-text-primary"
            }
          `}
        >
          Diagnostic Exceptions
          {activeAlertsList.length > 0 && (
            <span className="px-1.5 py-0.2 bg-error-light text-[10px] text-error font-bold rounded-circular">
              {activeAlertsList.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric: Fleet Utilization */}
            <div 
              onClick={() => { setActiveTab("vehicles"); setStatusFilter("All"); }}
              className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-menu active:scale-[0.99] cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Fleet Utilization</span>
                  <div className="text-3xl font-extrabold text-text-primary mt-1">{calculatedMetrics.utilizationRate}%</div>
                </div>
                <div className="h-10 w-10 rounded-m bg-primary-light text-primary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                  <Truck size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">
                  {calculatedMetrics.activeVehicles} of {calculatedMetrics.totalVehicles} in route
                </span>
                <span className="font-semibold text-success flex items-center gap-0.5">
                  <ArrowUpRight size={14} /> +3%
                </span>
              </div>
            </div>

            {/* Metric: Active Drivers */}
            <div 
              onClick={() => { setActiveTab("vehicles"); setStatusFilter("Active"); }}
              className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-secondary/50 hover:shadow-menu active:scale-[0.99] cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Drivers Active</span>
                  <div className="text-3xl font-extrabold text-text-primary mt-1">{calculatedMetrics.activeDrivers}</div>
                </div>
                <div className="h-10 w-10 rounded-m bg-secondary-light text-secondary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                  <Users size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">
                  Compliance rating 100%
                </span>
                <span className="text-text-muted font-medium">
                  Stable roster
                </span>
              </div>
            </div>

            {/* Metric: Fleet Power / Fuel Avg */}
            <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-info/30 transition-all duration-200 group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Average Capacity</span>
                  <div className="text-3xl font-extrabold text-text-primary mt-1">{calculatedMetrics.avgFuel}%</div>
                </div>
                <div className="h-10 w-10 rounded-m bg-info-light text-info flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                  <Battery size={20} className="text-info" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">
                  Avg. Diesel & Battery SOC
                </span>
                <span className="font-semibold text-error flex items-center gap-0.5">
                  <ArrowDownRight size={14} /> -1.2%
                </span>
              </div>
            </div>

            {/* Metric: Exceptions Raised */}
            <div 
              onClick={() => setActiveTab("alerts")}
              className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-error/50 hover:shadow-menu active:scale-[0.99] cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Exceptions Alerting</span>
                  <div className="text-3xl font-extrabold text-text-primary mt-1">{calculatedMetrics.activeAlerts}</div>
                </div>
                <div className="h-10 w-10 rounded-m bg-error-light text-error flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                  <AlertTriangle size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">
                  {calculatedMetrics.criticalAlertsCount} critical safety exceptions
                </span>
                <span className="font-semibold px-1.5 py-0.2 bg-error-light text-error text-[10px] rounded-circular">
                  Action required
                </span>
              </div>
            </div>

          </div>

          {/* Main Dashboard Overview Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2/3 Column: Live Trips Pipeline & Roster Overview */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Live Trips Table */}
              <div className="bg-surface-app border border-border-app rounded-m shadow-card flex flex-col">
                <div className="p-6 border-b border-border-app flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-text-primary text-base">Live Trips Monitoring</h3>
                    <p className="text-xs text-text-secondary">Currently dispatched assets in cargo transit pipeline.</p>
                  </div>
                  <Link 
                    href="/trips" 
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Inspect all dispatches</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-border-app text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        <th className="px-6 py-4">Trip ID</th>
                        <th className="px-6 py-4">Asset & Driver</th>
                        <th className="px-6 py-4">Cargo Route</th>
                        <th className="px-6 py-4">Progress</th>
                        <th className="px-6 py-4">ETA & Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {trips.slice(0, 4).map((trip) => (
                        <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5 font-mono font-bold text-xs text-primary">{trip.id}</td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-semibold text-text-primary text-xs">{trip.vehicle}</span>
                              <span className="text-[11px] text-text-secondary">{trip.driver}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-text-secondary text-xs">{trip.route}</td>
                          <td className="px-6 py-5">
                            <div className="w-full max-w-[80px] space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-text-secondary font-bold">
                                <span>{trip.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-100 rounded-circular overflow-hidden">
                                <div 
                                  className={`h-full rounded-circular ${trip.status === "Delayed" ? "bg-warning" : "bg-primary"}`}
                                  style={{ width: `${trip.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-bold text-text-primary text-xs">{trip.eta}</span>
                              <span 
                                className={`inline-flex px-2 py-0.2 text-[9px] font-bold rounded-circular border uppercase tracking-wider
                                  ${trip.status === "In Transit" ? "bg-info-light text-info border-info/20" : ""}
                                  ${trip.status === "Delayed" ? "bg-warning-light text-warning border-warning/20" : ""}
                                  ${trip.status === "Loading" ? "bg-success-light text-success border-success/20" : ""}
                                `}
                              >
                                {trip.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Roster Spotlight Details */}
              <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6">
                <div className="flex items-center justify-between border-b border-border-app pb-3 mb-5">
                  <div>
                    <h3 className="font-bold text-text-primary text-base">Key Fleet Analytics</h3>
                    <p className="text-xs text-text-secondary">Summary breakdown of operations by status.</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab("vehicles"); setStatusFilter("All"); }}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Manage Roster
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  <div 
                    onClick={() => { setActiveTab("vehicles"); setStatusFilter("Active"); }}
                    className="bg-gray-50 p-5 rounded-m border border-border-app hover:border-success/30 hover:bg-success-light/10 active:scale-[0.97] cursor-pointer transition-all duration-150"
                  >
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Active</span>
                    <span className="block text-2xl font-extrabold text-success mt-1">
                      {vehicles.filter(v => v.status === "Active").length}
                    </span>
                  </div>
                  <div 
                    onClick={() => { setActiveTab("vehicles"); setStatusFilter("Idle"); }}
                    className="bg-gray-50 p-5 rounded-m border border-border-app hover:border-warning/30 hover:bg-warning-light/10 active:scale-[0.97] cursor-pointer transition-all duration-150"
                  >
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Idle / Standby</span>
                    <span className="block text-2xl font-extrabold text-warning mt-1">
                      {vehicles.filter(v => v.status === "Idle").length}
                    </span>
                  </div>
                  <Link 
                    href="/maintenance"
                    className="bg-gray-50 p-5 rounded-m border border-border-app hover:border-primary/30 hover:bg-primary-light active:scale-[0.97] cursor-pointer transition-all duration-150 block"
                  >
                    <span className="text-[10px] font-bold text-text-secondary uppercase">In Service Bay</span>
                    <span className="block text-2xl font-extrabold text-primary mt-1">
                      {vehicles.filter(v => v.status === "Maintenance").length}
                    </span>
                  </Link>
                  <div 
                    onClick={() => { setActiveTab("vehicles"); setStatusFilter("Offline"); }}
                    className="bg-gray-50 p-5 rounded-m border border-border-app hover:border-gray-400/30 hover:bg-gray-100 active:scale-[0.97] cursor-pointer transition-all duration-150"
                  >
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Offline</span>
                    <span className="block text-2xl font-extrabold text-text-secondary mt-1">
                      {vehicles.filter(v => v.status === "Offline").length}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 1/3 Column: Live Exceptions Center & Action Center */}
            <div className="space-y-8">
              
              {/* Exceptions Feed */}
              <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6">
                <div className="flex items-center justify-between pb-3 border-b border-border-app mb-5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="text-error" size={18} />
                    <h3 className="font-bold text-text-primary text-base">System Exceptions</h3>
                  </div>
                  {activeAlertsList.length > 0 && (
                    <span 
                      onClick={() => setActiveTab("alerts")}
                      className="px-2 py-0.5 bg-error-light text-error text-[10px] font-bold rounded-circular border border-error/10 uppercase tracking-wider cursor-pointer hover:bg-error-light/80 transition-colors"
                    >
                      {activeAlertsList.length} Active
                    </span>
                  )}
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {activeAlertsList.length === 0 ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center bg-gray-50 rounded-m border border-dashed border-border-app">
                      <CheckCircle2 className="text-success mb-2" size={24} />
                      <span className="text-xs font-bold text-text-primary">All Systems Nominal</span>
                      <span className="text-[10px] text-text-secondary mt-0.5">No unresolved exceptions detected.</span>
                    </div>
                  ) : (
                    activeAlertsList.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`p-4 rounded-m border flex gap-3 items-start transition-all
                          ${
                            alert.severity === "critical"
                              ? "bg-error-light/20 border-error/20 hover:border-error/40"
                              : "bg-warning-light/10 border-warning/10 hover:border-warning/30"
                          }
                        `}
                      >
                        <AlertTriangle 
                          size={15} 
                          className={`mt-0.5 shrink-0 ${alert.severity === "critical" ? "text-error" : "text-warning"}`} 
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text-primary truncate">{alert.title}</span>
                            <span className="text-[9px] text-text-muted shrink-0">{alert.time}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-text-secondary truncate">Asset: {alert.assetName} ({alert.assetId})</span>
                            <button
                              id={`resolve-${alert.id}`}
                              onClick={() => handleResolveAlert(alert.id)}
                              className="text-[9px] font-extrabold text-primary hover:underline hover:text-primary/80 bg-white border border-border-app px-2 py-0.5 rounded shadow-small cursor-pointer"
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions Panel / Operations Playbook */}
              <div className="bg-surface-app border border-border-app rounded-m shadow-card p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-text-primary text-base">Operations Playbook</h3>
                  <p className="text-xs text-text-secondary">Dispatch pipeline operations and diagnostics.</p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs">
                  <button 
                    id="action-dispatch"
                    onClick={() => setActiveActionModal("dispatch")}
                    className="p-4 bg-gray-50 border border-border-app rounded-m hover:bg-primary-light hover:border-primary/30 transition-all font-semibold text-text-primary text-left flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold group-hover:text-primary transition-colors">Dispatch Active Trip</span>
                      <span className="text-[10px] text-text-secondary font-normal mt-0.5">Assign vehicle and driver to a route</span>
                    </div>
                    <Play size={14} className="text-text-muted group-hover:text-primary transition-colors" />
                  </button>

                  <button 
                    id="action-maintenance"
                    onClick={() => setActiveActionModal("maintenance")}
                    className="p-4 bg-gray-50 border border-border-app rounded-m hover:bg-warning-light/20 hover:border-warning/30 transition-all font-semibold text-text-primary text-left flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold group-hover:text-warning transition-colors">Log Mechanical Exception</span>
                      <span className="text-[10px] text-text-secondary font-normal mt-0.5">Place asset in repair bay & post alert</span>
                    </div>
                    <Wrench size={14} className="text-text-muted group-hover:text-warning transition-colors" />
                  </button>

                  <button 
                    id="action-diagnostics"
                    onClick={() => {
                      handleManualRefresh();
                      showToast("Diagnostics trigger sent. System analyzing vehicle sensor outputs.");
                    }}
                    className="p-4 bg-gray-50 border border-border-app rounded-m hover:bg-secondary-light hover:border-secondary/30 transition-all font-semibold text-text-primary text-left flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold group-hover:text-secondary transition-colors">Run System Diagnostics</span>
                      <span className="text-[10px] text-text-secondary font-normal mt-0.5">Scan telemetry logs for abnormalities</span>
                    </div>
                    <Activity size={14} className="text-text-muted group-hover:text-secondary transition-colors" />
                  </button>

                  <Link 
                    href="/maintenance"
                    className="p-4 bg-gray-50 border border-border-app rounded-m hover:bg-primary-light hover:border-primary/30 transition-all font-semibold text-text-primary text-left flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold group-hover:text-primary transition-colors">Open Maintenance Hub</span>
                      <span className="text-[10px] text-text-secondary font-normal mt-0.5">Manage work orders & preventive lists</span>
                    </div>
                    <ChevronRight size={14} className="text-text-muted group-hover:text-primary transition-colors" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Tab Contents: Active Fleet Roster (Vehicles Management) */}
      {activeTab === "vehicles" && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Controls: Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-surface-app border border-border-app p-5 rounded-m shadow-small items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
              <input
                id="vehicle-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by vehicle ID, name, or driver..."
                className="w-full h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs text-text-secondary font-bold mr-2 flex items-center gap-1 whitespace-nowrap">
                <Filter size={13} /> Status:
              </span>
              {["All", "Active", "Idle", "Maintenance", "Offline"].map((status) => (
                <button
                  key={status}
                  id={`filter-${status.toLowerCase()}`}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-m text-xs font-bold transition-all cursor-pointer whitespace-nowrap border
                    ${statusFilter === status 
                      ? "bg-primary text-text-on-primary border-primary shadow-small" 
                      : "bg-surface-app text-text-secondary border-border-app hover:bg-gray-50 hover:text-text-primary"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>

          </div>

          {/* Roster Grid View */}
          {filteredVehicles.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-surface-app rounded-m border border-dashed border-border-app shadow-card">
              <Truck className="text-text-muted mb-3" size={32} />
              <span className="text-sm font-bold text-text-primary">No Matching Vehicles Found</span>
              <span className="text-xs text-text-secondary mt-1">Try modifying your search text or status criteria filter.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => {
                const isBatteryLow = vehicle.fuelType === "Electric" && vehicle.fuelLevel < 20;
                const isFuelLow = vehicle.fuelType === "Diesel" && vehicle.fuelLevel < 20;
                const isOverheating = vehicle.engineTemp > 95;
                
                return (
                  <div 
                    key={vehicle.id} 
                    className="bg-surface-app border border-border-app rounded-m p-6 shadow-card hover:border-primary/20 transition-all duration-200 flex flex-col justify-between"
                  >
                    
                    {/* Vehicle Header Info */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">{vehicle.id}</span>
                          <span 
                            className={`inline-flex px-2 py-0.2 text-[9px] font-bold rounded-circular uppercase tracking-wider border
                              ${vehicle.status === "Active" ? "bg-success-light text-success border-success/20" : ""}
                              ${vehicle.status === "Idle" ? "bg-warning-light text-warning border-warning/20" : ""}
                              ${vehicle.status === "Maintenance" ? "bg-primary-light text-primary border-primary/20" : ""}
                              ${vehicle.status === "Offline" ? "bg-gray-100 text-text-secondary border-border-app" : ""}
                            `}
                          >
                            {vehicle.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-text-primary">{vehicle.name}</h4>
                        <span className="text-[11px] text-text-secondary block">{vehicle.type}</span>
                      </div>
                      
                      {/* Power / Fuel Badge Indicator */}
                      <div className={`p-2 rounded-m flex items-center justify-center
                        ${vehicle.fuelType === "Electric" ? "bg-info-light text-info" : "bg-gray-100 text-text-secondary"}
                      `}>
                        {vehicle.fuelType === "Electric" ? <Battery size={18} /> : <Fuel size={18} />}
                      </div>
                    </div>

                    {/* Progress Level Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-text-secondary">{vehicle.fuelType === "Electric" ? "Battery (SOC)" : "Fuel Tank"}</span>
                        <span className={`font-bold ${isBatteryLow || isFuelLow ? "text-error" : "text-text-primary"}`}>
                          {vehicle.fuelLevel}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                        <div 
                          className={`h-full rounded-circular transition-all duration-300
                            ${isBatteryLow || isFuelLow ? "bg-error" : vehicle.fuelType === "Electric" ? "bg-info" : "bg-secondary"}
                          `}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Sensor Telemetry Summary */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 text-xs">
                      <div>
                        <span className="text-text-secondary block text-[10px] uppercase font-bold">Speedometer</span>
                        <span className="font-bold text-text-primary mt-0.5 block">
                          {vehicle.speed > 0 ? `${vehicle.speed} km/h` : "Stationary"}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-[10px] uppercase font-bold">Driver Assigned</span>
                        <span className="font-bold text-text-primary mt-0.5 block truncate">
                          {vehicle.driver !== "None" ? vehicle.driver : "Unassigned"}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-[10px] uppercase font-bold">Thermal State</span>
                        <span className={`font-bold mt-0.5 block ${isOverheating ? "text-error" : "text-text-primary"}`}>
                          {vehicle.engineTemp}°C {isOverheating && "🔥"}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-[10px] uppercase font-bold">Service Due</span>
                        <span className="font-bold text-text-primary mt-0.5 block">
                          {vehicle.lastService}
                        </span>
                      </div>
                    </div>

                    {/* Actions on vehicle */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                      <button
                        id={`btn-diagnose-${vehicle.id}`}
                        onClick={() => {
                          showToast(`Initiating hardware diagnostics scan for ${vehicle.id}...`);
                          setTimeout(() => {
                            if (vehicle.engineTemp > 90) {
                              showToast(`Diagnostics Completed for ${vehicle.id}: Coolant thermistor reading out of range.`);
                            } else {
                              showToast(`Diagnostics Completed for ${vehicle.id}: All hardware sensors verified OK.`);
                            }
                          }, 1500);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-text-secondary border border-border-app bg-white hover:bg-gray-50 rounded shadow-small cursor-pointer transition-colors"
                      >
                        Run Diags
                      </button>
                      
                      {vehicle.status === "Idle" && (
                        <button
                          id={`btn-dispatch-${vehicle.id}`}
                          onClick={() => {
                            setDispatchForm(prev => ({ ...prev, vehicleId: vehicle.id }));
                            setActiveActionModal("dispatch");
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-text-on-primary bg-primary border border-primary hover:bg-primary/95 rounded shadow-small cursor-pointer transition-colors"
                        >
                          Dispatch
                        </button>
                      )}

                      {vehicle.status !== "Maintenance" && vehicle.status !== "Offline" && (
                        <button
                          id={`btn-service-${vehicle.id}`}
                          onClick={() => {
                            setMaintenanceForm(prev => ({ ...prev, vehicleId: vehicle.id }));
                            setActiveActionModal("maintenance");
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-text-on-primary bg-secondary border border-secondary hover:bg-secondary/95 rounded shadow-small cursor-pointer transition-colors"
                        >
                          Book Service
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Tab Contents: Diagnostics & Exceptions Deep Dive */}
      {activeTab === "alerts" && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-surface-app border border-border-app rounded-m p-5 shadow-card space-y-4">
            <div>
              <h3 className="font-bold text-text-primary text-lg">Active Safety & Diagnostic Exceptions</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Real-time warnings triggered by on-vehicle sensors, GPS fences, or telemetry thresholds.
              </p>
            </div>

            <div className="overflow-x-auto border border-border-app rounded-m">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-app text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="p-4">Alert ID</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Diagnostic Message</th>
                    <th className="p-4">Affected Asset</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {alerts.map((alert) => (
                    <tr 
                      key={alert.id} 
                      className={`transition-colors 
                        ${alert.resolved ? "bg-gray-50/50 opacity-60" : "hover:bg-gray-50/30"}
                      `}
                    >
                      <td className="p-4 font-mono font-bold text-xs">{alert.id}</td>
                      <td className="p-4">
                        <span 
                          className={`inline-flex px-2 py-0.2 text-[9px] font-bold rounded-circular border uppercase tracking-wider
                            ${alert.resolved 
                              ? "bg-gray-100 text-text-secondary border-border-app"
                              : alert.severity === "critical"
                                ? "bg-error-light text-error border-error/20"
                                : "bg-warning-light text-warning border-warning/20"
                            }
                          `}
                        >
                          {alert.resolved ? "Resolved" : alert.severity}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {!alert.resolved && (
                            <AlertCircle size={14} className={alert.severity === "critical" ? "text-error" : "text-warning"} />
                          )}
                          <span className={`font-semibold text-xs ${alert.resolved ? "line-through text-text-muted" : "text-text-primary"}`}>
                            {alert.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-text-primary">{alert.assetName}</span>
                          <span className="text-[10px] text-text-secondary font-mono">{alert.assetId}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary text-xs">{alert.time}</td>
                      <td className="p-4 text-right">
                        {alert.resolved ? (
                          <span className="text-xs text-success font-semibold flex items-center justify-end gap-1.5">
                            <CheckCircle2 size={14} /> Clear
                          </span>
                        ) : (
                          <button
                            id={`btn-table-resolve-${alert.id}`}
                            onClick={() => handleResolveAlert(alert.id)}
                            className="px-3 py-1 text-xs font-bold text-text-on-primary bg-primary hover:bg-primary/95 border border-primary rounded shadow-small cursor-pointer transition-colors"
                          >
                            Resolve Alert
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border border-border-app rounded-m text-xs text-text-secondary flex gap-2 items-start">
              <Sparkles className="text-warning shrink-0 mt-0.5" size={16} />
              <div>
                <span className="font-bold text-text-primary block">Automated Troubleshooting Guidelines</span>
                <p className="mt-0.5">
                  Exceptions classified as <span className="font-semibold text-error">critical</span> require immediate dispatch communication or emergency routing to the nearest service node. Warnings should be monitored and booked for preventative maintenance within 48 hours of telemetry flag.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Action Dialog: Simulated Dispatch Modal */}
      {activeActionModal === "dispatch" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-app border border-border-app w-full max-w-md rounded-m shadow-dialog p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-app pb-3">
              <h3 className="font-bold text-text-primary text-base">Dispatch Route Pipeline</h3>
              <button 
                onClick={() => setActiveActionModal(null)}
                className="hover:bg-gray-100 p-1 rounded text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={executeDispatch} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Select Standby Vehicle</label>
                <select
                  id="dispatch-select-vehicle"
                  value={dispatchForm.vehicleId}
                  onChange={(e) => setDispatchForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                >
                  <option value="">-- Select Idle Asset --</option>
                  {vehicles.filter(v => v.status === "Idle").map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id}) - Fuel/Battery: {v.fuelLevel}%</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Assign Rostered Driver</label>
                <select
                  id="dispatch-select-driver"
                  value={dispatchForm.driverId}
                  onChange={(e) => setDispatchForm(prev => ({ ...prev, driverId: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                >
                  <option value="">-- Select Driver --</option>
                  <option value="John Miller">John Miller (HOS: 2.5/8h)</option>
                  <option value="Clara Vance">Clara Vance (HOS: 0/8h)</option>
                  <option value="Stan Kowalski">Stan Kowalski (HOS: 1.2/8h)</option>
                  <option value="Marcus Vance">Marcus Vance (HOS: 4/8h)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Transit Route Pipeline</label>
                <input
                  id="dispatch-input-route"
                  type="text"
                  placeholder="e.g. LAX Depot → San Diego Terminal"
                  value={dispatchForm.route}
                  onChange={(e) => setDispatchForm(prev => ({ ...prev, route: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border-app">
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="px-4 py-2 border border-border-app hover:bg-gray-50 text-text-secondary rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="dispatch-submit-btn"
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-text-on-primary rounded font-bold cursor-pointer"
                >
                  Dispatch Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Dialog: Schedule Maintenance Modal */}
      {activeActionModal === "maintenance" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-app border border-border-app w-full max-w-md rounded-m shadow-dialog p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-app pb-3">
              <h3 className="font-bold text-text-primary text-base">Schedule Preventive Maintenance</h3>
              <button 
                onClick={() => setActiveActionModal(null)}
                className="hover:bg-gray-100 p-1 rounded text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={executeMaintenance} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Select Target Vehicle</label>
                <select
                  id="maintenance-select-vehicle"
                  value={maintenanceForm.vehicleId}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                >
                  <option value="">-- Select Active/Idle Asset --</option>
                  {vehicles.filter(v => v.status !== "Maintenance" && v.status !== "Offline").map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id}) - Current Temp: {v.engineTemp}°C</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Mechanical / Telemetry Exception Issue</label>
                <input
                  id="maintenance-input-issue"
                  type="text"
                  placeholder="e.g. Excessive transmission slippage, Brake pads worn"
                  value={maintenanceForm.issue}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, issue: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Alert Exception Severity</label>
                <div className="flex gap-4 items-center pt-1">
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input 
                      type="radio" 
                      name="severity" 
                      value="warning" 
                      checked={maintenanceForm.severity === "warning"} 
                      onChange={() => setMaintenanceForm(prev => ({ ...prev, severity: "warning" }))}
                      className="accent-warning"
                    />
                    <span>Warning (Routine Service)</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input 
                      type="radio" 
                      name="severity" 
                      value="critical" 
                      checked={maintenanceForm.severity === "critical"} 
                      onChange={() => setMaintenanceForm(prev => ({ ...prev, severity: "critical" }))}
                      className="accent-error"
                    />
                    <span className="text-error font-bold">Critical Safety Hold</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border-app">
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="px-4 py-2 border border-border-app hover:bg-gray-50 text-text-secondary rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="maintenance-submit-btn"
                  type="submit"
                  className="px-4 py-2 bg-secondary hover:bg-secondary/95 text-text-on-primary rounded font-bold cursor-pointer"
                >
                  Book Service Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
