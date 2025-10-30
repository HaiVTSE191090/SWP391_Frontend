import api from "./apiClient";
import { VehicleDetailResponse } from "../models/VehicleModel";

export const getVehicleDetail = async (vehicleId: number): Promise<VehicleDetailResponse> => {
  const response = await api.get(`/api/vehicle/detail/${vehicleId}`);
  return response.data;
};