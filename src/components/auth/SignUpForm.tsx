import React, { useState, useContext } from "react";
import InputField from "../common/InputField";
import { useModal } from "../../hooks/useModal";
import { FormContext } from "../../context/FormContext";
import { validateSignUp } from "../../utils/validators";
import { SignUpRequest } from "../../models/AuthModel";
import { UserContext } from "../../context/UserContext";
import FieldError from "../common/FieldError";

const SignUpForm: React.FC = () => {
    const [clientError, setClientError] = useState<string | null>(null);
    const { closeModalAndReload } = useModal();
    const formCtx = useContext(FormContext);
    const userCtx = useContext(UserContext);


    if (!userCtx) return null;
    const { signUp, loading, error, message, clearError, fieldErrors: userFieldErrors } = userCtx;

    if (!formCtx) return null;
    const { formData, handleChange, resetForm, fieldErrors, setFieldErrors, clearErrors } = formCtx;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);
        clearError();
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
            confirmPassword: formData.confirmPassword,
        };

        try {
            const ok = await signUp(payload);
            if (!ok) return;
            resetForm();
            closeModalAndReload("signUpForm");
        } catch { }
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
                                error={fieldErrors.fullName || userFieldErrors.fullName}
                                required
                            />
                            <FieldError fieldName="fullName" />

                            <InputField
                                name="email"
                                type="email"
                                placeholder="Email *"
                                value={formData.email || ""}
                                onChange={handleChange}
                                error={fieldErrors.email || userFieldErrors.email}
                                required
                            />
                            <FieldError fieldName="email" />

                            <InputField
                                name="phoneNumber"
                                placeholder="Số điện thoại *"
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                error={fieldErrors.phoneNumber || userFieldErrors.phoneNumber}
                                required
                            />
                            <FieldError fieldName="phoneNumber" />

                            <InputField
                                name="password"
                                type="password"
                                placeholder="Mật khẩu *"
                                value={formData.password || ""}
                                onChange={handleChange}
                                error={fieldErrors.password || userFieldErrors.password}
                                required
                            />
                            <FieldError fieldName="password" />

                            <InputField
                                name="confirmPassword"
                                type="password"
                                placeholder="Xác nhận mật khẩu *"
                                value={formData.confirmPassword || ""}
                                onChange={handleChange}
                                error={fieldErrors.confirmPassword || userFieldErrors.confirmPassword}
                                required
                            />
                            <FieldError fieldName="confirmPassword" />

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
