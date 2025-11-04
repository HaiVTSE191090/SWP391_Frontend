import { useLocation, Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import AdminLayout from "./Admin";

const RequireAdminAuth = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();
    
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            console.log(decoded)
            const adminRole = decoded.role;

            return (
                adminRole === "ADMIN" ? <AdminLayout /> : <Navigate to={"/"} state={{ from: location }} replace />
            )
        } catch (error: any) {
            console.warn("RequireAdminAuth err", error)
        }
    }

    return (
        <Navigate to={"/admin/login"} state={{ from: location }} replace />
    );
}

export default RequireAdminAuth