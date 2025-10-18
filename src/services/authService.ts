import axios from "axios";
import * as models from "../models/AuthModel";
import api from "./apiClient";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const signUpApi = async (data: models.SignUpRequest) => {
  return await api.post(`${baseURL}/api/auth/register`, data);
};

export const loginApi = async (data: models.LoginRequest) => {
  return await api.post(`/api/auth/login`, data);
};

export const loginWithGoogle = async (payload: models.GoogleLoginRequest) => {
  console.log("Google login payload:", payload);
  return await api.post(`${baseURL}/api/auth/google/login`, payload);
};

export const verifyKyc = async (payload: any) => {
  return await api.post(`${baseURL}/api/auth/verify`, payload);
};

export const getProfile = async (token: string) => {
  return await axios.get(`${baseURL}/api/renter/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyOTP = async (email: string, otpCode: string) => {
  return await api.post(`${baseURL}/api/auth/otp-email/verify`, {} ,
    {
        params: {
          email: email,
          otpCode: otpCode
        },
        headers: {
          "Accept": "*/*"
        }
      }
  );
};

export const sendOTP = async (email: string) => {
  return await api.post(`${baseURL}/api/auth/otp-email/send`, {
    email: email
  });
};
