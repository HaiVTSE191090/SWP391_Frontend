export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface SignUpResponse {
  renterId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Response format từ backend
export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  data: T;
}

// Success response
export interface LoginSuccessData {
  token: string;
  email: string;
  kycStatus: string;
}

// Error response có thể là string hoặc object
export type LoginErrorData = string | {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
};

export type LoginResponse = ApiResponse<LoginSuccessData | LoginErrorData>;

export interface User {
  renterId?: number;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  status?: string;
  blacklisted?: boolean;
}

// Register response typing
export type RegisterErrorData = string | Record<string, string>;
export type RegisterResponse = ApiResponse<SignUpResponse | RegisterErrorData>;