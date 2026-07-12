import FleetManagerDashboard from "@/features/dashboard/views/fleet-manager/FleetManagerDashboard";
import DriverDashboard from "@/features/dashboard/views/driver/DriverDashboard";

export default function FleetManagerDashboardPage() {
  // Role-based control: hardcoded to 'driver' to preview the driver POV
  const userRole: "fleet-manager" | "driver" = "driver";

  if (userRole === "driver") {
    return <DriverDashboard />;
  }

  return <FleetManagerDashboard />;
}
