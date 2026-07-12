import { Role, VehicleStatus, FuelType, DriverStatus, TripStatus, MaintenanceType, MaintenanceStatus, ExpenseCategory } from "@prisma/client";
import { prisma } from "../src/shared/database/prisma";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing tables in logical order of foreign key dependency
  console.log("🧹 Cleaning existing data...");
  await prisma.expense.deleteMany({});
  await prisma.fuelLog.deleteMany({});
  await prisma.maintenanceLog.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.vehicle.deleteMany({});
  console.log("✨ Database clean completed.");

  // 1. Create Core Users
  console.log("👤 Creating user accounts...");
  const dummyPasswordHash = "$2b$10$f3IhvU4M/GTengzYnzouHu61tOr5WEO9Zao3K92mU2xvitkCkoqiS"; // hashes to 'password123'

  const fleetManager = await prisma.user.create({
    data: {
      email: "manager@transitops.com",
      passwordHash: dummyPasswordHash,
      firstName: "Alice",
      lastName: "Manager",
      role: Role.FLEET_MANAGER,
      phone: "+15550100201",
    },
  });

  const safetyOfficer = await prisma.user.create({
    data: {
      email: "safety@transitops.com",
      passwordHash: dummyPasswordHash,
      firstName: "Bob",
      lastName: "Safety",
      role: Role.SAFETY_OFFICER,
      phone: "+15550100202",
    },
  });

  const financialAnalyst = await prisma.user.create({
    data: {
      email: "analyst@transitops.com",
      passwordHash: dummyPasswordHash,
      firstName: "Carol",
      lastName: "Analyst",
      role: Role.FINANCIAL_ANALYST,
      phone: "+15550100203",
    },
  });

  const driverUser1 = await prisma.user.create({
    data: {
      email: "john.doe@transitops.com",
      passwordHash: dummyPasswordHash,
      firstName: "John",
      lastName: "Doe",
      role: Role.DRIVER,
      phone: "+15550100204",
    },
  });

  const driverUser2 = await prisma.user.create({
    data: {
      email: "jane.smith@transitops.com",
      passwordHash: dummyPasswordHash,
      firstName: "Jane",
      lastName: "Smith",
      role: Role.DRIVER,
      phone: "+15550100205",
    },
  });

  // 2. Create Driver Profiles
  console.log("🪪 Creating driver profiles...");
  const driver1 = await prisma.driver.create({
    data: {
      userId: driverUser1.id,
      licenseNumber: "DL12345678",
      licenseClass: "Class A CDL",
      licenseExpiry: new Date("2027-12-31"),
      status: DriverStatus.ACTIVE,
      rating: 4.85,
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      userId: driverUser2.id,
      licenseNumber: "DL87654321",
      licenseClass: "Class B CDL",
      licenseExpiry: new Date("2028-06-15"),
      status: DriverStatus.ON_TRIP,
      rating: 4.92,
    },
  });

  // 3. Create Vehicles
  console.log("🚚 Creating vehicle fleet...");
  const vehicle1 = await prisma.vehicle.create({
    data: {
      registrationNumber: "MH12AB1234",
      make: "Volvo",
      model: "FH16",
      year: 2022,
      status: VehicleStatus.AVAILABLE,
      maxPayloadCapacity: 15000.0,
      fuelType: FuelType.DIESEL,
      currentOdometer: 45000,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      registrationNumber: "MH12CD5678",
      make: "Ford",
      model: "E-Transit",
      year: 2023,
      status: VehicleStatus.ON_TRIP,
      maxPayloadCapacity: 1600.0,
      fuelType: FuelType.ELECTRIC,
      currentOdometer: 12000,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      registrationNumber: "MH12EF9012",
      make: "Tata",
      model: "Starbus",
      year: 2021,
      status: VehicleStatus.IN_SHOP,
      maxPayloadCapacity: 5000.0,
      fuelType: FuelType.CNG,
      currentOdometer: 78000,
    },
  });

  // 4. Create Trips
  console.log("🗺️ Creating trips...");
  const trip1 = await prisma.trip.create({
    data: {
      tripNumber: "TR-2026-0001",
      driverId: driver1.id,
      vehicleId: vehicle1.id,
      status: TripStatus.COMPLETED,
      startLocation: "Mumbai Depot",
      endLocation: "Pune Warehouse",
      cargoWeight: 12000.0,
      cargoDescription: "Industrial Machinery Parts",
      scheduledStart: new Date("2026-07-10T08:00:00Z"),
      scheduledEnd: new Date("2026-07-10T12:00:00Z"),
      actualStart: new Date("2026-07-10T08:15:00Z"),
      actualEnd: new Date("2026-07-10T12:30:00Z"),
      odometerAtStart: 44800,
      odometerAtEnd: 45000,
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      tripNumber: "TR-2026-0002",
      driverId: driver2.id,
      vehicleId: vehicle2.id,
      status: TripStatus.DISPATCHED,
      startLocation: "Logistics Hub A",
      endLocation: "City Center Hub",
      cargoWeight: 950.0,
      cargoDescription: "E-commerce parcels",
      scheduledStart: new Date("2026-07-12T10:00:00Z"),
      scheduledEnd: new Date("2026-07-12T14:00:00Z"),
      actualStart: new Date("2026-07-12T10:05:00Z"),
      odometerAtStart: 11950,
    },
  });

  await prisma.trip.create({
    data: {
      tripNumber: "TR-2026-0003",
      driverId: driver1.id,
      vehicleId: vehicle1.id,
      status: TripStatus.SCHEDULED,
      startLocation: "Mumbai Depot",
      endLocation: "Thane Distribution Center",
      cargoWeight: 5000.0,
      cargoDescription: "Beverages and snacks",
      scheduledStart: new Date("2026-07-13T09:00:00Z"),
      scheduledEnd: new Date("2026-07-13T11:00:00Z"),
    },
  });

  // 5. Create Maintenance Logs
  console.log("🔧 Creating maintenance logs...");
  const maintenanceLog1 = await prisma.maintenanceLog.create({
    data: {
      vehicleId: vehicle1.id,
      loggedById: safetyOfficer.id,
      description: "Standard 45,000 km routine check-in and engine oil filter replacement.",
      type: MaintenanceType.PREVENTIVE,
      status: MaintenanceStatus.COMPLETED,
      cost: 450.0,
      odometerAtService: 44990,
      startDate: new Date("2026-07-11T09:00:00Z"),
      endDate: new Date("2026-07-11T14:00:00Z"),
    },
  });

  await prisma.maintenanceLog.create({
    data: {
      vehicleId: vehicle3.id,
      loggedById: safetyOfficer.id,
      description: "Brake pad wear replacement and dashboard indicator warnings investigation.",
      type: MaintenanceType.REPAIR,
      status: MaintenanceStatus.OPEN,
      odometerAtService: 78000,
      startDate: new Date("2026-07-12T08:00:00Z"),
    },
  });

  // 6. Create Fuel Logs
  console.log("⛽ Creating fuel logs...");
  const fuelLog1 = await prisma.fuelLog.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      tripId: trip1.id,
      quantity: 85.5,
      cost: 120.0,
      odometer: 45000,
      refueledAt: new Date("2026-07-10T12:15:00Z"),
    },
  });

  // 7. Create Expenses
  console.log("💰 Creating expense ledger entries...");
  // Fuel-generated expense
  await prisma.expense.create({
    data: {
      amount: 120.0,
      category: ExpenseCategory.FUEL,
      description: "Trip fuel replenishment: 85.5L diesel",
      loggedById: driverUser1.id,
      vehicleId: vehicle1.id,
      tripId: trip1.id,
      fuelLogId: fuelLog1.id,
      expenseDate: new Date("2026-07-10T12:15:00Z"),
    },
  });

  // Maintenance-generated expense
  await prisma.expense.create({
    data: {
      amount: 450.0,
      category: ExpenseCategory.MAINTENANCE,
      description: "Routine engine oil and filter change service",
      loggedById: safetyOfficer.id,
      vehicleId: vehicle1.id,
      maintenanceLogId: maintenanceLog1.id,
      expenseDate: new Date("2026-07-11T14:00:00Z"),
    },
  });

  // Manual toll expense
  await prisma.expense.create({
    data: {
      amount: 45.0,
      category: ExpenseCategory.TOLL,
      description: "Mumbai-Pune Expressway toll charge receipt",
      loggedById: driverUser1.id,
      vehicleId: vehicle1.id,
      tripId: trip1.id,
      expenseDate: new Date("2026-07-10T09:30:00Z"),
    },
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
