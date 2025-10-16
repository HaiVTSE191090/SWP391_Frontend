import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import * as model from "../models/AuthModel";
import { jwtDecode } from "jwt-decode";


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
}

export const UserContext = createContext<UserContextType | null>(null);

//create provider

interface UserProviderProps {
    children: ReactNode
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const getToken = localStorage.getItem("token");
        const getUser = localStorage.getItem("user");
        if (getToken && getUser) {
            setToken(getToken);
            try {
                const parsed = JSON.parse(getUser);
                setUser(parsed);
            } catch {
                setUser(null);
            }
        }
    }, []);

    const login = async (data: model.LoginRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setMessage(null);
        setFieldErrors({});

        try {
            const res = await authService.loginApi(data);
            const successData = res.data;
            const token = successData.data.token;

            setToken(token);
            setMessage("Đăng nhập thành công!");
            localStorage.setItem("token", token);
            const userRes = await authService.getProfile(successData.data.token);

            const userObj = {
                email: successData.data.email,
                fullName: userRes.data.data.fullName,
                kycStatus: successData.data.kycStatus,
                renterId: userRes.data.data.renterId,
                status: userRes.data.data.status
            };

            setUser(userObj);
            localStorage.setItem("user", JSON.stringify(userObj));
            window.dispatchEvent(new Event('userLogin'));

            return true;

        } catch (err: any) {
            const errorData = err?.response?.data;
            if (errorData?.data && typeof errorData.data === 'object') {
                setFieldErrors(errorData.data);
                setError(null);
            } else {
                const errorMessage = errorData?.data || "Đăng nhập thất bại, vui lòng thử lại.";
                setError(errorMessage);
                setFieldErrors({});
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {

        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMessage(null);
        setError(null);
    }

    const setUserData = (response: model.LoginSuccessData) => {
        setToken(response.token);

        let decoded: any = {};
        try {
            decoded = jwtDecode<any>(response.token);
        } catch (err: any) {
            console.log("JWT Decode error:", err?.message || err);
        }

        const userObj = {
            email: decoded?.email || decoded?.sub || response.email,
            fullName: decoded?.fullName || decoded?.name,
            kycStatus: response.kycStatus
        };

        setUser(userObj);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userObj));
    }

    const loginWithGoogle = async (credential: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            let decodedGoogle: any = {};
            try {
                decodedGoogle = jwtDecode<any>(credential);
            } catch { }

            const email = decodedGoogle?.email || decodedGoogle?.sub || undefined;
            const fullName = decodedGoogle?.name || decodedGoogle?.fullName || undefined;

            // Gửi lên backend giống như login thường
            const res = await authService.loginWithGoogle({
                token: credential,
                email,
                fullName,
                phoneNumber: "" // truyền phone từ form
            });


            if (res.status === 200) {
                const successData = res.data as model.LoginSuccessData;
                const newToken = successData.token;
                setToken(newToken);

                let decoded: any = {};
                try {
                    decoded = jwtDecode<any>(newToken);
                } catch { }

                const userObj = {
                    email: decoded?.email || decoded?.sub || successData.email,
                    fullName: decoded?.fullName || decoded?.name,
                    kycStatus: successData.kycStatus
                };

                setUser(userObj);
                localStorage.setItem("token", newToken);
                localStorage.setItem("user", JSON.stringify(userObj));
                window.dispatchEvent(new Event('userLogin'));
                setMessage("Đăng nhập Google thành công!");
                return true;
            } else {
                const msg = (res as any)?.data?.message || "Đăng nhập Google thất bại";
                setError(msg);
                return false;
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Đăng nhập Google thất bại";
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const signUp = async (data: model.SignUpRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setMessage(null);
        setFieldErrors({});
        try {
            const res = await authService.signUpApi(data);
            if (res.status === 201) {
                setMessage("Đăng ký thành công! Vui lòng đăng nhập.");

                return true;
            } else {
                const errorData = res?.data;
                if (errorData?.data && typeof errorData.data === 'object') {
                    setFieldErrors(errorData.data);
                    setError(null);
                } else {
                    const errorMessage = errorData?.message || "Đăng ký thất bại";
                    setError(errorMessage);
                    setFieldErrors({});
                }
                return false;
            }
        } catch (err: any) {
            const errorData = err?.response?.data || err?.data;
            if (errorData?.data && typeof errorData.data === 'object') {
                setFieldErrors(errorData.data);
                setError(null);
            } else {
                const errorMessage = errorData?.data || err?.message || "Đăng ký thất bại";
                setError(errorMessage);
                setFieldErrors({});
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
        setMessage(null);
        setFieldErrors({});
    }

    const clearFieldErrors = () => {
        setFieldErrors({});
    }


    const value = useMemo(() => ({
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
        setUserData,
    }), [user, token, loading, error, message, fieldErrors])
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>


} 