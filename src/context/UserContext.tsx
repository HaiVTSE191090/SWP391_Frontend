import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import * as model from "../models/AuthModel";
import { jwtDecode } from "jwt-decode";


interface UserContextType {
    user: any | null;
    token: string | null;
    login: (data: model.LoginRequest) => Promise<void>
    logout: () => void,
    loginWithGoogle: (credential: string) => Promise<{success: boolean, message: string}>;
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


    // Lấy token từ localStorage khi load lại trang
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const login = async (data: model.LoginRequest) => {
        try {
            const res: model.LoginResponse = await authService.loginApi(data);
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
                
                // Trigger event để các hook khác biết user đã login
                window.dispatchEvent(new Event('userLogin'));
            } else {
                throw new Error("Đăng nhập thất bại");
            }

        } catch (error) {
            console.error(error);
            throw error; // Re-throw để LoginForm có thể xử lý
        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Trigger event để các hook khác biết user đã logout
        window.dispatchEvent(new Event('userLogout'));
    }

    const setUserData = (response: model.LoginSuccessData) => {
        setToken(response.token);

        let decoded: any = {};
        try {
            decoded = jwtDecode<any>(response.token);
        } catch {}

        const userObj = {
            email: decoded?.email || decoded?.sub || response.email,
            fullName: decoded?.fullName || decoded?.name,
            kycStatus: response.kycStatus
        };

        setUser(userObj);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userObj));
    }

    const loginWithGoogle = async (credential: string) => {
        try {
            const res: model.LoginResponse = await authService.loginWithGoogle(credential);
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
                
                // Trigger event để các hook khác biết user đã login
                window.dispatchEvent(new Event('userLogin'));
                
                return { success: true, message: "Đăng nhập Google thành công!" };
            } else {
                throw new Error("Đăng nhập Google thất bại");
            }
        } catch (error: any) {
            console.error("Google login error:", error);
            return { 
                success: false, 
                message: error.message || "Đăng nhập Google thất bại!" 
            };
        }
    }
    

    const value = useMemo(() => ({ user, token, login, logout, loginWithGoogle, setUserData }), [login, token, user])
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>


} 