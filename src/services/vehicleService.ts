import api from "./apiClient";

/**
 * Vehicle Service - Gọi API liên quan đến vehicles
 * NOTE: Hiện tại chủ yếu dùng stationService.getAllStations()
 * File này giữ lại cho tương lai nếu BE có riêng vehicle endpoints
 */

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Lấy chi tiết 1 xe theo ID (nếu BE có API này)
export const getVehicleById = async (vehicleId: number) => {
  return await api.get(`${baseURL}/api/vehicles/${vehicleId}`);
};

// Các functions khác có thể bỏ hoặc giữ lại cho tương lai
// Hiện tại đang dùng stationService.getAllStations() để lấy vehicles
