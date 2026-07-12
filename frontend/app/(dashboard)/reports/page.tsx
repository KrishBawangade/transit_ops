"use client";

import { useEffect, useState } from "react";
import FleetReport from "@/features/reports/views/fleet-manager/FleetReport";
import FinancialReport from "@/features/finance/views/FinancialReport";

export default function ReportsPage() {
  const [role, setRole] = useState("fleet-manager");

  useEffect(() => {
    setRole(localStorage.getItem("transit_ops_user_role") || "fleet-manager");
    const handleStorage = () => {
      setRole(localStorage.getItem("transit_ops_user_role") || "fleet-manager");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (role === "financial-analyst") {
    return <FinancialReport />;
  }

  return <FleetReport />;
}
