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
  MapPin
} from "lucide-react";

export default function DriverDashboard() {
  // 1. Interactive States
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [time, setTime] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");

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
              <span className="text-3xl font-extrabold text-text-primary block">4 Trips</span>
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
              <span className="text-xl font-extrabold text-primary block mt-1">TRP-9482</span>
            </div>
            <div className="h-10 w-10 rounded-m bg-secondary-light text-secondary flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200">
              <Navigation size={18} className="animate-pulse" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Route: SFO ➔ LAX</span>
            <span className="font-bold px-1.5 py-0.2 bg-success-light text-success text-[10px] rounded uppercase tracking-wider border border-success/20">
              In Progress
            </span>
          </div>
        </div>

        {/* Card 3: Completed Deliveries */}
        <div className="bg-surface-app border border-border-app p-6 rounded-m shadow-card flex flex-col justify-between hover:border-success/20 transition-all group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Completed</span>
              <span className="text-3xl font-extrabold text-success block">12 / 15</span>
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
              <span className="text-3xl font-extrabold text-warning block">3 Left</span>
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
              <span className="text-3xl font-extrabold text-text-primary block">284 km</span>
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
              <span className="text-3xl font-extrabold text-text-primary block">4.92</span>
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

    </div>
  );
}
