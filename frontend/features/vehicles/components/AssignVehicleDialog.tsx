"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Check, RefreshCw } from "lucide-react";
import { Vehicle, Driver, VehicleAssignment } from "../types";
import { vehicleAssignmentService } from "../services/vehicleAssignment.service";

interface AssignVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  allVehicles: Vehicle[];
  allAssignments: VehicleAssignment[];
}

export function AssignVehicleDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  allVehicles, 
  allAssignments 
}: AssignVehicleDialogProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [remarks, setRemarks] = useState("");
  
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dialogCancelBtnRef = useRef<HTMLButtonElement>(null);

  // Compute available vehicles reactively
  const vehicles = useMemo(() => {
    if (!isOpen) return [];
    const assignedIds = new Set(
      allAssignments
        .filter((a) => a.status === "Assigned")
        .map((a) => a.vehicleId)
    );
    
    return allVehicles.filter(
      (v) => v.status !== "Retired" && !assignedIds.has(v.id)
    );
  }, [isOpen, allVehicles, allAssignments]);

  // Reset form selections on open
  useEffect(() => {
    if (isOpen) {
      setAssignmentDate(new Date().toISOString().split("T")[0]);
      setSelectedVehicleId("");
      setSelectedDriverId("");
      setRemarks("");
      setError("");
    }
  }, [isOpen]);

  // Fetch and filter active/unassigned drivers in background on open
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      vehicleAssignmentService.getDrivers()
        .then((allDrivers) => {
          const assignedDriverIds = new Set(
            allAssignments
              .filter((a) => a.status === "Assigned")
              .map((a) => a.driverId)
          );
          
          const availableDrivers = allDrivers.filter(
            (d) => !assignedDriverIds.has(d.id)
          );

          setDrivers(availableDrivers);
        })
        .catch((err: any) => {
          setError(err.message || "Failed to load active drivers.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        dialogCancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isSaving, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedVehicleId) {
      setError("Please select a vehicle.");
      return;
    }
    if (!selectedDriverId) {
      setError("Please select a driver.");
      return;
    }
    if (!assignmentDate) {
      setError("Please pick an assignment date.");
      return;
    }

    setIsSaving(true);
    try {
      await vehicleAssignmentService.assignVehicle(
        selectedVehicleId,
        selectedDriverId,
        assignmentDate,
        remarks || undefined
      );
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving assignment.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
        onClick={() => {
          if (!isSaving && !isLoading) {
            onClose();
          }
        }} 
      />
      <form
        onSubmit={handleSubmit}
        className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-md w-full p-6 relative z-10 animate-fadeIn space-y-4"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-text-primary">Assign Vehicle</h3>
            <p className="text-xs text-text-secondary mt-1">
              Select an available vehicle and assign it to an active commercial driver.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isSaving && !isLoading) {
                onClose();
              }
            }}
            disabled={isSaving || isLoading}
            className="text-text-muted hover:text-text-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-medium animate-fadeIn">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4 py-8 flex flex-col items-center justify-center select-none text-xs text-text-secondary">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span>Loading active drivers ledger...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Vehicle *</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                required
                disabled={isSaving}
                className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer disabled:opacity-50"
              >
                <option value="">-- Select Available Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.registrationNumber})
                  </option>
                ))}
              </select>
              {vehicles.length === 0 && (
                <p className="mt-1 text-[11px] text-warning font-semibold">No unassigned fleet vehicles are currently available.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Driver *</label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                required
                disabled={isSaving || drivers.length === 0}
                className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer disabled:opacity-50"
              >
                {drivers.length === 0 ? (
                  <option value="">No active, unassigned drivers available</option>
                ) : (
                  <>
                    <option value="">-- Select Commercial Driver --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Assignment Date *</label>
              <input
                type="date"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
                required
                disabled={isSaving}
                className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Remarks / Instructions</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Log shift instructions, route restrictions..."
                disabled={isSaving}
                className="w-full p-3 rounded-m border border-border-app text-xs text-text-primary placeholder:text-text-muted bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[70px] font-sans disabled:opacity-50"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 text-xs font-semibold border-t border-divider-app pt-4 select-none">
          <button
            type="button"
            ref={dialogCancelBtnRef}
            onClick={onClose}
            disabled={isSaving || isLoading}
            className="px-4 h-9 border border-border-app rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isLoading || vehicles.length === 0 || drivers.length === 0}
            className="px-4.5 h-9 bg-primary text-text-on-primary rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
