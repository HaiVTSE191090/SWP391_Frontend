import api from "./apiClient";
import { AllStationsResponse } from "../models/VehicleModel";

/**
 * Station Service - Gọi API liên quan đến stations
 */

/**
 * Lấy tất cả stations kèm vehicles
 * GET /api/stations/all
 */
export const getAllStations = async (): Promise<AllStationsResponse> => {
  const response = await api.get("/api/stations/all");
  return response.data;
};

/**
 * Lấy stations theo vị trí (có distance)
 * GET /api/stations/{lat}/{lng}
 */
export const getStationsByLocation = async (
  lat: number,
  lng: number
): Promise<AllStationsResponse> => {
  const response = await api.get(`/api/stations/${lat}/${lng}`);
  return response.data;
};

/**
 * Lấy vehicles của một station cụ thể
 * GET /api/stations/{stationId}/vehicles
 */
export const getVehiclesByStationId = async (stationId: number) => {
  const response = await api.get(`/api/stations/${stationId}/vehicles`);
  return response.data;
};
