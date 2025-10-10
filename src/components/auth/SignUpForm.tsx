import React, { useState } from "react";
import InputField from "../common/InputField";
import AlertMessage from "../common/AlertMessage";
import * as authService from "../../services/authService";
import { useModal } from "../../hooks/useModal";

const SignUpForm: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    
    const { closeModal } = useModal();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            const payload = { fullName, email, password, phoneNumber };
            const res = await authService.signUpApi(payload);

            if (res.status === "success") {
                setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
                setFullName("");
                setEmail("");
                setPhoneNumber("");
                setPassword("");
                setConfirmPassword("");
                
                // Đóng modal sau 2 giây để user đọc thông báo
                setTimeout(() => {
                    closeModal('signUpForm');
                }, 2000);
            } else {
                const data = res.data as any;
                let errorMsg = "";
                if (typeof data === "string") {
                    errorMsg = data;
                } else if (data && typeof data === "object") {
                    // Gộp các lỗi validation
                    errorMsg = Object.values<string>(data).filter(Boolean).join(", ");
                } else {
                    errorMsg = "Đăng ký thất bại";
                }
                setError(errorMsg);
            }
        } catch (err) {
            setError("Lỗi kết nối mạng");
        } finally {
            setLoading(false);
        }
    };

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
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <InputField
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} />
                            <InputField
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                            <InputField
                                placeholder="Số điện thoại"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)} />
                            <InputField
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <InputField
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />

                            <button type="submit" className="btn btn-success w-100 mt-2" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Đăng ký"}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 flex-column gap-2"></div>

                    {/* Thông báo */}
                    <AlertMessage type="success" message={message || ""} />
                    <AlertMessage type="danger" message={error || ""} />
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
