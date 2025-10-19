import React, { createContext, ReactNode, useState, useMemo, useCallback } from "react";
import { vehicleController } from "../controller/VehicleController";
import { VehicleWithStation, StationWithVehicles } from "../models/VehicleModel";


export interface VehicleContextType {
  vehicles: VehicleWithStation[];
  stations: StationWithVehicles[];
  loading: boolean;
  error: string | null;

  loadAllVehicles: () => Promise<boolean>;
  loadAvailableVehicles: () => Promise<boolean>;
  loadVehiclesByStation: (stationId: number) => Promise<boolean>;
  loadAllStations: () => Promise<boolean>;
  clearError: () => void;

  formatBattery: (batteryLevel: number) => string;
  formatMileage: (mileage: number) => string;
  isVehicleAvailable: (vehicle: VehicleWithStation) => boolean;
}

export const VehicleContext = createContext<VehicleContextType | null>(null);

interface VehicleProviderProps {
  children: ReactNode;
}

export const VehicleProvider = ({ children }: VehicleProviderProps) => {
  const [vehicles, setVehicles] = useState<VehicleWithStation[]>([]);
  const [stations, setStations] = useState<StationWithVehicles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load tất cả xe từ tất cả stations
   */
  const loadAllVehicles = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getAllVehicles();

      if (result.success) {
        setVehicles(result.data);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy danh sách xe");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load chỉ xe AVAILABLE
   */
  const loadAvailableVehicles = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getAvailableVehicles();

      if (result.success) {
        setVehicles(result.data);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy danh sách xe");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load xe theo station
   */
  const loadVehiclesByStation = useCallback(async (stationId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getVehiclesByStation(stationId);

      if (result.success) {
        // Cần convert sang VehicleWithStation nếu BE không có station info
        setVehicles(result.data);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load tất cả stations
   */
  const loadAllStations = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getAllStations();

      if (result.success) {
        setStations(result.data);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy danh sách trạm");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  
  const formatBattery = useCallback((batteryLevel: number): string => {
    return vehicleController.formatBattery(batteryLevel);
  }, []);

  
  const formatMileage = useCallback((mileage: number): string => {
    return vehicleController.formatMileage(mileage);
  }, []);


  const isVehicleAvailable = useCallback((vehicle: VehicleWithStation): boolean => {
    return vehicleController.isVehicleAvailable(vehicle);
  }, []);

  const value = useMemo(
    () => ({
      vehicles,
      stations,
      loading,
      error,
      loadAllVehicles,
      loadAvailableVehicles,
      loadVehiclesByStation,
      loadAllStations,
      clearError,
      formatBattery,
      formatMileage,
      isVehicleAvailable,
    }),
    [
      vehicles,
      stations,
      loading,
      error,
      loadAllVehicles,
      loadAvailableVehicles,
      loadVehiclesByStation,
      loadAllStations,
      clearError,
      formatBattery,
      formatMileage,
      isVehicleAvailable,
    ]
  );

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};
