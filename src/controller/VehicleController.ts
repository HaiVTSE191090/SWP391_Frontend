import {
  Vehicle,
  VehicleWithStation,
  StationWithVehicles,
  VehicleDetail,
  isVehicleAvailable as checkVehicleAvailable,
} from "../models/VehicleModel";
import * as stationService from "../services/stationService";
import * as vehicleService from "../services/vehicleService";
import { IVehicleController } from "./IVehicleController";

export class VehicleController implements IVehicleController {
  async getAllVehicles() {
    try {
      const response = await stationService.getAllStations();

      if (response.status === "success" && response.data) {
        const allVehiclesWithStation: VehicleWithStation[] = [];

        response.data.forEach((station: StationWithVehicles) => {
          const vehiclesWithStation = station.vehicles.map(
            (vehicle: Vehicle) => ({
              ...vehicle,
              stationId: station.stationId,
              stationName: station.name,
              stationLocation: station.location,
            })
          );
          allVehiclesWithStation.push(...vehiclesWithStation);
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
      console.error("VehicleController: ", err);
      return {
        success: false,
        data: [],
        error: err?.response?.data?.message || "Không thể lấy danh sách xe",
      };
    }
  }

  async getAvailableVehicles() {
    try {
      const result = await this.getAllVehicles();

      if (result.success) {
        const availableVehicles = result.data.filter(
          (vehicle: VehicleWithStation) => checkVehicleAvailable(vehicle)
        );

        return {
          success: true,
          data: availableVehicles,
          message: `Tìm thấy ${availableVehicles.length} xe có sẵn`,
        };
      }

      return result;
    } catch (err: any) {
      console.log("VehicleController - getAvailableVehicles error:", err);
      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách xe có sẵn",
      };
    }
  }

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
      console.log("VehicleController - getVehiclesByStation error:", err);
      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách xe",
      };
    }
  }

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
      console.log("VehicleController - getAllStations error:", err);
      return {
        success: false,
        data: [],
        error: "Không thể lấy danh sách trạm",
      };
    }
  }


  async getVehicleDetail(vehicleId: number) {
    try {
      const response = await vehicleService.getVehicleDetail(vehicleId);

      if (response.status === "success" && response.data) {
        return {
          success: true,
          data: response.data,
          message: "Lấy thông tin xe thành công",
        };
      }

      return {
        success: false,
        data: null,
        error: "Không tìm thấy xe",
      };
    } catch (err: any) {
      console.log("VehicleController - getVehicleDetail error:", err);
      return {
        success: false,
        data: null,
        error: err?.response?.data?.message || "Không thể lấy thông tin xe",
      };
    }
  }

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

  formatPrice(price: number): string {
    return `${price.toLocaleString("vi-VN")} ₫`;
  }

  isVehicleAvailable(vehicle: Vehicle): boolean {
    return checkVehicleAvailable(vehicle);
  }

  formatMileage(mileage: number | null | undefined): string {
    if (mileage == null || isNaN(mileage)) {
      return "Chưa cập nhật"; // hoặc "0 km"
    }
    return `${mileage.toLocaleString("vi-VN")} km`;
  }

}

export const vehicleController = new VehicleController();
