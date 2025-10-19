import { 
  Vehicle, 
  VehicleWithStation, 
  StationWithVehicles,
  isVehicleAvailable as checkVehicleAvailable 
} from "../models/VehicleModel";
import * as stationService from "../services/stationService";

/**
 * Vehicle Controller - Business logic layer
 * Xử lý data từ Service trước khi trả về cho Context/View
 */

export class VehicleController {
  /**
   * Lấy tất cả xe từ tất cả các trạm
   * Sử dụng API /api/stations/all
   */
  async getAllVehicles() {
    try {
      const response = await stationService.getAllStations();

      if (response.status === "success" && response.data) {
        // Flatten: Gộp tất cả vehicles từ tất cả stations
        const allVehiclesWithStation: VehicleWithStation[] = [];

        response.data.forEach((station: StationWithVehicles) => {
          station.vehicles.forEach((vehicle: Vehicle) => {
            allVehiclesWithStation.push({
              ...vehicle,
              stationId: station.stationId,
              stationName: station.name,
              stationLocation: station.location,
            });
          });
        });

        return {
          success: true,
          data: allVehiclesWithStation,
          message: `Tìm thấy ${allVehiclesWithStation.length} xe`,
        };
      }

      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách xe",
      };
    } catch (err: any) {
      console.error("❌ Get all vehicles error:", err?.response?.data || err?.message);

      return {
        success: false,
        data: [],
        error: err?.response?.data?.message || "Không thể lấy danh sách xe",
      };
    }
  }

  /**
   * Lấy chỉ xe AVAILABLE từ tất cả các trạm
   */
  async getAvailableVehicles() {
    try {
      const result = await this.getAllVehicles();

      if (result.success) {
        const availableVehicles = result.data.filter((vehicle: VehicleWithStation) =>
          checkVehicleAvailable(vehicle)
        );

        return {
          success: true,
          data: availableVehicles,
          message: `Tìm thấy ${availableVehicles.length} xe có sẵn`,
        };
      }

      return result;
    } catch (err: any) {
      console.error("❌ Get available vehicles error:", err);
      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách xe có sẵn",
      };
    }
  }

  /**
   * Lấy xe theo station ID
   */
  async getVehiclesByStation(stationId: number) {
    try {
      const response = await stationService.getVehiclesByStationId(stationId);

      if (response.status === "success" && response.data) {
        return {
          success: true,
          data: response.data,
          message: `Tìm thấy ${response.data.length} xe`,
        };
      }

      return {
        success: false,
        data: [],
        error: "Không tìm thấy xe nào",
      };
    } catch (err: any) {
      console.error("❌ Get vehicles by station error:", err);

      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách xe",
      };
    }
  }

  /**
   * Lấy tất cả stations kèm vehicles
   */
  async getAllStations() {
    try {
      const response = await stationService.getAllStations();

      if (response.status === "success" && response.data) {
        return {
          success: true,
          data: response.data,
          message: `Tìm thấy ${response.data.length} trạm`,
        };
      }

      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách trạm",
      };
    } catch (err: any) {
      console.error("❌ Get all stations error:", err);

      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách trạm",
      };
    }
  }

  /**
   * Filter vehicles theo điều kiện
   */
  filterVehicles(
    vehicles: VehicleWithStation[],
    filters: {
      status?: Vehicle["status"];
      stationId?: number;
      minBattery?: number;
    }
  ): VehicleWithStation[] {
    let filtered = [...vehicles];

    if (filters.status) {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    if (filters.stationId) {
      filtered = filtered.filter((v) => v.stationId === filters.stationId);
    }

    if (filters.minBattery) {
      filtered = filtered.filter((v) => v.batteryLevel >= filters.minBattery!);
    }

    return filtered;
  }

  
  formatBattery(batteryLevel: number): string {
    return `${batteryLevel.toFixed(0)}%`;
  }

 
  isVehicleAvailable(vehicle: Vehicle): boolean {
    return checkVehicleAvailable(vehicle);
  }

  
  formatMileage(mileage: number): string {
    return `${mileage.toLocaleString("vi-VN")} km`;
  }
}

export const vehicleController = new VehicleController();
