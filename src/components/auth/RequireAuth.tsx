import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { jwtDecode } from "jwt-decode";

const RequireAuth = () => {
    const { token } = useAuth();
    const location = useLocation();
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            console.log(decoded)
            const staffRole = decoded.role;

            return (
                staffRole === "STAFF" ? <Outlet /> : <Navigate to={"/staff/login"} state={{ from: location }} replace />
            )
        } catch (error: any) {
            console.warn("RequireAuth err")
        }
    }

    return (
        <Navigate to={"/"} />
    );
}

export default RequireAuth
