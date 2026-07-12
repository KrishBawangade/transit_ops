"use client";

import { Users, Plus, Filter, Search } from "lucide-react";

export default function DriversPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Drivers Management</h2>
          <p className="text-sm text-text-secondary">Manage commercial drivers, shift schedules, licenses, and safety metrics.</p>
        </div>
        <button
          className="flex h-9 items-center gap-1.5 px-3 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small self-start md:self-auto"
          onClick={() => {}}
        >
          <Plus size={16} />
          <span>Add New Driver</span>
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search by driver name, license ID, status..."
            className="w-full h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>
        <button className="flex h-9 items-center gap-1.5 px-3 py-2 border border-border-app rounded-m text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors">
          <Filter size={14} />
          <span>Filter Status</span>
        </button>
      </div>

      {/* Main Content Placeholder Area */}
      <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card">
        <div className="h-12 w-12 rounded-circular bg-secondary-light text-secondary flex items-center justify-center mb-4">
          <Users size={24} />
        </div>
        <h3 className="text-base font-semibold text-text-primary">Drivers Feature Roster</h3>
        <p className="text-sm text-text-secondary max-w-sm mt-1 mb-6">
          This page represents the entry point for the Drivers feature. Your teammates can now import components from the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-primary font-mono text-xs">lib/features/drivers</code> folder to implement lists, status rosters, and hour of service (HOS) logs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 text-xs">
          <div className="px-4 py-3 bg-gray-50 border border-border-app rounded-m text-left">
            <span className="font-semibold text-text-primary block">📍 Features Folder</span>
            <span className="text-text-secondary mt-1 block">`lib/features/drivers/components`</span>
          </div>
          <div className="px-4 py-3 bg-gray-50 border border-border-app rounded-m text-left">
            <span className="font-semibold text-text-primary block">📊 Safety Tracking</span>
            <span className="text-text-secondary mt-1 block">HOS compliance, driver logs, reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}
