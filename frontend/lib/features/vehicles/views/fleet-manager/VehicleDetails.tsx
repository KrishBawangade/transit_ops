"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit, Calendar, DollarSign, Activity, FileText, AlertTriangle, ShieldAlert, CheckCircle2, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Vehicle } from "../../types";
import { vehicleService } from "../../services/vehicle.service";
import { VehicleStatusBadge } from "../../components/VehicleStatusBadge";

interface VehicleDetailsProps {
  id: string;
}

type TabType = "overview" | "documents" | "notes";

export function VehicleDetails({ id }: VehicleDetailsProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    async function loadVehicle() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await vehicleService.getVehicleById(id);
        if (!data) {
          setError("Vehicle not found");
        } else {
          setVehicle(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load vehicle details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-200 rounded-m"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="flex border-b border-border-app gap-4">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Content Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-m"></div>
          <div className="h-64 bg-gray-200 rounded-m"></div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card space-y-4 animate-fadeIn">
        <div className="h-12 w-12 rounded-circular bg-error-light text-error flex items-center justify-center mb-4">
          <Truck size={24} />
        </div>
        <h3 className="text-base font-semibold text-text-primary">Vehicle not found</h3>
        <p className="text-sm text-text-secondary max-w-sm mt-1">
          The requested vehicle parameters could not be found or do not exist in the database.
        </p>
        <button
          onClick={() => router.push("/vehicles")}
          className="flex h-9 items-center gap-1.5 px-3.5 border border-border-app rounded-m bg-surface-app text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small"
        >
          <ArrowLeft size={16} />
          <span>Return to Vehicle Registry</span>
        </button>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getDocumentAlert = (expiryDate: string, label: string) => {
    if (!expiryDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const date = new Date(expiryDate);
    date.setHours(0, 0, 0, 0);
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return (
        <div className="p-3.5 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-medium flex items-start gap-2">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{label} Expired:</span> This document expired on {expiryDate} ({Math.abs(days)} days ago).
          </div>
        </div>
      );
    }

    if (days <= 30) {
      return (
        <div className="p-3.5 bg-warning-light/20 border border-warning/20 rounded-m text-xs text-warning font-medium flex items-start gap-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{label} Expiration Alert:</span> Document will expire soon on {expiryDate} ({days} days remaining).
          </div>
        </div>
      );
    }

    return (
      <div className="p-3.5 bg-success-light/10 border border-success/20 rounded-m text-xs text-success font-medium flex items-start gap-2">
        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{label} Active:</span> Expiring on {expiryDate} ({days} days remaining).
        </div>
      </div>
    );
  };

  const cardClass = "bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4 hover:border-primary/20 transition-all duration-200";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/vehicles")}
            aria-label="Back to Vehicle Registry"
            className="flex h-9 w-9 items-center justify-center border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                {vehicle.name || `${vehicle.manufacturer} ${vehicle.model}`}
              </h2>
              <VehicleStatusBadge status={vehicle.status} />
            </div>
            <p className="text-sm font-mono font-semibold text-primary mt-0.5 leading-normal">
              {vehicle.registrationNumber}
            </p>
          </div>
        </div>

        <Link
          href={`/vehicles/${vehicle.id}/edit`}
          className="flex h-9 items-center gap-1.5 px-3.5 rounded-m bg-secondary text-text-on-primary text-xs font-semibold hover:bg-secondary/95 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-small self-start sm:self-auto cursor-pointer select-none"
        >
          <Edit size={14} />
          <span>Edit Vehicle</span>
        </Link>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border-app gap-2 text-xs font-semibold select-none">
        {(["overview", "documents", "notes"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 transition-all capitalize cursor-pointer -mb-px focus:outline-none focus:ring-2 focus:ring-primary/10 rounded-t-s
              ${
                activeTab === tab
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === "overview" && (
          <>
            {/* Card 1: Basic Information */}
            <div className={cardClass}>
              <div className="pb-2 border-b border-border-app flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Basic Information
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-normal">
                <div>
                  <dt className="text-text-secondary font-medium">Registration Number</dt>
                  <dd className="text-text-primary font-bold font-mono mt-0.5">
                    {vehicle.registrationNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Vehicle Name</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.name || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Manufacturer</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.manufacturer || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Model</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.model || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Vehicle Type</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">{vehicle.type}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Capacity</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.capacity || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Fuel Type</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.fuelType || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Current Status</dt>
                  <dd className="text-text-primary mt-0.5">
                    <VehicleStatusBadge status={vehicle.status} />
                  </dd>
                </div>
              </dl>
            </div>

            {/* Card 2: Purchase Information */}
            <div className={cardClass}>
              <div className="pb-2 border-b border-border-app flex items-center gap-2">
                <DollarSign size={16} className="text-success" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Purchase Information
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-normal">
                <div>
                  <dt className="text-text-secondary font-medium">Purchase Date</dt>
                  <dd className="text-text-primary font-semibold mt-0.5 font-mono">
                    {vehicle.purchaseDate || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Acquisition Cost</dt>
                  <dd className="text-text-primary font-bold font-mono mt-0.5 text-success">
                    {vehicle.acquisitionCost ? formatCurrency(vehicle.acquisitionCost) : "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Current Odometer</dt>
                  <dd className="text-text-primary font-bold font-mono mt-0.5">
                    {vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : "0 km"}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}

        {activeTab === "documents" && (
          <div className={`${cardClass} md:col-span-2 space-y-5`}>
            <div className="pb-2 border-b border-border-app flex items-center gap-2">
              <Calendar size={16} className="text-warning" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Document Status & Validity
              </h3>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-normal">
              <div className="space-y-1">
                <span className="text-text-secondary font-medium">Insurance Expiry Date</span>
                <div className="text-text-primary font-bold font-mono">{vehicle.insuranceExpiry || "N/A"}</div>
              </div>
              <div className="space-y-1">
                <span className="text-text-secondary font-medium">Fitness Expiry Date</span>
                <div className="text-text-primary font-bold font-mono">{vehicle.fitnessExpiry || "N/A"}</div>
              </div>
            </dl>

            <div className="space-y-3 border-t border-border-app pt-4">
              {getDocumentAlert(vehicle.insuranceExpiry, "Insurance Policy")}
              {getDocumentAlert(vehicle.fitnessExpiry, "Fitness Certification")}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="md:col-span-2">
            {!vehicle.notes || vehicle.notes.trim() === "" ? (
              <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card">
                <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-base font-semibold text-text-primary">No Notes Filed</h3>
                <p className="text-sm text-text-secondary max-w-sm mt-1">
                  No additional comments or logs have been recorded for this vehicle.
                </p>
              </div>
            ) : (
              <div className={cardClass}>
                <div className="pb-2 border-b border-border-app flex items-center gap-2">
                  <FileText size={16} className="text-text-secondary" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Notes & Logs
                  </h3>
                </div>
                <div className="text-xs text-text-primary bg-gray-50 p-3 rounded-m border border-border-app min-h-[100px] whitespace-pre-wrap font-sans leading-relaxed">
                  {vehicle.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
