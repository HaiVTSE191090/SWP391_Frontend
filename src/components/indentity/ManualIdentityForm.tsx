import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authController } from "../../controller/AuthController";

type Props = {
    onSwitchToOcr: () => void;
};

const ManualIdentityForm: React.FC<Props> = ({ onSwitchToOcr }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Form fields
    const [idNumber, setIdNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [nationality, setNationality] = useState("Việt Nam");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!idNumber || !fullName || !dateOfBirth || !gender || !nationality) {
            setMessage("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const payload = {
                idNumber,
                fullName,
                dateOfBirth,
                gender,
                nationality,
                ocrConfidence: 0, // Manual input = 0 confidence
            };

            const result = await authController.verifyKyc(payload);

            if (result.success) {
                setMessage("Xác thực thành công! Tài khoản của bạn đã được cập nhật.");

                setTimeout(() => {
                    if (token) {
                        authController.getProfile(token).then(profileRes => {
                            const updatedUser = profileRes.data.data;
                            authController.saveAuthData(token, updatedUser);
                            window.location.reload();
                        });
                    }
                }, 2000);
            } else {
                setMessage(`Xác thực thất bại: ${result.error}`);
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Lỗi khi gửi thông tin. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Nhập thông tin danh tính thủ công</h4>
                <button className="btn btn-outline-primary" onClick={onSwitchToOcr}>
                    Quét OCR
                </button>
            </div>

            {message && (
                <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Thông tin Căn cước công dân (CCCD)</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {/* Số CCCD */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Số CCCD <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: 842827589954"
                                    value={idNumber}
                                    onChange={(e) => setIdNumber(e.target.value)}
                                    maxLength={12}
                                    required
                                />
                                <small className="text-muted">12 chữ số</small>
                            </div>

                            {/* Họ và tên */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Họ và tên <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: NGUYEN VAN A"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Ngày sinh */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Ngày sinh <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Giới tính */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Giới tính <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            {/* Quốc tịch */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Quốc tịch <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2 mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                Gửi thông tin xác thực
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManualIdentityForm;
