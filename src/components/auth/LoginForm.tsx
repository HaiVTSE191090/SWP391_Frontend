import React, { useState } from "react";
import { LoginRequest } from "../../models/AuthModel";
import { loginApi } from "../../services/authService";

const LoginForm: React.FC = () => {
    const [form, setForm] = useState<LoginRequest>({
        phone: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const result = await loginApi(form);

            if (result.status === "success" || result.code === 200) {
                setMessage("Đăng nhập thành công!");
            } else {
                setError(result.message || "Sai tài khoản hoặc mật khẩu");
            }
        } catch (err: any) {
            setError("Lỗi kết nối máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal fade"
            id="loginForm"
            tabIndex={-1}
            aria-labelledby="loginFormLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4">
                    <div className="modal-header border-0">
                        <h4 className="fw-bold mb-0" id="loginFormLabel">
                            Đăng nhập
                        </h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">
                                    Số điện thoại
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    className="form-control"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Mật khẩu
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}

                            <div className="d-grid mb-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </button>
                            </div>

                            <div className="d-grid">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "Đăng nhập bằng Google"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer border-0"></div>
                </div>
            </div>
        </div>

    );
};

export default LoginForm;
