"use client";

import { Settings, Save, Shield, Bell, Key, Database } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    { name: "General Settings", desc: "Company name, primary region, currency, timezone settings.", icon: Settings },
    { name: "Users & Security", desc: "Operations manager permissions, API tokens, and access lists.", icon: Shield },
    { name: "Notification Config", desc: "SMS, Email, and Slack webhooks for critical safety alerts.", icon: Bell },
    { name: "Integrations & API", desc: "Connect GPS gateway providers, Samsara, or external ERP systems.", icon: Key },
    { name: "Database Backup", desc: "Manage sync schedules and history archive parameters.", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">System Settings</h2>
          <p className="text-sm text-text-secondary">Configure TransitOps preferences, safety thresholds, and telematics integrations.</p>
        </div>
        <button
          className="flex h-9 items-center gap-1.5 px-3 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small self-start md:self-auto"
          onClick={() => {}}
        >
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation list */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={index} 
                className={`p-4 border rounded-m cursor-pointer transition-all hover:bg-primary-light/50 hover:border-primary/20 bg-surface-app shadow-small
                  ${index === 0 ? "border-primary bg-primary-light/10" : "border-border-app"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-m flex items-center justify-center ${index === 0 ? "bg-primary text-text-on-primary" : "bg-gray-100 text-text-secondary"}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-text-primary">{section.name}</h3>
                    <p className="text-[10px] text-text-secondary leading-tight mt-0.5">{section.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Setting details content panel */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-m shadow-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary border-b border-border-app pb-3">General Settings Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Company Profile Name</label>
                <input 
                  type="text" 
                  defaultValue="TransitOps Logistics Corp" 
                  className="w-full h-9 px-3 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Operating Region</label>
                  <select className="w-full h-9 px-3 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary focus:outline-none focus:border-primary">
                    <option>North America (SFO/CHI)</option>
                    <option>Europe Central</option>
                    <option>Asia Pacific</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">System Timezone</label>
                  <select className="w-full h-9 px-3 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary focus:outline-none focus:border-primary">
                    <option>America/Los_Angeles (PST)</option>
                    <option>America/New_York (EST)</option>
                    <option>UTC / GMT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border-app flex items-center justify-between text-xs text-text-secondary">
            <span>For settings hooks, hook into `lib/features/settings` or equivalent global context.</span>
            <button className="text-primary font-semibold hover:underline">Learn more</button>
          </div>
        </div>
      </div>
    </div>
  );
}
