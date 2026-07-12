"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, AlertCircle, FileText, X, Check } from "lucide-react";
import { useVehicleAssignments } from "../../hooks/useVehicleAssignments";
import { VehicleAssignmentTable } from "../../components/VehicleAssignmentTable";
import { AssignVehicleDialog } from "../../components/AssignVehicleDialog";
import { ReassignVehicleDialog } from "../../components/ReassignVehicleDialog";
import { UnassignVehicleDialog } from "../../components/UnassignVehicleDialog";
import { VehicleAssignment } from "../../types";

export function VehicleAssignments() {
  const {
    assignments,
    isLoading,
    error,
    search,
    setSearch,
    assignmentStatusFilter,
    setAssignmentStatusFilter,
    vehicleStatusFilter,
    setVehicleStatusFilter,
    refresh
  } = useVehicleAssignments();

  // Modals state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [reassignTarget, setReassignTarget] = useState<VehicleAssignment | null>(null);
  const [unassignTarget, setUnassignTarget] = useState<VehicleAssignment | null>(null);
  const [viewTarget, setViewTarget] = useState<VehicleAssignment | null>(null);

  const inputClass = "h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 focus:bg-surface-app text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small";
  const selectClass = "h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Vehicle Assignments</h2>
          <p className="text-sm text-text-secondary">Assign and manage vehicles for drivers.</p>
        </div>
        <button
          onClick={() => setIsAssignOpen(true)}
          className="flex h-9 items-center gap-1.5 px-3.5 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-small self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Assign Vehicle</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-light text-error rounded-m text-xs font-semibold border border-error/20">
          Error: {error}
        </div>
      )}

      {/* Filter panel */}
      <div className="flex flex-col md:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small select-none">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search by vehicle name, registration, driver name, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${inputClass}`}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Assignment:</span>
            <select
              value={assignmentStatusFilter}
              onChange={(e) => setAssignmentStatusFilter(e.target.value)}
              className={selectClass}
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Available">Available</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Vehicle Status:</span>
            <select
              value={vehicleStatusFilter}
              onChange={(e) => setVehicleStatusFilter(e.target.value)}
              className={selectClass}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse select-none">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card">
          <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">No Assignments Found</h3>
          <p className="text-sm text-text-secondary max-w-sm mt-1">
            No active vehicle assignments match your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden">
          <VehicleAssignmentTable
            assignments={assignments}
            onView={setViewTarget}
            onReassign={setReassignTarget}
            onUnassign={setUnassignTarget}
          />
        </div>
      )}

      {/* 1. Modal: Assign Vehicle */}
      <AssignVehicleDialog
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onSave={refresh}
      />

      {/* 2. Modal: Reassign Vehicle */}
      <ReassignVehicleDialog
        isOpen={!!reassignTarget}
        onClose={() => setReassignTarget(null)}
        assignment={reassignTarget}
        onSave={refresh}
      />

      {/* 3. Modal: Unassign Vehicle */}
      <UnassignVehicleDialog
        isOpen={!!unassignTarget}
        onClose={() => setUnassignTarget(null)}
        assignment={unassignTarget}
        onConfirm={refresh}
      />

      {/* 4. Modal Dialog: View Details */}
      {viewTarget && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setViewTarget(null)} />
          <div className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-md w-full p-6 relative z-10 animate-fadeIn space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-text-primary">Assignment Log Details</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Active parameters and Remarks for this driver assignment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="text-text-muted hover:text-text-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-xs leading-normal border-t border-divider-app pt-4">
              <div>
                <dt className="text-text-secondary">Vehicle Name</dt>
                <dd className="text-text-primary font-semibold mt-0.5">{viewTarget.vehicleName}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Registration Number</dt>
                <dd className="text-text-primary font-bold font-mono mt-0.5">{viewTarget.registrationNumber}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Assigned Driver</dt>
                <dd className="text-text-primary font-semibold mt-0.5">{viewTarget.driverName}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Driver ID</dt>
                <dd className="text-text-primary font-mono mt-0.5">{viewTarget.driverId}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Assignment Date</dt>
                <dd className="text-text-primary font-mono mt-0.5">{viewTarget.assignmentDate}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Assignment Status</dt>
                <dd className="text-text-primary mt-0.5">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border uppercase tracking-wider select-none ${
                    viewTarget.status === "Assigned"
                      ? "bg-success-light text-success border-success/20"
                      : viewTarget.status === "Available"
                      ? "bg-primary-light text-primary border-primary/20"
                      : "bg-gray-100 text-text-secondary border-gray-200"
                  }`}>
                    {viewTarget.status}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="border-t border-divider-app pt-4 space-y-1.5">
              <span className="block text-xs font-semibold text-text-secondary">Remarks / Instructions</span>
              <div className="text-xs text-text-primary bg-gray-50 p-3 rounded-m border border-border-app min-h-[70px] whitespace-pre-wrap font-sans leading-relaxed">
                {viewTarget.remarks || "No remarks logged."}
              </div>
            </div>

            <div className="flex justify-end border-t border-divider-app pt-4 select-none">
              <button
                onClick={() => setViewTarget(null)}
                className="px-4 h-9 bg-primary text-text-on-primary text-xs font-semibold rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-small cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
