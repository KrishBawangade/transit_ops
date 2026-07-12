"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useVehicles } from "../../hooks/useVehicles";
import { VehicleForm } from "../../components/VehicleForm";
import { Vehicle } from "../../types";
import { vehicleService } from "../../services/vehicle.service";

interface VehicleEditProps {
  id: string;
}

export function VehicleEdit({ id }: VehicleEditProps) {
  const router = useRouter();
  const { updateVehicle } = useVehicles();
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
        setError(err.message || "Failed to load vehicle for editing.");
      } finally {
        setIsLoading(false);
      }
    }
    loadVehicle();
  }, [id]);

  const handleSave = async (data: Omit<Vehicle, "id">) => {
    await updateVehicle(id, data);
    router.push("/vehicles");
  };

  const handleCancel = () => {
    router.push("/vehicles");
  };

  if (isLoading) {
    return (
      <div className="bg-surface-app border border-border-app rounded-m p-12 flex flex-col items-center justify-center shadow-card space-y-4">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-circular animate-spin"></div>
        <span className="text-xs text-text-secondary font-medium">Loading vehicle details...</span>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card space-y-4">
        <div className="p-3 bg-error-light text-error text-xs font-semibold rounded-m border border-error/20">
          {error || "Unable to load vehicle details for editing."}
        </div>
        <button
          onClick={handleCancel}
          className="flex h-9 items-center gap-1.5 px-3 border border-border-app rounded-m text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Registry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCancel}
          className="flex h-9 w-9 items-center justify-center border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-all cursor-pointer shadow-small"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Edit Vehicle</h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Modify details for vehicle <span className="font-semibold text-text-primary">{vehicle.registrationNumber}</span>.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <VehicleForm initialData={vehicle} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
