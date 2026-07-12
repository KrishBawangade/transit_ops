"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, FileDown, AlertTriangle, FileText, ClipboardList } from "lucide-react";
import { useDriverComplianceDetails } from "../../hooks/useDriverComplianceDetails";
import { DriverOverviewCard } from "../../components/DriverOverviewCard";
import { LicenseCard } from "../../components/LicenseCard";
import { MedicalCertificateCard } from "../../components/MedicalCertificateCard";
import { ComplianceHistoryTable } from "../../components/ComplianceHistoryTable";
import { ComplianceStatusBadge } from "../../components/ComplianceStatusBadge";

interface DriverComplianceDetailsProps {
  id: string;
}

export function DriverComplianceDetails({ id }: DriverComplianceDetailsProps) {
  const { record, history, isLoading, error } = useDriverComplianceDetails(id);
  const [activeTab, setActiveTab] = useState<"overview" | "license" | "medical" | "history" | "notes">("overview");

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    alert("Simulating PDF generation for Driver Compliance Record. Document download started...");
  };

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-4 w-36 bg-gray-200 rounded"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
          <div className="h-9 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Driver not found error state
  if (error || !record) {
    return (
      <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card max-w-md mx-auto mt-12">
        <div className="h-12 w-12 rounded-circular bg-error-light text-error flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-base font-semibold text-text-primary">Driver Profile Not Found</h3>
        <p className="text-sm text-text-secondary max-w-sm mt-1 mb-6">
          The safety compliance file for driver ID "{id}" could not be located in the local registry database.
        </p>
        <Link
          href="/drivers/compliance"
          className="px-4.5 h-9 bg-primary text-text-on-primary text-xs font-semibold rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-small flex items-center justify-center select-none"
        >
          Return to Driver Compliance
        </Link>
      </div>
    );
  }

  // Normal view state
  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/drivers/compliance"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors select-none"
        >
          <ArrowLeft size={14} />
          <span>Back to Driver Compliance</span>
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                {record.name}
              </h2>
              <ComplianceStatusBadge status={record.status} />
            </div>
            <p className="text-xs text-text-secondary font-mono mt-0.5">
              Employee ID: {record.employeeId}
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={handlePrint}
            className="flex h-9 items-center gap-1.5 px-3 border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer font-semibold text-xs"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex h-9 items-center gap-1.5 px-3 border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small cursor-pointer font-semibold text-xs"
          >
            <FileDown size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs controllers */}
      <div className="flex items-center gap-6 border-b border-divider-app pb-3 mb-6 select-none overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={
            activeTab === "overview"
              ? "text-primary border-b-2 border-primary font-bold text-xs pb-3 -mb-3.5 transition-all cursor-pointer whitespace-nowrap"
              : "text-text-muted hover:text-text-primary text-xs font-semibold pb-3 transition-colors cursor-pointer whitespace-nowrap"
          }
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("license")}
          className={
            activeTab === "license"
              ? "text-primary border-b-2 border-primary font-bold text-xs pb-3 -mb-3.5 transition-all cursor-pointer whitespace-nowrap"
              : "text-text-muted hover:text-text-primary text-xs font-semibold pb-3 transition-colors cursor-pointer whitespace-nowrap"
          }
        >
          License
        </button>
        <button
          onClick={() => setActiveTab("medical")}
          className={
            activeTab === "medical"
              ? "text-primary border-b-2 border-primary font-bold text-xs pb-3 -mb-3.5 transition-all cursor-pointer whitespace-nowrap"
              : "text-text-muted hover:text-text-primary text-xs font-semibold pb-3 transition-colors cursor-pointer whitespace-nowrap"
          }
        >
          Medical Certificate
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={
            activeTab === "history"
              ? "text-primary border-b-2 border-primary font-bold text-xs pb-3 -mb-3.5 transition-all cursor-pointer whitespace-nowrap"
              : "text-text-muted hover:text-text-primary text-xs font-semibold pb-3 transition-colors cursor-pointer whitespace-nowrap"
          }
        >
          Compliance History
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={
            activeTab === "notes"
              ? "text-primary border-b-2 border-primary font-bold text-xs pb-3 -mb-3.5 transition-all cursor-pointer whitespace-nowrap"
              : "text-text-muted hover:text-text-primary text-xs font-semibold pb-3 transition-colors cursor-pointer whitespace-nowrap"
          }
        >
          Notes
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {activeTab === "overview" && <DriverOverviewCard record={record} />}

        {activeTab === "license" && <LicenseCard record={record} />}

        {activeTab === "medical" && <MedicalCertificateCard record={record} />}

        {activeTab === "history" && <ComplianceHistoryTable history={history} />}

        {activeTab === "notes" && (
          record.notes ? (
            <div className="bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4 animate-fadeIn">
              <div className="pb-3 border-b border-divider-app flex items-center gap-2 select-none">
                <FileText size={16} className="text-text-secondary" />
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Auditor Compliance Notes
                </h3>
              </div>
              <div className="text-xs text-text-primary bg-gray-50 p-4 rounded-m border border-border-app whitespace-pre-wrap leading-relaxed font-sans">
                {record.notes}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card select-none">
              <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4 animate-pulse">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-base font-semibold text-text-primary">No Auditor Notes</h3>
              <p className="text-sm text-text-secondary max-w-sm mt-1">
                No compliance auditor notes or warnings have been submitted for this driver profile.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
