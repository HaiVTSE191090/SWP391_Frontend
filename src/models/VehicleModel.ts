export interface ApiResponse<T> {
  status: string;
  code: number;
  data: T;
  message: string | null;
}

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

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
  IN_REPAIR = "IN_REPAIR",
  REPAIRED = "REPAIRED",
  CANCELLED = "CANCELLED",
}

export interface VehicleRequest {
  vehicleId: number;
  vehicleName: string;
  stationId: number;
  stationName: string;
  modelId: number;
  modelName: string;
  pricePerHour: number;
  pricePerDay: number;
  plateNumber: string;
  batteryLevel: number;
  mileage: number;
  description: string;
  status: VehicleStatus | string;
}

export interface FileUploadRequest {
  file: string;
}

export interface VehicleResponse {
  vehicleId: number;
  vehicleName: string;
  stationId: number;
  stationName: string;
  modelId: number;
  modelName: string;
  pricePerHour: number;
  pricePerDay: number;
  plateNumber: string;
  batteryLevel: number;
  mileage: number;
  description: string;
  status: VehicleStatus | string;
}

export interface VehicleDetailData {
  vehicleId: number;
  vehicleName: string;
  plateNumber: string;
  status: VehicleStatus | string;
  description: string;
  modelName: string;
  stationName: string;
  pricePerHour: number;
  pricePerDay: number;
  batteryLevel: number;
  mileage: number;
  bookingHistory: BookingHistoryItem[];
  feedbacks: FeedbackItem[] | any[]; // Dùng FeedbackItem[] nếu bạn biết cấu trúc, hoặc any[]
  imageUrls: string[];
}

export interface BookingHistoryItem {
  bookingId: number;
  renterName: string;
  renterEmail: string;
  startDateTime: string; // ISO string "2025-11-11T20:00:00"
  endDateTime: string; // ISO string
  totalAmount: number;
  bookingStatus: string | null;
}

export interface FeedbackItem {
  feedbackId: number;
  renterName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type CreateVehicleDTO = Omit<
  VehicleRequest,
  "vehicleId" | "stationName" | "modelName"
>;

export type UpdateVehicleDTO = Omit<
  VehicleRequest,
  "vehicleId" | "stationName" | "modelName"
>;