import React, { useEffect, useState } from "react";
import "./StaffLogin.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";


const StaffLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const {loginStaff} = useAuth();

    useEffect(() => {
        const savedEmail = localStorage.getItem('staffRememberedEmail');
        const savedPassword = localStorage.getItem('staffRememberedPassword');
        
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Vui lòng nhập đầy đủ thông tin.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const loadingToast = toast.loading("Đang đăng nhập...", {
            position: "top-center"
        });

        const res = await loginStaff(email, password);
        
        if (!res.success) {
            toast.update(loadingToast, {
                render: res.error,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            return;
        }

        if (rememberMe) {
            localStorage.setItem('staffRememberedEmail', email);
            localStorage.setItem('staffRememberedPassword', password);
        } else {
            localStorage.removeItem('staffRememberedEmail');
            localStorage.removeItem('staffRememberedPassword');
        }

        toast.update(loadingToast, {
            render: "Đăng nhập thành công!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
        });

        setTimeout(() => {
            navigate("/staff");
        }, 1000);
    };

    return (
        <>
            <main className="staff-login-main py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-center mb-3">Staff Login</h3>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Nhập email"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Mật khẩu"
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input"
                                                    id="remember"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="remember">
                                                    Ghi nhớ đăng nhập
                                                </label>
                                            </div>
                                            <a href="#" className="small text-decoration-none">Quên mật khẩu?</a>
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100">
                                            Đăng nhập
                                        </button>

                                        <div className="text-center mt-3 small text-muted">
                                            Chỉ dành cho nhân viên. Vui lòng liên hệ quản trị nếu cần truy cập.
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default StaffLogin;
