import React from 'react'
import { forgotPassword, resetPassword } from '../../hooks/useAuth';
import { toast } from 'react-toastify';


type ForgotPasswordFormProps = {
    onBack: () => void;
};

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
    const [step, setStep] = React.useState<'email' | 'reset'>('email');
    const [email, setEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Vui lòng nhập email", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Đang gửi email đặt lại mật khẩu...", {
            position: "top-center"
        });

        try {
            const response = await forgotPassword(email);

            if (response.status === "success") {
                toast.update(loadingToast, {
                    render: response.data || "Đã gửi OTP! Vui lòng kiểm tra email.",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
                setTimeout(() => {
                    setStep('reset');
                    setLoading(false);
                }, 500);
            } else {
                toast.update(loadingToast, {
                    render: response.data,
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
                setLoading(false);
            }
        } catch (err: any) {
            console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", err);
            toast.update(loadingToast, {
                render: err.response?.data?.message,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            setLoading(false);
            setTimeout(() => {
                onBack();
            }, 1000);
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Đang đặt lại mật khẩu...", {
            position: "top-center"
        });

        try {
            const response = await resetPassword(email, otp, newPassword, confirmPassword);
            if (response.status === "success") {
                toast.update(loadingToast, {
                    render: response.data,
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });

                setTimeout(() => {
                    setLoading(false);
                    onBack(); 
                }, 2000);
            } else {
                toast.update(loadingToast, {
                    render: response.data || response.data.otpCode|| response.data.confirmPassword,
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
                setLoading(false);
            }

        } catch (err: any) {            
            const errorMessage = err.response?.data?.data || err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            
            toast.update(loadingToast, {
                render: errorMessage,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            setLoading(false);
        }
    }

    if (step === 'email') {
        return (
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="forgotEmail" className="form-label">
                        Nhập email để đặt lại mật khẩu
                    </label>
                    <input
                        id="forgotEmail"
                        name="forgotEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Nhập email của bạn"
                    />
                </div>
                {loading ? (
                    <div className="d-grid mb-3">
                        <button type="button" className="btn btn-primary" disabled>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Đang gửi...
                        </button>
                    </div>
                ) : (
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Gửi liên kết đặt lại mật khẩu
                        </button>
                    </div>
                )}


                <div className="text-center mt-3">
                    <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={onBack}
                    >
                        ← Quay lại đăng nhập
                    </button>
                </div>
            </form>
        )
    }

    return (
        <form onSubmit={handleResetPassword}>
            <div className="mb-3">
                <label htmlFor="otp" className="form-label">
                    Mã OTP
                </label>
                <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-control"
                    placeholder="Nhập mã OTP từ email"
                    maxLength={6}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                    Mật khẩu mới
                </label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control"
                    placeholder="Nhập mật khẩu mới"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                    Xác nhận mật khẩu
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                    placeholder="Nhập lại mật khẩu mới"
                />
            </div>

            <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Đang xử lý...
                        </>
                    ) : (
                        "Đặt lại mật khẩu"
                    )}
                </button>
            </div>

            <div className="text-center mt-3">
                <button
                    type="button"
                    className="btn btn-link text-decoration-none"
                    onClick={() => setStep('email')}
                >
                    ← Quay lại nhập email
                </button>
            </div>
        </form>
    )
}

export default ForgotPasswordForm
