export interface StationVehicle {
  vehicleId: number;
  plateNumber: string;
  batteryLevel: number;
  status: 'AVAILABLE' | 'IN_USE' | 'IN_REPAIR';
  mileage: number;
  lastServiceDate: string | null;
  modelName: string;
}

export interface Station {
  stationId: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  vehicles: StationVehicle[];
  distance: number | null;
  availableCount: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  data: T;
  message: string | null;
}

export interface StationRequest {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  carNumber: number;
  status: string;
}

export interface StationResponse {
  stationId: number;
  name: string;
  location: string ;
  latitude: number;
  longitude: number;
  capacity: number; 
  status: string;
}

export type GetAllStationsResponse = ApiResponse<Station[]>;
