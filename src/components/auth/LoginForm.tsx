import React, { useContext } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { LoginRequest } from "../../models/AuthModel";
import { UserContext } from "../../context/UserContext";
import { FormContext } from "../../context/FormContext";
import { useModal } from "../../hooks/useModal";

const LoginForm: React.FC = () => {
    const { closeModalAndReload } = useModal();

    const userCtx = useContext(UserContext);
    if (!userCtx) return null;
    const { login, loginWithGoogle, loading, error, message, clearError } = userCtx;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const formCtx = useContext(FormContext);
    if (!formCtx) return null;
    const { formData, handleChange, resetForm } = formCtx;

    const createLoginRequest = (): LoginRequest => {
        return {
            email: formData.email || "",
            password: formData.password || "",
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const loginData = createLoginRequest();
        try {
            const ok = await login(loginData);
            if (!ok) {
                console.error("Login failed");
                return
            };
            resetForm();
            closeModalAndReload('loginForm');
        } catch {
            console.error("Login failed due to an unexpected error");
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
                                <label htmlFor="email" className="form-label">
                                    email:
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    className="form-control"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập Email"
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
                                    value={formData.password || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>


                            <div>
                                {message && <div className="alert alert-success">{message}</div>}
                            </div>

                            <div>
                                {error && <div className="alert alert-danger">{error}</div>}
                            </div>




                            <div className="d-grid mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ?
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Đăng nhập"}
                                </button>
                            </div>

                            <div className="d-grid">
                                <GoogleOAuthProvider
                                    clientId={process.env.REACT_APP_CLIENT_ID!}
                                >
                                    <GoogleLogin
                                        onSuccess={async (credentialRes: any) => {
                                            clearError();
                                            try {
                                                const ok = await loginWithGoogle(credentialRes.credential);
                                                if (!ok) {
                                                    console.error("Login with Google failed");
                                                    return;
                                                }
                                                resetForm();
                                                closeModalAndReload('loginForm');
                                            } catch { }
                                        }}
                                        onError={() => {
                                            // surface via context if needed
                                            // no-op to avoid overriding existing errors
                                        }}
                                    />
                                </GoogleOAuthProvider>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
