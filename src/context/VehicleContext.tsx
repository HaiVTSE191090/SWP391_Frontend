import React, { createContext, ReactNode, useState, useMemo } from "react";
import { vehicleController } from "../controller/VehicleController";
import { Vehicle } from "../models/VehicleModel";

/**
 * Context cho Vehicle - Quản lý state và actions
 */
export interface VehicleContextType {
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  getVehicleDetail: (vehicleId: number) => Promise<boolean>;
  getVehiclesByStation: (stationId: number) => Promise<boolean>;
  searchVehicles: (filters: any) => Promise<boolean>;
  clearError: () => void;
  formatPrice: (price: number) => string;
  isVehicleAvailable: (vehicle: Vehicle) => boolean;
}

export const VehicleContext = createContext<VehicleContextType | null>(null);

interface VehicleProviderProps {
  children: ReactNode;
}

export const VehicleProvider = ({ children }: VehicleProviderProps) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy chi tiết xe
   */
  const getVehicleDetail = async (vehicleId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getVehicleDetail(vehicleId);

      if (result.success) {
        setVehicle(result.data);
        return true;
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
  };

  /**
   * Lấy danh sách xe theo station
   */
  const getVehiclesByStation = async (stationId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.getVehiclesByStation(stationId);

      if (result.success) {
        setVehicles(result.data);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Tìm kiếm xe
   */
  const searchVehicles = async (filters: any): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await vehicleController.searchVehicles(filters);

      if (result.success) {
        setVehicles(result.data);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Format giá
   */
  const formatPrice = (price: number): string => {
    return vehicleController.formatPrice(price);
  };

  /**
   * Check available
   */
  const isVehicleAvailable = (vehicle: Vehicle): boolean => {
    return vehicleController.isVehicleAvailable(vehicle);
  };

  const value = useMemo(
    () => ({
      vehicle,
      vehicles,
      loading,
      error,
      getVehicleDetail,
      getVehiclesByStation,
      searchVehicles,
      clearError,
      formatPrice,
      isVehicleAvailable,
    }),
    [vehicle, vehicles, loading, error]
  );

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};
