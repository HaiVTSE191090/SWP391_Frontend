import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "./services/authServicesForAdmin";
import StaffLogin from "../components/StaffInterface/StaffLogin";

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading

    const navigate = useNavigate(); // Khởi tạo hook chuyển hướng
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        // Minimal client-side validation
        if (!email.trim() || !password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        setLoading(true); // Bắt đầu loading
        // TODO: wire up real auth (API call)
        try {
            // 1. GỌI API THỰC TẾ
            await adminLogin(email, password);

            // 2. Xử lý thành công và chuyển hướng
            alert("Đăng nhập thành công!");
            navigate("/admin");

        } catch (err: any) {
            // 3. Xử lý lỗi
            setError(err.message || "Lỗi đăng nhập không xác định.");
        } finally {
            // 4. Kết thúc loading
            setLoading(false);
        }
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
                                                <input type="checkbox" id="remember" />{' '}
                                                <label htmlFor="remember">Ghi nhớ</label>
                                            </div>
                                            <a href="#" className="small">Quên mật khẩu?</a>
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100">
                                            Đăng nhập
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


        </>
    );
};

export default AdminLogin;
