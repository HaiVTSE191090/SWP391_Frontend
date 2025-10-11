import React, { useState, useContext } from "react";
import InputField from "../common/InputField";
import { useModal } from "../../hooks/useModal";
import { FormContext } from "../../context/FormContext";
import { useAuth } from "../../hooks/useAuth";
import { validateSignUp } from "../../utils/validators";
import { SignUpRequest } from "../../models/AuthModel";

const SignUpForm: React.FC = () => {
    const { loading, error, message, executeSignUp, reset } = useAuth();
    const [clientError, setClientError] = useState<string | null>(null);
    const { closeModalAndReload } = useModal();

    const formCtx = useContext(FormContext);
    if (!formCtx) return null;
    const { formData, handleChange, resetForm, fieldErrors, setFieldErrors, clearErrors } = formCtx;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);
        reset();
        clearErrors();

        const { fieldErrors: errs } = validateSignUp(formData);
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            return;
        }

        const payload: SignUpRequest = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
        };

        try {
            const res = await executeSignUp(payload);

            if (res && res.status === "success") {
                resetForm();
                closeModalAndReload("signUpForm");
            } else {
                const data = res?.data;
                if (typeof data === "string") {
                    setClientError(data);
                } else if (data && typeof data === "object") {
                    const fieldErrs = data as Record<string, string>;
                    setFieldErrors(fieldErrs);
                    const summary = Object.values(fieldErrs).filter(Boolean).join(", ");
                    if (summary) setClientError(summary);
                } else {
                    setClientError("Đăng ký thất bại, vui lòng thử lại.");
                }
            }
        } catch (err) {
            console.error("Signup error:", err);
            setClientError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
        }
    };

    return (
        <div id="signUpForm" className="modal fade">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 shadow-lg">

                    {/* Header */}
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold text-primary">Đăng ký tài khoản</h5>
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
                                name="fullName"
                                placeholder="Họ và tên *"
                                value={formData.fullName || ""}
                                onChange={handleChange}
                                error={fieldErrors.fullName}
                                required
                            />

                            <InputField
                                name="email"
                                type="email"
                                placeholder="Email *"
                                value={formData.email || ""}
                                onChange={handleChange}
                                error={fieldErrors.email}
                                required
                            />

                            <InputField
                                name="phoneNumber"
                                placeholder="Số điện thoại *"
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                error={fieldErrors.phoneNumber}
                                required
                            />

                            <InputField
                                name="password"
                                type="password"
                                placeholder="Mật khẩu *"
                                value={formData.password || ""}
                                onChange={handleChange}
                                error={fieldErrors.password}
                                required
                            />

                            <InputField
                                name="confirmPassword"
                                type="password"
                                placeholder="Xác nhận mật khẩu *"
                                value={formData.confirmPassword || ""}
                                onChange={handleChange}
                                error={fieldErrors.confirmPassword}
                                required
                            />
                            
                            <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    "Đăng ký"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 flex-column gap-2">
                        {message && <div className="alert alert-success w-100">{message}</div>}
                        {(clientError || error) && (
                            <div className="alert alert-danger w-100">{clientError || error}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
