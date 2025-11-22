import React, { createContext, ReactNode, useState, useMemo, useCallback } from "react";
import { vehicleController } from "../controller/VehicleController";
import { VehicleWithStation, VehicleDetail } from "../models/VehicleModel";
import { Station } from   "../models/StationModel";

export interface VehicleContextType {
  vehicles: VehicleWithStation[];
  stations: Station[];
  vehicleDetail: VehicleDetail | null;
  loading: boolean;
  error: string | null;

  loadAllVehicles: () => Promise<boolean>;
  loadAvailableVehicles: () => Promise<boolean>;
  loadVehiclesByStation: (stationId: number) => Promise<boolean>;
  loadVehicleDetail: (vehicleId: number) => Promise<any>;
  loadAllStations: () => Promise<boolean>;
  clearError: () => void;

  formatBattery: (batteryLevel: number) => string;
  formatMileage: (mileage: number) => string;
  formatPrice: (price: number) => string;
  isVehicleAvailable: (vehicle: VehicleWithStation) => boolean;
}

export const VehicleContext = createContext<VehicleContextType | null>(null);

interface VehicleProviderProps {
  children: ReactNode;
}

export const VehicleProvider = ({ children }: VehicleProviderProps) => {
  const [vehicles, setVehicles] = useState<VehicleWithStation[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [vehicleDetail, setVehicleDetail] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


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

  const loadVehiclesByStation = useCallback(async (stationId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getVehiclesByStation(stationId);

      if (result.success) {
        const vehiclesWithStation: VehicleWithStation[] = result.data.map((vehicle: any) => ({
          ...vehicle,
          stationId: vehicle.stationId || stationId,
          stationName: vehicle.stationName || `Trạm ${stationId}`,
          // stationLocation: vehicle.stationLocation || 'Chưa có thông tin',
        }));
        
        setVehicles(vehiclesWithStation);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, []);

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

  const loadVehicleDetail = useCallback(async (vehicleId: number): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getVehicleDetail(vehicleId);

      if (result.success && result.data) {
        setVehicleDetail(result.data);
        return {
          success: true,
          data: result.data,
          img: result.data.imageUrls[0]
        };
      } else {
        setError(result.error!);
        return false;
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy thông tin xe");
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

  
  const formatPrice = useCallback((price: number): string => {
    return vehicleController.formatPrice(price);
  }, []);


  const isVehicleAvailable = useCallback((vehicle: VehicleWithStation): boolean => {
    return vehicleController.isVehicleAvailable(vehicle);
  }, []);

  const value = useMemo(
    () => ({
      vehicles,
      stations,
      vehicleDetail,
      loading,
      error,
      loadAllVehicles,
      loadAvailableVehicles,
      loadVehiclesByStation,
      loadVehicleDetail,
      loadAllStations,
      clearError,
      formatBattery,
      formatMileage,
      formatPrice,
      isVehicleAvailable,
    }),
    [
      vehicles,
      stations,
      vehicleDetail,
      loading,
      error,
      loadAllVehicles,
      loadAvailableVehicles,
      loadVehiclesByStation,
      loadVehicleDetail,
      loadAllStations,
      clearError,
      formatBattery,
      formatMileage,
      formatPrice,
      isVehicleAvailable,
    ]
  );

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};
