import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import * as model from "../models/AuthModel";


interface UserContextType {
    user: any | null;
    token: string | null;
    login: (phone: number, password: string) => Promise<void>
    logout: () => void,

}

export const UserContext = createContext<UserContextType | null>(null);

//create provider

interface UserProviderProps {
    children: ReactNode
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<any | null>(null);


    // Lấy token từ localStorage khi load lại trang
    useEffect(() => {
        const getToken = localStorage.getItem("token");
        const getUser = localStorage.getItem("user");
        if (getToken && getUser) {
            setToken(getToken);
            setUser(getUser);
        }
    }, []);

    const login = async (phone: number, password: string) => {
        try {
            const res: model.LoginResponse = await authService.loginApi({ phone, password });
            if (res.code === 200 && res.token && res.user) {
                setToken(res.token);
                setUser(JSON.parse(res.user));
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user))
            } else {
                throw new Error(res.message || "Đăng nhập thất bại");
            }

        } catch (error) {
            console.error(error);

        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    const value = useMemo(() => ({ user, token, login, logout }), [token, user])
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>


} 
