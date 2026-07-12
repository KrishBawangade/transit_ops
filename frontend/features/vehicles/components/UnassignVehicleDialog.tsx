"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { VehicleAssignment } from "../types";
import { vehicleAssignmentService } from "../services/vehicleAssignment.service";

interface UnassignVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: VehicleAssignment | null;
  onConfirm: () => void;
}

export function UnassignVehicleDialog({ isOpen, onClose, assignment, onConfirm }: UnassignVehicleDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const dialogCancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
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
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleConfirm = async () => {
    if (!assignment) return;
    setIsSaving(true);
    try {
      await vehicleAssignmentService.unassignVehicle(assignment.id);
      onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to release assignment.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-sm w-full p-6 relative z-10 animate-fadeIn space-y-4">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-1.5 text-error">
            <AlertTriangle size={18} />
            <span>Unassign Driver</span>
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Are you sure you want to release driver <span className="font-semibold text-text-primary">{assignment.driverName}</span> from vehicle <span className="font-semibold text-text-primary">{assignment.vehicleName}</span>?
          </p>
          <p className="text-[11px] text-text-muted mt-2">
            After confirmation, the vehicle assignment status becomes <span className="font-bold text-primary">Available</span>.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-medium animate-fadeIn">
            {error}
          </div>
        )}

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
            onClick={handleConfirm}
            disabled={isSaving}
            className="px-4.5 h-9 bg-error text-text-on-primary rounded-m hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error/20 transition-all shadow-small disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>{isSaving ? "Releasing..." : "Unassign"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
