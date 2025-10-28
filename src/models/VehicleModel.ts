
export interface Vehicle {
  vehicleId: number;
  plateNumber: string;
  batteryLevel: number;
  status: "AVAILABLE" | "IN_USE" | "IN_REPAIR";
  mileage: number;  
  lastServiceDate: string | null;
  modelName: string | null;
}

export interface VehicleDetail {
  vehicleId: number;
  vehicleName: string;
  plateNumber: string;
  status: "AVAILABLE" | "IN_USE" | "IN_REPAIR";
  description: string;
  modelName: string;
  stationName: string;
  pricePerHour: number;
  pricePerDay: number;
  batteryLevel: number;
  mileage: number;
  imageUrls: string;
}

export interface VehicleDetailResponse {
  status: "success" | "error";
  code: number;
  data: VehicleDetail;
}

export interface VehicleWithStation extends Vehicle {
  stationId: number;
  stationName: string;
  stationLocation: string;
}

export interface StationWithVehicles {
  stationId: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  status: "ACTIVE" | "INACTIVE";
  vehicles: Vehicle[];
  distance: number | null;
  availableCount: number; 
}

export interface AllStationsResponse {
  status: "success" | "error";
  code: number;
  data: StationWithVehicles[];
}


export const isVehicleAvailable = (vehicle: Vehicle): boolean => {
  return vehicle.status === "AVAILABLE";
};

export const getVehicleStatusText = (status: Vehicle["status"]): string => {
  const statusMap = {
    AVAILABLE: "Có sẵn",
    IN_USE: "Đang sử dụng",
    IN_REPAIR: "Đang sửa chữa",
  };
  return statusMap[status] || status;
};

export const getVehicleStatusColor = (status: Vehicle["status"]): string => {
  const colorMap = {
    AVAILABLE: "success",
    IN_USE: "warning",
    IN_REPAIR: "secondary",
  };
  return colorMap[status] || "secondary";
};