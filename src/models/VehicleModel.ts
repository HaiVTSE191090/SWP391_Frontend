
export interface Vehicle {
  vehicleId: number;
  plateNumber: string;
  batteryLevel: number; // % pin (0-100)
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  mileage: number; // km đã đi
  lastServiceDate: string | null;
  modelName: string | null;
}


export interface VehicleWithStation extends Vehicle {
  stationId: number;
  stationName: string;
  stationLocation: string;
}

/**
 * Response từ API /api/stations/all
 */
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
    MAINTENANCE: "Bảo trì",
  };
  return statusMap[status] || status;
};

export const getVehicleStatusColor = (status: Vehicle["status"]): string => {
  const colorMap = {
    AVAILABLE: "success",
    IN_USE: "warning",
    MAINTENANCE: "secondary",
  };
  return colorMap[status] || "secondary";
};