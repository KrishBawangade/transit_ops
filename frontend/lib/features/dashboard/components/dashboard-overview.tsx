"use client";

import { 
  Truck, 
  Users, 
  MapPin, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ShieldAlert, 
  CheckCircle2,
  Navigation,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  // Mock metrics data
  const metrics = [
    {
      title: "Active Fleet",
      value: "42 / 50",
      subtext: "84% utilization rate",
      trend: "+4% from yesterday",
      trendUp: true,
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
    {
      title: "Drivers Active",
      value: "28 / 32",
      subtext: "4 on scheduled break",
      trend: "Stable operations",
      trendUp: null,
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary-light",
    },
    {
      title: "Trips in Transit",
      value: "18",
      subtext: "Avg. transit speed 48km/h",
      trend: "+3 dispatch queue",
      trendUp: true,
      icon: Navigation,
      color: "text-info",
      bgColor: "bg-info-light",
    },
    {
      title: "Active Alerts",
      value: "3 Critical",
      subtext: "Requires manager approval",
      trend: "-2 resolved today",
      trendUp: false,
      icon: AlertTriangle,
      color: "text-error",
      bgColor: "bg-error-light",
    },
  ];

  // Mock active trips
  const activeTrips = [
    {
      id: "TRP-9482",
      vehicle: "Volvo FH16 (V-8821)",
      driver: "Alex Rivera",
      route: "SFO Hub → LAX Terminal",
      status: "In Transit",
      statusColor: "bg-info-light text-info border-info/20",
      eta: "14:35 (In 45m)",
    },
    {
      id: "TRP-9483",
      vehicle: "Scania R500 (V-7710)",
      driver: "Sarah Connor",
      route: "Chicago Depot → Detroit Dock",
      status: "Delayed",
      statusColor: "bg-warning-light text-warning border-warning/20",
      eta: "16:10 (+30m)",
    },
    {
      id: "TRP-9484",
      vehicle: "Tesla Semi (V-9011)",
      driver: "David Chen",
      route: "Phoenix Plant → El Paso Hub",
      status: "In Transit",
      statusColor: "bg-info-light text-info border-info/20",
      eta: "18:50 (In 5h)",
    },
    {
      id: "TRP-9485",
      vehicle: "Kenworth T680 (V-4412)",
      driver: "Marcus Vance",
      route: "Miami Port → Atlanta Yard",
      status: "Loading",
      statusColor: "bg-success-light text-success border-success/20",
      eta: "Departs 12:15",
    },
  ];

  // Mock critical alerts
  const criticalAlerts = [
    {
      id: "ALT-204",
      title: "Engine Overheating",
      asset: "Vehicle V-8821 (Volvo FH16)",
      time: "12m ago",
      severity: "critical",
    },
    {
      id: "ALT-203",
      title: "Speeding Alert (112 km/h in 80 zone)",
      asset: "Vehicle V-7710 (Scania R500)",
      time: "34m ago",
      severity: "warning",
    },
    {
      id: "ALT-202",
      title: "Route Deviation Detected",
      asset: "Vehicle V-9011 (Tesla Semi)",
      time: "1h ago",
      severity: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Operations Control Center</h2>
          <p className="text-sm text-text-secondary">Real-time overview of your transit ecosystem, dispatch pipelines, and safety diagnostics.</p>
        </div>
        <div className="text-xs text-text-secondary flex items-center gap-1.5 bg-surface-app border border-border-app px-3 py-1.5 rounded-m shadow-small">
          <Clock size={14} />
          <span>Last sync: Just now</span>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx} 
              className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{m.title}</span>
                  <div className="text-2xl font-bold text-text-primary mt-1">{m.value}</div>
                </div>
                <div className={`h-10 w-10 rounded-m ${m.bgColor} ${m.color} flex items-center justify-center shadow-small group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={20} />
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-text-muted">{m.subtext}</span>
                {m.trendUp !== null && (
                  <span className={`font-semibold flex items-center gap-0.5 ${m.trendUp ? "text-success" : "text-error"}`}>
                    {m.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {m.trend}
                  </span>
                )}
                {m.trendUp === null && (
                  <span className="font-semibold text-text-secondary">{m.trend}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Dashboard Body (Trips + Sidebar/Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2/3 Column: Active Trips Monitoring */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-m shadow-card flex flex-col">
          <div className="p-4 border-b border-border-app flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary">Live Trips Pipeline</h3>
              <p className="text-xs text-text-secondary">Currently dispatched assets on route.</p>
            </div>
            <Link 
              href="/trips" 
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>View all trips</span>
              <ExternalLink size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary">
                  <th className="p-4">Trip ID</th>
                  <th className="p-4">Vehicle & Driver</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">ETA</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {activeTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono font-semibold text-xs text-primary">{trip.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary">{trip.vehicle}</span>
                        <span className="text-xs text-text-secondary">{trip.driver}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary text-xs">{trip.route}</td>
                    <td className="p-4">
                      <span className="font-medium text-text-primary text-xs">{trip.eta}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-circular border ${trip.statusColor}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1/3 Column: Live Action Centre (Alerts + Shortcuts) */}
        <div className="space-y-6">
          
          {/* Action Center - Active Alerts */}
          <div className="bg-surface-app border border-border-app rounded-m shadow-card p-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-app mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-error" size={18} />
                <h3 className="font-semibold text-text-primary">System Exceptions</h3>
              </div>
              <span className="px-2 py-0.5 bg-errorLight text-error text-[10px] font-bold rounded-circular">
                3 Alerting
              </span>
            </div>

            <div className="space-y-3">
              {criticalAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-m border flex gap-3 items-start transition-all cursor-pointer hover:shadow-small
                    ${
                      alert.severity === "critical"
                        ? "bg-errorLight/20 border-error/20 hover:border-error/40"
                        : "bg-warningLight/10 border-warning/10 hover:border-warning/30"
                    }
                  `}
                >
                  <AlertTriangle 
                    size={16} 
                    className={`mt-0.5 shrink-0 ${alert.severity === "critical" ? "text-error" : "text-warning"}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary truncate">{alert.title}</span>
                      <span className="text-[10px] text-text-muted shrink-0">{alert.time}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">{alert.asset}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-surface-app border border-border-app rounded-m shadow-card p-4">
            <h3 className="font-semibold text-text-primary pb-3 border-b border-border-app mb-4">Operations Playbook</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => alert("Dispatching new vehicle...")}
                className="p-3 bg-gray-50 border border-border-app rounded-m hover:bg-primary-light hover:border-primary/30 transition-all font-semibold text-text-primary text-center"
              >
                Dispatch Trip
              </button>
              <button 
                onClick={() => alert("Adding driver to roster...")}
                className="p-3 bg-gray-50 border border-border-app rounded-m hover:bg-secondary-light hover:border-secondary/30 transition-all font-semibold text-text-primary text-center"
              >
                Add Driver
              </button>
              <button 
                onClick={() => alert("Logging vehicle maintenance...")}
                className="p-3 bg-gray-50 border border-border-app rounded-m hover:bg-warningLight/20 hover:border-warning/30 transition-all font-semibold text-text-primary text-center col-span-2"
              >
                Log Maintenance Exception
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
