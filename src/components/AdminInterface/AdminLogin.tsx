import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "./services/authServicesForAdmin";
import { toast } from "react-toastify"; // ✅ Thêm dòng này

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        setLoading(true);

        try {
            // ✅ Hiển thị toast loading
            const loadingToast = toast.loading("Đang đăng nhập...");

            const res = await adminLogin(email, password);

            if (res.success === false) {
                toast.update(loadingToast, {
                    render: res.err,
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
                setError(res.err);
                return;
            }

            // ✅ Khi thành công
            toast.update(loadingToast, {
                render: "🎉 Đăng nhập thành công!",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            setTimeout(() => navigate("/admin"), 1200);
        } catch (err: any) {
            console.error("Lỗi đăng nhập:", err);
            toast.error(err.err || "Lỗi không xác định!", {
                position: "top-center",
            });
            setError(err.err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="staff-login-main py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <h3 className="card-title text-center mb-3 text-primary">
                                    Admin Login
                                </h3>

                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}

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
                                        <div>
                                            <input type="checkbox" id="remember" />{" "}
                                            <label htmlFor="remember">Ghi nhớ</label>
                                        </div>
                                        <button
                                            type="button"
                                            className="small btn btn-link p-0 text-decoration-none"
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                                    </button>

                                    <div className="text-center mt-3 small text-muted">
                                        Chỉ dành cho Admin.
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;
