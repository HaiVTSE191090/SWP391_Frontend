import React, { useState, useRef, useContext } from "react";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import { FormContext } from "../../context/FormContext";

const OTPVerificationModal: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { switchModal } = useModal();
    const { verifyOTP, sendOTP, loading } = useAuth();
    const formCtx = useContext(FormContext);

    // Clear messages khi component mount - must be before conditional return
    React.useEffect(() => {
        if (formCtx) {
            formCtx.clearMessages();
        }
    }, [formCtx]);

    if (!formCtx) return null;
    const { formData, resetForm, error, setError } = formCtx;
    

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
        setError(null);

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
                setError(null);
            } else if (index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
                setError(null);
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
            setError("Vui lòng paste mã OTP gồm 6 chữ số");
            return;
        }

        const newOtp = pastedData.split("");
        setOtp(newOtp);
        setError(null);
        
        inputRefs.current[5]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const otpCode = otp.join("");
        
        if (otpCode.length !== 6) {
            setError("Vui lòng nhập đầy đủ 6 chữ số");
            return;
        }

        try {
            const email = formData?.email;
            const ok = await verifyOTP(email, otpCode);

            if (!ok) {
                setError("Mã OTP không chính xác hoặc đã hết hạn");
                return;
            }

            alert("Xác thực OTP thành công! Vui lòng đăng nhập để tiếp tục.");
            
            // Mở modal đăng nhập
            setTimeout(() => {
                switchModal("otpVerificationModal", "loginForm");
                resetForm();
            }, 1000);
            
        } catch (err) {
            setError("Có lỗi xảy ra. Vui lòng thử lại");
        }
    };

    const handleResendOTP = async () => {
        setError(null);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        
        try {
            const email = formData?.email;
            console.log("Resending OTP to email:", email);
            await sendOTP(email);
            alert("Đã gửi lại mã OTP về email của bạn");
        } catch (err) {
            setError("Không thể gửi lại mã OTP. Vui lòng thử lại");
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

                            {error && (
                                <div className="alert alert-danger text-center" role="alert">
                                    {error}
                                </div>
                            )}

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