"use client";

import React, { useEffect, useRef } from "react";

interface DeleteVehicleDialogProps {
  isOpen: boolean;
  registrationNumber: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteVehicleDialog({
  isOpen,
  registrationNumber,
  onConfirm,
  onClose,
}: DeleteVehicleDialogProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when the dialog opens for keyboard safety
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-md w-full p-6 relative z-10 animate-fadeIn space-y-4">
        <div>
          <h3 id="delete-dialog-title" className="text-base font-bold text-text-primary">
            Delete Vehicle
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Are you sure you want to delete the vehicle with registration number{" "}
            <span className="font-semibold text-text-primary">{registrationNumber}</span>?
          </p>
        </div>

        <div className="p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-medium">
          Warning: This action is permanent and cannot be undone.
        </div>

        <div className="flex justify-end gap-3 text-xs font-semibold">
          <button
            ref={cancelBtnRef}
            onClick={onClose}
            className="px-3 h-9 border border-border-app rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 h-9 bg-error text-text-on-primary rounded-m hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error/20 transition-all shadow-small cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
