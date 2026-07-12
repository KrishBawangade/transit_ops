"use client";

import { apiClient } from "../../lib/core/services/api-client";

// TypeScript types for the finance data structure
export interface FinancialKPIs {
  revenue: number;
  revenueTrend: number;
  expenses: number;
  expensesTrend: number;
  netProfit: number;
  netProfitTrend: number;
  profitMargin: number;
  profitMarginTrend: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
  netProfit: number;
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: "Fuel" | "Maintenance" | "Driver Salary" | "Toll" | "Insurance" | "Repairs" | "Miscellaneous";
  description: string;
  vehicleNumber?: string;
  tripNumber?: string;
  expenseDate: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface FuelEfficiencyRecord {
  vehicleNumber: string;
  model: string;
  fuelType: "Diesel" | "Electric" | "CNG";
  totalDistanceKm: number;
  totalFuelLitersOrKwh: number;
  totalCost: number;
  costPerKm: number;
  efficiency: string; // e.g. "32 L/100km" or "1.15 kWh/km"
}

export interface TripProfitabilityRecord {
  tripNumber: string;
  route: string;
  vehicleNumber: string;
  driverName: string;
  revenue: number;
  fuelCost: number;
  tollCost: number;
  driverSalary: number;
  maintenanceCost: number;
  totalExpenses: number;
  netProfit: number;
  margin: number; // percentage
}

export interface BudgetRecord {
  category: string;
  budgeted: number;
  actual: number;
}

export interface AIInsight {
  id: string;
  type: "warning" | "success" | "info" | "critical";
  text: string;
  category: "Fuel" | "Maintenance" | "Revenue" | "Budget";
  timestamp: string;
}

// Default Data Sets
const DEFAULT_KPIs: FinancialKPIs = {
  revenue: 342500,
  revenueTrend: 8.2,
  expenses: 218300,
  expensesTrend: -2.4,
  netProfit: 124200,
  netProfitTrend: 12.5,
  profitMargin: 36.3,
  profitMarginTrend: 3.1,
};

const DEFAULT_MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: "Jan", revenue: 290000, expenses: 210000, netProfit: 80000 },
  { month: "Feb", revenue: 310000, expenses: 220000, netProfit: 90000 },
  { month: "Mar", revenue: 305000, expenses: 215000, netProfit: 90000 },
  { month: "Apr", revenue: 325000, expenses: 230000, netProfit: 95000 },
  { month: "May", revenue: 338000, expenses: 225000, netProfit: 113000 },
  { month: "Jun", revenue: 342500, expenses: 218300, netProfit: 124200 },
];

const DEFAULT_EXPENSES: ExpenseRecord[] = [
  { id: "EXP-801", amount: 4850, category: "Fuel", description: "Bulk diesel refuel depot tank #2", vehicleNumber: "MH-12-QW-9921", tripNumber: "TRP-9482", expenseDate: "2026-07-11", status: "Approved" },
  { id: "EXP-802", amount: 1200, category: "Maintenance", description: "Brake pad replacements & caliper alignment", vehicleNumber: "MH-12-AS-4501", tripNumber: "TRP-9483", expenseDate: "2026-07-10", status: "Approved" },
  { id: "EXP-803", amount: 3500, category: "Driver Salary", description: "Weekly shift driver payout - 50 hours logged", vehicleNumber: "MH-12-OP-1102", expenseDate: "2026-07-09", status: "Approved" },
  { id: "EXP-804", amount: 450, category: "Toll", description: "FastTag automatic wallet deduction (National Highway 4)", vehicleNumber: "MH-12-QW-9921", tripNumber: "TRP-9482", expenseDate: "2026-07-09", status: "Approved" },
  { id: "EXP-805", amount: 15000, category: "Insurance", description: "Quarterly commercial liability insurance renewal", expenseDate: "2026-07-08", status: "Approved" },
  { id: "EXP-806", amount: 2800, category: "Repairs", description: "Transmission fluid flush & gear clutch repairs", vehicleNumber: "MH-12-JK-8821", tripNumber: "TRP-9484", expenseDate: "2026-07-07", status: "Approved" },
  { id: "EXP-807", amount: 1400, category: "Fuel", description: "Tesla Supercharger charging session - 92 kWh", vehicleNumber: "MH-12-EE-9011", tripNumber: "TRP-9485", expenseDate: "2026-07-06", status: "Approved" },
  { id: "EXP-808", amount: 800, category: "Miscellaneous", description: "Safety cabin kit supplies & fire extinguisher recertification", vehicleNumber: "MH-12-AS-4501", expenseDate: "2026-07-05", status: "Approved" },
  { id: "EXP-809", amount: 1100, category: "Toll", description: "Yamuna Expressway transit tolls pass", vehicleNumber: "MH-12-JK-8821", tripNumber: "TRP-9486", expenseDate: "2026-07-04", status: "Approved" },
  { id: "EXP-810", amount: 3200, category: "Maintenance", description: "Pre-dispatch preventive health checkup & tire rotate", vehicleNumber: "MH-12-TR-3340", expenseDate: "2026-07-03", status: "Approved" },
  { id: "EXP-811", amount: 5200, category: "Fuel", description: "Diesel tank refuel at Shell station", vehicleNumber: "MH-12-JK-8821", tripNumber: "TRP-9486", expenseDate: "2026-07-02", status: "Pending" },
  { id: "EXP-812", amount: 950, category: "Repairs", description: "Broken side-view mirror glass replacement", vehicleNumber: "MH-12-QW-9921", expenseDate: "2026-07-02", status: "Pending" }
];

const DEFAULT_FUEL_EFFICIENCIES: FuelEfficiencyRecord[] = [
  { vehicleNumber: "MH-12-JK-8821", model: "Volvo FH16", fuelType: "Diesel", totalDistanceKm: 14500, totalFuelLitersOrKwh: 4350, totalCost: 47850, costPerKm: 3.30, efficiency: "30.0 L/100km" },
  { vehicleNumber: "MH-12-AS-4501", model: "Scania R500", fuelType: "Diesel", totalDistanceKm: 12200, totalFuelLitersOrKwh: 3904, totalCost: 42944, costPerKm: 3.52, efficiency: "32.0 L/100km" },
  { vehicleNumber: "MH-12-TR-3340", model: "Kenworth T680", fuelType: "Diesel", totalDistanceKm: 8800, totalFuelLitersOrKwh: 2464, totalCost: 27104, costPerKm: 3.08, efficiency: "28.0 L/100km" },
  { vehicleNumber: "MH-12-EE-9011", model: "Tesla Semi (Gen 2)", fuelType: "Electric", totalDistanceKm: 18200, totalFuelLitersOrKwh: 20930, totalCost: 8372, costPerKm: 0.46, efficiency: "1.15 kWh/km" },
  { vehicleNumber: "MH-12-OP-1102", model: "Tesla Semi (Gen 1)", fuelType: "Electric", totalDistanceKm: 15400, totalFuelLitersOrKwh: 19250, totalCost: 7700, costPerKm: 0.50, efficiency: "1.25 kWh/km" },
];

const DEFAULT_TRIP_PROFITABILITY: TripProfitabilityRecord[] = [
  { tripNumber: "TRP-9482", route: "Pune → Mumbai Express", vehicleNumber: "MH-12-JK-8821", driverName: "Alex Rivera", revenue: 24500, fuelCost: 4850, tollCost: 950, driverSalary: 2800, maintenanceCost: 1200, totalExpenses: 9800, netProfit: 14700, margin: 60.0 },
  { tripNumber: "TRP-9483", route: "Bangalore → Chennai Highway", vehicleNumber: "MH-12-AS-4501", driverName: "Sarah Connor", revenue: 28000, fuelCost: 5900, tollCost: 1100, driverSalary: 3100, maintenanceCost: 1400, totalExpenses: 11500, netProfit: 16500, margin: 58.9 },
  { tripNumber: "TRP-9484", route: "Mumbai → Goa Coast", vehicleNumber: "MH-12-TR-3340", driverName: "Elena Rostova", revenue: 22000, fuelCost: 6100, tollCost: 750, driverSalary: 2900, maintenanceCost: 1100, totalExpenses: 10850, netProfit: 11150, margin: 50.7 },
  { tripNumber: "TRP-9485", route: "Delhi NCR → Jaipur Golden", vehicleNumber: "MH-12-EE-9011", driverName: "David Chen", revenue: 19500, fuelCost: 1400, tollCost: 450, driverSalary: 2400, maintenanceCost: 800, totalExpenses: 5050, netProfit: 14450, margin: 74.1 },
  { tripNumber: "TRP-9486", route: "Hyderabad → Bangalore Corridor", vehicleNumber: "MH-12-OP-1102", driverName: "Marcus Vance", revenue: 31000, fuelCost: 1650, tollCost: 1200, driverSalary: 3500, maintenanceCost: 950, totalExpenses: 7300, netProfit: 23700, margin: 76.5 },
  { tripNumber: "TRP-9487", route: "Ahmedabad → Vadodara Highway", vehicleNumber: "MH-12-JK-8821", driverName: "Alex Rivera", revenue: 15500, fuelCost: 3100, tollCost: 400, driverSalary: 1800, maintenanceCost: 700, totalExpenses: 6000, netProfit: 9500, margin: 61.3 },
  { tripNumber: "TRP-9488", route: "Pune → Nagpur Route", vehicleNumber: "MH-12-AS-4501", driverName: "Sarah Connor", revenue: 35000, fuelCost: 9400, tollCost: 1800, driverSalary: 4500, maintenanceCost: 1800, totalExpenses: 17500, netProfit: 17500, margin: 50.0 }
];

const DEFAULT_BUDGETS: BudgetRecord[] = [
  { category: "Fuel", budgeted: 75000, actual: 70500 },
  { category: "Maintenance", budgeted: 35000, actual: 36200 },
  { category: "Driver Salary", budgeted: 85000, actual: 82000 },
  { category: "Toll", budgeted: 15000, actual: 14200 },
  { category: "Insurance", budgeted: 20000, actual: 15000 },
  { category: "Repairs", budgeted: 25000, actual: 28400 },
  { category: "Miscellaneous", budgeted: 10000, actual: 6500 },
];

const DEFAULT_INSIGHTS: AIInsight[] = [
  { id: "INS-001", type: "critical", text: "Maintenance budget exceeded by 3.4% due to unexpected transmission overhauls on older Volvo vehicles.", category: "Maintenance", timestamp: "1h ago" },
  { id: "INS-002", type: "success", text: "Transitioning to Electric Tesla Semis (V-9011 & V-1102) saved ₹48,000 in fuel costs this month, representing a 78% cost per km reduction.", category: "Fuel", timestamp: "3h ago" },
  { id: "INS-003", type: "info", text: "Route Pune–Mumbai generated the highest profit margin (60.0%) among all heavy diesel routes, primarily due to low travel duration.", category: "Revenue", timestamp: "5h ago" },
  { id: "INS-004", type: "warning", text: "Vehicle MH-12-AS-4501 has unusually high maintenance costs ($36.20/hour active), which is 24% higher than fleet averages.", category: "Maintenance", timestamp: "Yesterday" },
  { id: "INS-005", type: "info", text: "Next month's diesel expenses are projected to decline by 4.2% as new EV assets are deployed to the Mumbai-Goa corridor.", category: "Budget", timestamp: "Yesterday" }
];

// Helper functions for Local Storage Persistence
export function loadFinanceData() {
  if (typeof window === "undefined") {
    return {
      kpis: DEFAULT_KPIs,
      monthlyTrends: DEFAULT_MONTHLY_TRENDS,
      expenses: DEFAULT_EXPENSES,
      fuelEfficiencies: DEFAULT_FUEL_EFFICIENCIES,
      tripProfitability: DEFAULT_TRIP_PROFITABILITY,
      budgets: DEFAULT_BUDGETS,
      insights: DEFAULT_INSIGHTS
    };
  }

  try {
    const kpis = localStorage.getItem("transit_ops_kpis") ? JSON.parse(localStorage.getItem("transit_ops_kpis")!) : DEFAULT_KPIs;
    const monthlyTrends = localStorage.getItem("transit_ops_trends") ? JSON.parse(localStorage.getItem("transit_ops_trends")!) : DEFAULT_MONTHLY_TRENDS;
    const expenses = localStorage.getItem("transit_ops_expenses") ? JSON.parse(localStorage.getItem("transit_ops_expenses")!) : DEFAULT_EXPENSES;
    const fuelEfficiencies = localStorage.getItem("transit_ops_fuel_eff") ? JSON.parse(localStorage.getItem("transit_ops_fuel_eff")!) : DEFAULT_FUEL_EFFICIENCIES;
    const tripProfitability = localStorage.getItem("transit_ops_trip_prof") ? JSON.parse(localStorage.getItem("transit_ops_trip_prof")!) : DEFAULT_TRIP_PROFITABILITY;
    const budgets = localStorage.getItem("transit_ops_budgets") ? JSON.parse(localStorage.getItem("transit_ops_budgets")!) : DEFAULT_BUDGETS;
    const insights = localStorage.getItem("transit_ops_insights") ? JSON.parse(localStorage.getItem("transit_ops_insights")!) : DEFAULT_INSIGHTS;

    return { kpis, monthlyTrends, expenses, fuelEfficiencies, tripProfitability, budgets, insights };
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return {
      kpis: DEFAULT_KPIs,
      monthlyTrends: DEFAULT_MONTHLY_TRENDS,
      expenses: DEFAULT_EXPENSES,
      fuelEfficiencies: DEFAULT_FUEL_EFFICIENCIES,
      tripProfitability: DEFAULT_TRIP_PROFITABILITY,
      budgets: DEFAULT_BUDGETS,
      insights: DEFAULT_INSIGHTS
    };
  }
}

export function saveFinanceData(data: {
  kpis?: FinancialKPIs;
  monthlyTrends?: MonthlyTrend[];
  expenses?: ExpenseRecord[];
  fuelEfficiencies?: FuelEfficiencyRecord[];
  tripProfitability?: TripProfitabilityRecord[];
  budgets?: BudgetRecord[];
  insights?: AIInsight[];
}) {
  if (typeof window === "undefined") return;

  try {
    if (data.kpis) localStorage.setItem("transit_ops_kpis", JSON.stringify(data.kpis));
    if (data.monthlyTrends) localStorage.setItem("transit_ops_trends", JSON.stringify(data.monthlyTrends));
    if (data.expenses) localStorage.setItem("transit_ops_expenses", JSON.stringify(data.expenses));
    if (data.fuelEfficiencies) localStorage.setItem("transit_ops_fuel_eff", JSON.stringify(data.fuelEfficiencies));
    if (data.tripProfitability) localStorage.setItem("transit_ops_trip_prof", JSON.stringify(data.tripProfitability));
    if (data.budgets) localStorage.setItem("transit_ops_budgets", JSON.stringify(data.budgets));
    if (data.insights) localStorage.setItem("transit_ops_insights", JSON.stringify(data.insights));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
}

function getCurrentUserId(): string {
  if (typeof window === "undefined") return "c0000000-0000-0000-0000-000000000001";
  try {
    const token = localStorage.getItem("token");
    if (!token) return "c0000000-0000-0000-0000-000000000001";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.id || "c0000000-0000-0000-0000-000000000001";
  } catch {
    return "c0000000-0000-0000-0000-000000000001";
  }
}

// Function to add a new expense record and recalculate relevant numbers dynamically
export function addExpense(record: Omit<ExpenseRecord, "id" | "status">) {
  const { kpis, monthlyTrends, expenses, budgets } = loadFinanceData();

  // Create complete record
  const newId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
  const fullRecord: ExpenseRecord = {
    ...record,
    id: newId,
    status: "Approved", // Approved immediately for the hackathon workflow
  };

  // Add to ledger
  const updatedExpenses = [fullRecord, ...expenses];

  // Update budget actuals
  const updatedBudgets = budgets.map((b: BudgetRecord) => {
    if (b.category.toLowerCase() === record.category.toLowerCase()) {
      return { ...b, actual: b.actual + record.amount };
    }
    return b;
  });

  // Calculate new total expenses
  const expenseDiff = record.amount;
  const newTotalExpenses = kpis.expenses + expenseDiff;
  const newNetProfit = kpis.revenue - newTotalExpenses;
  const newMargin = parseFloat(((newNetProfit / kpis.revenue) * 100).toFixed(1));

  const updatedKpis: FinancialKPIs = {
    ...kpis,
    expenses: newTotalExpenses,
    netProfit: newNetProfit,
    profitMargin: newMargin,
  };

  // Update June (current month) monthly trend
  const updatedTrends = monthlyTrends.map((t: MonthlyTrend) => {
    if (t.month === "Jun") {
      return {
        ...t,
        expenses: t.expenses + expenseDiff,
        netProfit: t.netProfit - expenseDiff,
      };
    }
    return t;
  });

  // Save everything
  saveFinanceData({
    kpis: updatedKpis,
    expenses: updatedExpenses,
    budgets: updatedBudgets,
    monthlyTrends: updatedTrends
  });

  // Post to backend database in background
  apiClient.post("/expenses", {
    amount: record.amount,
    category: record.category.toUpperCase(),
    description: record.description,
    loggedById: getCurrentUserId(),
    expenseDate: new Date(record.expenseDate).toISOString()
  }).then(() => {
    syncFinanceDataWithBackend();
  }).catch((err) => {
    console.warn("Backend add expense failed, using local ledger fallback:", err);
  });

  // Trigger a custom event to notify other components of state changes
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("finance_data_update"));
  }

  return fullRecord;
}

// Function to reset all data back to defaults
export function resetFinanceData() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("transit_ops_kpis");
  localStorage.removeItem("transit_ops_trends");
  localStorage.removeItem("transit_ops_expenses");
  localStorage.removeItem("transit_ops_fuel_eff");
  localStorage.removeItem("transit_ops_trip_prof");
  localStorage.removeItem("transit_ops_budgets");
  localStorage.removeItem("transit_ops_insights");

  window.dispatchEvent(new Event("finance_data_update"));
}

let isSyncing = false;

export async function syncFinanceDataWithBackend() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const [expensesResponse, fuelResponse] = await Promise.all([
      apiClient.get<any>("/expenses?limit=100"),
      apiClient.get<any>("/fuel?limit=100")
    ]);

    const { kpis, monthlyTrends, budgets, insights } = loadFinanceData();

    let updatedExpenses = DEFAULT_EXPENSES;
    if (expensesResponse && expensesResponse.data && expensesResponse.data.length > 0) {
      updatedExpenses = expensesResponse.data.map((exp: any) => {
        let category: ExpenseRecord["category"] = "Miscellaneous";
        if (exp.category === "FUEL") category = "Fuel";
        if (exp.category === "MAINTENANCE") category = "Maintenance";
        if (exp.category === "TOLL") category = "Toll";
        if (exp.category === "INSURANCE") category = "Insurance";
        if (exp.category === "REPAIRS") category = "Repairs";

        return {
          id: exp.id,
          amount: Number(exp.amount),
          category,
          description: exp.description,
          vehicleNumber: exp.vehicle?.registrationNumber || undefined,
          tripNumber: exp.trip?.tripNumber || undefined,
          expenseDate: exp.expenseDate ? exp.expenseDate.split("T")[0] : new Date().toISOString().split("T")[0],
          status: exp.status === "APPROVED" ? "Approved" : exp.status === "REJECTED" ? "Rejected" : "Pending"
        };
      });
    }

    const backendExpensesTotal = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const updatedKpis = {
      ...kpis,
      expenses: backendExpensesTotal || kpis.expenses,
      netProfit: kpis.revenue - (backendExpensesTotal || kpis.expenses)
    };
    updatedKpis.profitMargin = parseFloat(((updatedKpis.netProfit / updatedKpis.revenue) * 100).toFixed(1));

    const categoryTotals: Record<string, number> = {};
    updatedExpenses.forEach(e => {
      const cat = e.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
    });

    const updatedBudgets = budgets.map((b: BudgetRecord) => {
      const match = Object.keys(categoryTotals).find(k => k.toLowerCase() === b.category.toLowerCase());
      return {
        ...b,
        actual: match ? categoryTotals[match] : b.actual
      };
    });

    let updatedFuelEfficiencies = DEFAULT_FUEL_EFFICIENCIES;
    if (fuelResponse && fuelResponse.data && fuelResponse.data.length > 0) {
      updatedFuelEfficiencies = fuelResponse.data.map((log: any) => {
        const dist = log.trip ? (log.odometer - (log.trip.odometerAtStart || 0)) : 150;
        return {
          vehicleNumber: log.vehicle?.registrationNumber || "MH-12-JK-8821",
          model: `${log.vehicle?.make || ''} ${log.vehicle?.model || ''}`,
          fuelType: log.vehicle?.fuelType === "ELECTRIC" ? "Electric" : "Diesel",
          totalDistanceKm: dist,
          totalFuelLitersOrKwh: Number(log.quantity),
          totalCost: Number(log.cost),
          costPerKm: dist > 0 ? parseFloat((Number(log.cost) / dist).toFixed(2)) : 0,
          efficiency: log.vehicle?.fuelType === "ELECTRIC" ? "1.15 kWh/km" : "30.0 L/100km"
        };
      });
    }

    saveFinanceData({
      kpis: updatedKpis,
      expenses: updatedExpenses,
      budgets: updatedBudgets,
      fuelEfficiencies: updatedFuelEfficiencies
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("finance_data_update"));
    }
  } catch (error) {
    console.warn("Backend sync failed or offline, keeping local mock state:", error);
  } finally {
    isSyncing = false;
  }
}
