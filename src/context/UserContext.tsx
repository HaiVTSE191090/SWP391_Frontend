import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { authController } from "../controller/AuthController";
import * as model from "../models/AuthModel";

/**
 * Interface cho UserContext - CHỈ quản lý auth logic & user state
 * KHÔNG quản lý error/message - để forms tự xử lý qua FormContext
 */
export interface UserContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  
  login: (data: model.LoginRequest) => Promise<AuthResult>;
  loginWithGoogle: (credential: string) => Promise<AuthResult>;
  signUp: (data: model.SignUpRequest) => Promise<AuthResult>;
  verifyOTP: (email: string, otpCode: string) => Promise<AuthResult>;
  sendOTP: (email: string) => Promise<AuthResult>;
  logout: () => void;
}

/**
 * Result type cho auth operations
 */
export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load auth data từ localStorage khi component mount
  useEffect(() => {
    const storedAuth = authController.getStoredAuth();
    if (storedAuth) {
      setToken(storedAuth.token);
      setUser(storedAuth.user);
    }
  }, []);

  /**
   * Login - CHỈ xử lý logic, return result cho form tự xử lý
   */
  const login = async (data: model.LoginRequest): Promise<AuthResult> => {
    setLoading(true);

    try {
      const result = await authController.login(data);

      if (result.success) {
        setToken(result.token!);
        setUser(result.user!);
        authController.saveAuthData(result.token!, result.user!);
        
        return {
          success: true,
          message: result.message || "Đăng nhập thành công!",
        };
      } else {
        return {
          success: false,
          error: result.error,
          fieldErrors: result.fieldErrors,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: "Có lỗi xảy ra, vui lòng thử lại",
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<AuthResult> => {
    setLoading(true);

    try {
      const result = await authController.loginWithGoogle(credential);

      if (result.success) {
        setToken(result.token!);
        setUser(result.user!);
        authController.saveAuthData(result.token!, result.user!);
        
        return {
          success: true,
          message: result.message || "Đăng nhập Google thành công!",
        };
      } else {
        return {
          success: false,
          error: result.error || "Đăng nhập Google thất bại",
        };
      }
    } catch (err) {
      return {
        success: false,
        error: "Có lỗi xảy ra, vui lòng thử lại",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign Up - CHỈ xử lý logic, return result
   */
  const signUp = async (data: model.SignUpRequest): Promise<AuthResult> => {
    setLoading(true);

    try {
      const result = await authController.signUp(data);

      if (result.success) {
        return {
          success: true,
          message: result.message || "Đăng ký thành công!",
        };
      } else {
        return {
          success: false,
          error: result.error,
          fieldErrors: result.fieldErrors,
        };
      }
    } catch (err) {
      console.error("Sign Up error:", err);
      return {
        success: false,
        error: "Có lỗi xảy ra, vui lòng thử lại",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP - CHỈ xử lý logic, return result
   */
  const verifyOTP = async (email: string, otpCode: string): Promise<AuthResult> => {
    setLoading(true);

    try {
      const result = await authController.verifyOTP(email, otpCode);

      if (result.success) {
        return {
          success: true,
          message: result.message || "Xác thực OTP thành công!",
        };
      } else {
        return {
          success: false,
          error: "Xác thực OTP thất bại",
        };
      }
    } catch (err) {
      return {
        success: false,
        error: "Có lỗi xảy ra, vui lòng thử lại",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send OTP - CHỈ xử lý logic, return result
   */
  const sendOTP = async (email: string): Promise<AuthResult> => {
    setLoading(true);

    try {
      const result = await authController.sendOTP(email);

      if (result.success) {
        return {
          success: true,
          message: result.message || "Gửi OTP thành công!",
        };
      } else {
        return {
          success: false,
          error: result.error || "Gửi OTP thất bại",
        };
      }
    } catch (err) {
      return {
        success: false,
        error: "Có lỗi xảy ra, vui lòng thử lại",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout - CHỈ clear auth state
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    authController.clearAuthData();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      loginWithGoogle,
      signUp,
      logout,
      verifyOTP,
      sendOTP,
    }),
    [user, token, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
