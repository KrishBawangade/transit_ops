import { prisma } from "../../shared/database/prisma";
import { VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus } from "@prisma/client";

export class DashboardService {
  async getMetrics(): Promise<any> {
    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const [
      totalVehicles,
      vehiclesOnTrip,
      totalDrivers,
      driversOnTrip,
      tripsInTransit,
      openMaintenanceLogsCount,
      expiringLicensesCount,
      vehiclesInShopCount,
      liveTrips,
    ] = await Promise.all([
      // 1. Vehicles count (non-retired)
      prisma.vehicle.count({
        where: {
          status: { not: VehicleStatus.RETIRED },
          deletedAt: null,
        },
      }),
      // 2. Vehicles currently dispatched
      prisma.vehicle.count({
        where: {
          status: VehicleStatus.ON_TRIP,
          deletedAt: null,
        },
      }),
      // 3. Drivers count (non-inactive)
      prisma.driver.count({
        where: {
          status: { not: DriverStatus.INACTIVE },
          deletedAt: null,
        },
      }),
      // 4. Drivers currently on trip
      prisma.driver.count({
        where: {
          status: DriverStatus.ON_TRIP,
          deletedAt: null,
        },
      }),
      // 5. Trips currently in transit
      prisma.trip.count({
        where: {
          status: TripStatus.DISPATCHED,
          deletedAt: null,
        },
      }),
      // 6. Open maintenance logs (exception alert)
      prisma.maintenanceLog.count({
        where: {
          status: MaintenanceStatus.OPEN,
          deletedAt: null,
        },
      }),
      // 7. Driver licenses expiring in next 30 days (exception alert)
      prisma.driver.count({
        where: {
          licenseExpiry: { lte: thirtyDaysFromNow },
          deletedAt: null,
        },
      }),
      // 8. Vehicles currently in shop (exception alert)
      prisma.vehicle.count({
        where: {
          status: VehicleStatus.IN_SHOP,
          deletedAt: null,
        },
      }),
      // 9. Dispatched/Scheduled trips pipeline (top 5 sorted by scheduledStart)
      prisma.trip.findMany({
        where: {
          status: { in: [TripStatus.SCHEDULED, TripStatus.DISPATCHED] },
          deletedAt: null,
        },
        orderBy: {
          scheduledStart: "asc",
        },
        take: 5,
        include: {
          vehicle: true,
          driver: {
            include: {
              user: true,
            },
          },
        },
      }),
    ]);

    // Calculate utilization rate
    const fleetUtilizationRate = totalVehicles > 0 ? Math.round((vehiclesOnTrip / totalVehicles) * 100) : 0;
    
    // Construct dynamic exceptions alerts list
    const alerts: any[] = [];
    if (openMaintenanceLogsCount > 0) {
      alerts.push({
        type: "MAINTENANCE_DUE",
        title: `${openMaintenanceLogsCount} Open Maintenance Orders`,
        severity: "warning",
      });
    }
    if (expiringLicensesCount > 0) {
      alerts.push({
        type: "LICENSE_EXPIRING",
        title: `${expiringLicensesCount} Driver Licenses Expiring Soon`,
        severity: "critical",
      });
    }
    if (vehiclesInShopCount > 0) {
      alerts.push({
        type: "VEHICLES_IN_SHOP",
        title: `${vehiclesInShopCount} Vehicles in Shop`,
        severity: "warning",
      });
    }

    return {
      metrics: {
        activeFleet: {
          active: vehiclesOnTrip,
          total: totalVehicles,
          utilizationRate: fleetUtilizationRate,
        },
        activeDrivers: {
          active: driversOnTrip,
          total: totalDrivers,
        },
        tripsInTransit,
        activeAlertsCount: alerts.length,
        alerts,
      },
      livePipeline: liveTrips.map((trip) => ({
        id: trip.tripNumber,
        vehicle: `${trip.vehicle.make} ${trip.vehicle.model} (${trip.vehicle.registrationNumber})`,
        driver: `${trip.driver.user.firstName} ${trip.driver.user.lastName}`,
        route: `${trip.startLocation} → ${trip.endLocation}`,
        status: trip.status,
        scheduledStart: trip.scheduledStart,
        scheduledEnd: trip.scheduledEnd,
      })),
    };
  }
}

export const dashboardService = new DashboardService();
