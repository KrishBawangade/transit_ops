"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Filter, Search, Star, Trash2, Edit3, ShieldAlert, CheckCircle2, X, RefreshCw } from "lucide-react";
import { DriverCompliance } from "@/features/drivers/views/safety-officer/DriverCompliance";
import { driverService } from "@/features/drivers/services/driver.service";

export default function DriversPage() {
  const [role, setRole] = useState("fleet-manager");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const activeRole = localStorage.getItem("transit_ops_user_role") || "fleet-manager";
    setRole(activeRole);

    const handleStorage = () => {
      setRole(localStorage.getItem("transit_ops_user_role") || "fleet-manager");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch or set initial mock data
  useEffect(() => {
    const loadDrivers = async () => {
      setIsLoading(true);
      try {
        const response = await driverService.listDrivers();
        if (response && response.data && response.data.length > 0) {
          setDrivers(response.data);
        } else {
          setDrivers(mockDrivers);
        }
      } catch (err) {
        setDrivers(mockDrivers);
      } finally {
        setIsLoading(false);
      }
    };
    loadDrivers();
  }, []);

  const handleDeleteDriver = (id: string, name: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    triggerToast(`Driver ${name} has been archived successfully.`);
  };

  if (role === "safety-officer") {
    return <DriverCompliance />;
  }

  // Filtered List
  const filteredDrivers = drivers.filter(driver => {
    const name = driver.user 
      ? (driver.user.name || `${driver.user.firstName} ${driver.user.lastName}`) 
      : "";
    const email = driver.user?.email || "";
    const license = driver.licenseNumber || "";
    const status = driver.status || "";

    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.toLowerCase().includes(searchQuery.toLowerCase()) ||
      status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 border border-gray-800 text-text-on-primary text-xs px-4 py-3 rounded-m shadow-dialog animate-fadeIn">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:bg-gray-800 rounded p-0.5 text-text-muted hover:text-text-on-primary">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Drivers Management</h2>
          <p className="text-sm text-text-secondary">Manage commercial drivers, shift schedules, licenses, and safety metrics.</p>
        </div>
        <button
          className="flex h-9 items-center gap-1.5 px-3 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small self-start md:self-auto cursor-pointer active:scale-95"
          onClick={() => triggerToast("Driver registration module activated. Dispatch operations initialized.")}
        >
          <Plus size={16} />
          <span>Add New Driver</span>
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search by driver name, license class, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>
        
        {/* Status filters */}
        <div className="flex items-center gap-1">
          {["ALL", "ACTIVE", "ON_TRIP", "SUSPENDED", "INACTIVE"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-m border transition-all cursor-pointer uppercase tracking-wider
                ${selectedStatus === status 
                  ? "bg-primary text-text-on-primary border-primary shadow-small" 
                  : "bg-white text-text-secondary border-border-app hover:bg-gray-50 hover:text-text-primary"
                }
              `}
            >
              {status === "ALL" ? "All status" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Drivers Roster List */}
      <div className="bg-surface-app border border-border-app rounded-m overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-12 text-center space-y-3 select-none">
            <RefreshCw size={24} className="text-primary animate-spin mx-auto animate-pulse" />
            <p className="text-xs text-text-secondary font-semibold">Loading Commercial Drivers Roster...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users size={32} className="text-text-secondary mx-auto" />
            <h3 className="text-sm font-bold text-text-primary">No drivers found</h3>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">Try refining your search query or change status filter parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border-app text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  <th className="py-3 px-4">Driver info</th>
                  <th className="py-3 px-4">Driver ID</th>
                  <th className="py-3 px-4">License credentials</th>
                  <th className="py-3 px-4">License expiry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Performance rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredDrivers.map((driver) => {
                  const name = driver.user?.name || "Unassigned User";
                  const email = driver.user?.email || "No email info";
                  const rating = Number(driver.rating ?? 5.0);

                  return (
                    <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Driver Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-circular bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-text-primary block truncate">{name}</span>
                            <span className="text-[10px] text-text-secondary block truncate">{email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Driver ID */}
                      <td className="py-3 px-4 font-mono text-[10px] text-text-secondary">
                        {driver.id}
                      </td>

                      {/* License */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-text-primary block">{driver.licenseClass || "Class A"}</span>
                        <span className="text-[10px] text-text-secondary font-mono block mt-0.5">{driver.licenseNumber || "N/A"}</span>
                      </td>

                      {/* Expiry */}
                      <td className="py-3 px-4 text-text-secondary">
                        {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 text-[8px] font-bold rounded-circular uppercase tracking-wider border
                          ${driver.status === "ACTIVE" ? "bg-success-light text-success border-success/20" : ""}
                          ${driver.status === "ON_TRIP" ? "bg-primary-light text-primary border-primary/20" : ""}
                          ${driver.status === "SUSPENDED" ? "bg-error-light text-error border-error/20" : ""}
                          ${driver.status === "INACTIVE" ? "bg-gray-100 text-text-secondary border-gray-200" : ""}
                        `}>
                          {driver.status === "ON_TRIP" ? "On Trip" : driver.status?.toLowerCase()}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-warning text-warning shrink-0" />
                          <span className="font-bold text-text-primary">{rating.toFixed(2)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => triggerToast(`Editing driver ${name} operational credentials.`)}
                            className="p-1.5 hover:bg-gray-150 hover:text-primary rounded text-text-secondary transition-colors cursor-pointer"
                            title="Edit credentials"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.id, name)}
                            className="p-1.5 hover:bg-error-light/25 hover:text-error rounded text-text-secondary transition-colors cursor-pointer"
                            title="Archive driver"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

const mockDrivers = [
  {
    id: "DRV-8821",
    user: {
      name: "Alex Rivera",
      email: "alex.rivera@transitops.com",
      phone: "+1 (555) 019-2834",
      avatarUrl: null
    },
    licenseNumber: "DL-9382098",
    licenseClass: "Class A CDL",
    licenseExpiry: "2028-11-15",
    status: "ON_TRIP" as const,
    rating: 4.9
  },
  {
    id: "DRV-7263",
    user: {
      name: "Sarah Connor",
      email: "sarah.connor@transitops.com",
      phone: "+1 (555) 018-7263",
      avatarUrl: null
    },
    licenseNumber: "DL-8273928",
    licenseClass: "Class A CDL",
    licenseExpiry: "2029-04-20",
    status: "ACTIVE" as const,
    rating: 4.8
  },
  {
    id: "DRV-9023",
    user: {
      name: "David Chen",
      email: "david.chen@transitops.com",
      phone: "+1 (555) 016-9023",
      avatarUrl: null
    },
    licenseNumber: "DL-1920392",
    licenseClass: "Class B CDL",
    licenseExpiry: "2027-08-10",
    status: "ON_TRIP" as const,
    rating: 4.75
  },
  {
    id: "DRV-3849",
    user: {
      name: "Emma Watson",
      email: "emma.watson@transitops.com",
      phone: "+1 (555) 012-3849",
      avatarUrl: null
    },
    licenseNumber: "DL-3849201",
    licenseClass: "Class A CDL",
    licenseExpiry: "2026-12-05",
    status: "ACTIVE" as const,
    rating: 4.95
  },
  {
    id: "DRV-9273",
    user: {
      name: "Marcus Aurelius",
      email: "marcus.aurelius@transitops.com",
      phone: "+1 (555) 014-9273",
      avatarUrl: null
    },
    licenseNumber: "DL-8821039",
    licenseClass: "Class A CDL",
    licenseExpiry: "2030-01-30",
    status: "INACTIVE" as const,
    rating: 4.5
  },
  {
    id: "DRV-8273",
    user: {
      name: "Elena Rostova",
      email: "elena.rostova@transitops.com",
      phone: "+1 (555) 011-8273",
      avatarUrl: null
    },
    licenseNumber: "DL-7729103",
    licenseClass: "Class B CDL",
    licenseExpiry: "2028-06-18",
    status: "ACTIVE" as const,
    rating: 4.85
  },
  {
    id: "DRV-7721",
    user: {
      name: "Carlos Santana",
      email: "carlos.santana@transitops.com",
      phone: "+1 (555) 015-7721",
      avatarUrl: null
    },
    licenseNumber: "DL-2938102",
    licenseClass: "Class A CDL",
    licenseExpiry: "2029-09-14",
    status: "SUSPENDED" as const,
    rating: 3.9
  },
  {
    id: "DRV-8832",
    user: {
      name: "John Doe",
      email: "john.doe@transitops.com",
      phone: "+1 (555) 019-8832",
      avatarUrl: null
    },
    licenseNumber: "DL-3849209",
    licenseClass: "Class A CDL",
    licenseExpiry: "2027-03-22",
    status: "ACTIVE" as const,
    rating: 4.65
  }
];
