"use client";

import React, { useMemo } from "react";
import { Award, ShieldAlert, AlertTriangle, ShieldCheck, FileDown, Activity } from "lucide-react";
import { useSafetyScores } from "../../hooks/useSafetyScores";
import { SafetyScoreTable } from "../../components/SafetyScoreTable";
import { SafetyScoreFilters } from "../../components/SafetyScoreFilters";

export function SafetyScoreMonitoring() {
  const {
    records,
    allRecords,
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
    handleSort
  } = useSafetyScores();

  // Compute metrics dynamically from the raw registry
  const metrics = useMemo(() => {
    if (allRecords.length === 0) {
      return { avg: 0, high: 0, medium: 0, low: 0 };
    }
    const total = allRecords.reduce((sum, r) => sum + r.safetyScore, 0);
    const avg = parseFloat((total / allRecords.length).toFixed(1));
    const high = allRecords.filter((r) => r.riskLevel === "High").length;
    const medium = allRecords.filter((r) => r.riskLevel === "Medium").length;
    const low = allRecords.filter((r) => r.riskLevel === "Low").length;
    return { avg, high, medium, low };
  }, [allRecords]);

  const handleExport = () => {
    alert("Simulating export of Safety Performance Report. CSV report sheet is generating...");
  };

  const cardClass = "bg-surface-app border border-border-app rounded-m p-4 shadow-card flex items-center justify-between";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Safety Score Monitoring</h2>
          <p className="text-sm text-text-secondary">
            Monitor driver safety performance and identify high-risk drivers.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex h-9 items-center gap-1.5 px-3.5 border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer select-none font-semibold text-xs animate-fadeIn"
        >
          <FileDown size={14} />
          <span>Export Safety Report</span>
        </button>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Average Safety Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-text-primary">{metrics.avg}</span>
              <span className="text-xs text-text-muted">/100</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-primary-light text-primary border border-primary/10 rounded-circular flex items-center justify-center">
            <Award size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-error uppercase tracking-wider block">High Risk Drivers</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.high}</span>
          </div>
          <div className="h-10 w-10 bg-error-light text-error border border-error/10 rounded-circular flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-warning uppercase tracking-wider block">Medium Risk Drivers</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.medium}</span>
          </div>
          <div className="h-10 w-10 bg-warning-light text-warning border border-warning/10 rounded-circular flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <span className="text-[10px] font-bold text-success uppercase tracking-wider block">Low Risk Drivers</span>
            <span className="text-2xl font-bold text-text-primary mt-1 block">{metrics.low}</span>
          </div>
          <div className="h-10 w-10 bg-success-light/20 text-success border border-success/10 rounded-circular flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
        </div>
      </div>

      {/* Filtering Toolbar */}
      <SafetyScoreFilters
        search={search}
        onSearchChange={setSearch}
        riskLevel={riskFilter}
        onRiskLevelChange={setRiskFilter}
        scoreRange={scoreRangeFilter}
        onScoreRangeChange={setScoreRangeFilter}
      />

      {/* Main Table Content */}
      {error && (
        <div className="p-4 bg-error-light text-error rounded-m text-xs font-semibold border border-error/20">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4 animate-pulse select-none">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      ) : totalItems === 0 ? (
        <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card">
          <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
            <Activity size={24} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">No Safety Scores Found</h3>
          <p className="text-sm text-text-secondary max-w-sm mt-1">
            No driver records match the safety score range or selected risk levels.
          </p>
        </div>
      ) : (
        <div className="bg-surface-app border border-border-app rounded-m shadow-card overflow-hidden">
          <SafetyScoreTable
            records={records}
            totalItems={totalItems}
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
      )}
    </div>
  );
}
