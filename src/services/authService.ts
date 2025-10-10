import * as models from "../models/AuthModel";
import { api } from "./apiClient";

// Đăng ký
export const signUpApi = async (data: models.SignUpRequest) => {
  return await api.post("/api/auth/register", data);
};

// Đăng nhập
export const loginApi = async (data: models.LoginRequest) => {
  return await api.post("/api/auth/login", data);
};

// Đăng nhập Google
export const loginWithGoogle = async (token: string) => {
  return await api.post("/api/auth/google/login", { token });
};

// Verify KYC
export const verifyKyc = async (payload: any) => {
  return await api.post("/api/auth/verify", payload);
};

// Lấy thông tin user
export const getUserByID = async (userID: number) => {
  return await api.get(`/api/users/${userID}`);
};
