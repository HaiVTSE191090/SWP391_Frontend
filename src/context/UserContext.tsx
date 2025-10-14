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
    login: (data: model.LoginRequest) => Promise<boolean>;
    loginWithGoogle: (credential: string) => Promise<boolean>;
    signUp: (data: model.SignUpRequest) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    setUserData: (response: model.LoginSuccessData) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

//create provider

interface UserProviderProps {
    children: ReactNode
};

export const UserProvider = ({ children } : UserProviderProps) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

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
        try {
            const res: model.LoginResponse = await authService.loginApi(data);
            if (res.status === "success") {
                const successData = res.data as model.LoginSuccessData;
                setToken(successData.token);

                let decoded: any = {};
                try {
                    decoded = jwtDecode<any>(successData.token);
                } catch {}

                const userObj = {
                    email: decoded?.email || decoded?.sub || successData.email,
                    fullName: decoded?.fullName || decoded?.name,
                    kycStatus: successData.kycStatus
                };

                setUser(userObj);
                localStorage.setItem("token", successData.token);
                localStorage.setItem("user", JSON.stringify(userObj));
                setMessage("Đăng nhập thành công!");
                return true;
            } else {
                const msg = (res as any)?.data?.password ||(res as any)?.data?.email|| (res as any)?.data|| "Đăng nhập thất bại";
                setError(msg);
                return false;
            }
        } catch (err: any) {
            console.log(err);
            const msg = err?.response?.data?.message || err?.message || "Đăng nhập thất bại";
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    }

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
        } catch(err: any) {
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
            } catch {}

            const email = decodedGoogle?.email || decodedGoogle?.sub || undefined;
            const fullName = decodedGoogle?.name || decodedGoogle?.fullName || undefined;
            const phoneNumber = "";

            const res: model.LoginResponse = await authService.loginWithGoogle({
                token: credential,
                email,
                fullName,
                phoneNumber
            });
            if (res.status === "success") {
                const successData = res.data as model.LoginSuccessData;
                const newToken = successData.token;
                setToken(newToken);

                let decoded: any = {};
                try {
                    decoded = jwtDecode<any>(newToken);
                } catch {}

                const userObj = {
                    email: decoded?.email || decoded?.sub || successData.email,
                    fullName: decoded?.fullName || decoded?.name,
                    kycStatus: successData.kycStatus
                };

                setUser(userObj);
                localStorage.setItem("token", newToken);
                localStorage.setItem("user", JSON.stringify(userObj));
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

    const signUp = async (data: model.SignUpRequest): Promise<any> => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res: any = await authService.signUpApi(data);
            if (res?.status === "success") {
                setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
                return true;
            }
            const msg = res.data ||res?.data?.email ||res?.data?.password ||res?.data?.confirmPassword|| "Đăng ký thất bại";
            setError(msg);
            return false;
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Đăng ký thất bại";
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const clearError = () => {
        setError(null);
        setMessage(null);
    }
    

    const value = useMemo(() => ({ 
        user, 
        token, 
        loading, 
        error, 
        message, 
        login, 
        loginWithGoogle, 
        signUp,
        logout, 
        clearError,
        setUserData 
    }), [user, token, loading, error, message])
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>


} 