import exp from "constants";

export interface StationRequestDTO {
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

export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  data: T;
}

export interface StationSuccessData {
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

export interface StationErrorData {
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

export type StationResponse = ApiResponse<StationSuccessData | StationErrorData>;