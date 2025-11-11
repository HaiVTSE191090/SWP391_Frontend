import { ChartData } from "chart.js";

export interface RecentActivityDto {
  type: string;
  description: string;
  timestamp: string;
}

export interface DashboardReportDto {
  totalBookingsToday: number;
  revenueToday: number;
  activeRenters: number;
  totalVehicles: number;
  bookingsThisMonth: number;
  revenueThisMonth: number;
  newRentersThisMonth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  pendingVerifications: number;
  vehiclesNeedMaintenance: number;
  expiringSoonBookings: number;
  recentActivities: RecentActivityDto[];
}

export interface RevenueByDateDto {
  date: string;
  revenue: number;
  bookingCount: number;
}

export interface VehicleRevenueDto {
  vehicleId: number;
  vehicleName: string;
  plateNumber: string;
  revenue: number;
  bookingCount: number;
}

export interface RevenueReportDto {
  startDate: string;
  endDate: string;
  groupBy: string;
  totalRevenue: number;
  totalDeposit: number;
  totalRefunded: number;
  netRevenue: number;
  cashRevenue: number;
  walletRevenue: number;
  momoRevenue: number;
  revenueByDate: RevenueByDateDto[];
  topVehicles: VehicleRevenueDto[];
}

export interface BookingByDateDto {
  date: string;
  count: number;
}

export interface RenterBookingDto {
  renterId: number;
  renterName: string;
  email: string;
  bookingCount: number;
  totalSpent: number;
}

export interface BookingReportDto {
  startDate: string;
  endDate: string;
  totalBookings: number;
  pendingBookings: number;
  reservedBookings: number;
  inUseBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  expiredBookings: number;
  completionRate: number;
  cancellationRate: number;
  bookingsByDate: BookingByDateDto[];
  topRenters: RenterBookingDto[];
}

export interface VehicleByStationDto {
  stationId: number;
  stationName: string;
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
}

export interface TopVehicleDto {
  vehicleId: number;
  vehicleName: string;
  plateNumber: string;
  bookingCount: number;
  averageRating: number;
  totalRevenue: number;
}

export interface MaintenanceNeededDto {
  vehicleId: number;
  vehicleName: string;
  plateNumber: string;
  mileage: number;
  reason: string;
}

export interface VehicleReportDto {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  inRepairVehicles: number;
  utilizationRate: number;
  vehiclesByStation: VehicleByStationDto[];
  vehiclesByModel: Record<string, number>;
  topVehicles: TopVehicleDto[];
  maintenanceNeeded: MaintenanceNeededDto[];
}

export interface StationDetailDto {
  stationId: number;
  name: string;
  location: string;
  status: string;
  totalVehicles: number;
  availableVehicles: number;
  totalBookings: number;
  revenue: number;
  staffCount: number;
}

export interface TopStationDto {
  stationId: number;
  name: string;
  bookingCount: number;
  revenue: number;
  utilizationRate: number;
}

export interface StationReportDto {
  totalStations: number;
  activeStations: number;
  inactiveStations: number;
  stations: StationDetailDto[];
  topStations: TopStationDto[];
}

export interface RevenueReportRequest {
  startDate: string;
  endDate: string;
  groupBy: "DAY" | "MONTH" | "YEAR";
}


export type ReportCardProps = {
  key: Number;
  title: string;
  filters: React.ReactNode;
  chartData: ChartData<any, (number | null)[], string>; // Dùng 'any' cho linh hoạt
  chartType?: "bar" | "line" | "pie"; // Thêm type
  isLoading: boolean;
};

export interface BookingReportRequest {
  startDate: string;
  endDate: string;
  status?: string;
}

export interface VehicleReportRequest {
  stationId?: number;
}
