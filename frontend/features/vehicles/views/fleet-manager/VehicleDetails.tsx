"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Edit, Calendar, DollarSign, Activity, FileText, AlertTriangle, ShieldAlert, CheckCircle2, Truck, Upload, Download, Trash2, Eye, FileUp, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Vehicle, VehicleDocument, VehicleAssignment } from "../../types";
import { vehicleService } from "../../services/vehicle.service";
import { vehicleAssignmentService } from "../../services/vehicleAssignment.service";
import { VehicleStatusBadge } from "../../components/VehicleStatusBadge";

interface VehicleDetailsProps {
  id: string;
}

type TabType = "overview" | "documents" | "notes";

export function VehicleDetails({ id }: VehicleDetailsProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Document states
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(false);

  // Assignment states
  const [assignment, setAssignment] = useState<VehicleAssignment | null>(null);

  useEffect(() => {
    async function loadAssignment() {
      try {
        const asgs = await vehicleAssignmentService.getAssignments();
        const active = asgs.find((a) => a.vehicleId === id && a.status === "Assigned");
        setAssignment(active || null);
      } catch (err) {
        console.error("Failed to load assignment info", err);
      }
    }
    loadAssignment();
  }, [id, vehicle]);
  
  // Document modal states
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VehicleDocument | null>(null);
  const [docName, setDocName] = useState("Registration Certificate (RC)");
  const [docNumber, setDocNumber] = useState("");
  const [docIssueDate, setDocIssueDate] = useState("");
  const [docExpiryDate, setDocExpiryDate] = useState("");
  const [docFileName, setDocFileName] = useState("");
  const [docFormError, setDocFormError] = useState("");
  const [isSavingDoc, setIsSavingDoc] = useState(false);

  // Document deletion state
  const [docToDelete, setDocToDelete] = useState<VehicleDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogCancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function loadVehicle() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await vehicleService.getVehicleById(id);
        if (!data) {
          setError("Vehicle not found");
        } else {
          setVehicle(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load vehicle details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadVehicle();
  }, [id]);

  const loadDocs = async () => {
    setIsDocsLoading(true);
    try {
      const data = await vehicleService.getVehicleDocuments(id);
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    if (vehicle) {
      loadDocs();
    }
  }, [id, vehicle]);

  // Escape key handler for dialogs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDocModalOpen(false);
        setDocToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus cancel buttons
  useEffect(() => {
    if (isDocModalOpen || docToDelete) {
      setTimeout(() => {
        dialogCancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isDocModalOpen, docToDelete]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getDocStatusInfo = (expiryDate: string) => {
    if (!expiryDate) return { label: "N/A", color: "bg-gray-100 text-text-secondary border-gray-200" };
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const date = new Date(expiryDate);
    date.setHours(0, 0, 0, 0);
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return { label: "Expired", color: "bg-error-light text-error border-error/20" };
    }
    if (days <= 30) {
      return { label: "Expiring Soon", color: "bg-warning-light text-warning border-warning/20" };
    }
    return { label: "Valid", color: "bg-success-light text-success border-success/20" };
  };

  // Actions
  const handleOpenDocModal = (doc?: VehicleDocument) => {
    setDocFormError("");
    if (doc) {
      setEditingDoc(doc);
      setDocName(doc.name);
      setDocNumber(doc.documentNumber);
      setDocIssueDate(doc.issueDate);
      setDocExpiryDate(doc.expiryDate);
      setDocFileName(doc.fileName || "");
    } else {
      setEditingDoc(null);
      setDocName("Registration Certificate (RC)");
      setDocNumber("");
      setDocIssueDate("");
      setDocExpiryDate("");
      setDocFileName("");
    }
    setIsDocModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFileName(file.name);
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocFormError("");

    if (!docNumber.trim()) {
      setDocFormError("Document Number is required.");
      return;
    }
    if (!docIssueDate) {
      setDocFormError("Issue Date is required.");
      return;
    }
    if (!docExpiryDate) {
      setDocFormError("Expiry Date is required.");
      return;
    }
    if (new Date(docExpiryDate) < new Date(docIssueDate)) {
      setDocFormError("Expiry Date cannot be before Issue Date.");
      return;
    }

    setIsSavingDoc(true);
    try {
      await vehicleService.addOrUpdateDocument(id, {
        id: editingDoc?.id,
        name: docName,
        documentNumber: docNumber,
        issueDate: docIssueDate,
        expiryDate: docExpiryDate,
        fileName: docFileName || undefined
      });
      await loadDocs();
      setIsDocModalOpen(false);
    } catch (err: any) {
      setDocFormError(err.message || "An error occurred while saving the document.");
    } finally {
      setIsSavingDoc(false);
    }
  };

  const handleRemoveDoc = async () => {
    if (docToDelete) {
      try {
        await vehicleService.removeDocument(id, docToDelete.id);
        await loadDocs();
        setDocToDelete(null);
      } catch (err) {
        console.error("Failed to remove document", err);
      }
    }
  };

  const handleViewDoc = (doc: VehicleDocument) => {
    alert(`Viewing document: ${doc.fileName || "No file uploaded"}`);
  };

  const handleDownloadDoc = (doc: VehicleDocument) => {
    alert(`Downloading document: ${doc.fileName || "No file uploaded"}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-200 rounded-m"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex border-b border-border-app gap-4">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-m"></div>
          <div className="h-64 bg-gray-200 rounded-m"></div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card space-y-4 animate-fadeIn">
        <div className="h-12 w-12 rounded-circular bg-error-light text-error flex items-center justify-center mb-4">
          <Truck size={24} />
        </div>
        <h3 className="text-base font-semibold text-text-primary">Vehicle not found</h3>
        <p className="text-sm text-text-secondary max-w-sm mt-1">
          The requested vehicle parameters could not be found or do not exist in the database.
        </p>
        <button
          onClick={() => router.push("/vehicles")}
          className="flex h-9 items-center gap-1.5 px-3.5 border border-border-app rounded-m bg-surface-app text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-all cursor-pointer shadow-small"
        >
          <ArrowLeft size={16} />
          <span>Return to Vehicle Registry</span>
        </button>
      </div>
    );
  }

  const cardClass = "bg-surface-app border border-border-app rounded-m p-6 shadow-card space-y-4 hover:border-primary/20 transition-all duration-200";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/vehicles")}
            aria-label="Back to Vehicle Registry"
            className="flex h-9 w-9 items-center justify-center border border-border-app rounded-m bg-surface-app text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-small"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                {vehicle.name || `${vehicle.manufacturer} ${vehicle.model}`}
              </h2>
              <VehicleStatusBadge status={vehicle.status} />
            </div>
            <p className="text-sm font-mono font-semibold text-primary mt-0.5 leading-normal">
              {vehicle.registrationNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto select-none">
          {activeTab === "documents" && (
            <button
              onClick={() => handleOpenDocModal()}
              className="flex h-9 items-center gap-1.5 px-3.5 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-small cursor-pointer"
            >
              <Upload size={14} />
              <span>Add Document</span>
            </button>
          )}
          <Link
            href={`/vehicles/${vehicle.id}/edit`}
            className="flex h-9 items-center gap-1.5 px-3.5 rounded-m bg-secondary text-text-on-primary text-xs font-semibold hover:bg-secondary/95 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-small cursor-pointer"
          >
            <Edit size={14} />
            <span>Edit Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border-app gap-2 text-xs font-semibold select-none">
        {(["overview", "documents", "notes"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 transition-all capitalize cursor-pointer -mb-px focus:outline-none focus:ring-2 focus:ring-primary/10 rounded-t-s
              ${
                activeTab === tab
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === "overview" && (
          <>
            {/* Card 1: Basic Information */}
            <div className={cardClass}>
              <div className="pb-2 border-b border-border-app flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Basic Information
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-normal">
                <div>
                  <dt className="text-text-secondary font-medium">Registration Number</dt>
                  <dd className="text-text-primary font-bold font-mono mt-0.5">
                    {vehicle.registrationNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Vehicle Name</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.name || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Manufacturer</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.manufacturer || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Model</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.model || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Vehicle Type</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">{vehicle.type}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Capacity</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.capacity || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Fuel Type</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {vehicle.fuelType || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Current Status</dt>
                  <dd className="text-text-primary mt-0.5">
                    <VehicleStatusBadge status={vehicle.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Assigned Driver</dt>
                  <dd className="text-text-primary font-semibold mt-0.5">
                    {assignment ? (
                      <Link
                        href="/vehicles/assignments"
                        className="text-primary hover:underline font-bold"
                      >
                        {assignment.driverName}
                      </Link>
                    ) : (
                      <span className="text-text-muted">Unassigned</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Card 2: Purchase Information */}
            <div className={cardClass}>
              <div className="pb-2 border-b border-border-app flex items-center gap-2">
                <DollarSign size={16} className="text-success" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Purchase Information
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-normal">
                <div>
                  <dt className="text-text-secondary font-medium">Purchase Date</dt>
                  <dd className="text-text-primary font-semibold mt-0.5 font-mono">
                    {vehicle.purchaseDate || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Acquisition Cost</dt>
                  <dd className="text-text-primary font-bold font-mono mt-0.5 text-success">
                    {vehicle.acquisitionCost ? formatCurrency(vehicle.acquisitionCost) : "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary font-medium">Current Odometer</dt>
                  <dd className="text-text-primary font-bold font-mono mt-0.5">
                    {vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : "0 km"}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}

        {activeTab === "documents" && (
          <div className="md:col-span-2 space-y-6 animate-fadeIn">
            {isDocsLoading ? (
              <div className="space-y-4">
                <div className="h-28 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-28 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ) : documents.length === 0 ? (
              <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card space-y-4">
                <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-base font-semibold text-text-primary">No Documents Available</h3>
                <p className="text-sm text-text-secondary max-w-sm mt-1">
                  There are no documents uploaded for this vehicle record. Add a Registration, Insurance, or Fitness Certificate.
                </p>
                <button
                  onClick={() => handleOpenDocModal()}
                  className="flex h-9 items-center gap-1.5 px-3.5 bg-primary text-text-on-primary text-xs font-semibold rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-small cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Upload Document</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => {
                  const status = getDocStatusInfo(doc.expiryDate);
                  return (
                    <div key={doc.id} className="bg-surface-app border border-border-app p-5 rounded-m shadow-card flex flex-col justify-between space-y-4 hover:border-primary/25 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">{doc.name}</h4>
                            <p className="text-[11px] text-text-secondary font-mono">No: {doc.documentNumber}</p>
                          </div>
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-circular border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <dl className="grid grid-cols-2 gap-2 text-[10px] leading-normal border-t border-divider-app pt-2.5">
                          <div>
                            <span className="text-text-secondary">Issue Date</span>
                            <div className="text-text-primary font-semibold font-mono mt-0.5">{doc.issueDate}</div>
                          </div>
                          <div>
                            <span className="text-text-secondary">Expiry Date</span>
                            <div className="text-text-primary font-bold font-mono mt-0.5">{doc.expiryDate}</div>
                          </div>
                        </dl>

                        {doc.fileName && (
                          <div className="flex items-center gap-1.5 bg-gray-50 border border-border-app px-2.5 py-1.5 rounded text-[10px] text-text-primary mt-1 animate-fadeIn font-medium">
                            <FileText size={12} className="text-text-secondary shrink-0" />
                            <span className="truncate">{doc.fileName}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions footer */}
                      <div className="flex items-center justify-end gap-2 text-xs font-bold border-t border-divider-app pt-2.5 select-none">
                        <button
                          onClick={() => handleViewDoc(doc)}
                          className="flex items-center gap-1 px-2 py-1 text-primary hover:bg-primary-light/30 rounded transition-all cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleOpenDocModal(doc)}
                          className="flex items-center gap-1 px-2 py-1 text-secondary hover:bg-secondary/10 rounded transition-all cursor-pointer"
                        >
                          <FileUp size={12} />
                          <span>Replace</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDoc(doc)}
                          className="flex items-center gap-1 px-2 py-1 text-text-secondary hover:bg-gray-100 rounded transition-all cursor-pointer"
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => setDocToDelete(doc)}
                          className="flex items-center gap-1 px-2 py-1 text-error hover:bg-error-light/35 rounded transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="md:col-span-2">
            {!vehicle.notes || vehicle.notes.trim() === "" ? (
              <div className="border border-dashed border-divider-app rounded-m p-12 bg-surface-app flex flex-col items-center justify-center text-center shadow-card">
                <div className="h-12 w-12 rounded-circular bg-primary-light text-primary flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-base font-semibold text-text-primary">No Notes Filed</h3>
                <p className="text-sm text-text-secondary max-w-sm mt-1">
                  No additional comments or logs have been recorded for this vehicle.
                </p>
              </div>
            ) : (
              <div className={cardClass}>
                <div className="pb-2 border-b border-border-app flex items-center gap-2">
                  <FileText size={16} className="text-text-secondary" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Notes & Logs
                  </h3>
                </div>
                <div className="text-xs text-text-primary bg-gray-50 p-3 rounded-m border border-border-app min-h-[100px] whitespace-pre-wrap font-sans leading-relaxed">
                  {vehicle.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Modal Dialog: Add / Replace Document */}
      {isDocModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setIsDocModalOpen(false)} />
          <form
            onSubmit={handleSaveDoc}
            className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-md w-full p-6 relative z-10 animate-fadeIn space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-text-primary">
                {editingDoc ? `Replace ${editingDoc.name}` : "Upload Document"}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Configure document meta-details and upload certificate files (.pdf, .png, .jpg).
              </p>
            </div>

            {docFormError && (
              <div className="p-3 bg-error-light/20 border border-error/20 rounded-m text-xs text-error font-medium animate-fadeIn">
                {docFormError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Document Type</label>
                <select
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  disabled={!!editingDoc}
                  className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                >
                  <option value="Registration Certificate (RC)">Registration Certificate (RC)</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Fitness Certificate">Fitness Certificate</option>
                  <option value="Pollution Certificate (PUC)">Pollution Certificate (PUC)</option>
                  <option value="Permit">Permit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Document Number *</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  required
                  placeholder="e.g. RC-998822"
                  className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Issue Date *</label>
                  <input
                    type="date"
                    value={docIssueDate}
                    onChange={(e) => setDocIssueDate(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Expiry Date *</label>
                  <input
                    type="date"
                    value={docExpiryDate}
                    onChange={(e) => setDocExpiryDate(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-m border border-border-app text-xs text-text-primary bg-gray-50 focus:bg-surface-app focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Document File (.pdf, .jpg, .png)</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf, .png, .jpg, .jpeg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-9 items-center gap-1.5 px-3 border border-border-app rounded-m text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-all cursor-pointer shadow-small bg-surface-app"
                  >
                    <Upload size={14} />
                    <span>Choose File</span>
                  </button>
                  <input
                    type="text"
                    value={docFileName}
                    readOnly
                    placeholder="No file chosen"
                    className="flex-1 h-9 px-3 rounded-m border border-border-app text-xs text-text-muted bg-gray-100 focus:outline-none truncate cursor-default"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 text-xs font-semibold border-t border-divider-app pt-4">
              <button
                type="button"
                ref={dialogCancelBtnRef}
                onClick={() => setIsDocModalOpen(false)}
                disabled={isSavingDoc}
                className="px-4 h-9 border border-border-app rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingDoc}
                className="px-4.5 h-9 bg-primary text-text-on-primary rounded-m hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-small disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} />
                <span>{isSavingDoc ? "Uploading..." : (editingDoc ? "Replace Document" : "Upload")}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal Dialog: Delete Confirmation */}
      {docToDelete && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setDocToDelete(null)} />
          <div className="bg-surface-app border border-border-app rounded-m shadow-dialog max-w-sm w-full p-6 relative z-10 animate-fadeIn space-y-4">
            <div>
              <h3 className="text-base font-bold text-text-primary flex items-center gap-1.5 text-error">
                <ShieldAlert size={18} />
                <span>Delete Document</span>
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Are you sure you want to permanently delete the document{" "}
                <span className="font-semibold text-text-primary">{docToDelete.name}</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 text-xs font-semibold border-t border-divider-app pt-4">
              <button
                ref={dialogCancelBtnRef}
                onClick={() => setDocToDelete(null)}
                className="px-4 h-9 border border-border-app rounded-m text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveDoc}
                className="px-4.5 h-9 bg-error text-text-on-primary rounded-m hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error/20 transition-all shadow-small flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
