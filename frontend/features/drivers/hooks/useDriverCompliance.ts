"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DriverCompliance } from "../types";
import { driverComplianceService } from "../services/driverCompliance.service";

export function useDriverCompliance() {
  const [records, setRecords] = useState<DriverCompliance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [licenseTypeFilter, setLicenseTypeFilter] = useState("All");

  // Sorting
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // Show 5 per page

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await driverComplianceService.getComplianceRecords();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to load driver compliance records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSort = useCallback((field: string) => {
    setSortBy((prevSortBy) => {
      if (prevSortBy === field) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        return prevSortBy;
      } else {
        setSortOrder("asc");
        return field;
      }
    });
  }, []);

  // Filtered & Sorted Records
  const processedRecords = useMemo(() => {
    // 1. Filter
    let filtered = records.filter((rec) => {
      const searchLower = search.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        rec.name.toLowerCase().includes(searchLower) ||
        rec.employeeId.toLowerCase().includes(searchLower) ||
        rec.licenseNumber.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "All" || rec.status === statusFilter;
      const matchesType = licenseTypeFilter === "All" || rec.licenseType === licenseTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // 2. Sort
    filtered.sort((a, b) => {
      let valA = (a as any)[sortBy] || "";
      let valB = (b as any)[sortBy] || "";

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });

    return filtered;
  }, [records, search, statusFilter, licenseTypeFilter, sortBy, sortOrder]);

  // Paginated records
  const totalItems = processedRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedRecords.slice(start, start + pageSize);
  }, [processedRecords, page, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, licenseTypeFilter]);

  return {
    records: paginatedRecords,
    totalItems,
    totalPages,
    page,
    setPage,
    pageSize,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    licenseTypeFilter,
    setLicenseTypeFilter,
    sortBy,
    sortOrder,
    handleSort,
    refresh: loadData
  };
}
