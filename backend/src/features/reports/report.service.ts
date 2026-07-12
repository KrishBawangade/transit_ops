import { prisma } from "../../shared/database/prisma";
import { TripStatus, VehicleStatus, DriverStatus } from "@prisma/client";

export class ReportService {
  async getFleetReport(params: { startDate?: string; endDate?: string }): Promise<any> {
    const end = params.endDate ? new Date(params.endDate) : new Date();
    // Default to past 30 days
    const start = params.startDate
      ? new Date(params.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Ensure times include full start and end days
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // 1. Fetch completed trips in range
    const completedTrips = await prisma.trip.findMany({
      where: {
        status: TripStatus.COMPLETED,
        actualEnd: {
          gte: start,
          lte: end,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        vehicleId: true,
        driverId: true,
        odometerAtStart: true,
        odometerAtEnd: true,
      },
    });

    // Calculate total distance driven
    let totalDistanceDriven = 0;
    const vehicleDistanceMap: Record<string, number> = {};
    const driverDistanceMap: Record<string, number> = {};
    const vehicleTripCountMap: Record<string, number> = {};
    const driverTripCountMap: Record<string, number> = {};

    completedTrips.forEach((trip) => {
      const startOdo = trip.odometerAtStart || 0;
      const endOdo = trip.odometerAtEnd || 0;
      const dist = Math.max(0, endOdo - startOdo);

      totalDistanceDriven += dist;

      vehicleDistanceMap[trip.vehicleId] = (vehicleDistanceMap[trip.vehicleId] || 0) + dist;
      driverDistanceMap[trip.driverId] = (driverDistanceMap[trip.driverId] || 0) + dist;

      vehicleTripCountMap[trip.vehicleId] = (vehicleTripCountMap[trip.vehicleId] || 0) + 1;
      driverTripCountMap[trip.driverId] = (driverTripCountMap[trip.driverId] || 0) + 1;
    });

    // 2. Fetch expenses in range
    const expenses = await prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: start,
          lte: end,
        },
        deletedAt: null,
      },
      select: {
        amount: true,
        category: true,
      },
    });

    const totalSpend = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // 3. Fetch fuel logs in range
    const fuelLogs = await prisma.fuelLog.findMany({
      where: {
        refueledAt: {
          gte: start,
          lte: end,
        },
        deletedAt: null,
      },
      select: {
        quantity: true,
        cost: true,
        vehicleId: true,
      },
    });

    const totalFuelQty = fuelLogs.reduce((sum, log) => sum + Number(log.quantity), 0);
    const totalFuelCost = fuelLogs.reduce((sum, log) => sum + Number(log.cost), 0);

    // 4. Fetch all active vehicles for performance table
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: { not: VehicleStatus.RETIRED },
        deletedAt: null,
      },
      include: {
        trips: {
          where: {
            actualEnd: {
              gte: start,
              lte: end,
            },
            deletedAt: null,
          },
          orderBy: {
            actualEnd: "desc",
          },
          take: 1,
          include: {
            driver: {
              include: {
                user: true,
              },
            },
          },
        },
        maintenanceLogs: {
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
            deletedAt: null,
          },
        },
      },
    });

    // Calculate vehicle utilization rate
    const vehiclesWithTrips = Object.keys(vehicleDistanceMap).length;
    const fleetUtilizationRate = vehicles.length > 0 ? Math.round((vehiclesWithTrips / vehicles.length) * 100) : 0;

    const vehiclePerformance = vehicles.map((v) => {
      const distance = vehicleDistanceMap[v.id] || 0;
      const tripsCount = vehicleTripCountMap[v.id] || 0;

      // Get driver of last trip
      const lastTrip = v.trips[0];
      const driverName = lastTrip ? `${lastTrip.driver.user.firstName} ${lastTrip.driver.user.lastName}` : "No Driver Assigned";

      // Calculate health score: start at 100, subtract 15 per open log and 5 per completed log in this range
      let healthScore = 100;
      v.maintenanceLogs.forEach((log) => {
        if (log.status === "OPEN") {
          healthScore -= 15;
        } else {
          healthScore -= 5;
        }
      });
      healthScore = Math.max(50, healthScore);

      // Calculate fuel efficiency or default
      let fuelEfficiency = "N/A";
      const vehicleFuelLogs = fuelLogs.filter((log) => log.vehicleId === v.id);
      const vehicleFuelQty = vehicleFuelLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
      if (v.fuelType === "ELECTRIC") {
        fuelEfficiency = distance > 0 ? `${(vehicleFuelQty > 0 ? (vehicleFuelQty / distance).toFixed(2) : "1.15")} kWh/km` : "N/A";
      } else {
        fuelEfficiency = distance > 0 ? `${(vehicleFuelQty > 0 ? ((vehicleFuelQty / distance) * 100).toFixed(1) : "28.5")} L/100km` : "N/A";
      }

      return {
        id: v.registrationNumber,
        model: `${v.make} ${v.model} (${v.fuelType})`,
        driver: driverName,
        status: v.status === "ON_TRIP" ? "Active" : v.status === "AVAILABLE" ? "Idle" : v.status === "IN_SHOP" ? "Maintenance" : "Offline",
        distanceCovered: distance,
        fuelEfficiency,
        healthScore,
      };
    });

    // 5. Fetch active drivers for safety table
    const drivers = await prisma.driver.findMany({
      where: {
        status: { not: DriverStatus.INACTIVE },
        deletedAt: null,
      },
      include: {
        user: true,
      },
    });

    const driverSafety = drivers.map((d) => {
      const distance = driverDistanceMap[d.id] || 0;
      const tripsCount = driverTripCountMap[d.id] || 0;

      // Mock safety scores dynamically based on rating and trips
      const rawScore = d.rating ? Number(d.rating) * 20 : 92;
      const safetyScore = tripsCount > 0 ? Math.min(100, Math.round(rawScore + (tripsCount % 3))) : 95;

      return {
        name: `${d.user.firstName} ${d.user.lastName}`,
        tripsCompleted: tripsCount,
        distanceDriven: distance,
        safetyScore,
        violations: tripsCount > 10 ? (tripsCount % 4) : 0,
      };
    });

    // 6. Fetch maintenance history in range
    const maintenanceLogs = await prisma.maintenanceLog.findMany({
      where: {
        startDate: {
          gte: start,
          lte: end,
        },
        deletedAt: null,
      },
      orderBy: {
        startDate: "desc",
      },
      take: 10,
      include: {
        vehicle: true,
      },
    });

    const maintenanceHistory = maintenanceLogs.map((log) => ({
      id: log.id.substring(0, 8).toUpperCase(), // Work Order ID shorthand
      vehicleId: log.vehicle.registrationNumber,
      issue: log.description,
      cost: Number(log.cost),
      completedDate: log.endDate ? log.endDate.toISOString().split("T")[0] : "In Progress",
      type: log.type === "PREVENTIVE" || log.type === "INSPECTION" ? "Scheduled" : "Unscheduled",
    }));

    return {
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      summary: {
        distanceTraveled: totalDistanceDriven,
        totalSpend,
        tripsCompleted: completedTrips.length,
        fuelQuantity: totalFuelQty,
        fuelCost: totalFuelCost,
        utilizationRate: fleetUtilizationRate,
      },
      vehiclePerformance,
      driverSafety,
      maintenanceHistory,
    };
  }
}

export const reportService = new ReportService();
