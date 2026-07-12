"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Wrench, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  User, 
  TrendingUp, 
  X, 
  Activity, 
  Sparkles, 
  Gauge, 
  FileText, 
  ChevronRight
} from "lucide-react";

interface WorkOrder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  issue: string;
  type: "Mechanical" | "Electrical" | "Routine" | "Safety Inspection";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Scheduled" | "In Progress" | "Awaiting Parts" | "Completed";
  technician: string;
  cost: number;
  startDate: string;
  progress: number;
}

interface PreventiveItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  serviceType: string;
  dueInKm: number;
  dueInDays: number;
  status: "Overdue" | "Due Soon" | "Good";
}

export default function MaintenanceDashboard() {
  // 1. Core States
  const [activeTab, setActiveTab] = useState<"orders" | "schedule" | "history">("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modal State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState<{
    vehicleId: string;
    vehicleName: string;
    issue: string;
    type: "Mechanical" | "Electrical" | "Routine" | "Safety Inspection";
    priority: "Critical" | "High" | "Medium" | "Low";
    technician: string;
    costEstimate: number;
  }>({
    vehicleId: "",
    vehicleName: "",
    issue: "",
    type: "Mechanical",
    priority: "Medium",
    technician: "",
    costEstimate: 0
  });

  // 2. Mock Data State
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { id: "WO-3024", vehicleId: "V-8821", vehicleName: "Volvo FH16", issue: "Engine cylinder misfire & coolant temp spike", type: "Mechanical", priority: "Critical", status: "In Progress", technician: "Sarah Jenkins", cost: 1250, startDate: "2026-07-11", progress: 65 },
    { id: "WO-3023", vehicleId: "V-2210", vehicleName: "Peterbilt 579", issue: "Brake pad replacement & caliper overhaul", type: "Mechanical", priority: "High", status: "Awaiting Parts", technician: "Dave Miller", cost: 890, startDate: "2026-07-10", progress: 20 },
    { id: "WO-3022", vehicleId: "V-1102", vehicleName: "Tesla Semi (Gen 1)", issue: "High-voltage battery diagnostic check", type: "Electrical", priority: "High", status: "In Progress", technician: "Elena Rostova", cost: 450, startDate: "2026-07-12", progress: 45 },
    { id: "WO-3021", vehicleId: "V-5582", vehicleName: "Mack Anthem", issue: "Scheduled safety & emissions inspection", type: "Safety Inspection", priority: "Medium", status: "Scheduled", technician: "Marcus Vance", cost: 180, startDate: "2026-07-13", progress: 0 },
    { id: "WO-3020", vehicleId: "V-7710", vehicleName: "Scania R500", issue: "Air conditioning compressor replacement", type: "Electrical", priority: "Low", status: "Completed", technician: "Sarah Jenkins", cost: 620, startDate: "2026-07-08", progress: 100 }
  ]);

  const [preventiveSchedule] = useState<PreventiveItem[]>([
    { id: "PM-102", vehicleId: "V-4412", vehicleName: "Kenworth T680", serviceType: "Engine Oil & Filter Change", dueInKm: -120, dueInDays: -3, status: "Overdue" },
    { id: "PM-103", vehicleId: "V-9011", vehicleName: "Tesla Semi (Gen 2)", serviceType: "Tire Rotation & Alignment Check", dueInKm: 420, dueInDays: 5, status: "Due Soon" },
    { id: "PM-104", vehicleId: "V-5582", vehicleName: "Mack Anthem", serviceType: "Transmission Fluid Swap", dueInKm: 1800, dueInDays: 14, status: "Good" },
    { id: "PM-105", vehicleId: "V-8821", vehicleName: "Volvo FH16", serviceType: "Air Brake System Cleanse", dueInKm: 250, dueInDays: 2, status: "Due Soon" },
    { id: "PM-106", vehicleId: "V-3340", vehicleName: "Freightliner Cascadia", serviceType: "Cabin Air Filter Replacement", dueInKm: 4900, dueInDays: 45, status: "Good" }
  ]);

  // 3. Automated Simulation of Maintenance Progress
  useEffect(() => {
    const timer = setInterval(() => {
      setWorkOrders(prev => prev.map(wo => {
        if (wo.status === "In Progress") {
          const increment = Math.floor(Math.random() * 8) + 1;
          const nextProgress = Math.min(100, wo.progress + increment);
          const nextStatus = nextProgress === 100 ? "Completed" as const : wo.status;
          
          if (nextProgress === 100 && wo.progress < 100) {
            triggerToast(`Work Order ${wo.id} (${wo.vehicleName}) has been completed!`);
          }

          return {
            ...wo,
            progress: nextProgress,
            status: nextStatus
          };
        }
        return wo;
      }));
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 4. Metrics Calculation
  const calculatedMetrics = useMemo(() => {
    const activeOrders = workOrders.filter(w => w.status !== "Completed");
    const activeCount = activeOrders.length;
    const criticalCount = activeOrders.filter(w => w.priority === "Critical").length;
    const completedOrders = workOrders.filter(w => w.status === "Completed");
    
    const totalMtdSpend = workOrders.reduce((acc, curr) => acc + curr.cost, 0);
    const overdueScheduleCount = preventiveSchedule.filter(p => p.status === "Overdue").length;

    return {
      activeCount,
      criticalCount,
      totalMtdSpend,
      overdueScheduleCount
    };
  }, [workOrders, preventiveSchedule]);

  // 5. Filtering & Search logic
  const filteredOrders = useMemo(() => {
    return workOrders.filter(w => {
      const matchesSearch = w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            w.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            w.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            w.technician.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === "All" || w.priority === priorityFilter;
      const matchesStatus = statusFilter === "All" || w.status === statusFilter;
      
      // Render based on active tab
      const matchesTab = activeTab === "history" 
        ? w.status === "Completed" 
        : w.status !== "Completed";

      return matchesSearch && matchesPriority && matchesStatus && matchesTab;
    });
  }, [workOrders, searchTerm, priorityFilter, statusFilter, activeTab]);

  // 6. Action Handlers
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.vehicleId || !newOrderForm.issue || !newOrderForm.technician) {
      alert("Please fill in all required work order parameters.");
      return;
    }

    const newWO: WorkOrder = {
      id: `WO-${Math.floor(Math.random() * 1000) + 3100}`,
      vehicleId: newOrderForm.vehicleId,
      vehicleName: newOrderForm.vehicleName || `Vehicle ${newOrderForm.vehicleId}`,
      issue: newOrderForm.issue,
      type: newOrderForm.type,
      priority: newOrderForm.priority,
      status: "Scheduled",
      technician: newOrderForm.technician,
      cost: Number(newOrderForm.costEstimate) || 150,
      startDate: new Date().toISOString().split('T')[0],
      progress: 0
    };

    setWorkOrders(prev => [newWO, ...prev]);
    setIsNewOrderModalOpen(false);
    triggerToast(`Logged New Work Order ${newWO.id} for ${newWO.vehicleName}`);
    setNewOrderForm({
      vehicleId: "",
      vehicleName: "",
      issue: "",
      type: "Mechanical",
      priority: "Medium",
      technician: "",
      costEstimate: 0
    });
  };

  const handleUpdateStatus = (id: string, nextStatus: "In Progress" | "Awaiting Parts" | "Completed") => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === id) {
        const nextProgress = nextStatus === "Completed" ? 100 : wo.progress;
        return {
          ...wo,
          status: nextStatus,
          progress: nextProgress
        };
      }
      return wo;
    }));
    triggerToast(`Work Order ${id} updated to ${nextStatus}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-4">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-800 text-text-on-primary text-xs px-4 py-3 rounded-m shadow-dialog animate-fadeIn transition-all duration-300">
          <Sparkles size={16} className="text-warning animate-pulse" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:bg-gray-800 rounded p-0.5 text-text-muted hover:text-text-on-primary"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-app pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary-light text-primary rounded border border-primary/10">
              Maintenance Hub
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-warning-light text-warning rounded border border-warning/10">
              Prevention & Repairs
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1.5 tracking-tight flex items-center gap-2">
            Service & Work Orders
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Dispatch vehicles to repair bays, monitor active work progress, and manage preventive checklists.
          </p>
        </div>

        <button
          id="btn-log-work-order"
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex h-10 items-center gap-1.5 px-4 rounded-m bg-primary text-text-on-primary text-xs font-bold hover:bg-primary/95 transition-all shadow-small self-start md:self-center cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          <span>Log Work Order</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric Card: Active Work Orders */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-primary/20 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Work Orders</span>
              <div className="text-3xl font-extrabold text-text-primary mt-1">{calculatedMetrics.activeCount}</div>
            </div>
            <div className="h-10 w-10 rounded-m bg-primary-light text-primary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Wrench size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">
              {calculatedMetrics.criticalCount} critical safety holds
            </span>
            {calculatedMetrics.criticalCount > 0 ? (
              <span className="font-bold px-1.5 py-0.2 bg-error-light text-error text-[10px] rounded-circular">
                Critical Issue
              </span>
            ) : (
              <span className="font-semibold text-success flex items-center gap-0.5">
                All scheduled
              </span>
            )}
          </div>
        </div>

        {/* Metric Card: Overdue Inspections */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-warning/20 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Overdue Prevention</span>
              <div className="text-3xl font-extrabold text-text-primary mt-1">{calculatedMetrics.overdueScheduleCount}</div>
            </div>
            <div className="h-10 w-10 rounded-m bg-warning-light text-warning flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">
              Scheduled mileage intervals
            </span>
            {calculatedMetrics.overdueScheduleCount > 0 ? (
              <span className="font-semibold text-warning flex items-center gap-0.5">
                Service needed
              </span>
            ) : (
              <span className="font-semibold text-success flex items-center gap-0.5">
                Up to date
              </span>
            )}
          </div>
        </div>

        {/* Metric Card: Spend MTD */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-secondary/20 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Maintenance Spend MTD</span>
              <div className="text-3xl font-extrabold text-text-primary mt-1">${calculatedMetrics.totalMtdSpend}</div>
            </div>
            <div className="h-10 w-10 rounded-m bg-secondary-light text-secondary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">
              Parts, labour & inspection
            </span>
            <span className="font-semibold text-secondary flex items-center gap-0.5">
              <TrendingUp size={14} /> +8% M-o-M
            </span>
          </div>
        </div>

        {/* Metric Card: Service Capacity */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-info/20 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Bay Turnaround Avg</span>
              <div className="text-3xl font-extrabold text-text-primary mt-1">28.4h</div>
            </div>
            <div className="h-10 w-10 rounded-m bg-info-light text-info flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">
              Target turnaround: 36h
            </span>
            <span className="font-semibold text-success flex items-center gap-0.5">
              <CheckCircle2 size={14} /> Efficiency high
            </span>
          </div>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border-app gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("orders"); setStatusFilter("All"); }}
          className={`pb-3 text-sm font-semibold tracking-tight transition-all relative whitespace-nowrap cursor-pointer px-1 flex items-center gap-1.5
            ${activeTab === "orders" 
              ? "text-primary border-b-2 border-primary" 
              : "text-text-secondary hover:text-text-primary"
            }
          `}
        >
          Active Work Orders
          <span className="px-1.5 py-0.2 bg-gray-100 text-[10px] text-text-secondary rounded-circular font-semibold">
            {workOrders.filter(w => w.status !== "Completed").length}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-3 text-sm font-semibold tracking-tight transition-all relative whitespace-nowrap cursor-pointer px-1 flex items-center gap-1.5
            ${activeTab === "schedule" 
              ? "text-primary border-b-2 border-primary" 
              : "text-text-secondary hover:text-text-primary"
            }
          `}
        >
          Preventive Roster
          <span className="px-1.5 py-0.2 bg-gray-100 text-[10px] text-text-secondary rounded-circular font-semibold">
            {preventiveSchedule.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("history"); setStatusFilter("All"); }}
          className={`pb-3 text-sm font-semibold tracking-tight transition-all relative whitespace-nowrap cursor-pointer px-1 flex items-center gap-1.5
            ${activeTab === "history" 
              ? "text-primary border-b-2 border-primary" 
              : "text-text-secondary hover:text-text-primary"
            }
          `}
        >
          Completed History
          <span className="px-1.5 py-0.2 bg-gray-100 text-[10px] text-text-secondary rounded-circular font-semibold">
            {workOrders.filter(w => w.status === "Completed").length}
          </span>
        </button>
      </div>

      {/* Main Tab Area */}
      {activeTab !== "schedule" ? (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Controls: Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, vehicle, or tech..."
                className="w-full h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs text-text-secondary font-bold mr-2 flex items-center gap-1 whitespace-nowrap">
                <Filter size={13} /> Priority:
              </span>
              {["All", "Critical", "High", "Medium", "Low"].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setPriorityFilter(prio)}
                  className={`px-3 py-1 rounded-m text-xs font-bold transition-all cursor-pointer whitespace-nowrap border
                    ${priorityFilter === prio 
                      ? "bg-primary text-text-on-primary border-primary shadow-small" 
                      : "bg-surface-app text-text-secondary border-border-app hover:bg-gray-50 hover:text-text-primary"
                    }
                  `}
                >
                  {prio}
                </button>
              ))}
            </div>

          </div>

          {/* Active / Completed Work Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-surface-app rounded-m border border-dashed border-border-app shadow-card">
              <Wrench className="text-text-muted mb-3" size={32} />
              <span className="text-sm font-bold text-text-primary">No Work Orders Found</span>
              <span className="text-xs text-text-secondary mt-1">Try modifying your filters or search text criteria.</span>
            </div>
          ) : (
            <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-border-app text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      <th className="p-4">WO ID</th>
                      <th className="p-4">Vehicle</th>
                      <th className="p-4">Issue details & Category</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Assignee</th>
                      <th className="p-4">Cost / Date</th>
                      <th className="p-4">Progress</th>
                      <th className="p-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredOrders.map((wo) => {
                      return (
                        <tr key={wo.id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="px-6 py-5 font-mono font-bold text-xs text-primary">{wo.id}</td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-semibold text-text-primary text-xs">{wo.vehicleName}</span>
                              <span className="text-[10px] text-text-secondary font-mono">{wo.vehicleId}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 max-w-[220px]">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-text-primary truncate" title={wo.issue}>
                                {wo.issue}
                              </span>
                              <span className="text-[10px] text-text-secondary mt-0.5 block">{wo.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span 
                              className={`inline-flex px-2 py-0.2 text-[9px] font-bold rounded-circular border uppercase tracking-wider
                                ${wo.priority === "Critical" ? "bg-error-light text-error border-error/20 animate-pulse" : ""}
                                ${wo.priority === "High" ? "bg-error-light text-error border-error/10" : ""}
                                ${wo.priority === "Medium" ? "bg-warning-light text-warning border-warning/20" : ""}
                                ${wo.priority === "Low" ? "bg-primary-light text-primary border-primary/20" : ""}
                              `}
                            >
                              {wo.priority}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-xs font-semibold text-text-primary">{wo.technician}</td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col text-xs">
                              <span className="font-bold text-text-primary">${wo.cost}</span>
                              <span className="text-[10px] text-text-secondary mt-0.5">{wo.startDate}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="w-full max-w-[100px] space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-text-secondary font-bold">
                                <span>{wo.progress}%</span>
                                <span className={`uppercase text-[8px] font-bold px-1.5 rounded
                                  ${wo.status === "In Progress" ? "bg-primary-light text-primary" : ""}
                                  ${wo.status === "Awaiting Parts" ? "bg-warning-light text-warning" : ""}
                                  ${wo.status === "Scheduled" ? "bg-gray-100 text-text-secondary" : ""}
                                  ${wo.status === "Completed" ? "bg-success-light text-success" : ""}
                                `}>
                                  {wo.status}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-100 rounded-circular overflow-hidden">
                                <div 
                                  className={`h-full rounded-circular transition-all duration-300
                                    ${wo.status === "Completed" ? "bg-success" : wo.status === "Awaiting Parts" ? "bg-warning" : "bg-primary"}
                                  `}
                                  style={{ width: `${wo.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            {wo.status !== "Completed" && (
                              <div className="flex justify-end gap-1.5">
                                {wo.status !== "In Progress" && wo.status !== "Awaiting Parts" && (
                                  <button
                                    onClick={() => handleUpdateStatus(wo.id, "In Progress")}
                                    className="px-2 py-0.5 border border-border-app bg-white hover:bg-primary-light hover:text-primary text-[10px] font-bold rounded shadow-small cursor-pointer transition-colors"
                                  >
                                    Start Job
                                  </button>
                                )}
                                {wo.status === "In Progress" && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateStatus(wo.id, "Awaiting Parts")}
                                      className="px-2 py-0.5 border border-border-app bg-white hover:bg-warning-light/30 hover:text-warning text-[10px] font-bold rounded shadow-small cursor-pointer transition-colors"
                                    >
                                      Hold Parts
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(wo.id, "Completed")}
                                      className="px-2 py-0.5 border border-primary bg-primary hover:bg-primary/95 text-[10px] font-bold text-text-on-primary rounded shadow-small cursor-pointer transition-colors"
                                    >
                                      Finish
                                    </button>
                                  </>
                                )}
                                {wo.status === "Awaiting Parts" && (
                                  <button
                                    onClick={() => handleUpdateStatus(wo.id, "In Progress")}
                                    className="px-2 py-0.5 border border-border-app bg-white hover:bg-primary-light hover:text-primary text-[10px] font-bold rounded shadow-small cursor-pointer transition-colors"
                                  >
                                    Resume
                                  </button>
                                )}
                              </div>
                            )}
                            {wo.status === "Completed" && (
                              <span className="text-xs text-success font-semibold flex items-center justify-end gap-1.5">
                                <CheckCircle2 size={14} /> Handed Over
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Tab Contents: Preventive Roster */
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-5">
            <div>
              <h3 className="font-bold text-text-primary text-base">Preventive Maintenance Schedule</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Vehicles requiring scheduled oil changes, chassis lube, fluid checks, and mechanical updates.
              </p>
            </div>

            <div className="overflow-x-auto border border-border-app rounded-m">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-app text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="px-6 py-4">PM Ticket</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Required Service</th>
                    <th className="px-6 py-4">Distance Due</th>
                    <th className="px-6 py-4">Time Due</th>
                    <th className="px-6 py-4">Alert Level</th>
                    <th className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {preventiveSchedule.map((pm) => {
                    return (
                      <tr key={pm.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 font-mono font-bold text-xs text-text-primary">{pm.id}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-primary text-xs">{pm.vehicleName}</span>
                            <span className="text-[10px] text-text-secondary font-mono">{pm.vehicleId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs font-semibold text-text-primary">{pm.serviceType}</td>
                        <td className="px-6 py-5 text-xs font-bold text-text-primary">
                          {pm.dueInKm < 0 
                            ? `Overdue by ${Math.abs(pm.dueInKm)} km` 
                            : `In ${pm.dueInKm} km`}
                        </td>
                        <td className="px-6 py-5 text-xs font-semibold text-text-secondary">
                          {pm.dueInDays < 0 
                            ? `Overdue by ${Math.abs(pm.dueInDays)} days` 
                            : `In ${pm.dueInDays} days`}
                        </td>
                        <td className="px-6 py-5">
                          <span 
                            className={`inline-flex px-2 py-0.2 text-[9px] font-bold rounded-circular border uppercase tracking-wider
                              ${pm.status === "Overdue" ? "bg-error-light text-error border-error/20 animate-pulse" : ""}
                              ${pm.status === "Due Soon" ? "bg-warning-light text-warning border-warning/20" : ""}
                              ${pm.status === "Good" ? "bg-success-light text-success border-success/20" : ""}
                            `}
                          >
                            {pm.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => {
                              setNewOrderForm({
                                vehicleId: pm.vehicleId,
                                vehicleName: pm.vehicleName,
                                issue: pm.serviceType,
                                type: "Routine",
                                priority: pm.status === "Overdue" ? "High" : "Medium",
                                technician: "",
                                costEstimate: 120
                              });
                              setIsNewOrderModalOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-text-on-primary bg-primary hover:bg-primary/95 border border-primary rounded shadow-small cursor-pointer transition-colors"
                          >
                            Create Work Order
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border border-border-app rounded-m text-xs text-text-secondary flex gap-2 items-start">
              <Sparkles className="text-warning shrink-0 mt-0.5" size={16} />
              <div>
                <span className="font-bold text-text-primary block">Automatic Prevention Calculations</span>
                <p className="mt-0.5">
                  Next preventive schedule metrics are calculated dynamically using on-vehicle odometer telemetry (CAN bus logs) and duration since the last logged work order.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Log Work Order Dialog Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-app border border-border-app w-full max-w-md rounded-m shadow-dialog p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-app pb-3">
              <h3 className="font-bold text-text-primary text-base">Log Maintenance Work Order</h3>
              <button 
                onClick={() => setIsNewOrderModalOpen(false)}
                className="hover:bg-gray-100 p-1 rounded text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Vehicle ID (e.g. V-8821) *</label>
                <input
                  type="text"
                  required
                  placeholder="V-XXXX"
                  value={newOrderForm.vehicleId}
                  onChange={(e) => {
                    const id = e.target.value;
                    let name = "";
                    if (id === "V-8821") name = "Volvo FH16";
                    else if (id === "V-7710") name = "Scania R500";
                    else if (id === "V-9011") name = "Tesla Semi (Gen 2)";
                    else if (id === "V-4412") name = "Kenworth T680";
                    else if (id === "V-2210") name = "Peterbilt 579";
                    else if (id === "V-1102") name = "Tesla Semi (Gen 1)";
                    else if (id === "V-5582") name = "Mack Anthem";
                    setNewOrderForm(prev => ({ ...prev, vehicleId: id, vehicleName: name }));
                  }}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                />
              </div>

              {newOrderForm.vehicleName && (
                <div className="text-[10px] font-bold text-success">
                  Matched: {newOrderForm.vehicleName}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Issue Details / Maintenance Description *</label>
                <textarea
                  required
                  placeholder="Describe mechanical faults, worn parts, or service required..."
                  value={newOrderForm.issue}
                  onChange={(e) => setNewOrderForm(prev => ({ ...prev, issue: e.target.value }))}
                  className="w-full h-20 px-3 py-2 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Category Type</label>
                  <select
                    value={newOrderForm.type}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  >
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Routine">Routine</option>
                    <option value="Safety Inspection">Safety Inspection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Priority</label>
                  <select
                    value={newOrderForm.priority}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium animate-pulse border-error"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Assign Technician *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newOrderForm.technician}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, technician: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Cost Estimate ($)</label>
                  <input
                    type="number"
                    placeholder="250"
                    value={newOrderForm.costEstimate || ""}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, costEstimate: Number(e.target.value) }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border-app">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 border border-border-app hover:bg-gray-50 text-text-secondary rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-text-on-primary rounded font-bold cursor-pointer"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
