export interface DamageReportSummaryDto {
  bookingId: number;
  vehicleName: string;
  plateNumber: string;
  renterName: string;
  createdAt: string; 
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  data: T;
  message: string | null;
}

export interface BookingImageResponse {
  imageId: number;
  imageUrl: string;
  description: string;
  createdAt: string;
  imageType: string; 
  vehicleComponent: string; 
}

export interface AdminReportResponse {
  bookingId: number;
  renterId: number;
  renterName: string;
  vehicleId: number;
  vehicleName: string;
  staffReceiveId: number | null;
  staffReceiveName: string;
  staffReturnId: number | null;
  staffReturnName: string;
  priceSnapshotPerHour: number;
  priceSnapshotPerDay: number;
  startDateTime: string;
  endDateTime: string;
  actualReturnTime: string;
  totalAmount: number;
  status: string; 
  depositStatus: string; 
  createdAt: string;
  updatedAt: string;
  bookingImages: BookingImageResponse[];
}

export interface BlacklistedRenter {
  renterId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  walletId: any | null; 
  status: string; 
  googleId: string | null;
  authProvider: string;
  otpStatus: any | null;
  kycStatus: any | null;
  nextStep: any | null;
  cccd: any | null;
  gplx: any | null;
  createdAt: string;
  updatedAt: string;
  blacklisted: boolean;
}


export interface WarningResponse {
  renterEmail: string;
  renterName: string;
  message: string;
}

export interface WarningRequest {
  bookingId: number;
  note: string;
}

// Model cho object "renter" lồng bên trong
export interface ReportRenterInfo {
  renterId: number;
  fullName: string;
  email: string;
}

// Model cho mảng "images" lồng bên trong
export interface ReportImage {
  imageId: number;
  imageUrl: string;
  description: string;
  imageType: string;
  // Lưu ý: vehicleComponent không có trong JSON API response
}

// Model chính cho data, thay thế cho AdminReportDetail cũ
export interface BookingReportDetail {
  bookingId: number;
  vehicleName: string;
  vehiclePlateNumber: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
  totalAmount: number;
  depositStatus: string;
  renter: ReportRenterInfo; // <-- Sửa ở đây
  images: ReportImage[]; // <-- Sửa ở đây
  // Lưu ý: actualReturnTime không có trong JSON API response
}