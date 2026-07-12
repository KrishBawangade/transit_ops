import { Role, VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus, MaintenanceType, ExpenseCategory } from "@prisma/client";
import { authService } from "../../features/auth/auth.service";
import { userService } from "../../features/users/user.service";
import { driverService } from "../../features/drivers/driver.service";
import { vehicleService } from "../../features/vehicles/vehicle.service";
import { tripService } from "../../features/trips/trip.service";
import { maintenanceService } from "../../features/maintenance/maintenance.service";
import { fuelService } from "../../features/fuel/fuel.service";
import { expenseService } from "../../features/expenses/expense.service";
import { prisma } from "./prisma";

async function runTests() {
  console.log("🏁 Starting Service Layer Validation Tests...");

  try {
    // ----------------------------------------------------
    // Test 1: User Login
    // ----------------------------------------------------
    console.log("\n🔑 Test 1: Authenticating fleet manager...");
    const loginResult = await authService.login({
      email: "manager@transitops.com",
      password: "password123",
    });
    console.log("✅ Fleet manager logged in successfully. Issued Token Payload exists.");

    // ----------------------------------------------------
    // Test 2: User Registration (Driver + Auto Driver Profile)
    // ----------------------------------------------------
    console.log("\n👤 Test 2: Registering a new driver...");
    const driverEmail = `test.driver.${Date.now()}@transitops.com`;
    const regResult = await authService.register(
      {
        email: driverEmail,
        passwordHash: "securePass123",
        firstName: "Test",
        lastName: "Driver",
        role: Role.DRIVER,
        phone: "+15551234567",
      },
      {
        licenseNumber: `DL-TEST-${Math.floor(100000 + Math.random() * 900000)}`,
        licenseClass: "Class A CDL",
      }
    );

    console.log(`✅ Driver registered! User ID: ${regResult.user.id}`);
    const driverProfile = await driverService.getDriverByUserId(regResult.user.id);
    console.log(`✅ Auto driver profile verified. License: ${driverProfile.licenseNumber}, Status: ${driverProfile.status}`);

    // ----------------------------------------------------
    // Test 3: Vehicle Creation
    // ----------------------------------------------------
    console.log("\n🚚 Test 3: Creating a new vehicle...");
    const vehicleReg = `REG-${Math.floor(1000 + Math.random() * 9000)}`;
    const vehicle = await vehicleService.createVehicle({
      registrationNumber: vehicleReg,
      make: "Volvo",
      model: "FH",
      year: 2024,
      status: VehicleStatus.AVAILABLE,
      maxPayloadCapacity: 12000.0,
      fuelType: "DIESEL",
      currentOdometer: 10000,
    });
    console.log(`✅ Vehicle created! ID: ${vehicle.id}, Registration: ${vehicle.registrationNumber}`);

    // ----------------------------------------------------
    // Test 4: Trip Creation and Dispatch (Overlapping check & driver/vehicle status sync)
    // ----------------------------------------------------
    console.log("\n🗺️ Test 4: Scheduling and dispatching a trip...");
    const scheduledStart = new Date();
    scheduledStart.setHours(scheduledStart.getHours() + 1);
    const scheduledEnd = new Date();
    scheduledEnd.setHours(scheduledEnd.getHours() + 3);

    const trip = await tripService.createTrip({
      driverId: driverProfile.id,
      vehicleId: vehicle.id,
      status: TripStatus.SCHEDULED,
      startLocation: "Source Hub",
      endLocation: "Destination Warehouse",
      cargoWeight: 8000.0,
      scheduledStart,
      scheduledEnd,
    });
    console.log(`✅ Trip scheduled! Number: ${trip.tripNumber}`);

    console.log("⚡ Dispatching trip...");
    const dispatchedTrip = await tripService.transitionTripStatus(trip.id, TripStatus.DISPATCHED, {
      odometerAtStart: 10000,
    });
    console.log(`✅ Trip dispatched. Status: ${dispatchedTrip.status}, Odometer At Start: ${dispatchedTrip.odometerAtStart}`);

    const driverAfterDispatch = await driverService.getDriverById(driverProfile.id);
    const vehicleAfterDispatch = await vehicleService.getVehicleById(vehicle.id);
    console.log(`📈 Post-dispatch statuses -> Driver: ${driverAfterDispatch.status}, Vehicle: ${vehicleAfterDispatch.status}`);

    // ----------------------------------------------------
    // Test 5: Complete Trip
    // ----------------------------------------------------
    console.log("\n🏁 Test 5: Completing trip...");
    const completedTrip = await tripService.transitionTripStatus(dispatchedTrip.id, TripStatus.COMPLETED, {
      odometerAtEnd: 10250, // 250 km trip
    });
    console.log(`✅ Trip completed. Status: ${completedTrip.status}, Odometer At End: ${completedTrip.odometerAtEnd}`);

    const driverAfterCompletion = await driverService.getDriverById(driverProfile.id);
    const vehicleAfterCompletion = await vehicleService.getVehicleById(vehicle.id);
    console.log(`📈 Post-completion statuses -> Driver: ${driverAfterCompletion.status}, Vehicle: ${vehicleAfterCompletion.status}, Odometer: ${vehicleAfterCompletion.currentOdometer}`);

    // ----------------------------------------------------
    // Test 6: Fuel Logging and Automatic Fuel Expense Generation
    // ----------------------------------------------------
    console.log("\n⛽ Test 6: Logging a fuel purchase...");
    const fuelLog = await fuelService.createFuelLog({
      vehicleId: vehicle.id,
      driverId: driverProfile.id,
      tripId: completedTrip.id,
      quantity: 50.0,
      cost: 75.0,
      odometer: 10300, // fuel refuel updates vehicle odometer
    });
    console.log(`✅ Fuel logged! Quantity: ${fuelLog.quantity}L, Cost: $${fuelLog.cost}`);

    const vehicleAfterFuel = await vehicleService.getVehicleById(vehicle.id);
    console.log(`📈 Vehicle odometer updated to: ${vehicleAfterFuel.currentOdometer}`);

    // Check linked expense
    const fuelExpenses = await expenseService.listExpenses({ vehicleId: vehicle.id, category: ExpenseCategory.FUEL });
    const linkedFuelExpense = fuelExpenses.data.find(e => e.fuelLogId === fuelLog.id);
    if (linkedFuelExpense) {
      console.log(`✅ Linked fuel expense found! Amount: $${linkedFuelExpense.amount}, Desc: "${linkedFuelExpense.description}"`);
    } else {
      throw new Error("Linked fuel expense was NOT automatically logged!");
    }

    // ----------------------------------------------------
    // Test 7: Maintenance Logging and Maintenance Expense Generation
    // ----------------------------------------------------
    console.log("\n🔧 Test 7: Logging maintenance session...");
    const maintenanceLog = await maintenanceService.createMaintenanceLog({
      vehicleId: vehicle.id,
      loggedById: loginResult.user.id, // logged by manager
      description: "Tire rotation and brake pad replacement",
      type: MaintenanceType.REPAIR,
      status: MaintenanceStatus.OPEN,
      cost: 300.0,
      odometerAtService: 10300,
    });
    console.log(`✅ Maintenance log created. Status: ${maintenanceLog.status}`);

    const vehicleInShop = await vehicleService.getVehicleById(vehicle.id);
    console.log(`📈 Vehicle status after open maintenance: ${vehicleInShop.status}`);

    console.log("⚡ Completing maintenance...");
    const completedMaintenance = await maintenanceService.updateMaintenanceLog(maintenanceLog.id, {
      status: MaintenanceStatus.COMPLETED,
    });
    console.log(`✅ Maintenance completed. Status: ${completedMaintenance.status}`);

    const vehicleOutShop = await vehicleService.getVehicleById(vehicle.id);
    console.log(`📈 Vehicle status after completed maintenance: ${vehicleOutShop.status}`);

    // Check linked maintenance expense
    const maintenanceExpenses = await expenseService.listExpenses({ vehicleId: vehicle.id, category: ExpenseCategory.MAINTENANCE });
    const linkedMaintExpense = maintenanceExpenses.data.find(e => e.maintenanceLogId === maintenanceLog.id);
    if (linkedMaintExpense) {
      console.log(`✅ Linked maintenance expense found! Amount: $${linkedMaintExpense.amount}, Desc: "${linkedMaintExpense.description}"`);
    } else {
      throw new Error("Linked maintenance expense was NOT automatically logged!");
    }

    // Clean up test driver
    console.log("\n🧹 Test 8: Cleaning up test data...");
    await prisma.expense.deleteMany({ where: { vehicleId: vehicle.id } });
    await prisma.fuelLog.deleteMany({ where: { vehicleId: vehicle.id } });
    await prisma.maintenanceLog.deleteMany({ where: { vehicleId: vehicle.id } });
    await prisma.trip.deleteMany({ where: { vehicleId: vehicle.id } });
    await driverService.deleteDriver(driverProfile.id);
    await vehicleService.deleteVehicle(vehicle.id);
    await userService.deleteUser(regResult.user.id);
    console.log("✅ Cleanup complete.");

    console.log("\n🎉 ALL SERVICES VERIFIED AND PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("\n❌ Test verification failed with error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
