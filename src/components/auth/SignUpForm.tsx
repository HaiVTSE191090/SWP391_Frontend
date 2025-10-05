import React, { use, useState } from "react";
import { SignUpRequest } from "../../models/SignUpRequest";
import InputField from "../common/InputField";
import AlertMessage from "../common/AlertMessage";
import signUpApi from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";



const SignUpForm: React.FC = () => {

    const [phone, setPhone] = useState("");
    const [displayName, setdisplayName] = useState("");
    const [password, setpassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");





    const onSubmit = async (e: React.FormEvent) => {
        const form: SignUpRequest = { phone, displayName, password, confirmPassword };
        const result = await signUpApi(form);
        if (result.error) {
            setError(result.message);
            setMessage("");
        } else {
            setMessage(result.message);
            setError("");
        }


    };

    return (
        <div
            id="signUpForm"
            className="modal fade"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 shadow-lg">
                    {/* Header */}
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold text-success">
                            Đăng ký tài khoản
                        </h5>
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
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <InputField
                                placeholder="Tên hiển thị"
                                value={displayName}
                                onChange={(e) => setdisplayName(e.target.value)}
                            />
                            <InputField
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                            <InputField
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setconfirmPassword(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="btn btn-success w-100 mt-2"
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Đăng ký"}
                            </button>

                            {/* Hiển thị thông báo */}
                            <AlertMessage type="success" message={message} />
                            <AlertMessage type="danger" message={error} />
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 flex-column gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-danger w-100"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đăng ký bằng Google"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default SignUpForm;
