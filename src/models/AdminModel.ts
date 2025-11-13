export interface AdminResponse {
  globalAdminId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: string; 
  createdAt: string; 
  totalContracts: number;
}
export interface UpdateAdminRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  status?: string; 
}