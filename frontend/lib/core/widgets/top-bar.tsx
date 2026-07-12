"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle, 
  CheckCircle2, 
  Plus,
  Truck,
  Users,
  Route,
  ChevronDown
} from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // References to handle clicking outside dropdowns
  const notifRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setQuickAddOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get display title based on path
  const getPageTitle = (path: string) => {
    if (path === "/") return "Dashboard";
    const segment = path.split("/")[1];
    if (!segment) return "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const title = getPageTitle(pathname);

  // Mock Notification Feed
  const notifications = [
    { id: 1, text: "Volvo FH16 (V-8821) engine temp exceeding 102°C", time: "12m ago", unread: true },
    { id: 2, text: "Sarah Connor updated trip status to 'Delayed'", time: "34m ago", unread: true },
    { id: 3, text: "Driver David Chen passed safety inspection check", time: "2h ago", unread: false },
  ];

  return (
    <header className="h-[64px] border-b border-border-app bg-surface-app shadow-small flex items-center justify-between px-[24px] lg:px-[32px] shrink-0 sticky top-0 z-30">
      
      {/* Left side: Hamburger (mobile) + Page Title (Shifted right by px-[32px] on desktop) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-[40px] w-[40px] items-center justify-center rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          {/* Extra margin on desktop to prevent overlap with border absolute toggle button */}
          <h1 className="text-lg font-bold text-text-primary tracking-tight transition-all duration-300 lg:ml-[16px]">
            {title}
          </h1>
        </div>
      </div>

      {/* Center: Search Bar (hidden on small screens, uses arbitrary px margins & padding) */}
      <div className="hidden md:flex items-center max-w-md w-full mx-[32px] relative">
        <Search className="absolute left-3.5 text-text-muted" size={16} />
        <input
          type="text"
          placeholder="Search vehicles, trips, drivers..."
          className="w-full h-9 pl-[40px] pr-[16px] rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-surface-app transition-all shadow-small focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Right side: Operations Health, Dropdowns, Actions */}
      <div className="flex items-center gap-4">
        
        {/* Operations status badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-[12px] py-[6px] rounded-circular bg-successLight text-success text-xs font-semibold border border-success/10">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>System Healthy</span>
        </div>

        {/* Global Quick Action Dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="flex h-9 items-center gap-1.5 px-[12px] rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small active:scale-95 cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden md:inline">Quick Action</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${quickAddOpen ? "rotate-180" : ""}`} />
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 mt-[8px] z-50 bg-surface-app border border-border-app rounded-m shadow-menu p-1 w-52 animate-fadeIn">
              <div className="px-3 py-1.5 text-xs text-text-secondary border-b border-border-app">
                Dispatch Playbook
              </div>
              <button
                onClick={() => {
                  alert("Opening Dispatch Modal...");
                  setQuickAddOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-gray-100 rounded-s text-left transition-colors cursor-pointer"
              >
                <Route size={14} className="text-primary" />
                <span>Create New Trip</span>
              </button>
              <button
                onClick={() => {
                  alert("Opening Add Vehicle Modal...");
                  setQuickAddOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-gray-100 rounded-s text-left transition-colors cursor-pointer"
              >
                <Truck size={14} className="text-secondary" />
                <span>Add Fleet Vehicle</span>
              </button>
              <button
                onClick={() => {
                  alert("Opening Register Driver Modal...");
                  setQuickAddOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-gray-100 rounded-s text-left transition-colors cursor-pointer"
              >
                <Users size={14} className="text-info" />
                <span>Register Driver</span>
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-[24px] w-[1px] bg-border-app" />

        {/* Help Button */}
        <button
          onClick={() => alert("Redirecting to help documentation & manual...")}
          className="h-9 w-9 flex items-center justify-center rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors cursor-pointer"
          title="Help Center"
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className={`h-9 w-9 flex items-center justify-center rounded-m transition-colors cursor-pointer relative
              ${notifDropdownOpen ? "bg-gray-100 text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-gray-100"}`}
            title="Notifications"
          >
            <Bell size={18} />
            {/* Active notification indicator */}
            <span className="absolute top-[10px] right-[10px] h-[8px] w-[8px] rounded-full bg-error ring-2 ring-surface-app" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-[8px] z-50 bg-surface-app border border-border-app rounded-m shadow-menu w-80 animate-fadeIn">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-app">
                <span className="text-xs font-semibold text-text-primary">Operations Alerts</span>
                <button 
                  onClick={() => alert("Marked all as read")}
                  className="text-[10px] text-primary hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs hover:bg-gray-50/50 cursor-pointer transition-colors ${n.unread ? "bg-primary-light/10" : ""}`}>
                    <div className="flex items-start gap-1.5 justify-between">
                      <p className={`text-text-primary leading-snug ${n.unread ? "font-semibold" : ""}`}>{n.text}</p>
                      {n.unread && <span className="h-1.5 w-1.5 rounded-circular bg-primary mt-1 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-text-muted mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border-app p-2 text-center bg-gray-50">
                <button 
                  onClick={() => {
                    alert("Opening notification log...");
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs text-text-secondary hover:text-text-primary font-semibold block w-full"
                >
                  View all system logs
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
