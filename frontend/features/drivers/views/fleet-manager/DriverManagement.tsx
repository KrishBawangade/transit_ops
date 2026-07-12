"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Award, 
  Truck, 
  Route, 
  Clock, 
  CheckCircle2, 
  X, 
  Sparkles, 
  TrendingUp 
} from "lucide-react";

interface Driver {
  id: string;
  name: string;
  avatarInitials: string;
  status: "Available" | "On Trip" | "Off Duty" | "Leave";
  licenseNumber: string;
  phone: string;
  email: string;
  safetyScore: number; // 0 - 100
  tripsCompleted: number;
  assignedVehicle: string | null;
  assignedTripId: string | null;
  hosDriveTimeRemaining: string; // HOS Log
  notes: string;
}

export default function DriverManagement() {
  // 1. Core States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDriverId, setSelectedDriverId] = useState("D-101");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Dialog States
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);

  // Form State: Add Driver
  const [newDriverForm, setNewDriverForm] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
    status: "Available" as const
  });

  // Form State: Create Trip
  const [newTripForm, setNewTripForm] = useState({
    driverId: "",
    vehicleId: "",
    destination: "",
    cargo: ""
  });

  // 2. Mock Driver Roster Database
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: "D-101", name: "Alex Rivera", avatarInitials: "AR", status: "On Trip", licenseNumber: "DL-908234", phone: "+1 (555) 304-9821", email: "alex.r@transitops.com", safetyScore: 96, tripsCompleted: 142, assignedVehicle: "V-8821 (Volvo FH16)", assignedTripId: "TRP-9482", hosDriveTimeRemaining: "4h 15m", notes: "Prefers mid-west long-haul routes. Clean safety sheet for 180 days." },
    { id: "D-102", name: "Dave Miller", avatarInitials: "DM", status: "On Trip", licenseNumber: "DL-772183", phone: "+1 (555) 298-3490", email: "dave.m@transitops.com", safetyScore: 91, tripsCompleted: 98, assignedVehicle: "V-2210 (Peterbilt 579)", assignedTripId: "TRP-9483", hosDriveTimeRemaining: "3h 45m", notes: "Assigned to specialized cargo hauling. Eco-driving certified." },
    { id: "D-103", name: "Elena Rostova", avatarInitials: "ER", status: "Available", licenseNumber: "DL-661092", phone: "+1 (555) 890-3482", email: "elena.r@transitops.com", safetyScore: 94, tripsCompleted: 112, assignedVehicle: null, assignedTripId: null, hosDriveTimeRemaining: "8h 00m", notes: "Experienced with EV semi-truck regenerative loading operations." },
    { id: "D-104", name: "Marcus Vance", avatarInitials: "MV", status: "On Trip", licenseNumber: "DL-552109", phone: "+1 (555) 438-9210", email: "marcus.v@transitops.com", safetyScore: 89, tripsCompleted: 135, assignedVehicle: "V-5582 (Mack Anthem)", assignedTripId: "TRP-9485", hosDriveTimeRemaining: "1h 10m", notes: "Requires renewal on hazardous material transport validation." },
    { id: "D-105", name: "Sarah Jenkins", avatarInitials: "SJ", status: "Available", licenseNumber: "DL-882012", phone: "+1 (555) 902-8419", email: "sarah.j@transitops.com", safetyScore: 98, tripsCompleted: 82, assignedVehicle: null, assignedTripId: null, hosDriveTimeRemaining: "8h 00m", notes: "Awarded top regional safety rating for Q2 operations." },
    { id: "D-106", name: "Jameson Blake", avatarInitials: "JB", status: "Off Duty", licenseNumber: "DL-441234", phone: "+1 (555) 671-9024", email: "jameson.b@transitops.com", safetyScore: 82, tripsCompleted: 245, assignedVehicle: null, assignedTripId: null, hosDriveTimeRemaining: "0h 00m", notes: "On weekly rest cycle. Returns to active roster in 24 hours." },
    { id: "D-107", name: "Carlos Santana", avatarInitials: "CS", status: "Leave", licenseNumber: "DL-332901", phone: "+1 (555) 781-8930", email: "carlos.s@transitops.com", safetyScore: 93, tripsCompleted: 64, assignedVehicle: null, assignedTripId: null, hosDriveTimeRemaining: "0h 00m", notes: "Approved medical leave. Expected return next Monday." }
  ]);

  // 3. Spacing-optimal KPIs
  const kpis = useMemo(() => {
    const total = drivers.length;
    const available = drivers.filter(d => d.status === "Available").length;
    const onTrip = drivers.filter(d => d.status === "On Trip").length;
    const offDuty = drivers.filter(d => d.status === "Off Duty").length;
    
    return { total, available, onTrip, offDuty };
  }, [drivers]);

  // 4. Searching & Filtering
  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            d.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  const selectedDriver = useMemo(() => {
    return drivers.find(d => d.id === selectedDriverId) || drivers[0];
  }, [drivers, selectedDriverId]);

  // 5. Actions Handlers
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverForm.name || !newDriverForm.licenseNumber) {
      alert("Please enter Name and License Number.");
      return;
    }

    const initials = newDriverForm.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const newDr: Driver = {
      id: `D-${100 + drivers.length + 1}`,
      name: newDriverForm.name,
      avatarInitials: initials || "D",
      status: newDriverForm.status,
      licenseNumber: newDriverForm.licenseNumber,
      phone: newDriverForm.phone || "+1 (555) 000-0000",
      email: newDriverForm.email || "driver@transitops.com",
      safetyScore: 95,
      tripsCompleted: 0,
      assignedVehicle: null,
      assignedTripId: null,
      hosDriveTimeRemaining: newDriverForm.status === "Available" ? "8h 00m" : "0h 00m",
      notes: "Newly registered commercial driver."
    };

    setDrivers(prev => [...prev, newDr]);
    setSelectedDriverId(newDr.id);
    setIsAddDriverOpen(false);
    showToast(`Registered new driver: ${newDr.name} (${newDr.id})`);
    setNewDriverForm({
      name: "",
      licenseNumber: "",
      phone: "",
      email: "",
      status: "Available"
    });
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripForm.driverId || !newTripForm.vehicleId || !newTripForm.destination) {
      alert("Please complete all trip variables.");
      return;
    }

    setDrivers(prev => prev.map(d => {
      if (d.id === newTripForm.driverId) {
        return {
          ...d,
          status: "On Trip" as const,
          assignedVehicle: `${newTripForm.vehicleId} (Custom Route)`,
          assignedTripId: `TRP-${Math.floor(Math.random() * 1000) + 9400}`,
          hosDriveTimeRemaining: "7h 45m"
        };
      }
      return d;
    }));

    setSelectedDriverId(newTripForm.driverId);
    setIsCreateTripOpen(false);
    showToast(`Trip created successfully! Driver status updated to On Trip.`);
    setNewTripForm({
      driverId: "",
      vehicleId: "",
      destination: "",
      cargo: ""
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

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
              Roster
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-secondary-light text-secondary rounded border border-secondary/10">
              Compliance
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1.5 tracking-tight flex items-center gap-2">
            Driver Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage drivers, assign trips, monitor deliveries, and track driver performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          
          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-text-muted" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Driver Name..."
              className="h-9 pl-9 pr-3 w-40 rounded-m border border-border-app bg-surface-app text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white transition-all shadow-small"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 border border-border-app bg-surface-app rounded-m px-2.5 text-xs text-text-primary font-bold focus:outline-none shadow-small"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          {/* Add Driver Button */}
          <button
            onClick={() => setIsAddDriverOpen(true)}
            className="flex h-9 items-center gap-1.5 px-4 rounded-m bg-primary text-text-on-primary text-xs font-bold hover:bg-primary/95 transition-all shadow-small cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>Add Driver</span>
          </button>

          {/* Create Trip Button */}
          <button
            onClick={() => setIsCreateTripOpen(true)}
            className="flex h-9 items-center gap-1.5 px-4 rounded-m border border-primary text-primary bg-primary-light hover:bg-primary/10 text-xs font-bold transition-all shadow-small cursor-pointer active:scale-95"
          >
            <Route size={15} />
            <span>Create Trip</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI: Total Drivers */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-primary/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Total Drivers</span>
            <span className="text-3xl font-extrabold text-text-primary mt-1.5 block">{kpis.total}</span>
          </div>
          <span className="text-[10px] text-text-muted mt-4 block">Active in database roster</span>
        </div>

        {/* KPI: Available Drivers */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Available</span>
            <span className="text-3xl font-extrabold text-success mt-1.5 block">{kpis.available}</span>
          </div>
          <span className="text-[10px] text-success font-semibold mt-4 block">Ready for immediate route dispatch</span>
        </div>

        {/* KPI: On Trip Drivers */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-secondary/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Active On Trip</span>
            <span className="text-3xl font-extrabold text-secondary mt-1.5 block">{kpis.onTrip}</span>
          </div>
          <span className="text-[10px] text-secondary font-semibold mt-4 block">Currently navigating deliveries</span>
        </div>

        {/* KPI: Off Duty Drivers */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-warning/20 transition-all">
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Off Duty</span>
            <span className="text-3xl font-extrabold text-warning mt-1.5 block">{kpis.offDuty}</span>
          </div>
          <span className="text-[10px] text-text-muted mt-4 block">Weekly rest intervals</span>
        </div>

      </div>

      {/* 3. Main Roster Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (1/3): Searchable Driver List */}
        <div className="space-y-4">
          <div className="bg-surface-app border border-border-app rounded-m p-5 shadow-card space-y-4">
            <div>
              <h3 className="font-bold text-text-primary text-base">Drivers Registry</h3>
              <p className="text-xs text-text-secondary mt-0.5">Select a driver card to review logs.</p>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredDrivers.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center bg-gray-50 border border-dashed border-border-app rounded">
                  <Users className="text-text-muted mb-2" size={24} />
                  <span className="text-xs font-bold text-text-primary">No Matching Drivers Found</span>
                </div>
              ) : (
                filteredDrivers.map((driver) => {
                  const isSelected = driver.id === selectedDriverId;
                  return (
                    <div
                      key={driver.id}
                      onClick={() => setSelectedDriverId(driver.id)}
                      className={`p-4 rounded border text-xs cursor-pointer transition-all flex items-center justify-between
                        ${isSelected 
                          ? "bg-primary-light border-primary/45 hover:border-primary/60" 
                          : "bg-surface-app border-border-app hover:border-gray-300 hover:bg-gray-50/50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-circular flex items-center justify-center font-bold text-xs shadow-small
                          ${isSelected ? "bg-primary text-text-on-primary" : "bg-gray-100 text-text-secondary"}
                        `}>
                          {driver.avatarInitials}
                        </div>
                        
                        <div className="space-y-1">
                          <span className="font-bold text-text-primary text-xs block">{driver.name}</span>
                          <span className="text-[10px] text-text-secondary block font-mono">{driver.id}</span>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`inline-block px-1.5 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                          ${driver.status === "Available" ? "bg-success-light text-success border-success/20" : ""}
                          ${driver.status === "On Trip" ? "bg-secondary-light text-secondary border-secondary/20" : ""}
                          ${driver.status === "Off Duty" ? "bg-warning-light text-warning border-warning/20" : ""}
                          ${driver.status === "Leave" ? "bg-error-light text-error border-error/20" : ""}
                        `}>
                          {driver.status}
                        </span>
                        <span className="text-[9px] text-text-secondary font-semibold block">Safety: {driver.safetyScore}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (2/3): Selected Driver Profile & Performance Audit */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Driver Card Header Profile */}
          <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-circular bg-primary text-text-on-primary flex items-center justify-center font-bold text-xl shadow-card">
                {selectedDriver.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-text-primary tracking-tight">{selectedDriver.name}</h2>
                  <span className="text-[10px] font-mono bg-gray-100 text-text-secondary px-2 py-0.5 rounded border border-border-app">
                    {selectedDriver.id}
                  </span>
                </div>
                <span className="text-xs text-text-secondary flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-success" />
                  Commercial License ID: <span className="font-mono font-bold text-text-primary">{selectedDriver.licenseNumber}</span>
                </span>
              </div>
            </div>

            {/* Quick contact */}
            <div className="flex flex-col gap-1.5 text-xs text-text-secondary">
              <span className="flex items-center gap-2">
                <Phone size={13} className="text-text-muted" />
                <span>{selectedDriver.phone}</span>
              </span>
              <span className="flex items-center gap-2">
                <Mail size={13} className="text-text-muted" />
                <span>{selectedDriver.email}</span>
              </span>
            </div>
          </div>

          {/* Details grid split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Hours of Service (HOS) & Status */}
            <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-border-app pb-2">
                <Clock className="text-primary" size={16} />
                <h3 className="font-bold text-text-primary text-base">HOS (Hours of Service) Logs</h3>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* HOS Drive Time Clock */}
                <div className="p-4 bg-gray-50 border border-border-app rounded flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-text-secondary uppercase">Drive Time Remaining</span>
                    <span className="block text-2xl font-extrabold text-text-primary mt-0.5">
                      {selectedDriver.hosDriveTimeRemaining}
                    </span>
                  </div>
                  <div className="h-10 w-10 bg-primary-light text-primary rounded-circular flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-text-secondary font-semibold">Duty Phase</span>
                    <span className={`font-bold ${selectedDriver.status === "On Trip" ? "text-primary" : "text-text-primary"}`}>
                      {selectedDriver.status}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-text-secondary font-semibold">Assigned Vehicle</span>
                    <span className="font-bold text-text-primary">
                      {selectedDriver.assignedVehicle || "None (In Depot)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-semibold">Active Dispatch ID</span>
                    <span className="font-mono font-bold text-primary">
                      {selectedDriver.assignedTripId || "None"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Safety & Performance Scores */}
            <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-border-app pb-2">
                <Award className="text-secondary" size={16} />
                <h3 className="font-bold text-text-primary text-base">Safety & Performance Audits</h3>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Safety Score Meter */}
                <div className="p-4 bg-gray-50 border border-border-app rounded flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-text-secondary uppercase">Safety Rating Score</span>
                    <span className={`block text-2xl font-extrabold mt-0.5 
                      ${selectedDriver.safetyScore >= 95 ? "text-success" : selectedDriver.safetyScore >= 90 ? "text-primary" : "text-warning"}
                    `}>
                      {selectedDriver.safetyScore}/100
                    </span>
                  </div>
                  <div className="h-10 w-10 bg-secondary-light text-secondary rounded-circular flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-text-secondary font-semibold">Trips Completed</span>
                    <span className="font-bold text-text-primary">{selectedDriver.tripsCompleted}</span>
                  </div>
                  
                  {/* Eco-Driving Rating bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-text-secondary">
                      <span>Eco-Driving Compliance</span>
                      <span className="font-bold text-success">Outstanding</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                      <div className="h-full bg-success rounded-circular" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Driver Notes & Dispatch Action Suggestions */}
          <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border-app pb-2">
              <h3 className="font-bold text-text-primary text-base">Driver Operational Log Notes</h3>
              <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 rounded border border-border-app">
                Updated Daily
              </span>
            </div>
            
            <p className="text-xs text-text-secondary leading-relaxed bg-gray-50 border border-border-app p-4 rounded-m font-medium italic">
              "{selectedDriver.notes}"
            </p>

            <div className="flex gap-2 items-start p-3 bg-primary-light/20 border border-primary/20 rounded-m text-xs">
              <Sparkles className="text-primary shrink-0 mt-0.5" size={15} />
              <div className="space-y-0.5">
                <span className="font-bold text-text-primary block">AI Dispatch Recommendation</span>
                <p className="text-[10px] text-text-secondary">
                  {selectedDriver.status === "Available" 
                    ? `${selectedDriver.name} has a full HOS block (8h 00m) available. Highly recommended for the upcoming TRP-9490 long-haul dispatch.` 
                    : `${selectedDriver.name} is currently active on route. Shift ends in ${selectedDriver.hosDriveTimeRemaining}.`
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Add Driver Dialog Modal */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-app border border-border-app w-full max-w-md rounded-m shadow-dialog p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-app pb-3">
              <h3 className="font-bold text-text-primary text-base">Add Driver to Roster</h3>
              <button onClick={() => setIsAddDriverOpen(false)} className="hover:bg-gray-100 p-1 rounded text-text-secondary hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Driver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newDriverForm.name}
                  onChange={(e) => setNewDriverForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">License Number (CDL) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-XXXXXX"
                    value={newDriverForm.licenseNumber}
                    onChange={(e) => setNewDriverForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Status</label>
                  <select
                    value={newDriverForm.status}
                    onChange={(e) => setNewDriverForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium font-bold"
                  >
                    <option value="Available">Available</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newDriverForm.phone}
                    onChange={(e) => setNewDriverForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Email Address</label>
                  <input
                    type="email"
                    placeholder="driver@transitops.com"
                    value={newDriverForm.email}
                    onChange={(e) => setNewDriverForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border-app">
                <button type="button" onClick={() => setIsAddDriverOpen(false)} className="px-4 py-2 border border-border-app hover:bg-gray-50 text-text-secondary rounded font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/95 text-text-on-primary rounded font-bold cursor-pointer">
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Trip / Assign Driver Dialog Modal */}
      {isCreateTripOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-app border border-border-app w-full max-w-md rounded-m shadow-dialog p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-app pb-3">
              <h3 className="font-bold text-text-primary text-base">Create Trip & Assign Driver</h3>
              <button onClick={() => setIsCreateTripOpen(false)} className="hover:bg-gray-100 p-1 rounded text-text-secondary hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Select Available Driver *</label>
                <select
                  required
                  value={newTripForm.driverId}
                  onChange={(e) => setNewTripForm(prev => ({ ...prev, driverId: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-bold"
                >
                  <option value="">-- Choose Driver --</option>
                  {drivers.filter(d => d.status === "Available").map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.name} ({driver.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Select Active Asset *</label>
                  <select
                    required
                    value={newTripForm.vehicleId}
                    onChange={(e) => setNewTripForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-bold"
                  >
                    <option value="">-- Choose Truck --</option>
                    <option value="V-8821">Volvo FH16 (V-8821)</option>
                    <option value="V-7710">Scania R500 (V-7710)</option>
                    <option value="V-9011">Tesla Semi (V-9011)</option>
                    <option value="V-4412">Kenworth T680 (V-4412)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">Cargo Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Dry Van Freight"
                    value={newTripForm.cargo}
                    onChange={(e) => setNewTripForm(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary block">Trip Destination Route *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SFO Hub ➔ LAX Terminal"
                  value={newTripForm.destination}
                  onChange={(e) => setNewTripForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full h-9 px-3 border border-border-app rounded-m bg-gray-50 focus:outline-none focus:border-primary text-text-primary font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border-app">
                <button type="button" onClick={() => setIsCreateTripOpen(false)} className="px-4 py-2 border border-border-app hover:bg-gray-50 text-text-secondary rounded font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/95 text-text-on-primary rounded font-bold cursor-pointer">
                  Dispatch Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
