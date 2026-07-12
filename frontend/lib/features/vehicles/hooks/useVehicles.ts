import { useState, useEffect, useCallback } from "react";
import { Vehicle } from "../types";
import { vehicleService } from "../services/vehicle.service";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = async (vehicleData: Omit<Vehicle, "id">) => {
    try {
      const newVehicle = await vehicleService.createVehicle(vehicleData);
      setVehicles((prev) => [...prev, newVehicle]);
      return newVehicle;
    } catch (err: any) {
      throw err;
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    try {
      const updatedVehicle = await vehicleService.updateVehicle(id, vehicleData);
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? updatedVehicle : v))
      );
      return updatedVehicle;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const retireVehicle = async (id: string) => {
    return updateVehicle(id, { status: "Retired" });
  };

  return {
    vehicles,
    isLoading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    retireVehicle,
    refreshVehicles: fetchVehicles,
  };
}
