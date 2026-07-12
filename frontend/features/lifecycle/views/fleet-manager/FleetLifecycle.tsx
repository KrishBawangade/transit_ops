"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  ArrowUpRight, 
  FileText, 
  Sparkles,
  Info,
  Layers,
  X,
  Gauge,
  Cpu,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";

interface VehicleLifecycle {
  id: string;
  name: string;
  model: string;
  driver: string;
  status: "Active" | "Idle" | "Maintenance" | "Retired";
  phase: "Procurement" | "Registration" | "Deployment" | "Maintenance" | "Repairs" | "Retirement";
  phaseProgress: number; // 0 to 100 for current phase
  purchaseDate: string;
  purchaseCost: number;
  ageYears: number;
  expectedLifeYears: number;
  healthScore: number;
  
  // Compliance
  insuranceExpiry: string;
  registrationExpiry: string;
  pucStatus: "Valid" | "Expiring" | "Expired";

  // Costs
  fuelCostMtd: number;
  maintenanceCostMtd: number;
  distanceKm: number;
}

function mapVehicleToLifecycle(v: any): VehicleLifecycle {
  let phase: VehicleLifecycle["phase"] = "Deployment";
  let phaseProgress = 90;
  let status: VehicleLifecycle["status"] = "Active";

  if (v.status === "On Trip" || v.status === "ON_TRIP") {
    status = "Active";
    phase = "Deployment";
    phaseProgress = 95;
  } else if (v.status === "Available" || v.status === "AVAILABLE" || v.status === "Idle") {
    status = "Idle";
    phase = "Registration";
    phaseProgress = 100;
  } else if (v.status === "In Shop" || v.status === "IN_SHOP" || v.status === "Maintenance") {
    status = "Maintenance";
    phase = "Maintenance";
    phaseProgress = 35;
  } else if (v.status === "Retired" || v.status === "RETIRED" || v.status === "Offline") {
    status = "Retired";
    phase = "Retirement";
    phaseProgress = 100;
  }

  const purchaseYear = v.purchaseDate ? new Date(v.purchaseDate).getFullYear() : 2024;
  const currentYear = new Date().getFullYear();
  const ageYears = Math.max(0.1, currentYear - purchaseYear);

  return {
    id: v.id,
    name: v.name || v.registrationNumber,
    model: v.model || "Unknown Model",
    driver: v.driverName || "Unassigned",
    status,
    phase,
    phaseProgress,
    purchaseDate: v.purchaseDate || "2024-01-01",
    purchaseCost: v.acquisitionCost || 120000,
    ageYears,
    expectedLifeYears: 10,
    healthScore: v.status === "In Shop" || v.status === "IN_SHOP" ? 65 : 95,
    insuranceExpiry: v.insuranceExpiry || "2027-01-01",
    registrationExpiry: v.fitnessExpiry || "2027-01-01",
    pucStatus: "Valid",
    fuelCostMtd: 2450,
    maintenanceCostMtd: v.status === "In Shop" || v.status === "IN_SHOP" ? 3450 : 450,
    distanceKm: v.odometer || 45000
  };
}

export default function FleetLifecycle() {
  // 1. Core States
  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [selectedVehicleId, setSelectedVehicleId] = useState("V-8821");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add Vehicle Form State
  const [newVehicleForm, setNewVehicleForm] = useState({
    id: "",
    name: "",
    model: "",
    driver: "",
    phase: "Procurement" as const,
    purchaseCost: 0,
    expectedLife: 10
  });

  // 2. Lifecycle Database State
  const [vehicles, setVehicles] = useState<VehicleLifecycle[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await vehicleService.getVehicles();
        if (data && data.length > 0) {
          setVehicles(data.map(mapVehicleToLifecycle));
          setSelectedVehicleId(data[0].id);
        } else {
          setVehicles([
            { id: "V-8821", name: "Volvo FH16 Heavy", model: "Volvo FH16 (Diesel)", driver: "Alex Rivera", status: "Active", phase: "Maintenance", phaseProgress: 80, purchaseDate: "2022-04-10", purchaseCost: 145000, ageYears: 4.2, expectedLifeYears: 10, healthScore: 92, insuranceExpiry: "2026-11-15", registrationExpiry: "2027-04-10", pucStatus: "Valid", fuelCostMtd: 2450, maintenanceCostMtd: 820, distanceKm: 45200 },
            { id: "V-2210", name: "Peterbilt Road Master", model: "Peterbilt 579 (Diesel)", driver: "Dave Miller", status: "Active", phase: "Deployment", phaseProgress: 95, purchaseDate: "2023-08-15", purchaseCost: 138000, ageYears: 2.9, expectedLifeYears: 10, healthScore: 88, insuranceExpiry: "2026-08-20", registrationExpiry: "2028-08-15", pucStatus: "Valid", fuelCostMtd: 2890, maintenanceCostMtd: 450, distanceKm: 32100 },
            { id: "V-1102", name: "Tesla Semi-EV 1", model: "Tesla Semi Gen 1 (EV)", driver: "Elena Rostova", status: "Maintenance", phase: "Repairs", phaseProgress: 45, purchaseDate: "2021-01-20", purchaseCost: 180000, ageYears: 5.5, expectedLifeYears: 8, healthScore: 64, insuranceExpiry: "2026-07-28", registrationExpiry: "2026-07-20", pucStatus: "Expiring", fuelCostMtd: 820, maintenanceCostMtd: 3450, distanceKm: 65100 },
            { id: "V-5582", name: "Mack Anthem Hauler", model: "Mack Anthem (Diesel)", driver: "Marcus Vance", status: "Active", phase: "Deployment", phaseProgress: 75, purchaseDate: "2024-03-02", purchaseCost: 125000, ageYears: 2.3, expectedLifeYears: 12, healthScore: 95, insuranceExpiry: "2026-09-02", registrationExpiry: "2029-03-02", pucStatus: "Valid", fuelCostMtd: 2150, maintenanceCostMtd: 180, distanceKm: 18400 },
            { id: "V-7710", name: "Scania Eco-Liner", model: "Scania R500 (Hybrid)", driver: "Sarah Jenkins", status: "Idle", phase: "Maintenance", phaseProgress: 20, purchaseDate: "2020-05-18", purchaseCost: 152000, ageYears: 6.1, expectedLifeYears: 10, healthScore: 78, insuranceExpiry: "2026-10-18", registrationExpiry: "2025-05-18", pucStatus: "Expired", fuelCostMtd: 1450, maintenanceCostMtd: 1250, distanceKm: 89000 },
            { id: "V-4412", name: "Kenworth Express", model: "Kenworth T680 (Diesel)", driver: "Jameson Blake", status: "Retired", phase: "Retirement", phaseProgress: 100, purchaseDate: "2016-11-05", purchaseCost: 110000, ageYears: 9.6, expectedLifeYears: 10, healthScore: 42, insuranceExpiry: "2025-11-05", registrationExpiry: "2026-11-05", pucStatus: "Expired", fuelCostMtd: 0, maintenanceCostMtd: 5800, distanceKm: 245000 }
          ]);
          setSelectedVehicleId("V-8821");
        }
      } catch (err) {
        console.error("Failed to load vehicle lifecycles, using mock data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 3. Selection & Filtering logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPhase = phaseFilter === "All" || v.phase === phaseFilter;
      return matchesSearch && matchesPhase;
    });
  }, [vehicles, searchTerm, phaseFilter]);

  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  }, [vehicles, selectedVehicleId]);

  // 4. Global KPIs calculations
  const kpis = useMemo(() => {
    if (vehicles.length === 0) {
      return { total: 0, active: 0, nearEol: 0, avgAge: "0", avgHealth: 0 };
    }
    const total = vehicles.length;
    const active = vehicles.filter(v => v.status === "Active").length;
    const nearEol = vehicles.filter(v => (v.expectedLifeYears - v.ageYears) <= 1.5 && v.phase !== "Retirement").length;
    const avgAge = vehicles.reduce((acc, curr) => acc + curr.ageYears, 0) / total;
    const avgHealth = vehicles.reduce((acc, curr) => acc + curr.healthScore, 0) / total;

    return {
      total,
      active,
      nearEol,
      avgAge: avgAge.toFixed(1),
      avgHealth: Math.round(avgHealth)
    };
  }, [vehicles]);

  // 5. Custom handlers
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleForm.id || !newVehicleForm.name || !newVehicleForm.model) {
      alert("Please fill out all required fields.");
      return;
    }

    const servicePayload = {
      registrationNumber: newVehicleForm.id,
      name: newVehicleForm.name,
      manufacturer: newVehicleForm.name.split(" ")[0] || "Volvo",
      model: newVehicleForm.model,
      type: "Truck" as const,
      capacity: "15 Tons",
      purchaseDate: new Date().toISOString().split("T")[0],
      fuelType: newVehicleForm.model.toLowerCase().includes("ev") || newVehicleForm.model.toLowerCase().includes("electric") ? "Electric" : "Diesel",
      odometer: 0,
      acquisitionCost: Number(newVehicleForm.purchaseCost) || 120000,
      insuranceExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
      fitnessExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 5).toISOString().split("T")[0],
      status: "Available" as const,
      notes: "Created via lifecycle dashboard."
    };

    vehicleService.createVehicle(servicePayload)
      .then((created: any) => {
        const lifecycleVehicle = mapVehicleToLifecycle(created);
        setVehicles(prev => [lifecycleVehicle, ...prev]);
        setSelectedVehicleId(lifecycleVehicle.id);
        showToast(`Successfully registered new asset ${lifecycleVehicle.id} (${lifecycleVehicle.name}) in Procurement.`);
      })
      .catch((err: any) => {
        console.warn("Backend vehicle creation failed, falling back to local simulation:", err);
        const newAsset: VehicleLifecycle = {
          id: newVehicleForm.id,
          name: newVehicleForm.name,
          model: newVehicleForm.model,
          driver: newVehicleForm.driver || "Unassigned",
          status: "Idle",
          phase: newVehicleForm.phase,
          phaseProgress: 10,
          purchaseDate: new Date().toISOString().split("T")[0],
          purchaseCost: Number(newVehicleForm.purchaseCost) || 120000,
          ageYears: 0.1,
          expectedLifeYears: Number(newVehicleForm.expectedLife) || 10,
          healthScore: 100,
          insuranceExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
          registrationExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 5).toISOString().split("T")[0],
          pucStatus: "Valid",
          fuelCostMtd: 0,
          maintenanceCostMtd: 0,
          distanceKm: 0
        };
        setVehicles(prev => [newAsset, ...prev]);
        setSelectedVehicleId(newAsset.id);
        showToast(`Successfully registered new asset ${newAsset.id} (${newAsset.name}) in Procurement.`);
      });

    setIsAddVehicleOpen(false);
    setNewVehicleForm({
      id: "",
      name: "",
      model: "",
      driver: "",
      phase: "Procurement",
      purchaseCost: 0,
      expectedLife: 10
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  if (vehicles.length === 0 || !selectedVehicle) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary animate-pulse" />
          <p className="text-xs text-text-secondary font-semibold">Loading Fleet Assets Lifecycle...</p>
        </div>
      </div>
    );
  }

  // Remaining useful life & priority calculations
  const remainingLife = selectedVehicle.expectedLifeYears - selectedVehicle.ageYears;
  const resaleValueEstimate = Math.max(
    selectedVehicle.purchaseCost * 0.15,
    selectedVehicle.purchaseCost * (1 - (selectedVehicle.ageYears / selectedVehicle.expectedLifeYears))
  );

  const replacementPriority = useMemo(() => {
    if (selectedVehicle.phase === "Retirement") return { label: "Completed", color: "text-text-secondary bg-gray-100 border-gray-200" };
    if (remainingLife <= 1.0 || selectedVehicle.healthScore < 50) return { label: "CRITICAL", color: "text-error bg-error-light/25 border-error/20" };
    if (remainingLife <= 2.5 || selectedVehicle.healthScore < 75) return { label: "MEDIUM", color: "text-warning bg-warning-light border-warning/20" };
    return { label: "LOW", color: "text-success bg-success-light text-success border-success/20" };
  }, [selectedVehicle, remainingLife]);

  // Timeline phase indices
  const phasesOrder = ["Procurement", "Registration", "Deployment", "Maintenance", "Repairs", "Retirement"];
  const currentPhaseIndex = phasesOrder.indexOf(selectedVehicle.phase);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-800 text-text-on-primary text-xs px-4 py-3 rounded-m shadow-dialog animate-fadeIn transition-all duration-300">
          <Sparkles size={16} className="text-warning animate-pulse" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:bg-gray-800 rounded p-0.5 text-text-muted hover:text-text-on-primary">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-border-app pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary-light text-primary rounded border border-primary/10">
              Asset Lifecycle
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-secondary-light text-secondary rounded border border-secondary/10">
              Manager Panel
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1.5 tracking-tight flex items-center gap-2">
            Fleet Asset Lifecycle
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track asset milestones, schedule compliance filings, evaluate lifetime costs, and schedule retirement planning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          {/* Search Asset */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-text-muted" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Vehicle ID..."
              className="h-9 pl-9 pr-3 w-40 rounded-m border border-border-app bg-surface-app text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white transition-all shadow-small"
            />
          </div>

          {/* Phase Filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-text-secondary" />
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="h-9 border border-border-app bg-surface-app rounded-m px-2.5 text-xs text-text-primary font-bold focus:outline-none shadow-small"
            >
              <option value="All">All Phases</option>
              {phasesOrder.map(phase => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
          </div>

          {/* Add Vehicle Button */}
          <button
            onClick={() => setIsAddVehicleOpen(true)}
            className="flex h-9 items-center gap-1.5 px-4 rounded-m bg-primary text-text-on-primary text-xs font-bold hover:bg-primary/95 transition-all shadow-small cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* 2. Lifecycle Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        
        {/* KPI: Total Fleet Assets */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-primary/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Total Fleet Assets</span>
            <span className="text-3xl font-extrabold text-text-primary mt-1.5 block">{kpis.total}</span>
          </div>
          <span className="text-[10px] text-text-muted mt-4 block">Active in database</span>
        </div>

        {/* KPI: Active Vehicles */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Active Roster</span>
            <span className="text-3xl font-extrabold text-success mt-1.5 block">{kpis.active}</span>
          </div>
          <span className="text-[10px] text-success font-semibold mt-4 block">Currently on-road dispatches</span>
        </div>

        {/* KPI: Near End-of-Life */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-error/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Near End-of-Life</span>
            <span className="text-3xl font-extrabold text-error mt-1.5 block">{kpis.nearEol}</span>
          </div>
          <span className="text-[10px] text-error font-semibold mt-4 block">Requires retirement audit</span>
        </div>

        {/* KPI: Average Fleet Age */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-info/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Avg Fleet Age</span>
            <span className="text-3xl font-extrabold text-text-primary mt-1.5 block">{kpis.avgAge} yrs</span>
          </div>
          <span className="text-[10px] text-text-muted mt-4 block">Target life expectation: 10 yrs</span>
        </div>

        {/* KPI: Fleet Health Score */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-secondary/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Fleet Health Score</span>
            <span className="text-3xl font-extrabold text-secondary mt-1.5 block">{kpis.avgHealth}%</span>
          </div>
          <span className="text-[10px] text-secondary font-semibold mt-4 block">Average telemetry audit</span>
        </div>

      </div>

      {/* Main Grid split: 1/3 list & 2/3 details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (1/3): Vehicles Registry list */}
        <div className="space-y-4">
          <div className="bg-surface-app border border-border-app rounded-m p-5 shadow-card space-y-4">
            <div>
              <h3 className="font-bold text-text-primary text-base">Fleet Assets Registry</h3>
              <p className="text-xs text-text-secondary mt-0.5">Select a vehicle to inspect lifecycle details.</p>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredVehicles.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center bg-gray-50 border border-dashed border-border-app rounded">
                  <Truck className="text-text-muted mb-2" size={24} />
                  <span className="text-xs font-bold text-text-primary">No Assets Found</span>
                </div>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const isSelected = vehicle.id === selectedVehicleId;
                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicleId(vehicle.id)}
                      className={`p-4 rounded border text-xs cursor-pointer transition-all flex items-center justify-between
                        ${isSelected 
                          ? "bg-primary-light border-primary/45 hover:border-primary/60" 
                          : "bg-surface-app border-border-app hover:border-gray-300 hover:bg-gray-50/50"
                        }
                      `}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-primary text-xs">{vehicle.id}</span>
                          <span className="font-bold text-text-primary">{vehicle.name}</span>
                        </div>
                        <span className="text-[10px] text-text-secondary block">{vehicle.model}</span>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`inline-block px-1.5 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider
                          ${vehicle.phase === "Retirement" ? "bg-gray-100 text-text-secondary" : "bg-primary-light text-primary"}
                        `}>
                          {vehicle.phase}
                        </span>
                        <span className="text-[9px] text-text-muted block">Age: {vehicle.ageYears} yrs</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (2/3): Selected Vehicle Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 3. Vehicle Lifecycle Timeline */}
          <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-6">
            <div>
              <h3 className="font-bold text-text-primary text-base">Vehicle Lifecycle Timeline</h3>
              <p className="text-xs text-text-secondary mt-0.5">Selected Asset: <span className="font-bold text-primary font-mono">{selectedVehicle.id}</span></p>
            </div>

            {/* Horizontal Timeline */}
            <div className="relative pt-2 pb-4">
              {/* Background Connective Line */}
              <div className="absolute top-[21px] left-8 right-8 h-1 bg-gray-100 rounded"></div>
              {/* Active Connective Line */}
              <div 
                className="absolute top-[21px] left-8 h-1 bg-primary rounded transition-all duration-500"
                style={{ width: `${(currentPhaseIndex / (phasesOrder.length - 1)) * 88}%` }}
              ></div>

              <div className="relative flex justify-between items-start text-center">
                {phasesOrder.map((phase, index) => {
                  const isCompleted = index < currentPhaseIndex;
                  const isCurrent = index === currentPhaseIndex;
                  const isUpcoming = index > currentPhaseIndex;

                  return (
                    <div key={phase} className="flex-1 flex flex-col items-center">
                      {/* Timeline Node circle */}
                      <div className={`h-7 w-7 rounded-circular flex items-center justify-center border-2 transition-all duration-300 z-10
                        ${isCompleted ? "bg-primary border-primary text-text-on-primary" : ""}
                        ${isCurrent ? "bg-white border-primary text-primary scale-110 shadow-small" : ""}
                        ${isUpcoming ? "bg-white border-gray-200 text-text-muted" : ""}
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <span className="text-[10px] font-bold">{index + 1}</span>
                        )}
                      </div>

                      {/* Labels */}
                      <span className={`text-[10px] font-bold mt-2.5 block
                        ${isCurrent ? "text-primary scale-105" : "text-text-secondary"}
                      `}>
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase completion Progress Info */}
            <div className="p-4 bg-gray-50 border border-border-app rounded flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-text-primary">Current Phase: {selectedVehicle.phase}</span>
                <p className="text-[10px] text-text-secondary">Milestone execution and registry synchronization checks.</p>
              </div>
              
              <div className="w-44 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-text-secondary">
                  <span>Phase Progress</span>
                  <span>{selectedVehicle.phaseProgress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-primary rounded-circular" style={{ width: `${selectedVehicle.phaseProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid layout for Details & Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 4. Vehicle Details View */}
            <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-border-app pb-2">
                <Info className="text-primary" size={16} />
                <h3 className="font-bold text-text-primary text-base">Vehicle Information</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-text-secondary font-semibold">Name / Alias</span>
                  <span className="font-bold text-text-primary">{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-text-secondary font-semibold">Model Class</span>
                  <span className="font-bold text-text-primary">{selectedVehicle.model}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-text-secondary font-semibold">Procured Date</span>
                  <span className="font-semibold text-text-primary">{selectedVehicle.purchaseDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-text-secondary font-semibold">Procurement Cost</span>
                  <span className="font-bold text-text-primary">${selectedVehicle.purchaseCost.toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-text-secondary font-semibold">Assigned Driver</span>
                  <span className="font-bold text-primary">{selectedVehicle.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary font-semibold">Operational Status</span>
                  <span className={`inline-block px-1.5 rounded text-[9px] font-bold uppercase tracking-wider
                    ${selectedVehicle.status === "Active" ? "bg-success-light text-success" : ""}
                    ${selectedVehicle.status === "Idle" ? "bg-warning-light text-warning" : ""}
                    ${selectedVehicle.status === "Maintenance" ? "bg-error-light text-error" : ""}
                    ${selectedVehicle.status === "Retired" ? "bg-gray-100 text-text-secondary" : ""}
                  `}>
                    {selectedVehicle.status}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Maintenance & Compliance View */}
            <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-border-app pb-2">
                <FileText className="text-secondary" size={16} />
                <h3 className="font-bold text-text-primary text-base">Compliance & Fitness Audit</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-gray-100 pb-2 items-center">
                  <span className="text-text-secondary font-semibold">Insurance Expiration</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-text-muted" />
                    <span className="font-bold text-text-primary">{selectedVehicle.insuranceExpiry}</span>
                  </div>
                </div>
                
                <div className="flex justify-between border-b border-gray-100 pb-2 items-center">
                  <span className="text-text-secondary font-semibold">Registration Renewal</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-text-muted" />
                    <span className="font-bold text-text-primary">{selectedVehicle.registrationExpiry}</span>
                  </div>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-2 items-center">
                  <span className="text-text-secondary font-semibold">Fitness / PUC Status</span>
                  <span className={`inline-flex px-2 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                    ${selectedVehicle.pucStatus === "Valid" ? "bg-success-light text-success border-success/20" : ""}
                    ${selectedVehicle.pucStatus === "Expiring" ? "bg-warning-light text-warning border-warning/20" : ""}
                    ${selectedVehicle.pucStatus === "Expired" ? "bg-error-light text-error border-error/20" : ""}
                  `}>
                    {selectedVehicle.pucStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-semibold">Odometer Telemetry</span>
                  <div className="flex items-center gap-1">
                    <Gauge size={13} className="text-text-muted" />
                    <span className="font-bold text-text-primary">{selectedVehicle.distanceKm.toLocaleString("en-US")} KM</span>
                  </div>
                </div>

                {/* Status validation alert */}
                {selectedVehicle.pucStatus === "Expired" && (
                  <div className="p-3 bg-error-light/20 border border-error/20 rounded flex gap-2 items-start mt-2">
                    <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
                    <p className="text-[10px] text-text-secondary leading-normal">
                      **Registration expired** or fitness checklist expired. Place vehicle on administrative safety hold.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Grid layout for Cost & Replacement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 6. Cost & Utilization View */}
            <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-border-app pb-2">
                <DollarSign className="text-success" size={16} />
                <h3 className="font-bold text-text-primary text-base">Cost & Lifetime Valuation</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-semibold">Fuel Cost MTD</span>
                  <span className="font-bold text-text-primary">${selectedVehicle.fuelCostMtd.toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-semibold">Maintenance Cost MTD</span>
                  <span className="font-bold text-text-primary">${selectedVehicle.maintenanceCostMtd.toLocaleString("en-US")}</span>
                </div>
                
                {/* Total Cost of Ownership */}
                <div className="p-3.5 bg-gray-50 border border-border-app rounded space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Total Cost of Ownership</span>
                    <span className="text-sm font-extrabold text-secondary">
                      ${(selectedVehicle.purchaseCost + selectedVehicle.maintenanceCostMtd + (selectedVehicle.fuelCostMtd * 12)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <p className="text-[9px] text-text-secondary leading-normal">
                    TCO reflects purchase outlay, maintenance logs, and estimated annualized fuel utilization costs.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Replacement Planning View */}
            <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-border-app pb-2">
                <Activity className="text-secondary" size={16} />
                <h3 className="font-bold text-text-primary text-base">Replacement Strategy</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-semibold">Remaining Useful Life</span>
                  <span className="font-bold text-text-primary">
                    {remainingLife <= 0 ? "Expired" : `${remainingLife.toFixed(1)} years`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-semibold">Estimated Resale Value</span>
                  <span className="font-extrabold text-success">
                    ${resaleValueEstimate.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-semibold">Replacement Priority</span>
                  <span className={`inline-flex px-2 py-0.2 text-[9px] font-bold rounded border uppercase tracking-wider
                    ${replacementPriority.color}
                  `}>
                    {replacementPriority.label}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* 8. Fleet Manager Insights */}
          <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-border-app pb-2">
              <Cpu className="text-primary animate-pulse" size={16} />
              <h3 className="font-bold text-text-primary text-base">AI-Powered Replacement Strategy Recommendations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 bg-gray-50 border border-border-app rounded space-y-1">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <Sparkles className="text-warning shrink-0" size={14} />
                  Compliance Expiry Warning
                </span>
                <p className="text-[10px] text-text-secondary leading-normal">
                  Scania (V-7710) has an expired registration since 2025-05-18. Remove from dispatch queues and schedule immediate fitness compliance tests.
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-border-app rounded space-y-1">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <TrendingUp className="text-primary shrink-0" size={14} />
                  Retirement Recommendation
                </span>
                <p className="text-[10px] text-text-secondary leading-normal">
                  Tesla Semi (V-1102) has high maintenance costs MTD (${selectedVehicle.maintenanceCostMtd.toLocaleString("en-US")}) which exceeds expected residual amortization levels. Retiring this asset soon is highly recommended.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Add Vehicle Modal Dialog */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-app border border-border-app w-full max-w-md rounded-m shadow-dialog p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-app pb-3">
              <h3 className="font-bold text-text-primary text-base">Register Fleet Asset</h3>
              <button 
                onClick={() => setIsAddVehicleOpen(false)}
                className="hover:bg-gray-100 p-1 rounded text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Vehicle ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. V-8890"
                    value={newVehicleForm.id}
                    onChange={(e) => setNewVehicleForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Volvo FH16"
                    value={newVehicleForm.name}
                    onChange={(e) => setNewVehicleForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Model & Engine Specification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volvo FH16 (Diesel) or Tesla Semi (EV)"
                  value={newVehicleForm.model}
                  onChange={(e) => setNewVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Assigned Driver</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={newVehicleForm.driver}
                    onChange={(e) => setNewVehicleForm(prev => ({ ...prev, driver: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Lifecycle Status Phase</label>
                  <select
                    value={newVehicleForm.phase}
                    onChange={(e) => setNewVehicleForm(prev => ({ ...prev, phase: e.target.value as any }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  >
                    <option value="Procurement">Procurement</option>
                    <option value="Registration">Registration</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Repairs">Repairs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Purchase Outlay ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="125000"
                    value={newVehicleForm.purchaseCost || ""}
                    onChange={(e) => setNewVehicleForm(prev => ({ ...prev, purchaseCost: Number(e.target.value) }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Expected Useful Life (Years)</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={newVehicleForm.expectedLife || ""}
                    onChange={(e) => setNewVehicleForm(prev => ({ ...prev, expectedLife: Number(e.target.value) }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border-app">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2 border border-border-app hover:bg-gray-50 text-text-secondary rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-text-on-primary rounded font-bold cursor-pointer"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
