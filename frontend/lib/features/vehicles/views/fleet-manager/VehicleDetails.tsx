"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit, Calendar, DollarSign, Activity, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Vehicle } from "../../types";
import { vehicleService } from "../../services/vehicle.service";
import { VehicleStatusBadge } from "../../components/VehicleStatusBadge";

interface VehicleDetailsProps {
  id: string;
}

export function VehicleDetails({ id }: VehicleDetailsProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicle() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await vehicleService.getVehicleById(id);
        if (!data) {
          setError("Vehicle not found.");
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
      <div className="bg-surface-app border border-border-app rounded-m p-12 flex flex-col items-center justify-center shadow-card space-y-4 animate-fadeIn">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-circular animate-spin"></div>
        <span className="text-xs text-text-secondary font-medium">Loading vehicle details...</span>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card space-y-4 animate-fadeIn">
        <div className="p-3 bg-error-light text-error text-xs font-semibold rounded-m border border-error/20">
          {error || "Unable to display vehicle details."}
        </div>
        <button
          onClick={() => router.push("/vehicles")}
          className="flex h-9 items-center gap-1.5 px-3 border border-border-app rounded-m text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Registry</span>
        </button>
      </div>
    );
  }

  const cardClass = "bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4 hover:border-primary/20 transition-all duration-200";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/vehicles")}
            aria-label="Back to Registry"
            className="flex h-9 w-9 items-center justify-center border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                {vehicle.registrationNumber}
              </h2>
              <VehicleStatusBadge status={vehicle.status} />
            </div>
            <p className="text-sm text-text-secondary mt-0.5 leading-normal">
              {vehicle.name || `${vehicle.manufacturer} ${vehicle.model}`} Details
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

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info Card */}
        <div className={cardClass}>
          <div className="pb-2 border-b border-border-app flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              General Specification
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
          </dl>
        </div>

        {/* Purchase & Telematics Card */}
        <div className={cardClass}>
          <div className="pb-2 border-b border-border-app flex items-center gap-2">
            <DollarSign size={16} className="text-success" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Purchase & Telematics
            </h3>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-normal">
            <div>
              <dt className="text-text-secondary font-medium">Purchase Date</dt>
              <dd className="text-text-primary font-semibold mt-0.5">
                {vehicle.purchaseDate || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary font-medium">Acquisition Cost</dt>
              <dd className="text-text-primary font-bold font-mono mt-0.5">
                {vehicle.acquisitionCost ? (
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(vehicle.acquisitionCost)
                ) : (
                  "N/A"
                )}
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

        {/* Compliance (Insurance & Fitness) Card */}
        <div className={cardClass}>
          <div className="pb-2 border-b border-border-app flex items-center gap-2">
            <Calendar size={16} className="text-warning" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Compliance & Validity
            </h3>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-normal">
            <div>
              <dt className="text-text-secondary font-medium">Insurance Expiry Date</dt>
              <dd className="text-text-primary font-semibold mt-0.5">
                {vehicle.insuranceExpiry || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary font-medium">Fitness Expiry Date</dt>
              <dd className="text-text-primary font-semibold mt-0.5">
                {vehicle.fitnessExpiry || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Notes Card */}
        <div className={cardClass}>
          <div className="pb-2 border-b border-border-app flex items-center gap-2">
            <FileText size={16} className="text-text-secondary" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Special Notes / Logs
            </h3>
          </div>

          <div className="text-xs text-text-primary bg-gray-50 p-3 rounded-m border border-border-app min-h-[70px] whitespace-pre-wrap font-sans leading-relaxed">
            {vehicle.notes || "No additional logs or notes available for this vehicle."}
          </div>
        </div>
      </div>
    </div>
  );
}
