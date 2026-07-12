import { useState, useMemo, useEffect } from "react";
import { Vehicle, VehicleType, VehicleStatus } from "../types";

export type SortField =
  | "registrationNumber"
  | "name"
  | "type"
  | "capacity"
  | "odometer"
  | "acquisitionCost"
  | "status";

export type SortOrder = "asc" | "desc";

export function useVehicleFilters(vehicles: Vehicle[]) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<VehicleType | "All">("All");
  const [status, setStatus] = useState<VehicleStatus | "All">("All");
  const [sortBy, setSortBy] = useState<SortField>("registrationNumber");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default to 5 items per page

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, type, status]);

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Search filter: Registration Number
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase().trim();
      result = result.filter((v) =>
        v.registrationNumber.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (type !== "All") {
      result = result.filter((v) => v.type === type);
    }

    // Status filter
    if (status !== "All") {
      result = result.filter((v) => v.status === status);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [vehicles, search, type, status, sortBy, sortOrder]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredVehicles.slice(startIndex, startIndex + pageSize);
  }, [filteredVehicles, page, pageSize]);

  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return {
    search,
    setSearch,
    type,
    setType,
    status,
    setStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    pageSize,
    setPageSize,
    filteredVehicles,
    paginatedVehicles,
    totalItems,
    totalPages,
    handleSort,
  };
}
