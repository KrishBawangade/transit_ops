"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SafetyScoreRecord, RiskLevel } from "../types";
import { safetyScoreService } from "../services/safetyScore.service";

export function useSafetyScores() {
  const [records, setRecords] = useState<SafetyScoreRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [scoreRangeFilter, setScoreRangeFilter] = useState("All");

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
      const data = await safetyScoreService.getSafetyScores();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to load safety score records.");
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
        rec.employeeId.toLowerCase().includes(searchLower);

      // Risk Level
      const matchesRisk = riskFilter === "All" || rec.riskLevel === riskFilter;

      // Score Range
      let matchesRange = true;
      if (scoreRangeFilter !== "All") {
        const score = rec.safetyScore;
        if (scoreRangeFilter === "90-100") {
          matchesRange = score >= 90 && score <= 100;
        } else if (scoreRangeFilter === "75-89") {
          matchesRange = score >= 75 && score <= 89;
        } else if (scoreRangeFilter === "60-74") {
          matchesRange = score >= 60 && score <= 74;
        } else if (scoreRangeFilter === "Below 60") {
          matchesRange = score < 60;
        }
      }

      return matchesSearch && matchesRisk && matchesRange;
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
  }, [records, search, riskFilter, scoreRangeFilter, sortBy, sortOrder]);

  const totalItems = processedRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedRecords.slice(start, start + pageSize);
  }, [processedRecords, page, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, riskFilter, scoreRangeFilter]);

  return {
    records: paginatedRecords,
    allRecords: records, // keep original list to compute dashboard KPIs summaries
    totalItems,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
    search,
    setSearch,
    riskFilter,
    setRiskFilter,
    scoreRangeFilter,
    setScoreRangeFilter,
    sortBy,
    sortOrder,
    handleSort,
    refresh: loadData
  };
}
