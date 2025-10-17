import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { AuthController } from "../controller/AuthController";
import * as model from "../models/AuthModel";

/**
 * UserContext - CHỈ quản lý STATE, không chứa business logic
 * Business logic được xử lý bởi AuthController
 */
interface UserContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  fieldErrors: Record<string, string>;
  login: (data: model.LoginRequest) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  signUp: (data: model.SignUpRequest) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  clearFieldErrors: () => void;
  verifyOTP: (email: string, otpCode: string) => Promise<boolean>;
  sendOTP: (email: string) => Promise<boolean>;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load auth data từ localStorage khi component mount
  useEffect(() => {
    const storedAuth = AuthController.getStoredAuth();
    if (storedAuth) {
      setToken(storedAuth.token);
      setUser(storedAuth.user);
    }
  }, []);

  /**
   * Đăng nhập - Gọi Controller xử lý logic
   */
  const login = async (data: model.LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setFieldErrors({});

    try {
      const result = await AuthController.login(data);

      if (result.success) {
        setToken(result.token!);
        setUser(result.user!);
        setMessage(result.message!);
        AuthController.saveAuthData(result.token!, result.user!);
        return true;
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        if (result.error) {
          setError(result.error);
        }
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đăng nhập bằng Google - Gọi Controller
   */
  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setFieldErrors({});

    try {
      const result = await AuthController.loginWithGoogle(credential);

      if (result.success) {
        setToken(result.token!);
        setUser(result.user!);
        setMessage(result.message!);
        AuthController.saveAuthData(result.token!, result.user!);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đăng ký - Gọi Controller
   */
  const signUp = async (data: model.SignUpRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setFieldErrors({});

    try {
      const result = await AuthController.signUp(data);

      if (result.success) {
        setMessage(result.message!);
        return true;
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        if (result.error) {
          setError(result.error);
        }
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xác thực OTP - Gọi Controller
   */
  const verifyOTP = async (email: string, otpCode: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await AuthController.verifyOTP(email, otpCode);

      if (result.success) {
        setMessage(result.message!);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gửi OTP - Gọi Controller
   */
  const sendOTP = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await AuthController.sendOTP(email);

      if (result.success) {
        setMessage(result.message!);
        return true;
      } else {
        setError(result.error!);
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đăng xuất
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    setMessage(null);
    setError(null);
    setFieldErrors({});
    AuthController.clearAuthData();
  };

  /**
   * Clear error messages
   */
  const clearError = () => {
    setError(null);
    setMessage(null);
    setFieldErrors({});
  };

  /**
   * Clear field errors
   */
  const clearFieldErrors = () => {
    setFieldErrors({});
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      message,
      fieldErrors,
      login,
      loginWithGoogle,
      signUp,
      logout,
      clearError,
      clearFieldErrors,
      verifyOTP,
      sendOTP,
    }),
    [user, token, loading, error, message, fieldErrors]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
