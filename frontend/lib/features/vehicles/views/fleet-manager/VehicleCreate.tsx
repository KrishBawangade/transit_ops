"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useVehicles } from "../../hooks/useVehicles";
import { VehicleForm } from "../../components/VehicleForm";
import { Vehicle } from "../../types";

export function VehicleCreate() {
  const router = useRouter();
  const { addVehicle } = useVehicles();

  const handleSave = async (data: Omit<Vehicle, "id">) => {
    await addVehicle(data);
    router.push("/vehicles");
  };

  const handleCancel = () => {
    router.push("/vehicles");
  };

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
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Add New Vehicle</h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Register a new fleet asset in TransitOps.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <VehicleForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
