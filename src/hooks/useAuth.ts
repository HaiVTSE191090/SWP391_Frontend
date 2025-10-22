import { useContext } from "react";
import { UserContext, UserContextType } from "../context/UserContext";
import api from "../services/apiClient";

export const useAuth = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within a UserProvider. " +
        "Wrap your component tree with <UserProvider>.</UserProvider>"
    );
  }

  return context;
};

export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await api.post("/api/auth/forgot-password/send", {
      email,
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data;
  }
};

export const resetPassword = async (
  email: string,
  otpCode: string,
  password: string,
  confirmPassword: string
): Promise<any> => {
  try {
    const response = await api.post("/api/auth/forgot-password/verify-reset", {
      email,
      otpCode,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data;
  }
};
