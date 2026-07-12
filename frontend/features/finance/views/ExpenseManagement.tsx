"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  User, 
  Truck, 
  AlertTriangle, 
  Check, 
  Trash2, 
  X,
  FileText,
  CreditCard,
  RefreshCw,
  Eye
} from "lucide-react";
import { loadFinanceData, saveFinanceData, addExpense, ExpenseRecord, BudgetRecord, MonthlyTrend, syncFinanceDataWithBackend } from "../mockData";

export default function ExpenseManagement() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  
  // Filtering & searching states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modal form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptUrl, setActiveReceiptUrl] = useState<string | null>(null);

  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState<ExpenseRecord["category"]>("Fuel");
  const [formDesc, setFormDesc] = useState("");
  const [formVehicle, setFormVehicle] = useState("");
  const [formTrip, setFormTrip] = useState("");
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Loading indicator for fake processing
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFinanceData(loadFinanceData());
    syncFinanceDataWithBackend();
    const handleUpdate = () => {
      setFinanceData(loadFinanceData());
    };
    window.addEventListener("finance_data_update", handleUpdate);
    return () => window.removeEventListener("finance_data_update", handleUpdate);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. Dynamic Filtering
  const filteredExpenses = useMemo(() => {
    if (!financeData) return [];

    return financeData.expenses.filter((e: ExpenseRecord) => {
      const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (e.vehicleNumber && e.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === "All" || e.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [financeData, searchTerm, categoryFilter, statusFilter]);

  // Total amount filtered
  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum: number, e: ExpenseRecord) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // 2. Actions (Approve, Delete, Create)
  const handleApproveExpense = (id: string) => {
    if (!financeData) return;

    const targetExpense = financeData.expenses.find((e: ExpenseRecord) => e.id === id);
    if (!targetExpense || targetExpense.status === "Approved") return;

    // Update status
    const updatedExpenses = financeData.expenses.map((e: ExpenseRecord) => {
      if (e.id === id) {
        return { ...e, status: "Approved" as const };
      }
      return e;
    });

    // Save and notify
    saveFinanceData({ expenses: updatedExpenses });
    
    // Trigger custom event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("finance_data_update"));
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (!financeData) return;
    if (!confirm("Are you sure you want to delete this expense record? This will adjust financial actual totals.")) return;

    const targetExpense = financeData.expenses.find((e: ExpenseRecord) => e.id === id);
    if (!targetExpense) return;

    const amountDiff = targetExpense.amount;

    // Filter out expense
    const updatedExpenses = financeData.expenses.filter((e: ExpenseRecord) => e.id !== id);

    // Update budgets actuals
    const updatedBudgets = financeData.budgets.map((b: BudgetRecord) => {
      if (b.category.toLowerCase() === targetExpense.category.toLowerCase()) {
        return { ...b, actual: Math.max(0, b.actual - amountDiff) };
      }
      return b;
    });

    // Update KPIs
    const updatedKpis = {
      ...financeData.kpis,
      expenses: Math.max(0, financeData.kpis.expenses - amountDiff),
      netProfit: financeData.kpis.revenue - Math.max(0, financeData.kpis.expenses - amountDiff),
    };
    updatedKpis.profitMargin = parseFloat(((updatedKpis.netProfit / updatedKpis.revenue) * 100).toFixed(1));

    // Update trends
    const updatedTrends = financeData.monthlyTrends.map((t: MonthlyTrend) => {
      if (t.month === "Jun") {
        return {
          ...t,
          expenses: Math.max(0, t.expenses - amountDiff),
          netProfit: t.netProfit + amountDiff,
        };
      }
      return t;
    });

    // Save
    saveFinanceData({
      kpis: updatedKpis,
      expenses: updatedExpenses,
      budgets: updatedBudgets,
      monthlyTrends: updatedTrends
    });

    // Dispatch
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("finance_data_update"));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || isNaN(Number(formAmount)) || Number(formAmount) <= 0) {
      alert("Please enter a valid expense amount.");
      return;
    }
    if (!formDesc.trim()) {
      alert("Please enter a valid description.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Add expense in storage
      addExpense({
        amount: Number(formAmount),
        category: formCategory,
        description: formDesc.trim(),
        vehicleNumber: formVehicle.trim() || undefined,
        tripNumber: formTrip.trim() || undefined,
        expenseDate: formDate,
      });

      // Clear form
      setFormAmount("");
      setFormCategory("Fuel");
      setFormDesc("");
      setFormVehicle("");
      setFormTrip("");
      setFormDate(new Date().toISOString().split("T")[0]);

      setIsSubmitting(false);
      setIsAddModalOpen(false);
    }, 500);
  };

  if (!financeData) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="expense-management-title">Expense Management Ledger</h1>
          <p className="text-sm text-text-secondary">Monitor, categorize, and approve all operational expenses from fuel costs to driver shift payouts.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex h-9 items-center justify-center gap-1.5 px-3 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small self-start md:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Expense Stats summary widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-surface-app border border-border-app p-4 rounded-m shadow-small">
        <div className="p-3 border-r border-border-app last:border-0">
          <span className="text-[10px] font-semibold text-text-secondary uppercase">Ledger Spend Total</span>
          <div className="text-xl font-bold text-text-primary mt-1">
            {formatCurrency(financeData.expenses.reduce((sum: number, e: ExpenseRecord) => sum + e.amount, 0))}
          </div>
          <span className="text-[10px] text-text-muted">LTD operating expenses</span>
        </div>
        <div className="p-3 border-r border-border-app last:border-0">
          <span className="text-[10px] font-semibold text-text-secondary uppercase">Active Filter Sum</span>
          <div className="text-xl font-bold text-primary mt-1">{formatCurrency(totalFilteredAmount)}</div>
          <span className="text-[10px] text-text-muted">{filteredExpenses.length} transaction entries</span>
        </div>
        <div className="p-3 border-r border-border-app last:border-0">
          <span className="text-[10px] font-semibold text-text-secondary uppercase">Pending Approvals</span>
          <div className="text-xl font-bold text-warning mt-1">
            {financeData.expenses.filter((e: ExpenseRecord) => e.status === "Pending").length} Items
          </div>
          <span className="text-[10px] text-text-muted">Awaiting manager validation</span>
        </div>
        <div className="p-3 border-r border-border-app last:border-0 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-text-secondary uppercase">Compliance Status</span>
            <div className="text-sm font-bold text-success mt-1 flex items-center gap-1">
              <span>98.6% Audited</span>
            </div>
          </div>
          <span className="h-6 px-1.5 bg-success-light text-success font-semibold text-[10px] rounded flex items-center">HEALTHY</span>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-surface-app border border-border-app p-4 rounded-m shadow-small">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search by Expense ID, description, vehicle plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-m border border-border-app bg-gray-50 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Categories select */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-text-secondary" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 border border-border-app rounded-m text-xs px-2 bg-gray-50 text-text-primary focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Driver Salary">Driver Salary</option>
              <option value="Toll">Tolls</option>
              <option value="Insurance">Insurance</option>
              <option value="Repairs">Repairs</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          {/* Status select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 border border-border-app rounded-m text-xs px-2 bg-gray-50 text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Main Expenses Table */}
      <div className="bg-surface-app border border-border-app rounded-m shadow-card flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary">
                <th className="p-4">ID</th>
                <th className="p-4">Expense Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Asset/Trip Mapping</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredExpenses.map((exp: ExpenseRecord) => (
                <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-text-primary">{exp.id}</td>
                  <td className="p-4 text-text-secondary whitespace-nowrap">{exp.expenseDate}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 font-semibold text-[10px] rounded-circular border 
                      ${exp.category === "Fuel" ? "bg-primary-light text-primary border-primary/10" : 
                        exp.category === "Maintenance" || exp.category === "Repairs" ? "bg-teal-50 text-teal-700 border-teal-700/10" : 
                        exp.category === "Driver Salary" ? "bg-amber-50 text-amber-600 border-amber-500/10" : 
                        exp.category === "Toll" ? "bg-success-light text-success border-success/10" : 
                        "bg-gray-100 text-text-secondary border-gray-200"
                      }
                    `}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-text-primary max-w-xs truncate">{exp.description}</td>
                  <td className="p-4 space-y-1">
                    {exp.vehicleNumber && (
                      <div className="flex items-center gap-1 font-mono text-[10px] text-text-secondary">
                        <Truck size={12} className="text-text-muted" />
                        <span>{exp.vehicleNumber}</span>
                      </div>
                    )}
                    {exp.tripNumber && (
                      <div className="flex items-center gap-1 font-mono text-[10px] text-primary">
                        <FileText size={12} className="text-primary/50" />
                        <span>{exp.tripNumber}</span>
                      </div>
                    )}
                    {!exp.vehicleNumber && !exp.tripNumber && (
                      <span className="text-text-muted italic text-[10px]">None mapped</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-bold text-text-primary text-sm">{formatCurrency(exp.amount)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-circular border
                      ${exp.status === "Approved" ? "bg-success-light text-success border-success/20" : "bg-warning-light text-warning border-warning/20"}
                    `}>
                      <span className={`h-1.5 w-1.5 rounded-circular ${exp.status === "Approved" ? "bg-success" : "bg-warning"}`} />
                      <span>{exp.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Receipt viewer trigger */}
                      <button
                        onClick={() => {
                          setActiveReceiptUrl(exp.category === "Fuel" ? "/receipt_fuel.png" : "/receipt_generic.png");
                          setIsReceiptModalOpen(true);
                        }}
                        title="View Audit Receipt"
                        className="p-1 text-text-secondary hover:text-primary hover:bg-primary-light rounded transition-colors cursor-pointer"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Approve Trigger */}
                      {exp.status === "Pending" && (
                        <button
                          onClick={() => handleApproveExpense(exp.id)}
                          title="Approve Transaction"
                          className="p-1 text-text-secondary hover:text-success hover:bg-success-light rounded transition-colors cursor-pointer"
                        >
                          <Check size={14} />
                        </button>
                      )}

                      {/* Delete Trigger */}
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        title="Void Expense"
                        className="p-1 text-text-secondary hover:text-error hover:bg-error-light rounded transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-text-secondary">
                    No matching expenses found in ledger index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-[11px] text-text-secondary flex justify-between">
          <span>Standard auditing principles applied. Log entries are immutable except for cancellation adjustments.</span>
          <span>Showing {filteredExpenses.length} rows</span>
        </div>
      </div>

      {/* MODAL 1: ADD EXPENSE FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface-app border border-border-app rounded-m shadow-dialog overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-border-app flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                <h3 className="font-semibold text-text-primary text-sm">Log Operational Expense</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-secondary uppercase">Expense Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full h-9 border border-border-app rounded-m text-xs px-3 bg-white text-text-primary focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Fuel">Fuel Cost</option>
                  <option value="Maintenance">Maintenance Service</option>
                  <option value="Driver Salary">Driver Salary</option>
                  <option value="Toll">Road Toll Tax</option>
                  <option value="Insurance">Asset Insurance</option>
                  <option value="Repairs">Unscheduled Repairs</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-secondary uppercase">Amount (INR)</label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-xs text-text-muted font-bold">₹</div>
                  <input
                    type="number"
                    required
                    placeholder="Enter total amount"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full h-9 pl-7 pr-3 border border-border-app rounded-m text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-secondary uppercase">Description / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scania MH12 spark plug replacement"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full h-9 px-3 border border-border-app rounded-m text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              {/* Vehicle Number (optional) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary uppercase">Vehicle Plate (Optional)</label>
                  <input
                    type="text"
                    placeholder="MH-12-XX-0000"
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="w-full h-9 px-3 border border-border-app rounded-m text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary uppercase">Trip Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="TRP-9482"
                    value={formTrip}
                    onChange={(e) => setFormTrip(e.target.value)}
                    className="w-full h-9 px-3 border border-border-app rounded-m text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono uppercase"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-secondary uppercase">Expense Date</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full h-9 px-3 border border-border-app rounded-m text-xs text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-border-app mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 rounded-m border border-border-app text-xs text-text-secondary font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Writing Ledger...</span>
                    </>
                  ) : (
                    <span>Add Expense</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECEIPT VIEWER SIMULATION */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-surface-app border border-border-app rounded-m shadow-dialog overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border-app flex justify-between items-center bg-gray-50">
              <span className="text-xs font-semibold text-text-primary">Audit Receipt Attachment</span>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 bg-slate-100 flex flex-col items-center justify-center">
              {/* Fake High Fidelity Receipt Document */}
              <div className="w-full max-w-xs bg-white border border-gray-200 p-4 rounded shadow-card font-mono text-[9px] text-gray-800 space-y-3 relative">
                {/* Jagged paper styling overlay top/bottom */}
                <div className="text-center font-bold border-b border-dashed border-gray-300 pb-2">
                  <div className="text-xs tracking-widest text-primary">TRANSDELIVERY CO.</div>
                  <div className="text-[8px] text-text-secondary mt-0.5">NATIONAL LOGISTICS AUDIT CORRIDOR</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>RECEIPT ID:</span>
                    <span className="font-semibold">TXN-882194</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DATE:</span>
                    <span>2026-07-12 11:35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STATUS:</span>
                    <span className="text-success font-bold font-sans text-[8px]">VERIFIED (AUTO-COMPLIANT)</span>
                  </div>
                </div>
                
                <div className="border-t border-dashed border-gray-300 pt-2 space-y-1.5">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>ITEM CATEGORY:</span>
                    <span>LOGISTICS CHARGE</span>
                  </div>
                  <p className="text-[8px] text-text-secondary">Logged in connection with scheduled route dispatches, fuel refuelling, or maintenance overhauls.</p>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-2 text-center text-[8px] text-text-muted">
                  SYSTEM-GENERATED TAX INVOICE. NO SIGNATURE REQUIRED.
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-border-app bg-gray-50 text-right">
              <button 
                onClick={() => {
                  alert("Downloading document...");
                  setIsReceiptModalOpen(false);
                }}
                className="px-3 py-1.5 bg-primary text-text-on-primary font-semibold text-xs rounded-m shadow-small hover:bg-primary/95 transition-all cursor-pointer"
              >
                Download PDF Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
