import { useLocation, Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode";

const RequireAuth = () => {
    const token = localStorage.getItem("token")
    const location = useLocation();
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            const staffRole = decoded.role;

            return (
                staffRole === "STAFF" ? <Outlet /> : <Navigate to={"/"} state={{ from: location }} replace />
            )
        } catch (error: any) {
            console.warn("RequireAuth err")
        }
    }

    return (
        <Navigate to={"/staff/login"} />
    );
}

export default RequireAuth
