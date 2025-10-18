import React, { useContext, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { LoginRequest } from "../../models/AuthModel";
import { useAuth } from "../../hooks/useAuth";
import { FormContext } from "../../context/FormContext";
import { useModal } from "../../hooks/useModal";
import FieldError from "../common/FieldError";

const LoginForm: React.FC = () => {
    const { closeModalAndReload } = useModal();
    const [showPassword, setShowPassword] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    const { 
        login, 
        loginWithGoogle, 
        loading,
        fieldErrors: userFieldErrors,
        message,
        error,
        clearError
    } = useAuth();
    
    const formCtx = useContext(FormContext);
    const { closeModal } = useModal();

    if (!formCtx) {
        console.error("FormContext is not available");
        return null;
    }

    // Lấy form data từ FormContext
    const { 
        formData, 
        handleChange, 
        resetForm
    } = formCtx;

    const createLoginRequest = (): LoginRequest => {
        return {
            email: formData.email || "",
            password: formData.password || "",
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError(); // Clear messages cũ
        
        const loginData = createLoginRequest();
        const result = await login(loginData);
        if (result) {
            setTimeout(() => {
                closeModal('loginForm');
                resetForm();
            }, 2000);
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
                            {showForgot ? "Quên mật khẩu" : "Đăng nhập"}
                        </h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={clearError}
                        ></button>
                    </div>

                    <div className="modal-body">
                        {showForgot ? (
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="forgotEmail" className="form-label">
                                        Nhập email để đặt lại mật khẩu
                                    </label>
                                    <input
                                        id="forgotEmail"
                                        name="forgotEmail"
                                        type="email"
                                        className="form-control"
                                        placeholder="Nhập email của bạn"
                                    />
                                </div>

                                <div className="d-grid">
                                    <button type="button" className="btn btn-primary">
                                        Gửi liên kết đặt lại mật khẩu
                                    </button>
                                </div>

                                <div className="text-center mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-link text-decoration-none"
                                        onClick={() => setShowForgot(false)}
                                    >
                                        ← Quay lại đăng nhập
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        className={`form-control form-control-lg rounded-3 ${userFieldErrors.email ? "is-invalid" : ""
                                            }`}
                                        value={formData.email || ""}
                                        onChange={handleChange}
                                        placeholder="Nhập Email"
                                    />
                                    <FieldError fieldName="email" />
                                </div>

                                <div  className="mb-2 position-relative">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        Mật khẩu
                                    </label>
                                    <div className="input-group input-group-lg">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control ${userFieldErrors.password ? "is-invalid" : ""}`}
                                            value={formData.password || ""}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu"
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Ẩn" : "Hiện"}
                                        </button>
                                    </div>
                                    <FieldError fieldName="password" />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mt-2 mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-link text-decoration-none text-primary fw-semibold p-0"
                                        onClick={() => setShowForgot(true)}
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>

                                {message && <div className="alert alert-success">{message}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}

                                <div className="d-grid mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg rounded-3 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : (
                                            "Đăng nhập"
                                        )}
                                    </button>
                                </div>

                                <div className="d-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span className="px-2 text-muted">hoặc</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <div className="d-grid">
                                    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID!}>
                                        <GoogleLogin
                                            onSuccess={async (credentialRes: any) => {
                                                clearError(); // Clear messages cũ
                                                const result = await loginWithGoogle(credentialRes.credential);
                                                if (result) {
                                                    setTimeout(() => {
                                                        resetForm();
                                                        closeModalAndReload("loginForm");
                                                    }, 1000);
                                                }
                                            }}
                                            onError={() => {
                                                console.log("Google OAuth failed");
                                            }}
                                        />
                                    </GoogleOAuthProvider>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
