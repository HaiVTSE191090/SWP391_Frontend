import  api  from "./apiClient";

export interface StationResponseDTO {
  stationId: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  status: string;
  vehicles?: any[];
  distance?: number;
  availableCount?: number;
}

export const getStations = async (lat: number, lng: number) => {
  // GET /api/stations?lat=..&lng=..
  return await api.get(`/api/stations/${lat}/${lng}`);
};

export const getAllStations = async () => {
  // GET /api/stations/all
  return await api.get("/api/stations/all");
};

export const getVehiclesByStationId = async (stationId: number) => {
  // GET /api/stations/{stationId}/vehicles
  return await api.get(`/api/stations/${stationId}/vehicles`);
};
