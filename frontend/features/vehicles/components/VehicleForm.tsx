"use client";

import React, { useState } from "react";
import { Vehicle } from "../types";
import { vehicleService } from "../services/vehicle.service";

interface VehicleFormProps {
  initialData?: Vehicle;
  onSave: (data: Omit<Vehicle, "id">) => Promise<void>;
  onCancel: () => void;
}

export function VehicleForm({ initialData, onSave, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    registrationNumber: initialData?.registrationNumber || "",
    name: initialData?.name || "",
    type: initialData?.type || "Truck",
    capacity: initialData?.capacity || "",
    purchaseDate: initialData?.purchaseDate || "",
    manufacturer: initialData?.manufacturer || "",
    model: initialData?.model || "",
    fuelType: initialData?.fuelType || "",
    odometer: initialData?.odometer ?? 0,
    acquisitionCost: initialData?.acquisitionCost ?? 0,
    insuranceExpiry: initialData?.insuranceExpiry || "",
    fitnessExpiry: initialData?.fitnessExpiry || "",
    status: initialData?.status || "Available",
    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "odometer" || name === "acquisitionCost" ? (Number(value) || 0) : value,
    }));
    // Clear field-specific error as they type
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const tempErrors: Record<string, string> = {};
    if (!formData.registrationNumber.trim()) {
      tempErrors.registrationNumber = "Registration Number is required.";
    }
    if (!formData.name.trim()) {
      tempErrors.name = "Vehicle Name is required.";
    }
    if (formData.acquisitionCost < 0) {
      tempErrors.acquisitionCost = "Acquisition Cost cannot be negative.";
    }
    if (formData.odometer < 0) {
      tempErrors.odometer = "Odometer cannot be negative.";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const isUnique = await vehicleService.checkRegistrationNumberUnique(
        formData.registrationNumber,
        initialData?.id
      );

      if (!isUnique) {
        setErrors({ registrationNumber: "Registration Number must be unique." });
        setIsSubmitting(false);
        return;
      }

      await onSave(formData);
    } catch (err: any) {
      setErrors({ form: err.message || "An error occurred while saving." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName: string) => `
    w-full h-9 px-3 rounded-m border text-xs text-text-primary placeholder:text-text-muted bg-gray-50 focus:bg-surface-app focus:outline-none transition-all shadow-small focus:ring-2
    ${errors[fieldName] ? "border-error focus:ring-error/20 focus:border-error" : "border-border-app focus:ring-primary/20 focus:border-primary"}
  `;

  const selectClass = "w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 hover:bg-gray-100/50 focus:bg-surface-app focus:outline-none transition-all shadow-small focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-medium animate-fadeIn">
          {errors.form}
        </div>
      )}

      {/* Main Grid split into logical sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-app border border-border-app p-6 rounded-m shadow-card">
        {/* Section 1: General Info */}
        <div className="md:col-span-2 pb-2 border-b border-border-app">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">General Information</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            Registration Number <span className="text-error font-bold">*</span>
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="e.g. TX-8821"
            className={inputClass("registrationNumber")}
          />
          {errors.registrationNumber && (
            <p className="mt-1 text-[11px] text-error font-semibold animate-fadeIn">{errors.registrationNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            Vehicle Name <span className="text-error font-bold">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Volvo FH16"
            className={inputClass("name")}
          />
          {errors.name && (
            <p className="mt-1 text-[11px] text-error font-semibold animate-fadeIn">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Vehicle Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini">Mini</option>
            <option value="Bus">Bus</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Capacity</label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="e.g. 25 Tons, 12 Seats"
            className={inputClass("capacity")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Manufacturer</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            placeholder="e.g. Volvo"
            className={inputClass("manufacturer")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. FH16"
            className={inputClass("model")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Fuel Type</label>
          <input
            type="text"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            placeholder="e.g. Diesel, Electric, Gasoline"
            className={inputClass("fuelType")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        {/* Section 2: Purchase & Odometer */}
        <div className="md:col-span-2 pb-2 mt-4 border-b border-border-app">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Purchase & Odometer Information</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className={inputClass("purchaseDate")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Acquisition Cost ($)</label>
          <input
            type="number"
            name="acquisitionCost"
            value={formData.acquisitionCost || ""}
            onChange={handleChange}
            placeholder="0"
            className={inputClass("acquisitionCost")}
          />
          {errors.acquisitionCost && (
            <p className="mt-1 text-[11px] text-error font-semibold animate-fadeIn">{errors.acquisitionCost}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Current Odometer (km)</label>
          <input
            type="number"
            name="odometer"
            value={formData.odometer || ""}
            onChange={handleChange}
            placeholder="0"
            className={inputClass("odometer")}
          />
          {errors.odometer && (
            <p className="mt-1 text-[11px] text-error font-semibold animate-fadeIn">{errors.odometer}</p>
          )}
        </div>

        <div className="hidden md:block"></div>

        {/* Section 3: Insurance & Fitness */}
        <div className="md:col-span-2 pb-2 mt-4 border-b border-border-app">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Insurance & Fitness Validity</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Insurance Expiry Date</label>
          <input
            type="date"
            name="insuranceExpiry"
            value={formData.insuranceExpiry}
            onChange={handleChange}
            className={inputClass("insuranceExpiry")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">Fitness Expiry Date</label>
          <input
            type="date"
            name="fitnessExpiry"
            value={formData.fitnessExpiry}
            onChange={handleChange}
            className={inputClass("fitnessExpiry")}
          />
        </div>

        {/* Section 4: Notes */}
        <div className="md:col-span-2 pb-2 mt-4 border-b border-border-app">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Additional Notes</h3>
        </div>

        <div className="md:col-span-2">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add vehicle-specific comments, defects, or assignment logs..."
            className="w-full p-3 rounded-m border border-border-app text-xs text-text-primary placeholder:text-text-muted bg-gray-50 focus:bg-surface-app focus:outline-none transition-all shadow-small focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[90px] font-sans"
          />
        </div>
      </div>

      {/* Buttons Panel */}
      <div className="flex justify-end gap-3 text-xs font-semibold select-none">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 h-9 border border-border-app rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 h-9 bg-primary text-text-on-primary rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
        >
          {isSubmitting 
            ? (initialData ? "Updating..." : "Saving...") 
            : (initialData ? "Update" : "Save")}
        </button>
      </div>
    </form>
  );
}
