// Vehicle Model - Data structure
export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  plateNumber: string;
  battery: string;
  range: string;
  imageUrl: string;
  color?: string;
  year?: number;
  pricePerHour?: number;
  pricePerDay?: number;
  status?: string;
  description?: string;
  features?: string[];
  stationId?: number;
  stationName?: string;
}

// Response từ API
export interface VehicleDetailResponse {
  status: number;
  message: string;
  data: Vehicle;
}

export interface VehicleListResponse {
  status: number;
  message: string;
  data: Vehicle[];
}

// Request body nếu cần update vehicle (optional)
export interface UpdateVehicleRequest {
  name?: string;
  battery?: string;
  range?: string;
  status?: string;
  pricePerHour?: number;
  pricePerDay?: number;
}