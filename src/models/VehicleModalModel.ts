export interface ApiResponse<T> {
  status: string;
  code: number;
  data: T;
  message: string;
}

export interface VehicleModelResponse {
  modelId: number;
  modelName: string;
  manufacturer: string;
  batteryCapacity: number | null;
  seatingCapacity: number;
}

export interface VehicleModelRequest {
  modelName: string;
  manufacturer: string;
  batteryCapacity: number | null;
  seatingCapacity: number;
}
