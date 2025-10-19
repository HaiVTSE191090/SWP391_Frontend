import api from "./apiClient";
import { VehicleDetailResponse, VehicleListResponse } from "../models/VehicleModel";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Service layer - Chỉ lo việc gọi API, không có business logic
 */

// Lấy chi tiết 1 xe theo ID
export const getVehicleById = async (vehicleId: number) => {
  return await api.get<VehicleDetailResponse>(`${baseURL}/api/vehicles/${vehicleId}`);
};

// Lấy danh sách xe theo station
export const getVehiclesByStationId = async (stationId: number) => {
  return await api.get<VehicleListResponse>(`${baseURL}/api/stations/${stationId}/vehicles`);
};

// Lấy tất cả xe (nếu cần)
export const getAllVehicles = async () => {
  return await api.get<VehicleListResponse>(`${baseURL}/api/vehicles`);
};

// Tìm kiếm xe theo filter (optional)
export const searchVehicles = async (params: {
  stationId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}) => {
  return await api.get<VehicleListResponse>(`${baseURL}/api/vehicles/search`, { params });
};
