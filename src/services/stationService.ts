import api from "./apiClient";
import { GetAllStationsResponse } from "../models/StationModel";

export const getAllStations = async (): Promise<GetAllStationsResponse> => {
  const response = await api.get("/api/stations/all");
  return response.data;
};

export const getStationsByLocation = async (lat: number, lng: number): Promise<GetAllStationsResponse> => {
  const response = await api.get(`/api/stations?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getVehiclesByStationId = async (stationId: number) => {
  const response = await api.get(`/api/stations/${stationId}/vehicles`);
  return response.data;
};
