import { tripRepository, TripWithRelations } from "./trip.repository";
import { TripStatus, DriverStatus, VehicleStatus, Prisma } from "@prisma/client";
import { driverService } from "../drivers/driver.service";
import { vehicleService } from "../vehicles/vehicle.service";
import { NotFoundError, ConflictError, BadRequestError } from "../../shared/errors/app-error";

export class TripService {
  async getTripById(id: string): Promise<TripWithRelations> {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundError(`Trip with ID ${id} not found`);
    }
    return trip;
  }

  private async generateUniqueTripNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let unique = false;
    let tripNumber = "";

    while (!unique) {
      const rand = String(Math.floor(1000 + Math.random() * 9000));
      tripNumber = `TR-${year}-${rand}`;
      const existing = await tripRepository.findByTripNumber(tripNumber);
      if (!existing) {
        unique = true;
      }
    }

    return tripNumber;
  }

  async createTrip(
    data: Omit<Prisma.TripUncheckedCreateInput, "tripNumber"> & { tripNumber?: string }
  ): Promise<TripWithRelations> {
    // 1. Verify driver exists and is ACTIVE
    const driver = await driverService.getDriverById(data.driverId);
    if (driver.status !== DriverStatus.ACTIVE) {
      throw new BadRequestError(`Driver is currently ${driver.status}, but must be ACTIVE to assign a new trip`);
    }

    // 2. Verify vehicle exists and is AVAILABLE
    const vehicle = await vehicleService.getVehicleById(data.vehicleId);
    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new BadRequestError(`Vehicle is currently ${vehicle.status}, but must be AVAILABLE to assign a new trip`);
    }

    // 3. Generate a unique trip number if not provided
    if (!data.tripNumber) {
      data.tripNumber = await this.generateUniqueTripNumber();
    } else {
      const existing = await tripRepository.findByTripNumber(data.tripNumber);
      if (existing) {
        throw new ConflictError(`Trip with trip number ${data.tripNumber} already exists`);
      }
    }

    // 4. Validate scheduled times
    const start = new Date(data.scheduledStart);
    const end = new Date(data.scheduledEnd);
    if (start >= end) {
      throw new BadRequestError("Scheduled end time must be after the scheduled start time");
    }

    // 5. If status is starting as DISPATCHED, update statuses immediately
    if (data.status === TripStatus.DISPATCHED) {
      data.actualStart = data.actualStart || new Date();
      data.odometerAtStart = data.odometerAtStart || vehicle.currentOdometer;
    }

    const trip = await tripRepository.create(data as Prisma.TripUncheckedCreateInput);

    // Update statuses if dispatched immediately
    if (trip.status === TripStatus.DISPATCHED) {
      await driverService.updateDriver(driver.id, { status: DriverStatus.ON_TRIP });
      await vehicleService.updateVehicle(vehicle.id, { status: VehicleStatus.ON_TRIP });
    }

    return trip;
  }

  async updateTrip(
    id: string,
    data: Prisma.TripUpdateInput | Prisma.TripUncheckedUpdateInput
  ): Promise<TripWithRelations> {
    const existingTrip = await this.getTripById(id);

    // If updating status, delegate to dedicated transition logic or handle here
    if (data.status && data.status !== existingTrip.status) {
      return this.transitionTripStatus(id, data.status as TripStatus, data);
    }

    return tripRepository.update(id, data);
  }

  async transitionTripStatus(
    id: string,
    newStatus: TripStatus,
    updateData: any = {}
  ): Promise<TripWithRelations> {
    const trip = await this.getTripById(id);
    const driver = await driverService.getDriverById(trip.driverId);
    const vehicle = await vehicleService.getVehicleById(trip.vehicleId);

    const updates: any = { status: newStatus };

    if (newStatus === TripStatus.DISPATCHED) {
      if (trip.status !== TripStatus.SCHEDULED) {
        throw new BadRequestError(`Cannot dispatch trip from status ${trip.status}`);
      }
      if (driver.status !== DriverStatus.ACTIVE) {
        throw new BadRequestError(`Driver is currently ${driver.status}, cannot dispatch`);
      }
      if (vehicle.status !== VehicleStatus.AVAILABLE) {
        throw new BadRequestError(`Vehicle is currently ${vehicle.status}, cannot dispatch`);
      }

      updates.actualStart = updateData.actualStart || new Date();
      updates.odometerAtStart = updateData.odometerAtStart || vehicle.currentOdometer;

      const updatedTrip = await tripRepository.update(id, updates);
      await driverService.updateDriver(driver.id, { status: DriverStatus.ON_TRIP });
      await vehicleService.updateVehicle(vehicle.id, { status: VehicleStatus.ON_TRIP });
      return updatedTrip;
    }

    if (newStatus === TripStatus.COMPLETED) {
      if (trip.status !== TripStatus.DISPATCHED) {
        throw new BadRequestError(`Cannot complete trip from status ${trip.status}`);
      }

      const odometerAtEnd = updateData.odometerAtEnd;
      if (odometerAtEnd === undefined || odometerAtEnd === null) {
        throw new BadRequestError("Odometer reading at completion (odometerAtEnd) is required");
      }

      const odometerAtStart = trip.odometerAtStart || vehicle.currentOdometer;
      if (odometerAtEnd < odometerAtStart) {
        throw new BadRequestError(
          `odometerAtEnd (${odometerAtEnd}) cannot be less than odometerAtStart (${odometerAtStart})`
        );
      }

      updates.actualEnd = updateData.actualEnd || new Date();
      updates.odometerAtEnd = odometerAtEnd;

      const updatedTrip = await tripRepository.update(id, updates);
      await driverService.updateDriver(driver.id, { status: DriverStatus.ACTIVE });
      await vehicleService.updateVehicle(vehicle.id, {
        status: VehicleStatus.AVAILABLE,
        currentOdometer: odometerAtEnd,
      });
      return updatedTrip;
    }

    if (newStatus === TripStatus.CANCELLED) {
      if (trip.status === TripStatus.COMPLETED) {
        throw new BadRequestError("Cannot cancel a completed trip");
      }

      const updatedTrip = await tripRepository.update(id, updates);

      // If the trip was active, release the driver and vehicle
      if (trip.status === TripStatus.DISPATCHED) {
        await driverService.updateDriver(driver.id, { status: DriverStatus.ACTIVE });
        await vehicleService.updateVehicle(vehicle.id, { status: VehicleStatus.AVAILABLE });
      }
      return updatedTrip;
    }

    return tripRepository.update(id, updates);
  }

  async deleteTrip(id: string): Promise<TripWithRelations> {
    const trip = await this.getTripById(id);

    // If trip was dispatched/active, reset driver & vehicle first
    if (trip.status === TripStatus.DISPATCHED) {
      await driverService.updateDriver(trip.driverId, { status: DriverStatus.ACTIVE });
      await vehicleService.updateVehicle(trip.vehicleId, { status: VehicleStatus.AVAILABLE });
    }

    return tripRepository.softDelete(id);
  }

  async listTrips(params: {
    page?: number;
    limit?: number;
    driverId?: string;
    vehicleId?: string;
    status?: TripStatus;
  }): Promise<{ data: TripWithRelations[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const skip = (page - 1) * limit;

    const { data, total } = await tripRepository.list({
      skip,
      take: limit,
      driverId: params.driverId,
      vehicleId: params.vehicleId,
      status: params.status,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

export const tripService = new TripService();
