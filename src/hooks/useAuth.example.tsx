// Ví dụ sử dụng useAuth hook trong component khác
import React from 'react';
import { useAuth } from './useAuth';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

const ExampleComponent: React.FC = () => {
    const { loading, error, message, executeLogin, executeGoogleLogin } = useAuth();
    
    const userCtx = useContext(UserContext);
    if (!userCtx) return null;
    const { setUserData } = userCtx;

    const handleLogin = async () => {
        try {
            const response = await executeLogin({
                email: "user@example.com",
                password: "password123"
            });
            
            if (response) {
                setUserData(response);
                console.log("Login thành công!");
            }
        } catch (err) {
            console.error("Login thất bại:", err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await executeGoogleLogin("google_credential_token");
            
            if (response) {
                setUserData(response);
                console.log("Google Login thành công!");
            }
        } catch (err) {
            console.error("Google Login thất bại:", err);
        }
    };

    return (
        <div>
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            
            <button onClick={handleGoogleLogin} disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập Google"}
            </button>
            
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
        </div>
    );
};

export default ExampleComponent;
