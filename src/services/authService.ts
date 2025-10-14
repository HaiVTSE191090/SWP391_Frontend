import axios from "axios";
import * as models from "../models/AuthModel";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";


export const signUpApi = async (data: models.SignUpRequest) => {
  return await axios.post(`${baseURL}/api/auth/register`, data);
};

export const loginApi = async (data: models.LoginRequest) => {
  return await axios.post(`${baseURL}/api/auth/login`, data);
};

export const loginWithGoogle = async (
  payload: models.GoogleLoginRequest
) => {
  return await axios.post(`${baseURL}/api/auth/google/login`, payload);
};

export const verifyKyc = async (payload: any) => {
  return await axios.post(`${baseURL}/api/auth/verify`, payload);
};

export const getUserByID = async (userID: number) => {
  return await axios.get(`${baseURL}/api/users/${userID}`);
};
