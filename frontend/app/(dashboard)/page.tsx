"use client";

import { useEffect, useState } from "react";
import FleetManagerDashboard from "@/features/dashboard/views/fleet-manager/FleetManagerDashboard";
import DriverDashboard from "@/features/dashboard/views/driver/DriverDashboard";
import { DriverCompliance } from "@/features/drivers/views/safety-officer/DriverCompliance";
import FinancialDashboard from "@/features/finance/views/FinancialDashboard";

export default function DashboardPage() {
  const [role, setRole] = useState("fleet-manager");

  useEffect(() => {
    const activeRole = localStorage.getItem("transit_ops_user_role") || "fleet-manager";
    setRole(activeRole);

    const handleStorage = () => {
      setRole(localStorage.getItem("transit_ops_user_role") || "fleet-manager");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (role === "safety-officer") {
    return <DriverCompliance />;
  }

  if (role === "driver") {
    return <DriverDashboard />;
  }

  if (role === "financial-analyst") {
    return <FinancialDashboard />;
  }

  return <FleetManagerDashboard />;
}
