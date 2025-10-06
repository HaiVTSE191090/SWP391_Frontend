import React from "react";
import InputField from "../common/InputField";
import AlertMessage from "../common/AlertMessage";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useSignUpController } from "../../controller/useSignUpController";

const SignUpForm: React.FC = () => {
    const {
        phone, displayName, password, confirmPassword,
        setPhone, setdisplayName, setpassword, setconfirmPassword,
        loading, error, message,
        handleLoginWithGoogle, onSubmit
    } = useSignUpController();

    return (
        <div id="signUpForm" className="modal fade">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 shadow-lg">
                    {/* Header */}
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold text-success">Đăng ký tài khoản</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
                            <InputField
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)} />
                            <InputField
                                placeholder="Tên hiển thị"
                                value={displayName}
                                onChange={(e) => setdisplayName(e.target.value)} />
                            <InputField
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)} />
                            <InputField
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setconfirmPassword(e.target.value)} />

                            <button type="submit" className="btn btn-success w-100 mt-2" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Đăng ký"}
                            </button>

                            <GoogleOAuthProvider clientId="255202154765-ff80kah50367qbbmods5oggb4d7j91fu.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={(res: any) => handleLoginWithGoogle(res.credential)}
                                    onError={() => console.log("Login Failed")}
                                />
                            </GoogleOAuthProvider>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 flex-column gap-2"></div>

                    {/* Thông báo */}
                    <AlertMessage type="success" message={message} />
                    <AlertMessage type="danger" message={error} />
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
