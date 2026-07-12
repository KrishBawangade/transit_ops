"use client";

import React, { useState, useEffect } from "react";
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
  Play
} from "lucide-react";

export default function DriverDashboard() {
  // 1. Interactive States
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [time, setTime] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
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
            Welcome back, <span className="font-bold text-text-primary">John!</span> Keep up the safe driving today.
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
              <div className="h-6 w-6 rounded-circular bg-primary text-text-on-primary flex items-center justify-center font-bold text-xs">
                J
              </div>
              <ChevronDown size={14} className="text-text-secondary" />
            </button>

            {/* Avatar Dropdown Panel */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-app border border-border-app rounded-m shadow-dialog z-30 py-1.5 text-xs text-text-primary font-bold">
                <div className="px-4 py-2 border-b border-border-app mb-1.5">
                  <span className="block text-[11px] text-text-primary">John Doe</span>
                  <span className="block text-[9px] font-mono text-text-secondary">Driver ID: D-109</span>
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
                <span className="text-2xl font-extrabold text-text-primary">4</span>
                <span className="text-xs font-bold text-text-secondary">Trips</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-primary-light text-primary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Route size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">1 Scheduled • 3 Active</span>
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
                  TRP-9482
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-secondary-light text-secondary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Navigation size={18} className="animate-pulse" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Route: SFO ➔ LAX</span>
            <span className="font-bold px-1.5 py-0.2 bg-success-light text-success text-[10px] rounded uppercase tracking-wider border border-success/20 animate-pulse">
              In Progress
            </span>
          </div>
        </div>

        {/* Card 3: Completed Deliveries */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Completed</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-success">12</span>
                <span className="text-xs font-bold text-text-secondary">/ 15</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-success-light text-success flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-[10px] font-bold text-text-secondary">
              <span>Delivery Rate</span>
              <span>80%</span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-circular overflow-hidden">
              <div className="h-full bg-success rounded-circular" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Deliveries */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-warning/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Pending</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-warning">3</span>
                <span className="text-xs font-bold text-text-secondary">Left</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-m bg-warning-light text-warning flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Next ETA: 16:30</span>
            <span className="font-bold text-error flex items-center gap-0.5 text-[10px] uppercase">
              <AlertTriangle size={11} className="animate-bounce" /> 1 Overdue
            </span>
          </div>
        </div>

        {/* Card 5: Distance Covered */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-info/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Distance Today</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-text-primary">284</span>
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
              <TrendingUp size={12} /> +0.04
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
                TRP-9482
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

        {/* 3 Column Grid: Trip Info & Route, Assigned Vehicle, Trip Progress */}
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
                  <span className="font-bold text-text-primary block mt-0.5">San Francisco Cargo Depot (SFO-1)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 bg-success-light text-success rounded-circular flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  B
                </div>
                <div>
                  <span className="text-text-secondary font-semibold block">Destination Terminal</span>
                  <span className="font-bold text-text-primary block mt-0.5">Los Angeles Port Terminal (LAX-4)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100 mt-2">
                <div>
                  <span className="text-text-secondary font-semibold block">Total Route Distance</span>
                  <span className="font-bold text-text-primary block mt-0.5">612 km</span>
                </div>
                <div>
                  <span className="text-text-secondary font-semibold block">Scheduled ETA</span>
                  <span className="font-bold text-text-primary block mt-0.5">14:35 PM (In 45m)</span>
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
                  <span className="font-bold text-text-primary block text-sm mt-0.5">Volvo FH16 (V-8821)</span>
                  <span className="text-[10px] text-text-secondary block mt-0.5">Heavy Semi-Electric Rig</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-text-secondary font-semibold block">Priority Tier</span>
                  <span className="inline-block mt-0.5 px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider text-error bg-error-light/25 border border-error/15 rounded">
                    High Priority
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary font-semibold block">Scheduled Departure</span>
                  <span className="font-bold text-text-primary block mt-0.5">08:00 AM</span>
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
                  <span className="text-primary font-mono font-bold">87% Completed</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-circular overflow-hidden">
                  <div className="h-full bg-primary rounded-circular" style={{ width: "87%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-text-secondary font-semibold">Stops Progress</span>
                  <span className="font-bold text-text-primary">3 of 4 Stops Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary font-semibold">Current Checkpoint</span>
                  <span className="font-bold text-text-primary">Bakersfield Stopover (KM 490)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => triggerToast("Trip TRP-9482 started. GPS telemetry tracking activated.")}
              className="flex h-9 items-center gap-1.5 px-4 bg-primary hover:bg-primary/95 text-text-on-primary text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95"
            >
              <Navigation size={14} />
              <span>Start Trip</span>
            </button>
            <button
              onClick={() => triggerToast("Trip paused. Logging rest stop duration HOS values.")}
              className="flex h-9 items-center gap-1.5 px-4 border border-border-app hover:bg-gray-50 text-text-secondary hover:text-text-primary text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95"
            >
              <Clock size={14} />
              <span>Pause Trip</span>
            </button>
            <button
              onClick={() => triggerToast("Trip completed. Uploading cargo weight receipts and manifest logs.")}
              className="flex h-9 items-center gap-1.5 px-4 bg-success text-text-on-primary hover:bg-success/95 text-xs font-bold rounded-m transition-all shadow-small cursor-pointer active:scale-95"
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
            const scheduleTrips = [
              {
                id: "TRP-9480",
                pickup: "Oakland Depot (OAK-2)",
                destination: "San Francisco Cargo Depot (SFO-1)",
                scheduledTime: "06:00 AM - 07:30 AM",
                duration: "1.5h",
                priority: "Medium",
                status: "Completed" as const,
                color: "success"
              },
              {
                id: "TRP-9482",
                pickup: "San Francisco Cargo Depot (SFO-1)",
                destination: "Los Angeles Port Terminal (LAX-4)",
                scheduledTime: "08:00 AM - 02:35 PM",
                duration: "6.5h",
                priority: "High",
                status: "In Progress" as const,
                color: "primary"
              },
              {
                id: "TRP-9486",
                pickup: "Los Angeles Port Terminal (LAX-4)",
                destination: "San Diego Distribution Center (SAN-2)",
                scheduledTime: "03:30 PM - 05:45 PM",
                duration: "2.25h",
                priority: "Low",
                status: "Upcoming" as const,
                color: "warning"
              }
            ];

            return scheduleTrips.map((trip) => {
              const isCompleted = trip.status === "Completed";
              const isActive = trip.status === "In Progress";
              const isUpcoming = trip.status === "Upcoming";

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
                    <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                      
                      {/* Time block */}
                      <div className="space-y-0.5 shrink-0">
                        <span className="text-[9px] font-bold text-text-secondary uppercase">Scheduled Block</span>
                        <span className="block text-xs font-bold text-text-primary">{trip.scheduledTime}</span>
                        <span className="text-[10px] text-text-secondary block">Duration: {trip.duration}</span>
                      </div>

                      {/* Path specification */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[9px] text-primary bg-primary-light px-1.5 py-0.2 rounded">
                            {trip.id}
                          </span>
                          <span className={`inline-block px-1.5 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                            ${trip.priority === "High" ? "bg-error-light text-error border-error/20" : ""}
                            ${trip.priority === "Medium" ? "bg-primary-light text-primary border-primary/20" : ""}
                            ${trip.priority === "Low" ? "bg-gray-100 text-text-secondary border-gray-200" : ""}
                          `}>
                            {trip.priority} Priority
                          </span>
                          
                          {/* Status Badge */}
                          <span className={`inline-block px-1.5 py-0.2 text-[8px] font-bold rounded uppercase tracking-wider border
                            ${trip.status === "Completed" ? "bg-success-light text-success border-success/20" : ""}
                            ${trip.status === "In Progress" ? "bg-primary-light text-primary border-primary/20" : ""}
                            ${trip.status === "Upcoming" ? "bg-gray-100 text-text-secondary border-gray-200" : ""}
                          `}>
                            {trip.status}
                          </span>
                        </div>
                        
                        {/* Pickup/Destination Text */}
                        <span className="text-xs text-text-primary block font-semibold mt-1">
                          {trip.pickup} ➔ {trip.destination}
                        </span>
                      </div>

                    </div>

                    {/* Actions Block */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => triggerToast(`Opening manifest and cargo weight logs for ${trip.id}.`)}
                        className="flex h-8 items-center justify-center px-3 border border-border-app bg-surface-app hover:bg-gray-50 text-[11px] font-bold text-text-secondary hover:text-text-primary rounded transition-all cursor-pointer"
                      >
                        View Details
                      </button>

                      {isActive && (
                        <button
                          onClick={() => triggerToast(`GPS route navigation mapping loaded for ${trip.id}.`)}
                          className="flex h-8 items-center gap-1 px-3 bg-primary hover:bg-primary/95 text-[11px] font-bold text-text-on-primary rounded transition-all shadow-small cursor-pointer"
                        >
                          <Navigation size={12} />
                          <span>Navigate</span>
                        </button>
                      )}

                      {isUpcoming && (
                        <button
                          onClick={() => triggerToast(`Initiating trip ${trip.id}. Dispatch operations center notified.`)}
                          className="flex h-8 items-center gap-1 px-3 bg-success hover:bg-success/95 text-[11px] font-bold text-text-on-primary rounded transition-all shadow-small cursor-pointer"
                        >
                          <Play size={12} />
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

    </div>
  );
}
