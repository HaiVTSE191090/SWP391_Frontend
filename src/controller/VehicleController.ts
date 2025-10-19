import * as vehicleServiceModule from "../services/vehicleService";
import { Vehicle } from "../models/VehicleModel";

/**
 * Controller - Business logic layer
 * Xử lý data từ Service trước khi trả về cho View
 */

export interface IVehicleService {
  getVehicleById: typeof vehicleServiceModule.getVehicleById;
  getVehiclesByStationId: typeof vehicleServiceModule.getVehiclesByStationId;
  getAllVehicles: typeof vehicleServiceModule.getAllVehicles;
  searchVehicles: typeof vehicleServiceModule.searchVehicles;
}

export class VehicleController {
  constructor(private vehicleService: IVehicleService = vehicleServiceModule) {}

  /**
   * Lấy chi tiết xe theo ID
   * @param vehicleId - ID của xe
   * @returns Object chứa success, data (vehicle), error
   */
  async getVehicleDetail(vehicleId: number) {
    try {
      const response = await this.vehicleService.getVehicleById(vehicleId);

      if (response.status === 200 && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: "Lấy thông tin xe thành công",
        };
      }

      return {
        success: false,
        data: null,
        error: "Không tìm thấy thông tin xe",
      };
    } catch (err: any) {
      console.error("❌ Get vehicle detail error:", err?.response?.data || err?.message);

      const errorData = err?.response?.data;
      return {
        success: false,
        data: null,
        error: errorData?.message || "Không thể lấy thông tin xe",
      };
    }
  }

  /**
   * Lấy danh sách xe theo station
   * @param stationId - ID của trạm
   * @returns Object chứa success, data (vehicles array), error
   */
  async getVehiclesByStation(stationId: number) {
    try {
      const response = await this.vehicleService.getVehiclesByStationId(stationId);

      if (response.status === 200 && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: `Tìm thấy ${response.data.data.length} xe`,
        };
      }

      return {
        success: false,
        data: [],
        error: "Không tìm thấy xe nào",
      };
    } catch (err: any) {
      console.error("❌ Get vehicles by station error:", err?.response?.data || err?.message);

      const errorData = err?.response?.data;
      return {
        success: false,
        data: [],
        error: errorData?.message || "Không thể lấy danh sách xe",
      };
    }
  }

  /**
   * Tìm kiếm xe theo filter
   * @param filters - Object chứa các điều kiện filter
   * @returns Object chứa success, data (vehicles array), error
   */
  async searchVehicles(filters: {
    stationId?: number;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }) {
    try {
      const response = await this.vehicleService.searchVehicles(filters);

      if (response.status === 200 && response.data.data) {
        const vehicles = response.data.data;

        // Business logic: Filter theo giá (nếu BE chưa filter)
        let filteredVehicles = vehicles;
        
        if (filters.minPrice !== undefined) {
          filteredVehicles = filteredVehicles.filter(
            (v) => (v.pricePerHour || 0) >= filters.minPrice!
          );
        }

        if (filters.maxPrice !== undefined) {
          filteredVehicles = filteredVehicles.filter(
            (v) => (v.pricePerHour || 0) <= filters.maxPrice!
          );
        }

        return {
          success: true,
          data: filteredVehicles,
          message: `Tìm thấy ${filteredVehicles.length} xe phù hợp`,
        };
      }

      return {
        success: false,
        data: [],
        error: "Không tìm thấy xe nào",
      };
    } catch (err: any) {
      console.error("❌ Search vehicles error:", err?.response?.data || err?.message);

      const errorData = err?.response?.data;
      return {
        success: false,
        data: [],
        error: errorData?.message || "Không thể tìm kiếm xe",
      };
    }
  }

  /**
   * Format giá tiền
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  /**
   * Check xe có available không
   */
  isVehicleAvailable(vehicle: Vehicle): boolean {
    return vehicle.status === "AVAILABLE" || vehicle.status === "available";
  }
}

export const vehicleController = new VehicleController();
