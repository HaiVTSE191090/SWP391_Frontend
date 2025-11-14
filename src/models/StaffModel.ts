export interface StaffResponse {
  staffId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  completedCount: number;
}

export interface AssignStaffRequest {
  staffId: number;
  targetStationId: number;
}