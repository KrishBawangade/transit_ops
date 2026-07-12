"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogOut,
  User as UserIcon,
  CreditCard
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile?: boolean;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Vehicles", icon: Truck, badge: "12" },
  { href: "/drivers", label: "Drivers", icon: Users, badge: "8" },
  { href: "/trips", label: "Trips", icon: Route },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Active check helper
  const isActive = (href: string) => {
    if (!mounted || !pathname) {
      return false;
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40
        flex flex-col bg-surface-app border-r border-border-app shadow-sidebar
        transition-all duration-300 ease-in-out
        ${isMobile ? "w-[256px]" : isOpen ? "w-[256px]" : "w-[80px]"}
        ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
      `}
    >
      {/* Collapsible toggle button - Absolute positioned on the border edge, vertically centered in 64px header */}
      {!isMobile && (
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setProfileMenuOpen(false); // Close dropdown if sidebar collapses
          }}
          className="hidden lg:flex absolute top-[20px] -right-3 z-50 h-6 w-6 items-center justify-center rounded-circular border border-border-app bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-transform active:scale-95 shadow-small cursor-pointer"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}

      {/* Brand Header - Height 64px, Padded 16px when open */}
      <div className={`flex h-[64px] items-center border-b border-border-app transition-all duration-300 ${isOpen || isMobile ? "px-[16px]" : "justify-center px-0"}`}>
        <Link href="/" className="flex items-center gap-3 overflow-hidden select-none">
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-m bg-primary text-text-on-primary shadow-small">
            <TrendingUp size={20} className="animate-pulse" />
          </div>
          {(isOpen || isMobile) && (
            <div className="flex flex-col animate-fadeIn">
              <span className="text-sm font-semibold tracking-tight text-text-primary">
                TransitOps
              </span>
              <span className="text-[10px] text-text-secondary leading-none">
                Fleet Management
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-m text-sm font-medium transition-all duration-200 group relative
                ${
                  active
                    ? "bg-primary text-text-on-primary shadow-small"
                    : "text-text-secondary hover:text-text-primary hover:bg-primary-light"
                }
              `}
            >
              <Icon
                size={20}
                className={`
                  shrink-0 transition-transform duration-200 group-hover:scale-110
                  ${active ? "text-text-on-primary" : "text-text-secondary group-hover:text-primary"}
                `}
              />
              
              {(isOpen || isMobile) && (
                <span className="flex-1 truncate animate-fadeIn">{item.label}</span>
              )}

              {/* Badge for items if sidebar is open */}
              {(isOpen || isMobile) && item.badge && (
                <span
                  className={`
                    px-2 py-0.5 text-[11px] font-semibold rounded-circular shrink-0 animate-fadeIn
                    ${
                      active
                        ? "bg-text-on-primary text-primary"
                        : "bg-gray-100 text-text-secondary"
                    }
                  `}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed state */}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-4 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-text-on-primary text-xs font-medium px-2 py-1.5 rounded-s shadow-menu whitespace-nowrap">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-primary text-[10px] rounded-circular">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Preview & Settings Dropdown */}
      <div className="border-t border-border-app p-[16px] bg-gray-50 relative">
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="w-full flex items-center gap-3 overflow-hidden text-left focus:outline-none cursor-pointer group"
        >
          <div className="h-[36px] w-[36px] shrink-0 rounded-circular bg-secondary text-text-on-primary flex items-center justify-center font-semibold shadow-small group-hover:ring-2 group-hover:ring-secondary/20 transition-all">
            OP
          </div>
          {(isOpen || isMobile) && (
            <div className="flex-1 min-w-0 animate-fadeIn">
              <div className="text-xs font-semibold text-text-primary truncate">
                Operations Lead
              </div>
              <div className="text-[10px] text-text-secondary truncate">
                ops@transitops.com
              </div>
            </div>
          )}
        </button>

        {/* Profile Dropdown Menu */}
        {profileMenuOpen && (
          <div
            className={`
              absolute bottom-[60px] z-50 bg-surface-app border border-border-app rounded-m shadow-menu p-1 w-48
              ${isOpen || isMobile ? "left-4" : "left-2"}
            `}
          >
            <div className="px-3 py-1.5 text-xs text-text-secondary border-b border-border-app">
              Account Options
            </div>
            <button
              onClick={() => {
                alert("Navigating to profile...");
                setProfileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-gray-100 rounded-s text-left transition-colors cursor-pointer"
            >
              <UserIcon size={14} className="text-text-secondary" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => {
                alert("Navigating to billing...");
                setProfileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-gray-100 rounded-s text-left transition-colors cursor-pointer"
            >
              <CreditCard size={14} className="text-text-secondary" />
              <span>Billing</span>
            </button>
            <div className="h-px bg-border-app my-1" />
            <button
              onClick={() => {
                alert("Logging out...");
                setProfileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-error hover:bg-errorLight/30 rounded-s text-left transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
