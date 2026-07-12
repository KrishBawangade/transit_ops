"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  X,
  Route,
  Navigation,
  Gauge,
  Star,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Truck,
  Play,
  Fuel,
  Award,
  Phone,
  RefreshCw
} from "lucide-react";
import { apiClient } from "@/lib/core/services/api-client";

export default function DriverDashboard() {
  // 1. Interactive States
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [time, setTime] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic database states
  const [driver, setDriver] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const [driverAlerts, setDriverAlerts] = useState([
    {
      id: "alert-1",
      category: "emergency",
      title: "Immediate Action Required: Route Diversion",
      description: "Severe weather warning on I-5 North. Heavy mudslides reported near Grapevine. Re-route immediately via Hwy-99.",
      timestamp: "5 mins ago",
      priority: "Critical",
      read: false
    },
    {
      id: "alert-2",
      category: "new-trip",
      title: "New Dispatch Assigned",
      description: "TRP-9486 has been added to your upcoming roster starting at 15:30. Equipment: Volvo FH16 (V-8821).",
      timestamp: "15 mins ago",
      priority: "High",
      read: false
    },
    {
      id: "alert-3",
      category: "maintenance",
      title: "Scheduled Rig Safety Inspection",
      description: "Volvo FH16 (V-8821) is overdue for its cooling system pressure check. Please check in with mechanical team at LAX-4 terminal.",
      timestamp: "1 hour ago",
      priority: "Medium",
      read: true
    },
    {
      id: "alert-4",
      category: "fuel",
      title: "Rig Battery State-of-Charge Warning",
      description: "Tractor battery level dropped below 20% (18% SOC). Next charging hub: Kettleman City (14 km ahead).",
      timestamp: "2 hours ago",
      priority: "High",
      read: true
    },
    {
      id: "alert-5",
      category: "traffic",
      title: "Traffic Congestion Ahead",
      description: "30-minute delay detected on CA-99 South approaching Bakersfield. Automated GPS route adjustment proposed.",
      timestamp: "3 hours ago",
      priority: "Low",
      read: true
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setDriverAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, read: true } : alert));
    triggerToast("Notification marked as read.");
  };

  const handleDismissAlert = (id: string) => {
    setDriverAlerts(prev => prev.filter(alert => alert.id !== id));
    triggerToast("Notification dismissed.");
  };

  // Notifications Mock Data
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New dispatch TRP-9482 assigned to your roster.", read: false, time: "5m ago" },
    { id: 2, text: "Battery cooling check required before SFO route.", read: true, time: "2h ago" }
  ]);

  // Live Clock & Date Update
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 2. Fetch Dashboard details from backend
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      let userId: string | null = null;
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const parts = token.split(".");
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              userId = payload.sub || payload.userId || null;
            }
          } catch (e) {
            console.error("Token decoding error", e);
          }
        }
      }

      let activeDriver: any = null;

      if (userId) {
        try {
          const response = await apiClient.get<any>(`/drivers/user/${userId}`);
          if (response && response.data) {
            activeDriver = response.data;
          }
        } catch (err) {
          console.warn("Could not load driver by userId, trying first fallback...", err);
        }
      }

      if (!activeDriver) {
        try {
          const response = await apiClient.get<any>("/drivers", { params: { limit: 1 } });
          if (response && response.data && response.data.length > 0) {
            activeDriver = response.data[0];
          }
        } catch (err) {
          console.warn("Could not fetch first driver from backend", err);
        }
      }

      if (!activeDriver) {
        activeDriver = {
          id: "D-109",
          rating: 4.92,
          status: "ACTIVE",
          licenseNumber: "DL-2022-9988",
          licenseClass: "Class A CDL",
          user: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@transitops.com"
          }
        };
      }

      setDriver(activeDriver);

      try {
        const tripsResponse = await apiClient.get<any>("/trips", {
          params: { driverId: activeDriver.id, limit: 100 }
        });
        if (tripsResponse && tripsResponse.data) {
          setTrips(tripsResponse.data);
        }
      } catch (err) {
        console.error("Failed to load driver trips", err);
      }
    } catch (error) {
      console.error("Failed to initialize driver dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadTrips = async (driverId: string) => {
    try {
      const tripsResponse = await apiClient.get<any>("/trips", {
        params: { driverId, limit: 100 }
      });
      if (tripsResponse && tripsResponse.data) {
        setTrips(tripsResponse.data);
      }
    } catch (err) {
      console.error("Failed to refresh trips list", err);
    }
  };

  const handleStartTrip = async (tripId: string) => {
    try {
      await apiClient.patch(`/trips/${tripId}/status`, {
        status: "DISPATCHED",
        actualStart: new Date().toISOString()
      });
      triggerToast("Trip started. GPS telemetry tracking activated.");
      if (driver) {
        loadTrips(driver.id);
      }
    } catch (e: any) {
      console.error(e);
      triggerToast("Failed to start trip: " + (e.message || "Unknown error"));
    }
  };

  const handleCompleteTrip = async (tripId: string) => {
    try {
      await apiClient.patch(`/trips/${tripId}/status`, {
        status: "COMPLETED",
        actualEnd: new Date().toISOString(),
        odometerAtEnd: 45200
      });
      triggerToast("Trip completed. Manifest logs updated.");
      if (driver) {
        loadTrips(driver.id);
      }
    } catch (e: any) {
      console.error(e);
      triggerToast("Failed to complete trip: " + (e.message || "Unknown error"));
    }
  };

  // Derive dynamic list
  const driverTrips = useMemo(() => {
    if (trips && trips.length > 0) {
      return trips;
    }
    return [
      {
        id: "TR-2026-0001",
        tripNumber: "TR-2026-0001",
        status: "COMPLETED",
        startLocation: "Oakland Depot (OAK-2)",
        endLocation: "San Francisco Cargo Depot (SFO-1)",
        scheduledStart: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        scheduledEnd: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
        cargoWeight: 12000.0,
        cargoDescription: "Industrial Parts",
        vehicle: { id: "V-8821", make: "Volvo", model: "FH16", registrationNumber: "MH12AB1234" }
      },
      {
        id: "TR-2026-0002",
        tripNumber: "TR-2026-0002",
        status: "DISPATCHED",
        startLocation: "San Francisco Cargo Depot (SFO-1)",
        endLocation: "Los Angeles Port Terminal (LAX-4)",
        scheduledStart: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        scheduledEnd: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
        cargoWeight: 950.0,
        cargoDescription: "E-commerce parcels",
        vehicle: { id: "V-8821", make: "Volvo", model: "FH16", registrationNumber: "MH12AB1234" }
      },
      {
        id: "TR-2026-0003",
        tripNumber: "TR-2026-0003",
        status: "SCHEDULED",
        startLocation: "Los Angeles Port Terminal (LAX-4)",
        endLocation: "San Diego Distribution Center (SAN-2)",
        scheduledStart: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        scheduledEnd: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        cargoWeight: 5000.0,
        cargoDescription: "Beverages and snacks",
        vehicle: { id: "V-8821", make: "Volvo", model: "FH16", registrationNumber: "MH12AB1234" }
      }
    ];
  }, [trips]);

  const activeTrip = useMemo(() => {
    return driverTrips.find(t => t.status === "DISPATCHED");
  }, [driverTrips]);

  const featuredTrip = useMemo(() => {
    return activeTrip || driverTrips.find(t => t.status === "SCHEDULED") || driverTrips[0];
  }, [activeTrip, driverTrips]);

  if (isLoading || !driver) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 select-none">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-text-secondary font-semibold">Loading Driver Operations Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-6 animate-fadeIn">
      
      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-800 text-text-on-primary text-xs px-4 py-3 rounded-m shadow-dialog animate-fadeIn transition-all duration-300">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:bg-gray-800 rounded p-0.5 text-text-muted hover:text-text-on-primary">
            <X size={14} />
          </button>
        </div>
      )}
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-border-app pb-6">
        
        {/* Title and Welcome */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary-light text-primary rounded border border-primary/10 flex items-center gap-1">
              <ShieldCheck size={11} />
              Driver Active Status
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-success-light text-success rounded border border-success/10">
              On Duty
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Driver Dashboard
          </h1>
          <p className="text-sm text-text-secondary">
            Welcome back, <span className="font-bold text-text-primary">{driver?.user?.firstName || "John"}!</span> Keep up the safe driving today.
          </p>
        </div>

        {/* Info & Actions */}
        <div className="flex items-center gap-4 self-start md:self-center">
          
          {/* Live Date & Time Display */}
          <div className="flex items-center gap-3 bg-surface-app border border-border-app px-4 py-2 rounded-m shadow-small text-xs font-bold text-text-primary">
            <div className="flex items-center gap-1.5 text-text-secondary border-r border-gray-200 pr-3">
              <Calendar size={14} className="text-primary" />
              <span>{dateStr || "Loading..."}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Clock size={14} className="text-secondary" />
              <span>{time || "Loading..."}</span>
            </div>
          </div>

          {/* Interactive Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileDropdownOpen(false);
              }}
              className="relative h-9 w-9 flex items-center justify-center rounded-m border border-border-app bg-surface-app hover:bg-gray-50 hover:text-primary transition-all shadow-small cursor-pointer"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-error text-[9px] font-extrabold text-text-on-primary rounded-circular flex items-center justify-center border-2 border-white shadow-small animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-app border border-border-app rounded-m shadow-dialog z-30 py-3 px-4 text-xs">
                <div className="flex items-center justify-between border-b border-border-app pb-2 mb-2 font-bold">
                  <span className="text-text-primary">Operational Alerts</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2 rounded border text-[11px] leading-normal ${n.read ? "bg-white border-gray-150 text-text-secondary" : "bg-primary-light/35 border-primary/20 text-text-primary font-medium"}`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span>{n.text}</span>
                        <span className="text-[9px] text-text-muted whitespace-nowrap shrink-0">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 h-9 px-2 rounded-m border border-border-app bg-surface-app hover:bg-gray-50 transition-all shadow-small cursor-pointer"
            >
              <div className="h-6 w-6 rounded-circular bg-primary text-text-on-primary flex items-center justify-center font-bold text-xs uppercase">
                {(driver?.user?.firstName?.[0] || "J")}
              </div>
              <ChevronDown size={14} className="text-text-secondary" />
            </button>

            {/* Avatar Dropdown Panel */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-app border border-border-app rounded-m shadow-dialog z-30 py-1.5 text-xs text-text-primary font-bold">
                <div className="px-4 py-2 border-b border-border-app mb-1.5">
                  <span className="block text-[11px] text-text-primary font-bold">{driver?.user?.firstName || "John"} {driver?.user?.lastName || "Doe"}</span>
                  <span className="block text-[9px] font-mono text-text-secondary">Driver ID: {driver?.id}</span>
                </div>
                
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} className="text-text-secondary" />
                  <span>My Profile Logs</span>
                </button>
                
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary flex items-center gap-2 cursor-pointer"
                >
                  <Settings size={14} className="text-text-secondary" />
                  <span>Shift Settings</span>
                </button>

                <Link
                  href="/dashboard"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} className="text-warning" />
                  <span>Fleet Manager POV</span>
                </Link>
                
                <div className="border-t border-border-app my-1"></div>
                
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-error flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Go Off Duty</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Overview KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        {/* Card 1: Today's Trips */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-primary/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Today's Trips</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-text-primary">{driverTrips.length}</span>
                <span className="text-xs font-bold text-text-secondary">Trips</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-primary-light text-primary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Route size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">
              {driverTrips.filter(t => t.status === "SCHEDULED").length} Scheduled • {driverTrips.filter(t => t.status === "DISPATCHED").length} Active
            </span>
            <span className="font-bold text-success flex items-center gap-0.5 text-[10px]">
              <TrendingUp size={12} /> Stable
            </span>
          </div>
        </div>

        {/* Card 2: Active Trip */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-secondary/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Active Trip</span>
              <div className="mt-1.5">
                <span className="text-xs font-mono font-bold text-primary bg-primary-light border border-primary/20 px-2 py-1 rounded">
                  {activeTrip ? activeTrip.tripNumber : "None"}
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-secondary-light text-secondary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Navigation size={18} className={activeTrip ? "animate-pulse" : ""} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium truncate max-w-[110px]">
              {activeTrip ? `Route: ${activeTrip.startLocation} ➔ ${activeTrip.endLocation}` : "No active route"}
            </span>
            <span className={`font-bold px-1.5 py-0.2 text-[10px] rounded uppercase tracking-wider border ${activeTrip ? "bg-success-light text-success border-success/20 animate-pulse" : "bg-gray-150 text-text-secondary border-gray-200"}`}>
              {activeTrip ? "In Progress" : "Idle"}
            </span>
          </div>
        </div>

        {/* Card 3: Completed Deliveries */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Completed</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-success">{driverTrips.filter(t => t.status === "COMPLETED").length}</span>
                <span className="text-xs font-bold text-text-secondary">/ {driverTrips.length}</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-success-light text-success flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-[10px] font-bold text-text-secondary">
              <span>Delivery Rate</span>
              <span>{driverTrips.length > 0 ? Math.round((driverTrips.filter(t => t.status === "COMPLETED").length / driverTrips.length) * 100) : 0}%</span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-circular overflow-hidden">
              <div className="h-full bg-success rounded-circular" style={{ width: `${driverTrips.length > 0 ? (driverTrips.filter(t => t.status === "COMPLETED").length / driverTrips.length) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Deliveries */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-warning/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Pending</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-warning">{driverTrips.filter(t => t.status === "SCHEDULED").length}</span>
                <span className="text-xs font-bold text-text-secondary">Left</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-warning-light text-warning flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">
              {activeTrip ? `Next ETA: ${new Date(activeTrip.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "No active trip"}
            </span>
            <span className="font-bold text-success flex items-center gap-0.5 text-[10px] uppercase">
              Stable
            </span>
          </div>
        </div>

        {/* Card 5: Distance Covered */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-info/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Distance Today</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-text-primary">
                  {driverTrips.reduce((acc, t) => acc + (t.odometerAtEnd && t.odometerAtStart ? (t.odometerAtEnd - t.odometerAtStart) : 0), 0) || 284}
                </span>
                <span className="text-xs font-bold text-text-secondary">km</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-info-light text-info flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Gauge size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Yesterday: 250 km</span>
            <span className="font-bold text-success flex items-center gap-0.5 text-[10px]">
              <TrendingUp size={12} /> +13.6%
            </span>
          </div>
        </div>

        {/* Card 6: Driver Rating */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-warning/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Driver Rating</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-text-primary">{driver?.rating || 4.92}</span>
                <span className="text-xs text-warning font-bold">★</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-warning-light text-warning flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Star size={18} className="fill-warning" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Top 5% regional</span>
            <span className="font-semibold text-success flex items-center gap-0.5 text-[10px]">
              <TrendingUp size={12} /> Stable
            </span>
          </div>
        </div>
      </div>

      {/* 3. Current Trip Featured Section */}
      <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card space-y-6 hover:border-primary/15 transition-all">
        
        {/* Header: Title, Live Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-app pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary-light text-primary rounded border border-primary/10">
              Active Dispatch Cargo
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-xl font-bold text-text-primary">Current Assigned Route</h2>
              <span className="text-xs font-mono font-bold text-primary bg-primary-light border border-primary/20 px-2 py-0.5 rounded">
                {featuredTrip ? featuredTrip.tripNumber : "None"}
              </span>
            </div>
          </div>

          {/* GPS Live Locator & Status badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-success bg-success-light/20 px-2.5 py-1 rounded-circular border border-success/15 font-semibold">
              <span className="h-2 w-2 bg-success rounded-circular inline-block animate-ping"></span>
              <span>GPS Tracking Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success bg-success-light/20 px-2.5 py-1 rounded-circular border border-success/15 font-bold">
              <span>On Time</span>
            </div>
          </div>
        </div>

        {featuredTrip ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Trip & Route Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Route Specification</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-primary-light text-primary rounded-circular flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    A
                  </div>
                  <div>
                    <span className="text-text-secondary font-semibold block">Pickup Location</span>
                    <span className="font-bold text-text-primary block mt-0.5">{featuredTrip.startLocation}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-success-light text-success rounded-circular flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    B
                  </div>
                  <div>
                    <span className="text-text-secondary font-semibold block">Destination Terminal</span>
                    <span className="font-bold text-text-primary block mt-0.5">{featuredTrip.endLocation}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100 mt-2">
                  <div>
                    <span className="text-text-secondary font-semibold block">Cargo Description</span>
                    <span className="font-bold text-text-primary block mt-0.5 truncate max-w-[130px]">
                      {featuredTrip.cargoDescription || "General Freight"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary font-semibold block">Cargo Weight</span>
                    <span className="font-bold text-text-primary block mt-0.5">
                      {(featuredTrip.cargoWeight || 8500).toLocaleString("en-US")} kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Assigned Vehicle Specs */}
            <div className="space-y-4 lg:border-l lg:border-gray-100 lg:pl-8">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Assigned Equipment</h3>
              
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-gray-50 border border-border-app rounded-m flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary-light text-primary rounded-m flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Assigned Truck</span>
                    <span className="font-bold text-text-primary block text-sm mt-0.5">
                      {featuredTrip.vehicle ? `${featuredTrip.vehicle.make} ${featuredTrip.vehicle.model}` : "Volvo FH16"}
                    </span>
                    <span className="text-[10px] text-text-secondary block mt-0.5">
                      {featuredTrip.vehicle ? featuredTrip.vehicle.registrationNumber : "MH12AB1234"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-text-secondary font-semibold block">Priority Tier</span>
                    <span className={`inline-block mt-0.5 px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider rounded border ${featuredTrip.cargoWeight && featuredTrip.cargoWeight > 8000 ? "text-error bg-error-light/25 border-error/15" : "text-primary bg-primary-light border-primary/20"}`}>
                      {featuredTrip.cargoWeight && featuredTrip.cargoWeight > 8000 ? "High Priority" : "Medium Priority"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary font-semibold block">Scheduled Departure</span>
                    <span className="font-bold text-text-primary block mt-0.5">
                      {new Date(featuredTrip.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Trip Progress */}
            <div className="space-y-4 lg:border-l lg:border-gray-100 lg:pl-8">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Trip Progress</h3>
              
              <div className="space-y-4 text-xs">
                
                {/* Progress percentage bar */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-text-secondary">
                    <span>Overall Route Progress</span>
                    <span className="text-primary font-mono font-bold">
                      {featuredTrip.status === "COMPLETED" ? "100%" : featuredTrip.status === "DISPATCHED" ? "85%" : "0%"} Completed
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-circular overflow-hidden">
                    <div className="h-full bg-primary rounded-circular" style={{ width: featuredTrip.status === "COMPLETED" ? "100%" : featuredTrip.status === "DISPATCHED" ? "85%" : "0%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-150 pb-2">
                    <span className="text-text-secondary font-semibold">Status</span>
                    <span className="font-bold text-text-primary capitalize">{featuredTrip.status.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-semibold">Start Location</span>
                    <span className="font-bold text-text-primary truncate max-w-[130px]">{featuredTrip.startLocation}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-xs text-text-secondary">
            No dynamic dispatches assigned to your driver ID.
          </div>
        )}

        {/* Quick Action Buttons Toolbar */}
        {featuredTrip && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStartTrip(featuredTrip.id)}
                disabled={featuredTrip.status !== "SCHEDULED"}
                className="flex h-9 items-center gap-1.5 px-4 bg-primary hover:bg-primary/95 text-text-on-primary text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Navigation size={14} />
                <span>Start Trip</span>
              </button>
              <button
                onClick={() => triggerToast("Trip paused. Logging rest stop duration HOS values.")}
                disabled={featuredTrip.status !== "DISPATCHED"}
                className="flex h-9 items-center gap-1.5 px-4 border border-border-app hover:bg-gray-50 text-text-secondary hover:text-text-primary text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Clock size={14} />
                <span>Pause Trip</span>
              </button>
              <button
                onClick={() => handleCompleteTrip(featuredTrip.id)}
                disabled={featuredTrip.status !== "DISPATCHED"}
                className="flex h-9 items-center gap-1.5 px-4 bg-success text-text-on-primary hover:bg-success/95 text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <CheckCircle2 size={14} />
                <span>Complete Trip</span>
              </button>
            </div>

            <button
              onClick={() => triggerToast("Exception logging triggered. Dispatch operations notified.")}
              className="flex h-9 items-center gap-1.5 px-4 border border-error text-error hover:bg-error-light/20 text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95"
            >
              <AlertTriangle size={14} />
              <span>Report Issue</span>
            </button>
          </div>
        )}

      </div>

      {/* 4. Today's Schedule Section */}
      <div className="space-y-4 pt-2">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold text-text-primary">Today's Schedule</h2>
          <p className="text-xs text-text-secondary">View and manage your assigned trips for today.</p>
        </div>

        {/* Vertical Timeline wrapper */}
        <div className="relative border-l-2 border-gray-100 ml-4 pl-8 space-y-6 py-2">
          
          {/* Timeline node connector path */}
          {(() => {
            return driverTrips.map((trip) => {
              const isCompleted = trip.status === "COMPLETED";
              const isActive = trip.status === "DISPATCHED";
              const isUpcoming = trip.status === "SCHEDULED";

              const scheduledTime = `${new Date(trip.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(trip.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              const duration = `${Math.max(1, Math.round((new Date(trip.scheduledEnd).getTime() - new Date(trip.scheduledStart).getTime()) / (3600 * 1000)))}h`;
              const priority = trip.cargoWeight && trip.cargoWeight > 8000 
                ? "High" 
                : (trip.cargoWeight && trip.cargoWeight > 3000 ? "Medium" : "Low");
              const displayStatus = trip.status === "COMPLETED" ? "Completed" : trip.status === "DISPATCHED" ? "In Progress" : "Upcoming";

              return (
                <div key={trip.id} className="relative">
                  {/* Timeline node icon */}
                  <div className={`absolute -left-[46px] top-2 h-7 w-7 rounded-circular flex items-center justify-center border-2 z-10 transition-all
                    ${isCompleted ? "bg-success border-success text-text-on-primary shadow-small" : ""}
                    ${isActive ? "bg-white border-primary text-primary scale-110 shadow-card animate-pulse" : ""}
                    ${isUpcoming ? "bg-white border-gray-200 text-text-muted" : ""}
                  `}>
                    {isCompleted && <CheckCircle2 size={13} />}
                    {isActive && <Navigation size={12} />}
                    {isUpcoming && <Clock size={12} />}
                  </div>

                  {/* Card Container */}
                  <div className={`bg-surface-app border p-5 rounded-m shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/10 transition-all
                    ${isCompleted ? "border-success/15 hover:border-success/35 opacity-90" : ""}
                    ${isActive ? "border-primary/35 shadow-card" : ""}
                    ${isUpcoming ? "border-border-app opacity-60" : ""}
                  `}>
                    <div className="flex flex-col md:flex-row gap-5 items-start md:items-center font-sans">
                      
                      {/* Time block */}
                      <div className="space-y-0.5 shrink-0">
                        <span className="text-[9px] font-bold text-text-secondary uppercase">Scheduled Block</span>
                        <span className="block text-xs font-bold text-text-primary">{scheduledTime}</span>
                        <span className="text-[10px] text-text-secondary block font-semibold">Duration: {duration}</span>
                      </div>

                      {/* Path specification */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-[9px] text-primary bg-primary-light px-1.5 py-0.2 rounded">
                            {trip.tripNumber || trip.id}
                          </span>
                          <span className={`inline-block px-1.5 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                            ${priority === "High" ? "bg-error-light text-error border-error/20" : ""}
                            ${priority === "Medium" ? "bg-primary-light text-primary border-primary/20" : ""}
                            ${priority === "Low" ? "bg-gray-100 text-text-secondary border-gray-200" : ""}
                          `}>
                            {priority} Priority
                          </span>
                          
                          {/* Status Badge */}
                          <span className={`inline-block px-1.5 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                            ${isCompleted ? "bg-success-light text-success border-success/20" : ""}
                            ${isActive ? "bg-primary-light text-primary border-primary/20 animate-pulse" : ""}
                            ${isUpcoming ? "bg-gray-100 text-text-secondary border-gray-200" : ""}
                          `}>
                            {displayStatus}
                          </span>
                        </div>
                        
                        {/* Pickup/Destination Text */}
                        <span className="text-xs text-text-primary block font-semibold mt-1">
                          {trip.startLocation} ➔ {trip.endLocation}
                        </span>
                      </div>

                    </div>

                    {/* Actions Block */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => triggerToast(`Opening manifest and cargo weight logs for ${trip.tripNumber || trip.id}.`)}
                        className="flex h-9 items-center justify-center px-4 border border-border-app bg-white hover:bg-gray-50 text-xs font-bold text-text-secondary hover:text-text-primary rounded-m transition-all shadow-small cursor-pointer active:scale-95 shrink-0"
                      >
                        View Details
                      </button>

                      {isActive && (
                        <button
                          onClick={() => triggerToast(`GPS route navigation mapping loaded for ${trip.tripNumber || trip.id}.`)}
                          className="flex h-9 items-center gap-1.5 px-4 bg-primary hover:bg-primary/95 text-xs font-bold text-text-on-primary rounded-m transition-all shadow-small cursor-pointer active:scale-95 shrink-0"
                        >
                          <Navigation size={13} />
                          <span>Navigate</span>
                        </button>
                      )}

                      {isUpcoming && (
                        <button
                          onClick={() => handleStartTrip(trip.id)}
                          className="flex h-9 items-center gap-1.5 px-4 bg-success hover:bg-success/95 text-xs font-bold text-text-on-primary rounded-m transition-all shadow-small cursor-pointer active:scale-95 shrink-0 animate-pulse"
                        >
                          <Play size={13} />
                          <span>Start Trip</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* 5. Performance Summary Section */}
      <div className="space-y-6 pt-4 border-t border-border-app">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold text-text-primary">Performance Summary</h2>
          <p className="text-xs text-text-secondary">Track your driving performance and delivery efficiency.</p>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          
          {/* Card 1: Trips Completed */}
          <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Trips Completed</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-text-primary">142</span>
                  <span className="text-xs font-bold text-text-secondary">Trips</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-m bg-success-light text-success flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">All-time record</span>
              <span className="font-semibold text-success flex items-center gap-0.5 text-[10px]">
                <TrendingUp size={12} /> +8.2%
              </span>
            </div>
          </div>

          {/* Card 2: Total Distance Driven */}
          <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-primary/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Distance Driven</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-text-primary">45,200</span>
                  <span className="text-xs font-bold text-text-secondary">km</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-m bg-primary-light text-primary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                <Gauge size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Lifetime total</span>
              <span className="font-semibold text-success flex items-center gap-0.5 text-[10px]">
                <TrendingUp size={12} /> +1,200km
              </span>
            </div>
          </div>

          {/* Card 3: On-Time Rate */}
          <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-secondary/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">On-Time Rate</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-text-primary">94.5</span>
                  <span className="text-xs font-bold text-text-secondary">%</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-m bg-secondary-light text-secondary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Target: 92.0%</span>
              <span className="font-bold text-success flex items-center gap-0.5 text-[10px]">
                <TrendingUp size={12} /> Above
              </span>
            </div>
          </div>

          {/* Card 4: Average Rating */}
          <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-warning/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Average Rating</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-text-primary">4.92</span>
                  <span className="text-xs text-warning font-bold">★</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-m bg-warning-light text-warning flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                <Star size={18} className="fill-warning" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Top 5% regional</span>
              <span className="font-semibold text-success flex items-center gap-0.5 text-[10px]">
                <TrendingUp size={12} /> Stable
              </span>
            </div>
          </div>

          {/* Card 5: Safety Score */}
          <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Safety Score</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-success">96</span>
                  <span className="text-xs font-bold text-text-secondary">/100</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-m bg-success-light text-success flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Zero warnings</span>
              <span className="font-bold text-success flex items-center gap-0.5 text-[10px]">
                Excellent
              </span>
            </div>
          </div>

          {/* Card 6: Fuel Efficiency */}
          <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-info/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Fuel Efficiency</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-text-primary">27.6</span>
                  <span className="text-xs font-bold text-text-secondary">L/100k</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-m bg-info-light text-info flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
                <Fuel size={18} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Target: 29.0 max</span>
              <span className="font-semibold text-success flex items-center gap-0.5 text-[10px]">
                <TrendingUp size={12} /> -4.8%
              </span>
            </div>
          </div>

        </div>

        {/* Charts & Breakdown Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Performance Trend & Achievement Highlights */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trend Card */}
            <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Trips Completed (Last 7 Days)</h3>
                  <span className="text-[10px] text-text-secondary">Daily breakdown of dispatched trips</span>
                </div>
                <span className="text-xs font-bold text-primary font-mono bg-primary-light px-2 py-0.5 rounded">
                  21 Total Trips
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-[170px] w-full mt-2 relative">
                <svg viewBox="0 0 500 160" width="100%" height="160" className="text-primary overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0.0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid horizontal guidelines */}
                  <line x1="20" y1="30" x2="480" y2="30" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="20" y1="70" x2="480" y2="70" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="20" y1="110" x2="480" y2="110" stroke="#f3f4f6" strokeWidth="1" />
                  
                  {/* Gradient Area under curve */}
                  <path d="M 40,110 L 110,70 L 180,90 L 250,50 L 320,70 L 390,110 L 460,130 L 460,135 L 40,135 Z" fill="url(#chartGradient)" />
                  
                  {/* Linear connect path */}
                  <path d="M 40,110 L 110,70 L 180,90 L 250,50 L 320,70 L 390,110 L 460,130" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Interactive Nodes */}
                  <circle cx="40" cy="110" r="4" className="fill-white stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all" />
                  <circle cx="110" cy="70" r="4" className="fill-white stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all" />
                  <circle cx="180" cy="90" r="4" className="fill-white stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all" />
                  <circle cx="250" cy="50" r="4" className="fill-white stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all" />
                  <circle cx="320" cy="70" r="4" className="fill-white stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all" />
                  <circle cx="390" cy="110" r="4" className="fill-white stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all" />
                  <circle cx="460" cy="130" r="4" className="fill-white stroke-primary stroke-2 cursor-pointer hover:r-6 transition-all" />

                  {/* Day Labels directly inside SVG to ensure perfect alignment */}
                  <text x="40" y="152" textAnchor="middle" className="fill-gray-400 text-[10px] font-bold">Mon (2)</text>
                  <text x="110" y="152" textAnchor="middle" className="fill-gray-400 text-[10px] font-bold">Tue (4)</text>
                  <text x="180" y="152" textAnchor="middle" className="fill-gray-400 text-[10px] font-bold">Wed (3)</text>
                  <text x="250" y="152" textAnchor="middle" className="fill-gray-400 text-[10px] font-bold">Thu (5)</text>
                  <text x="320" y="152" textAnchor="middle" className="fill-gray-400 text-[10px] font-bold">Fri (4)</text>
                  <text x="390" y="152" textAnchor="middle" className="fill-gray-400 text-[10px] font-bold">Sat (2)</text>
                  <text x="460" y="152" textAnchor="middle" className="fill-gray-400 text-[10px] font-bold">Sun (1)</text>
                </svg>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card space-y-4">
              <div>
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <Award size={16} className="text-warning" />
                  <span>Achievement Highlights</span>
                </h3>
                <span className="text-[10px] text-text-secondary">Milestone badges earned this quarter</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Badge 1: Safe Driver */}
                <div className="bg-success-light/20 border border-success/15 p-3 rounded flex flex-col items-center text-center space-y-1">
                  <ShieldCheck size={24} className="text-success" />
                  <span className="text-[10px] font-bold text-text-primary block">Safe Driver</span>
                  <span className="text-[9px] text-text-secondary">30d incident free</span>
                </div>

                {/* Badge 2: On-Time Deliveries */}
                <div className="bg-primary-light/20 border border-primary/15 p-3 rounded flex flex-col items-center text-center space-y-1">
                  <CheckCircle2 size={24} className="text-primary" />
                  <span className="text-[10px] font-bold text-text-primary block">On-Time Pro</span>
                  <span className="text-[9px] text-text-secondary">100% week rating</span>
                </div>

                {/* Badge 3: Fuel Efficient */}
                <div className="bg-info-light/20 border border-info/15 p-3 rounded flex flex-col items-center text-center space-y-1">
                  <Fuel size={24} className="text-info" />
                  <span className="text-[10px] font-bold text-text-primary block">Eco driver</span>
                  <span className="text-[9px] text-text-secondary">Top fuel saver</span>
                </div>

                {/* Badge 4: Top Performer */}
                <div className="bg-warning-light/20 border border-warning/15 p-3 rounded flex flex-col items-center text-center space-y-1">
                  <Star size={24} className="text-warning fill-warning" />
                  <span className="text-[10px] font-bold text-text-primary block">Top Performer</span>
                  <span className="text-[9px] text-text-secondary">Region upper 5%</span>
                </div>

              </div>
            </div>

          </div>

          {/* Column 3: Performance Breakdown */}
          <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Performance Breakdown</h3>
              <span className="text-[10px] text-text-secondary">Core operations metrics analysis</span>
            </div>

            <div className="space-y-4">
              
              {/* Progress 1: Delivery Efficiency */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Delivery Efficiency</span>
                  <span className="text-text-primary font-bold">95%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-primary rounded-circular" style={{ width: "95%" }}></div>
                </div>
              </div>

              {/* Progress 2: Driving Safety */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Driving Safety</span>
                  <span className="text-text-primary font-bold">98%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-success rounded-circular" style={{ width: "98%" }}></div>
                </div>
              </div>

              {/* Progress 3: Customer Satisfaction */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Customer Satisfaction</span>
                  <span className="text-text-primary font-bold">96%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-warning rounded-circular" style={{ width: "96%" }}></div>
                </div>
              </div>

              {/* Progress 4: Route Adherence */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Route Adherence</span>
                  <span className="text-text-primary font-bold">94%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-info rounded-circular" style={{ width: "94%" }}></div>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-gray-100 mt-2 text-center">
              <span className="text-[11px] font-bold text-primary block">
                Next Review Cycle: Aug 1, 2026
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 6. Notifications & Alerts Section */}
      <div className="space-y-6 pt-4 border-t border-border-app">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold text-text-primary">Notifications & Alerts</h2>
          <p className="text-xs text-text-secondary">Stay informed about trips, vehicle status, and important updates.</p>
        </div>

        {/* 2 Column Layout: Alerts List, Featured Emergency Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Alerts List */}
          <div className="lg:col-span-2 space-y-4">
            {driverAlerts.length === 0 ? (
              <div className="bg-surface-app border border-border-app p-8 rounded-m text-center space-y-2">
                <CheckCircle2 size={32} className="text-success mx-auto" />
                <span className="block text-sm font-bold text-text-primary">All Clear!</span>
                <span className="block text-xs text-text-secondary">You have dismissed or read all notifications.</span>
              </div>
            ) : (
              driverAlerts.map((alert) => {
                // Determine icon based on category
                let IconComponent = Bell;
                let bgIconColor = "bg-primary-light text-primary";
                
                if (alert.category === "emergency") {
                  IconComponent = AlertTriangle;
                  bgIconColor = "bg-error-light text-error";
                } else if (alert.category === "new-trip") {
                  IconComponent = Route;
                  bgIconColor = "bg-primary-light text-primary";
                } else if (alert.category === "maintenance") {
                  IconComponent = Settings;
                  bgIconColor = "bg-warning-light text-warning";
                } else if (alert.category === "fuel") {
                  IconComponent = Fuel;
                  bgIconColor = "bg-error-light text-error";
                } else if (alert.category === "traffic") {
                  IconComponent = Navigation;
                  bgIconColor = "bg-warning-light text-warning";
                }

                return (
                  <div 
                    key={alert.id} 
                    className={`bg-surface-app border p-4 rounded-m shadow-card flex items-start gap-4 hover:border-primary/10 transition-all relative
                      ${alert.read ? "border-border-app opacity-75" : "border-primary/20 shadow-small"}
                    `}
                  >
                    {/* Unread dot indicator */}
                    {!alert.read && (
                      <span className="absolute top-4 right-4 h-2 w-2 bg-primary rounded-circular"></span>
                    )}

                    {/* Icon Column */}
                    <div className={`h-9 w-9 rounded-m flex items-center justify-center shrink-0 ${bgIconColor}`}>
                      <IconComponent size={18} />
                    </div>

                    {/* Content Column */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs font-bold text-text-primary truncate">{alert.title}</h4>
                        
                        {/* Priority Badge */}
                        <span className={`inline-block px-1.5 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                          ${alert.priority === "Critical" ? "bg-error-light text-error border-error/25" : ""}
                          ${alert.priority === "High" ? "bg-error-light/50 text-error border-error/15" : ""}
                          ${alert.priority === "Medium" ? "bg-warning-light text-warning border-warning/20" : ""}
                          ${alert.priority === "Low" ? "bg-gray-100 text-text-secondary border-gray-200" : ""}
                        `}>
                          {alert.priority}
                        </span>

                        <span className="text-[10px] text-text-secondary font-medium ml-auto shrink-0">{alert.timestamp}</span>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed">{alert.description}</p>

                      {/* Action buttons toolbar */}
                      <div className="flex items-center gap-2 pt-2">
                        <button 
                          onClick={() => triggerToast(`Manifest/details sheet opened for notification: ${alert.title}`)}
                          className="text-[10px] font-bold text-primary hover:underline hover:text-primary-dark transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                        
                        {!alert.read && (
                          <>
                            <span className="h-2.5 w-px bg-gray-200 inline-block"></span>
                            <button 
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="text-[10px] font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                            >
                              Mark as Read
                            </button>
                          </>
                        )}
                        
                        <span className="h-2.5 w-px bg-gray-200 inline-block"></span>
                        <button 
                          onClick={() => handleDismissAlert(alert.id)}
                          className="text-[10px] font-bold text-error hover:underline transition-all cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Column 3: Emergency Alert Card */}
          <div className="bg-error-light/10 border-2 border-error p-6 rounded-m shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-error">
                <AlertTriangle size={24} className="animate-bounce" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider">Critical Dispatch Alert</h3>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-text-primary">Dispatch Operations Centre Broadcast:</p>
                <p className="text-text-secondary leading-relaxed">
                  Weather Advisory: Dense fog warning in Grapevine Pass. Visibility below 10 meters. Safety guidelines mandate hazard lights and maintaining a minimum 50-meter gap.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => triggerToast("Initiating direct sat-link audio connection to Dispatch Operations...")}
                className="w-full flex h-10 items-center justify-center gap-2 bg-error hover:bg-error/95 text-text-on-primary text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95"
              >
                <Phone size={14} className="animate-pulse" />
                <span>Contact Dispatch Centre</span>
              </button>
              
              <span className="block text-[9px] text-text-secondary text-center">
                Backup Satellite Line: +1 (800) 555-9921
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
