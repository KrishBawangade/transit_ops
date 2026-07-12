"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";
import { VehicleAssignment, Driver } from "../types";
import { vehicleAssignmentService } from "../services/vehicleAssignment.service";

interface ReassignVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: VehicleAssignment | null;
  onSave: () => void;
}

export function ReassignVehicleDialog({ isOpen, onClose, assignment, onSave }: ReassignVehicleDialogProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const dialogCancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && assignment) {
      setSelectedDriverId(assignment.driverId);
      setError("");
      
      vehicleAssignmentService.getDrivers()
        .then((allDrivers) => {
          setDrivers(allDrivers);
        })
        .catch((err) => {
          setError(err.message || "Failed to load drivers.");
        });
    }
  }, [isOpen, assignment]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        dialogCancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) {
      setError("Please select a driver.");
      return;
    }

    setIsSaving(true);
    try {
      await vehicleAssignmentService.reassignVehicle(assignment!.id, selectedDriverId);
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to reassign vehicle.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-md w-full p-6 relative z-10 animate-fadeIn space-y-4"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-text-primary">Reassign Vehicle</h3>
            <p className="text-xs text-text-secondary mt-1">
              Select another active commercial driver to take over the vehicle assignment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-medium animate-fadeIn">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-text-secondary">Vehicle Details</label>
            <div className="bg-gray-50 border border-border-app p-3 rounded-m mt-1 text-xs text-text-primary font-medium">
              <div>{assignment.vehicleName}</div>
              <div className="font-mono text-[10px] text-primary mt-0.5">{assignment.registrationNumber}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">New Assigned Driver *</label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="">-- Select New Driver --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id} disabled={d.id === assignment.driverId}>
                  {d.name} {d.id === assignment.driverId ? "(Current)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 text-xs font-semibold border-t border-divider-app pt-4 select-none">
          <button
            type="button"
            ref={dialogCancelBtnRef}
            onClick={onClose}
            disabled={isSaving}
            className="px-4 h-9 border border-border-app rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || selectedDriverId === assignment.driverId}
            className="px-4.5 h-9 bg-primary text-text-on-primary rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
