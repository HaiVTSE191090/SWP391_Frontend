export interface ApiResponse<T> {
    status: string;
    code: number;
    data: T;
    message: string | null;
}

export type BookingStatus =
    | 'RESERVED'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';

export type ContractStatus =
    | 'ADMIN_SIGNED'
    | 'CANCELLED'
    | 'FULLY_SIGNED'
    | 'PENDING_ADMIN_SIGNATURE';

export type DepositStatus =
    | 'PENDING'
    | 'PAID'
    | 'REFUNDED'
    | 'FAILED';

export interface Booking {
    bookingId: number;
    vehicleName: string;
    vehiclePlate: string;
    renterName: string;
    renterEmail: string;
    renterPhone: string;
    staffName: string;
    startDateTime: string;
    endDateTime: string;
    pricePerHour: number;
    pricePerDay: number;
    bookingStatus: BookingStatus;
}
/**
 * Contract model
 */
export interface Contract {
    id: number;
    renterName: string;
    bookingId: number;
    status: ContractStatus;
    createdAt: string;
}
export interface ContractDetail {
    contract: Contract;
    booking: Booking;
}
/**
 * Service response (cho error handling)
 */
export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// models/contract.types.ts - thêm interface mới

export interface ContractTerm {
    termNumber: number;
    termTitle: string;
    termContent: string;
}

export interface ContractFullDetail {
    contractId: number;
    bookingId: number;
    contractType: string;
    contractFileUrl: string;
    status: ContractStatus;
    contractDate: string;
    terms: ContractTerm[];
    adminName: string;
    renterName: string;
    adminSignedAt?: string;
    renterSignedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BookingResponse {
  bookingId: number;
  renterId: number;
  renterName: string;
  vehicleId: number;
  vehicleName: string;
  staffId: number | null;
  staffName: string | null;
  priceSnapshotPerHour: number;
  priceSnapshotPerDay: number;
  startDateTime: string;
  endDateTime: string;
  actualReturnTime: string | null;
  totalAmount: number;
  status: BookingStatus;
  depositStatus: DepositStatus;
  createdAt: string;
  updatedAt: string;
}