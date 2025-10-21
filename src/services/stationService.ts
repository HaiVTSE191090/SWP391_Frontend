import api from "./apiClient";
import { AllStationsResponse } from "../models/VehicleModel";


export const getAllStations = async (): Promise<AllStationsResponse> => {
  const response = await api.get("/api/stations/all");
  return response.data;
};


export const getStationsByLocation = async (
  lat: number,
  lng: number
): Promise<AllStationsResponse> => {
  const response = await api.get(`/api/stations?lat=${lat}&lng=${lng}`);
  return response.data;
};


export const getVehiclesByStationId = async (stationId: number) => {
  const response = await api.get(`/api/stations/${stationId}/vehicles`);
  return response.data;
};
