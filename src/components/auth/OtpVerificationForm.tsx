import React, { useState, useRef } from "react";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { toast } from "react-toastify";
import { getToken } from "../../utils/authHelpers";

const OTPVerificationModal: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { switchModal, closeModal } = useModal();
    const { verifyOTP, sendOTP, loading } = useAuth();
    const { error: formError,
        formData,
        resetForm,
        message: formMessage,
        setError: setFormError,
        setMessage: setFormMessage,
        clearMessages
    } = useForm();


    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        for (let i = 0; i < index; i++) {
            if (!otp[i]) {
                inputRefs.current[i]?.focus();
                return;
            }
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        clearMessages();

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
                clearMessages();
            } else if (index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
                clearMessages();
            }
            e.preventDefault();
        }

        if (e.key !== "Backspace" && e.key !== "Tab") {
            for (let i = 0; i < index; i++) {
                if (!otp[i]) {
                    e.preventDefault();
                    inputRefs.current[i]?.focus();
                    return;
                }
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        // Chỉ chấp nhận 6 số
        if (!/^\d{6}$/.test(pastedData)) {
            // Hiển thị error nhưng không set vào state (không cần thiết cho paste)
            return;
        }

        const newOtp = pastedData.split("");
        setOtp(newOtp);
        clearMessages();

        inputRefs.current[5]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            toast.error("Vui lòng nhập đầy đủ 6 chữ số OTP", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const loadingToast = toast.loading("Đang xác thực OTP...", {
            position: "top-center"
        });

        const result = await verifyOTP(formData.email, otpCode);

        if (result.success) {
            toast.update(loadingToast, {
                render: result.message || "Xác thực OTP thành công!",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            setTimeout(() => {
                // Kiểm tra xem user đã có token chưa
                const token = getToken();
                
                if (token) {
                    closeModal("otpVerificationModal");
                } else {
                    switchModal("otpVerificationModal", "loginForm");
                }
                
                resetForm();
            }, 1000);
        } else {
            toast.update(loadingToast, {
                render: result.error || "Xác thực OTP thất bại",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const handleResendOTP = async () => {
        clearMessages();
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        const email = formData?.email;
        if (!email) {
            toast.error("Không tìm thấy email. Vui lòng đăng ký lại.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }
        
        console.log("Resending OTP to email:", email);
        
        const loadingToast = toast.loading("Đang gửi lại mã OTP...", {
            position: "top-center"
        });
        
        const result = await sendOTP(email);
        
        if (result.success) {
            toast.update(loadingToast, {
                render: "Đã gửi lại mã OTP! Vui lòng kiểm tra email.",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } else {
            toast.update(loadingToast, {
                render: result.error || "Gửi lại OTP thất bại",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    return (
        <div id="otpVerificationModal" className="modal fade" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4 p-4">
                    <div className="modal-header border-0">
                        <h4 className="modal-title fw-bold">
                            Xác thực OTP
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
                        <p className="text-muted text-center mb-4">
                            Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến email của bạn
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-center gap-2 mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="form-control text-center fw-bold fs-4"
                                        style={{
                                            width: "50px",
                                            height: "60px",
                                            fontSize: "24px"
                                        }}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg rounded-3 w-100 mt-3 fw-semibold"
                                disabled={loading || otp.join("").length !== 6}
                            >
                                {loading ? (
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    "Xác nhận"
                                )}
                            </button>

                            <div className="text-center mt-3">
                                <span className="text-muted">Không nhận được mã? </span>
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                >
                                    Gửi lại
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationModal;