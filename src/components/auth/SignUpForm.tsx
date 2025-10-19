import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import InputField from "../common/InputField";
import { useModal } from "../../hooks/useModal";
import { useForm } from "../../hooks/useForm";
import { validateSignUp } from "../../utils/validators";
import { SignUpRequest } from "../../models/AuthModel";
import { useAuth } from "../../hooks/useAuth";
import FieldError from "../common/FieldError";

const SignUpForm: React.FC = () => {
    const { switchModal, closeModal } = useModal();
    const { signUp, loginWithGoogle, sendOTP, loading } = useAuth();

    const { formData,
        handleChange,
        resetForm,
        error: formError,
        message: formMessage,
        fieldErrors: formFieldErrors,
        setError: setFormError,
        setMessage: setFormMessage,
        setFieldErrors: setFormFieldErrors,
        clearMessages } = useForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();

        const { fieldErrors: errs } = validateSignUp(formData);
        if (Object.keys(errs).length > 0) {
            setFormFieldErrors(errs);
            return;
        }

        const payload: SignUpRequest = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            confirmPassword: formData.confirmPassword,
        };

        const result = await signUp(payload);
        if (result.success) {
            
            // Send OTP
            const otpResult = await sendOTP(formData.email);
            if (otpResult.success) {
                setFormMessage(result.message || "Đăng ký thành công!");
                setTimeout(() => {
                    switchModal("signUpForm", "otpVerificationModal");
                    clearMessages();
                }, 500);
            } else {
                setFormError(otpResult.error || "Gửi OTP thất bại");
            }
        } else {
            if (result.error) setFormError(result.error);
            if (result.fieldErrors) setFormFieldErrors(result.fieldErrors);
        }
    };

    return (
        <div id="signUpForm" className="modal fade" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4 p-4">
                    <div className="modal-header border-0">
                        <h4 className="modal-title fw-bold" id="signUpFormLabel">
                            Đăng ký
                        </h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={clearMessages}
                        ></button>
                    </div>

                    <div className="modal-body">


                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <InputField
                                name="fullName"
                                placeholder="Họ và tên *"
                                value={formData.fullName || ""}
                                onChange={handleChange}
                                error={formFieldErrors.fullName}
                                required
                            />
                            <FieldError fieldName="fullName" />

                            <InputField
                                name="email"
                                type="email"
                                placeholder="Email *"
                                value={formData.email || ""}
                                onChange={handleChange}
                                error={formFieldErrors.email}
                                required
                            />
                            <FieldError fieldName="email" />

                            <InputField
                                name="phoneNumber"
                                placeholder="Số điện thoại *"
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                error={formFieldErrors.phoneNumber}
                                required
                            />
                            <FieldError fieldName="phoneNumber" />

                            <InputField
                                name="password"
                                type="password"
                                placeholder="Mật khẩu *"
                                value={formData.password || ""}
                                onChange={handleChange}
                                error={formFieldErrors.password}
                                required
                            />
                            <FieldError fieldName="password" />

                            <InputField
                                name="confirmPassword"
                                type="password"
                                placeholder="Xác nhận mật khẩu *"
                                value={formData.confirmPassword || ""}
                                onChange={handleChange}
                                error={formFieldErrors.confirmPassword}
                                required
                            />
                            <FieldError fieldName="confirmPassword" />

                            {formMessage && (
                                <div className="alert alert-success">
                                    <i className="bi bi-check-circle me-2"></i>
                                    {formMessage}
                                </div>
                            )}
                            {formError && (
                                <div className="alert alert-danger">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {formError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg rounded-3 w-100 mt-2 fw-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    "Đăng ký"
                                )}
                            </button>

                            <div className="d-flex align-items-center my-2">
                                <hr className="flex-grow-1" />
                                <span className="px-2 text-muted">hoặc</span>
                                <hr className="flex-grow-1" />
                            </div>

                            <div className="d-grid">
                                <GoogleOAuthProvider
                                    clientId={process.env.REACT_APP_CLIENT_ID!}
                                >
                                    <GoogleLogin
                                        onSuccess={async (credentialRes: any) => {
                                            const ok = await loginWithGoogle(credentialRes.credential);
                                            if (ok) {
                                                resetForm();
                                                closeModal("signUpForm");
                                            }
                                        }}
                                        onError={() => {
                                            console.log("Google Login Failed");
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

export default SignUpForm;
