import * as models from "../models/AuthModel";
import { api } from "./apiClient";

export const signUpApi = async (data: models.SignUpRequest) => {
  return await api.post("/api/auth/register", data);
};

export const loginApi = async (data: models.LoginRequest) => {
  return await api.post("/api/auth/login", data);
};

export const loginWithGoogle = async (
  payload: models.GoogleLoginRequest
) => {
  return await api.post("/api/auth/google/login", payload);
};

export const verifyKyc = async (payload: any) => {
  return await api.post("/api/auth/verify", payload);
};

export const getUserByID = async (userID: number) => {
  return await api.get(`/api/users/${userID}`);
};
