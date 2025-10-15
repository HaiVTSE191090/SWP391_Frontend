export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
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

export interface GoogleLoginRequest {
  token: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  data: T;
}

export interface LoginSuccessData {
  token: string;
  email: string;
  kycStatus: string;
}

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

export type RegisterErrorData = string | Record<string, string>;
export type RegisterResponse = ApiResponse<SignUpResponse | RegisterErrorData>;