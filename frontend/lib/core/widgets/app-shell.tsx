"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Desktop sidebar toggle state (fully expanded vs icon-only)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  // Mobile sidebar overlay drawer toggle state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-app font-sans">
      {/* 1. Desktop Sidebar (visible on lg screens, hidden on mobile/tablet) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar 
          isOpen={isDesktopSidebarOpen} 
          setIsOpen={setIsDesktopSidebarOpen} 
        />
      </div>

      {/* 2. Mobile Sidebar Overlay & Drawer (visible only under lg screens) */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={isMobileSidebarOpen} 
          setIsOpen={setIsMobileSidebarOpen} 
          isMobile={true}
        />
      </div>

      {/* 3. Main Content Container */}
      <div 
        className={`
          flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out
          ${isDesktopSidebarOpen ? "lg:pl-[256px]" : "lg:pl-[80px]"}
        `}
      >
        {/* Top Header */}
        <TopBar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Page Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background-app">
          <div className="max-w-[1600px] mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
