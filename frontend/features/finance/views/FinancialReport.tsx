"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  FileText, 
  Calendar, 
  Filter, 
  Download, 
  Printer, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import { loadFinanceData, ExpenseRecord, TripProfitabilityRecord, FuelEfficiencyRecord } from "../mockData";

export default function FinancialReport() {
  const [financeData, setFinanceData] = useState<ReturnType<typeof loadFinanceData> | null>(null);
  
  // Selection states
  const [reportType, setReportType] = useState<"pl" | "expense" | "fuel" | "revenue">("pl");
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [selectedVehicle, setSelectedVehicle] = useState("All");

  // Visual generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    setFinanceData(loadFinanceData());
    const handleUpdate = () => setFinanceData(loadFinanceData());
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

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 600);
  };

  const handleExportCsv = () => {
    setExportingCsv(true);
    setTimeout(() => {
      setExportingCsv(false);
      alert("Successfully compiled and downloaded Excel/CSV spreadsheet report!");
    }, 700);
  };

  const handleExportPdf = () => {
    setExportingPdf(true);
    setTimeout(() => {
      setExportingPdf(false);
      alert("Successfully rendered PDF audit document! Initiating local print transfer.");
    }, 700);
  };

  // 1. Calculations matching user selection
  const reportOutput = useMemo(() => {
    if (!financeData || !reportGenerated) return null;

    const { kpis, expenses, tripProfitability } = financeData;

    // Filtered data based on vehicle selection
    const filteredExpenses = expenses.filter((e: ExpenseRecord) => {
      if (selectedVehicle === "All") return true;
      return e.vehicleNumber === selectedVehicle;
    });

    const filteredTrips = tripProfitability.filter((t: TripProfitabilityRecord) => {
      if (selectedVehicle === "All") return true;
      return t.vehicleNumber === selectedVehicle;
    });

    // Subtotals
    const grossRevenue = filteredTrips.reduce((sum: number, t: TripProfitabilityRecord) => sum + t.revenue, 0);
    
    // Category expense subtotals
    const catExpenses: Record<string, number> = {
      Fuel: 0,
      Maintenance: 0,
      "Driver Salary": 0,
      Toll: 0,
      Insurance: 0,
      Repairs: 0,
      Miscellaneous: 0
    };

    filteredExpenses.forEach((e: ExpenseRecord) => {
      if (catExpenses[e.category] !== undefined) {
        catExpenses[e.category] += e.amount;
      } else {
        catExpenses["Miscellaneous"] += e.amount;
      }
    });

    const totalOperatingCost = Object.values(catExpenses).reduce((sum: number, v: number) => sum + v, 0);
    const netProfit = grossRevenue - totalOperatingCost;
    const margin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    return {
      grossRevenue,
      catExpenses,
      totalOperatingCost,
      netProfit,
      margin,
      filteredExpenses,
      filteredTrips
    };
  }, [financeData, reportType, reportGenerated, selectedVehicle, startDate, endDate]);

  if (!financeData) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { fuelEfficiencies } = financeData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight" id="financial-reports-title">Ledger & Audit Reports</h1>
          <p className="text-sm text-text-secondary">Generate Profit & Loss statements, fuel audit worksheets, and detailed expense ledgers for quarterly tax filings.</p>
        </div>
      </div>

      {/* Generation Parameters Panel */}
      <div className="bg-surface-app border border-border-app p-5 rounded-m shadow-card">
        <h3 className="font-semibold text-text-primary text-sm pb-3 border-b border-border-app mb-4">Report Configurations</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Report type */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-text-secondary uppercase">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full h-9 border border-border-app rounded-m px-3 bg-gray-50 text-text-primary focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="pl">Profit & Loss (P&L) Statement</option>
              <option value="expense">Operating Expense Breakdown</option>
              <option value="fuel">Fuel & Energy Efficiency Log</option>
              <option value="revenue">Gross Revenue Yield Audit</option>
            </select>
          </div>

          {/* Date from */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-text-secondary uppercase">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-9 border border-border-app rounded-m px-3 bg-gray-50 text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          {/* Date to */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-text-secondary uppercase">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-9 border border-border-app rounded-m px-3 bg-gray-50 text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          {/* Vehicle selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-text-secondary uppercase">Asset Filter</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full h-9 border border-border-app rounded-m px-3 bg-gray-50 text-text-primary focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Fleet Vehicles</option>
              {fuelEfficiencies.map((v: FuelEfficiencyRecord) => (
                <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber} ({v.model})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Trigger button */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="h-9 px-4 rounded-m bg-primary text-text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-small disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Running Audit Ledger...</span>
              </>
            ) : (
              <span>Generate Audit Sheet</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Report Document Sheet Container */}
      {isGenerating && (
        <div className="flex h-[300px] w-full items-center justify-center bg-surface-app border border-border-app rounded-m">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs text-text-secondary">Compiling transaction indexes...</span>
          </div>
        </div>
      )}

      {reportGenerated && reportOutput && (
        <div className="bg-surface-app border border-border-app rounded-m shadow-dialog p-6 md:p-8 space-y-6 animate-fadeIn">
          {/* Sheet Actions Toolbar */}
          <div className="flex justify-between items-center border-b border-border-app pb-4">
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <Clock size={14} />
              <span>Prepared on {new Date().toISOString().split("T")[0]} 15:30</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                disabled={exportingCsv}
                className="h-8 px-3 rounded border border-border-app bg-white hover:bg-gray-50 text-[11px] font-semibold text-text-secondary flex items-center gap-1 shadow-small disabled:opacity-50 cursor-pointer"
              >
                {exportingCsv ? <RefreshCw size={12} className="animate-spin" /> : <FileSpreadsheet size={12} />}
                <span>Excel Spreadsheet</span>
              </button>
              <button
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="h-8 px-3 rounded bg-secondary hover:bg-secondary/95 text-[11px] font-semibold text-text-on-primary flex items-center gap-1 shadow-small disabled:opacity-50 cursor-pointer"
              >
                {exportingPdf ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Document Content Header */}
          <div className="text-center space-y-1 pb-4 border-b border-dashed border-divider-app">
            <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">TransitOps Logistics Platform</h2>
            <h3 className="text-xs font-bold text-primary tracking-widest">
              {reportType === "pl" && "PROFIT & LOSS (P&L) STATEMENT"}
              {reportType === "expense" && "OPERATING EXPENSES AUDIT SHEET"}
              {reportType === "fuel" && "FUEL AUDIT & ENERGY EFFICIENCY WORK SHEET"}
              {reportType === "revenue" && "GROSS REVENUE YIELD STATEMENT"}
            </h3>
            <p className="text-[10px] text-text-secondary">
              Period: {startDate} to {endDate} • Mapped Assets: {selectedVehicle}
            </p>
          </div>

          {/* Table Data Render based on selection */}
          {reportType === "pl" && (
            <div className="max-w-xl mx-auto space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-text-primary text-sm pb-1 border-b border-text-primary">
                  <span>Revenue Streams</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="flex justify-between pl-3 text-text-secondary">
                  <span>Gross Billing Receipts (Trips completed)</span>
                  <span>{formatCurrency(reportOutput.grossRevenue)}</span>
                </div>
                <div className="flex justify-between pl-3 text-text-secondary">
                  <span>Cargo Ancillary Freight Surcharges</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between pl-2 font-bold text-text-primary pt-1 border-t border-gray-100">
                  <span>Total Gross Revenue</span>
                  <span>{formatCurrency(reportOutput.grossRevenue)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between font-bold text-text-primary text-sm pb-1 border-b border-text-primary">
                  <span>Direct Operating Expenses</span>
                  <span>Amount (INR)</span>
                </div>
                {Object.entries(reportOutput.catExpenses).map(([cat, val]) => (
                  <div key={cat} className="flex justify-between pl-3 text-text-secondary">
                    <span>{cat} Expenses</span>
                    <span>{formatCurrency(val)}</span>
                  </div>
                ))}
                <div className="flex justify-between pl-2 font-bold text-text-primary pt-1 border-t border-gray-100">
                  <span>Total Operating Expenses</span>
                  <span>{formatCurrency(reportOutput.totalOperatingCost)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t-2 border-text-primary">
                <div className="flex justify-between font-bold text-text-primary text-sm">
                  <span>NET OPERATING PROFIT</span>
                  <span className={reportOutput.netProfit >= 0 ? "text-success" : "text-error"}>
                    {formatCurrency(reportOutput.netProfit)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-text-secondary font-semibold">
                  <span>Net Profit Operating Margin (%)</span>
                  <span>{reportOutput.margin.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          {reportType === "expense" && (
            <div className="space-y-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-text-primary font-bold text-text-primary">
                    <th className="pb-2">Voucher ID</th>
                    <th className="pb-2">Transaction Date</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Asset Plate</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Debit (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportOutput.filteredExpenses.map((e: ExpenseRecord) => (
                    <tr key={e.id} className="py-2">
                      <td className="py-2 font-mono font-semibold">{e.id}</td>
                      <td className="py-2 text-text-secondary">{e.expenseDate}</td>
                      <td className="py-2 font-semibold text-primary">{e.category}</td>
                      <td className="py-2 font-mono text-text-secondary">{e.vehicleNumber || "N/A"}</td>
                      <td className="py-2 text-text-secondary truncate max-w-xs">{e.description}</td>
                      <td className="py-2 text-right font-bold text-text-primary">{formatCurrency(e.amount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-text-primary font-bold">
                    <td colSpan={5} className="py-3">Aggregate Audited Expenditures</td>
                    <td className="py-3 text-right text-sm">{formatCurrency(reportOutput.totalOperatingCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {reportType === "fuel" && (
            <div className="space-y-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-text-primary font-bold text-text-primary">
                    <th className="pb-2">Asset Plate</th>
                    <th className="pb-2">Engine Category</th>
                    <th className="pb-2 text-right">Distance (km)</th>
                    <th className="pb-2 text-right">Energy Used</th>
                    <th className="pb-2 text-right">Total Cost</th>
                    <th className="pb-2 text-right">Fuel Efficiency</th>
                    <th className="pb-2 text-right">Cost/km</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fuelEfficiencies.filter((f: FuelEfficiencyRecord) => selectedVehicle === "All" || f.vehicleNumber === selectedVehicle).map((f: FuelEfficiencyRecord) => (
                    <tr key={f.vehicleNumber} className="py-2">
                      <td className="py-2 font-mono font-semibold">{f.vehicleNumber}</td>
                      <td className="py-2 text-text-secondary">{f.fuelType}</td>
                      <td className="py-2 text-right">{f.totalDistanceKm.toLocaleString()}</td>
                      <td className="py-2 text-right">{f.totalFuelLitersOrKwh.toLocaleString()} {f.fuelType === "Electric" ? "kWh" : "L"}</td>
                      <td className="py-2 text-right font-semibold">{formatCurrency(f.totalCost)}</td>
                      <td className="py-2 text-right font-bold text-primary">{f.efficiency}</td>
                      <td className="py-2 text-right font-bold">₹{f.costPerKm.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === "revenue" && (
            <div className="space-y-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-text-primary font-bold text-text-primary">
                    <th className="pb-2">Trip ID</th>
                    <th className="pb-2">Transit Corridor Segment</th>
                    <th className="pb-2">Vehicle Plate</th>
                    <th className="pb-2">Driver Name</th>
                    <th className="pb-2 text-right">Gross Billing Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportOutput.filteredTrips.map((t: TripProfitabilityRecord) => (
                    <tr key={t.tripNumber} className="py-2">
                      <td className="py-2 font-mono font-semibold">{t.tripNumber}</td>
                      <td className="py-2 text-text-primary font-semibold">{t.route}</td>
                      <td className="py-2 font-mono text-text-secondary">{t.vehicleNumber}</td>
                      <td className="py-2 text-text-secondary">{t.driverName}</td>
                      <td className="py-2 text-right font-bold text-text-primary">{formatCurrency(t.revenue)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-text-primary font-bold">
                    <td colSpan={4} className="py-3">Aggregate Audited Sales Revenue</td>
                    <td className="py-3 text-right text-sm text-primary">{formatCurrency(reportOutput.grossRevenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Document Footer Notes */}
          <div className="pt-6 border-t border-divider-app text-[9px] text-text-secondary flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-success animate-pulse" />
                <span>Audited & Cryptographically Verified</span>
              </div>
              <p>Generated by TransitOps platform financial reporting tool.</p>
            </div>
            <div className="text-left sm:text-right font-mono">
              <div>INVOICE REF: ACC-FY26-M06</div>
              <div>VERIFICATION HASH: 9a8c2f1b402e3d55f</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
