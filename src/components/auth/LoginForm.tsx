import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useLoginController } from "../../controller/useLoginController";

const LoginForm: React.FC = () => {
    const {
        form,
        loading,
        error,
        message,
        handleChange,
        handleSubmit,
        handleLoginWithGoogle,
    } = useLoginController();

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

                            <div className="d-grid mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </button>
                            </div>

                            <div className="d-grid">
                                <GoogleOAuthProvider clientId="255202154765-ff80kah50367qbbmods5oggb4d7j91fu.apps.googleusercontent.com">
                                    <GoogleLogin
                                        onSuccess={(credentialRes: any) => {
                                            handleLoginWithGoogle(credentialRes.credential);
                                        }}
                                        onError={() => console.log("Login Failed")}
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
