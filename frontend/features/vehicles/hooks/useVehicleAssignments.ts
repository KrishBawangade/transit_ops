"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { VehicleAssignment, Vehicle } from "../types";
import { vehicleAssignmentService } from "../services/vehicleAssignment.service";
import { vehicleService } from "../services/vehicle.service";

export function useVehicleAssignments() {
  const [assignments, setAssignments] = useState<VehicleAssignment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState("All");
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState("All");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allAssignments, allVehicles] = await Promise.all([
        vehicleAssignmentService.getAssignments(),
        vehicleService.getVehicles()
      ]);
      setAssignments(allAssignments);
      setVehicles(allVehicles);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicle assignments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create lookup map for vehicle statuses
  const vehiclesMap = useMemo(() => {
    const map: Record<string, Vehicle> = {};
    vehicles.forEach((v) => {
      map[v.id] = v;
    });
    return map;
  }, [vehicles]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      // 1. Search filter
      const searchLower = search.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        a.vehicleName.toLowerCase().includes(searchLower) ||
        a.registrationNumber.toLowerCase().includes(searchLower) ||
        a.driverName.toLowerCase().includes(searchLower) ||
        a.driverId.toLowerCase().includes(searchLower);

      // 2. Assignment Status filter
      const matchesAsgStatus =
        assignmentStatusFilter === "All" || a.status === assignmentStatusFilter;

      // 3. Vehicle Status filter
      const v = vehiclesMap[a.vehicleId];
      const matchesVehStatus =
        vehicleStatusFilter === "All" || (v && v.status === vehicleStatusFilter);

      return matchesSearch && matchesAsgStatus && matchesVehStatus;
    });
  }, [assignments, search, assignmentStatusFilter, vehicleStatusFilter, vehiclesMap]);

  return {
    assignments: filteredAssignments,
    allAssignments: assignments,
    allVehicles: vehicles,
    isLoading,
    error,
    search,
    setSearch,
    assignmentStatusFilter,
    setAssignmentStatusFilter,
    vehicleStatusFilter,
    setVehicleStatusFilter,
    refresh: loadData
  };
}
