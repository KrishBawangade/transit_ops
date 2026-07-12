"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { LicenseMonitoringRecord } from "../types";
import { licenseMonitoringService } from "../services/licenseMonitoring.service";

export function useLicenseMonitoring() {
  const [records, setRecords] = useState<LicenseMonitoringRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [licenseStatusFilter, setLicenseStatusFilter] = useState("All");
  const [medicalStatusFilter, setMedicalStatusFilter] = useState("All");

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
      const data = await licenseMonitoringService.getLicenseMonitoringRecords();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to load license monitoring records.");
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

  // Filtered & Sorted records
  const processedRecords = useMemo(() => {
    let filtered = records.filter((rec) => {
      // Search
      const searchLower = search.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        rec.name.toLowerCase().includes(searchLower) ||
        rec.employeeId.toLowerCase().includes(searchLower) ||
        rec.licenseNumber.toLowerCase().includes(searchLower);

      // License status filter
      const matchesLicense = licenseStatusFilter === "All" || rec.licenseStatus === licenseStatusFilter;

      // Medical status filter
      const matchesMedical = medicalStatusFilter === "All" || rec.medicalStatus === medicalStatusFilter;

      return matchesSearch && matchesLicense && matchesMedical;
    });

    // Sort
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
  }, [records, search, licenseStatusFilter, medicalStatusFilter, sortBy, sortOrder]);

  const totalItems = processedRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedRecords.slice(start, start + pageSize);
  }, [processedRecords, page, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, licenseStatusFilter, medicalStatusFilter]);

  return {
    records: paginatedRecords,
    allRecords: records, // keep original list to compute dashboard KPIs and alerts banners
    totalItems,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
    search,
    setSearch,
    licenseStatusFilter,
    setLicenseStatusFilter,
    medicalStatusFilter,
    setMedicalStatusFilter,
    sortBy,
    sortOrder,
    handleSort,
    refresh: loadData
  };
}
