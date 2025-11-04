import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminRequireAuth = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            const role = decoded.role;

            if (role === "ADMIN") {
                return <Outlet />;
            }

            return <Navigate to="/" state={{ from: location }} replace />;
        } catch (error) {
            console.warn("AdminRequire decode error:", error);
        }
    }
    return <Navigate to={"/admin/login"} />

}

export default AdminRequireAuth
