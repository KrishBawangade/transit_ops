"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useVehicles } from "../../hooks/useVehicles";
import { useVehicleFilters } from "../../hooks/useVehicleFilters";
import { VehicleSearch } from "../../components/VehicleSearch";
import { VehicleFilters } from "../../components/VehicleFilters";
import { VehicleTable } from "../../components/VehicleTable";
import { RetireVehicleDialog } from "../../components/RetireVehicleDialog";
import { DeleteVehicleDialog } from "../../components/DeleteVehicleDialog";
import { Vehicle } from "../../types";

export function VehicleRegistry() {
  const {
    vehicles,
    isLoading,
    error,
    deleteVehicle,
    retireVehicle,
  } = useVehicles();

  const {
    search,
    setSearch,
    type,
    setType,
    status,
    setStatus,
    sortBy,
    sortOrder,
    page,
    setPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedVehicles,
    handleSort,
  } = useVehicleFilters(vehicles);

  // Dialog States
  const [retireTarget, setRetireTarget] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const handleConfirmRetire = async () => {
    if (retireTarget) {
      await retireVehicle(retireTarget.id);
      setRetireTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteVehicle(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Vehicle Registry</h2>
          <p className="text-sm text-text-secondary leading-normal">
            Manage your transit fleet assets, status logs, capacity parameters, and compliance details.
          </p>
        </div>
        <Link
          href="/vehicles/new"
          className="flex h-9 items-center gap-1.5 px-3.5 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small self-start sm:self-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary select-none"
        >
          <Plus size={16} />
          <span>Add Vehicle</span>
        </Link>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small md:items-center md:justify-between">
        <VehicleSearch value={search} onChange={setSearch} />
        <VehicleFilters
          type={type}
          onTypeChange={setType}
          status={status}
          onStatusChange={setStatus}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-error-light text-error rounded-m text-xs font-semibold border border-error/20 animate-fadeIn">
          Error loading registry: {error}
        </div>
      )}

      {/* Main Table Grid */}
      <VehicleTable
        vehicles={paginatedVehicles}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onRetireClick={setRetireTarget}
        onDeleteClick={setDeleteTarget}
      />

      {/* Confirmation Dialogs */}
      <RetireVehicleDialog
        isOpen={!!retireTarget}
        registrationNumber={retireTarget?.registrationNumber || ""}
        onConfirm={handleConfirmRetire}
        onClose={() => setRetireTarget(null)}
      />

      <DeleteVehicleDialog
        isOpen={!!deleteTarget}
        registrationNumber={deleteTarget?.registrationNumber || ""}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
