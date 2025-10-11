import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as authService from "../services/authService";
import * as model from "../models/AuthModel";

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  executeLogin: (
    data: model.LoginRequest
  ) => Promise<model.LoginSuccessData | null>;
  executeGoogleLogin: (
    credential: string
  ) => Promise<model.LoginSuccessData | null>;
  executeSignUp: (
    data: model.SignUpRequest
  ) => Promise<model.RegisterResponse | null>;
  reset: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const executeLogin = async (
    data: model.LoginRequest
  ): Promise<model.LoginSuccessData | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await authService.loginApi(data);
      // response expected: { status, code, data }
      if (response?.status === "success" && response?.data) {
        const payload: any = response.data as any;
        const token = payload.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        let decoded: any = {};
        try {
          decoded = jwtDecode<any>(token);
        } catch {}
        const userObj = {
          email: decoded?.email || decoded?.sub || payload?.email,
          fullName: decoded?.fullName || decoded?.name,
          kycStatus: payload?.kycStatus,
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        setSuccess(true);
        setMessage("Đăng nhập thành công!");
        return payload as model.LoginSuccessData;
      } else {
        const errorMessage =
          (response as any)?.data?.message || "Đăng nhập thất bại";
        setError(errorMessage);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Lỗi kết nối mạng";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const executeGoogleLogin = async (
    credential: string
  ): Promise<model.LoginSuccessData | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await authService.loginWithGoogle(credential);
      // response expected: { status, code, data }
      if (response?.status === "success" && response?.data) {
        const payload: any = response.data as any;
        const token = payload.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        let decoded: any = {};
        try {
          decoded = jwtDecode<any>(token);
        } catch {}
        const userObj = {
          email: decoded?.email || decoded?.sub || payload?.email,
          fullName: decoded?.fullName || decoded?.name,
          kycStatus: payload?.kycStatus,
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        setSuccess(true);
        setMessage("Đăng nhập Google thành công!");
        return payload as model.LoginSuccessData;
      } else {
        const errorMessage =
          (response as any)?.data?.message || "Đăng nhập Google thất bại";
        setError(errorMessage);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Lỗi kết nối mạng";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const executeSignUp = async (data: model.SignUpRequest): Promise<model.RegisterResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const response = await authService.signUpApi(data);
      if (response?.status === "success") {
        setSuccess(true);
        setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        return response as model.RegisterResponse;
      } else {
        const errorMessage =
          response?.data?.message || "Đăng ký thất bại";
        setError(errorMessage);
        return response as model.RegisterResponse;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Lỗi kết nối mạng";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setMessage(null);
  };

  return {
    loading,
    error,
    success,
    message,
    executeLogin,
    executeGoogleLogin,
    executeSignUp,
    reset,
  };
};
