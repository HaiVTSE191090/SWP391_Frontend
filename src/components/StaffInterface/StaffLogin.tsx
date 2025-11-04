import React, { useState } from "react";
import "./StaffLogin.css";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
// Giả định staffLogin được import từ đây và đã được sửa đổi để ném lỗi HTTP
import { staffLogin } from "./services/authServices"; 
import { AxiosError } from "axios"; 

const StaffLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State để hiển thị lỗi
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const navigate = useNavigate();

    // Hàm xử lý khi submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Xóa lỗi cũ

        if (!email.trim() || !password) {
            setError("Vui lòng nhập đầy đủ thông tin Email và Mật khẩu.");
            return;
        }

        try {
            // 1. Thực hiện API call
            const resp = await staffLogin(email, password);
            
            // 2. Nếu thành công (API trả về 200)
            const token = resp?.token || resp?.data?.token; // Điều chỉnh tùy cấu trúc trả về
            const fullName = resp?.fullName || resp?.data?.fullName;

            if (token && fullName) {
                // Lưu token và tên vào localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('name', fullName);
                
                // Hiển thị toast thành công
                setToastMessage(`Đăng nhập thành công! Chào mừng, ${fullName}!`);
                setToastType("success");
                setShowToast(true);
                
                // Chuyển hướng sau 1.5 giây
                setTimeout(() => {
                    navigate("/staff");
                }, 1500);
            } else {
                // Trường hợp thành công nhưng phản hồi thiếu thông tin cần thiết
                setError("Phản hồi đăng nhập không hợp lệ từ máy chủ.");
            }
        } catch (err) {
            // 3. XỬ LÝ LỖI CHI TIẾT TỪ AXIOS
            const axiosError = err as AxiosError;
            let errorMessage = "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";

            if (axiosError.response) {
                // Lỗi từ server (có response)
                const status = axiosError.response.status;
                // Giả định API trả về lỗi dưới dạng { message: "..." }
                const data = axiosError.response.data as { message?: string, error?: string }; 

                if (status === 401 || status === 400) {
                    // Lỗi xác thực: Email/Mật khẩu sai hoặc Bad Request
                    // Ưu tiên hiển thị message cụ thể từ server
                    errorMessage = data.message || "Email hoặc mật khẩu không đúng.";
                } else if (status >= 500) {
                    // Lỗi Server
                    errorMessage = "Lỗi hệ thống. Vui lòng liên hệ quản trị viên.";
                } else {
                    // Lỗi HTTP khác
                    errorMessage = data.message || `Lỗi ${status}: Không thể xử lý yêu cầu.`;
                }
            } else if (axiosError.request) {
                // Lỗi không có phản hồi (mất mạng, server down)
                errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
            }
            
            // Cập nhật state lỗi, ngăn không cho chuyển trang
            setError(errorMessage);
        }
    };

    return (
        <>
            {/* Toast Container */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast 
                    show={showToast} 
                    onClose={() => setShowToast(false)} 
                    delay={3000} 
                    autohide
                    bg={toastType === "success" ? "success" : "danger"}
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastType === "success" ? "✅ Thành công" : "❌ Lỗi"}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            <main className="staff-login-main py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card shadow-lg border-0">
                                <div className="card-body p-5">
                                    <h3 className="card-title text-center mb-4 fw-bold text-primary">Đăng nhập Nhân viên</h3>

                                    <form onSubmit={handleSubmit}>
                                        {/* Hiển thị lỗi */}
                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Nhập email nhân viên"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Mật khẩu"
                                                required
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="remember" />
                                                <label className="form-check-label" htmlFor="remember">Ghi nhớ đăng nhập</label>
                                            </div>
                                            <a href="#" className="small text-primary">Quên mật khẩu?</a>
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                                            Đăng nhập
                                        </button>

                                        <div className="text-center mt-4 small text-muted">
                                            Chỉ dành cho nhân viên. Vui lòng liên hệ quản trị nếu cần truy cập.
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default StaffLogin;
