import React, { useState } from "react";
import { ocrAPI } from "../../services/ocrService";
import { useAuth } from "../../hooks/useAuth";
import { authController } from "../../controller/AuthController";

type Props = {
    onSwitchToManual: () => void;
};

const OcrIdentityForm: React.FC<Props> = ({ onSwitchToManual }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [ocrData, setOcrData] = useState<any>(null);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const handleUpload = async () => {
        if (!image) return alert("Chưa chọn ảnh CCCD hoặc GPLX!");
        setLoading(true);
        setMessage(null);
        try {
            const result = await ocrAPI(image);
            setOcrData(result.data);
            setMessage("OCR thành công! Bạn có thể xem kết quả bên dưới.");
        } catch (err) {
            setMessage("Lỗi kết nối mạng không ổn định.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyKyc = async () => {
        if (!ocrData) return alert("Chưa có dữ liệu OCR!");

        setVerifying(true);
        setMessage(null);
        try {
            const payload = {
                idNumber: ocrData.data[0].id,
                fullName: ocrData.data[0].name,
                dateOfBirth: ocrData.data[0].dob,
                gender: ocrData.data[0].sex,
                nationality: ocrData.data[0].nationality,
                ocrConfidence: ocrData.data[0].overall_score,
            };
            

            const result = await authController.verifyKyc(payload);

            if (result.success) {
                setMessage("Xác thực thành công! Tài khoản của bạn đã được cập nhật.");


                //tìm hiểu thêm
                setTimeout(() => {
                    // Refresh user data từ server
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
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Lỗi khi xác thực. Vui lòng thử lại.");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="container my-4">
            <h4 className="fw-bold mb-3">Quét CCCD bằng OCR</h4>

            <div className="card mb-4">

                <div className="card-body text-center" >
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control mb-3"
                        />

                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="img-fluid mb-3"
                                style={{ maxHeight: "250px" }}
                            />
                        )}
                    </div>


                    {loading ?
                        <>
                            <div className="">
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                đang tải...
                            </div>
                        </>
                        :
                        <>
                            <button
                                className="btn btn-primary me-2"
                                onClick={handleUpload}
                                disabled={loading}>
                                Bắt đầu nhận diện
                            </button>

                            <button
                                className="btn btn-outline-secondary"
                                onClick={onSwitchToManual}
                            >
                                Nhập tay thay thế
                            </button>
                        </>
                    }



                </div>
            </div>

            {message && (
                <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                </div>
            )}

            {ocrData && ocrData.data && (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title fw-bold mb-4">
                            <i className="fas fa-id-card me-2 text-primary"></i>
                            Thông tin định danh
                        </h5>

                        <div className="row g-3">
                            {/* Số CCCD */}
                            <div className="col-md-6">
                                <div className="border rounded p-3 h-100">
                                    <label className="text-muted small mb-1">
                                        <i className="fas fa-fingerprint me-1"></i>
                                        Số CCCD
                                    </label>
                                    <div className="fw-bold fs-5">{ocrData.data[0].id}</div>
                                    <small className="text-success">
                                        Độ chính xác: {ocrData.data[0].id_prob}%
                                    </small>
                                </div>
                            </div>

                            {/* Họ và tên */}
                            <div className="col-md-6">
                                <div className="border rounded p-3 h-100">
                                    <label className="text-muted small mb-1">
                                        <i className="fas fa-user me-1"></i>
                                        Họ và tên
                                    </label>
                                    <div className="fw-bold fs-5">{ocrData.data[0].name}</div>
                                    <small className="text-success">
                                        Độ chính xác: {ocrData.data[0].name_prob}%
                                    </small>
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div className="col-md-4">
                                <div className="border rounded p-3 h-100">
                                    <label className="text-muted small mb-1">
                                        <i className="fas fa-birthday-cake me-1"></i>
                                        Ngày sinh
                                    </label>
                                    <div className="fw-bold">{ocrData.data[0].dob}</div>
                                    <small className="text-success">
                                        Độ chính xác: {ocrData.data[0].dob_prob}%
                                    </small>
                                </div>
                            </div>

                            {/* Giới tính */}
                            <div className="col-md-4">
                                <div className="border rounded p-3 h-100">
                                    <label className="text-muted small mb-1">
                                        <i className="fas fa-venus-mars me-1"></i>
                                        Giới tính
                                    </label>
                                    <div className="fw-bold">{ocrData.data[0].sex}</div>
                                    <small className="text-success">
                                        Độ chính xác: {ocrData.data[0].sex_prob}%
                                    </small>
                                </div>
                            </div>

                            {/* Quốc tịch */}
                            <div className="col-md-4">
                                <div className="border rounded p-3 h-100">
                                    <label className="text-muted small mb-1">
                                        <i className="fas fa-flag me-1"></i>
                                        Quốc tịch
                                    </label>
                                    <div className="fw-bold">{ocrData.data[0].nationality}</div>
                                    <small className="text-success">
                                        Độ chính xác: {ocrData.data[0].nationality_prob}%
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Overall Score */}
                        <div className="alert alert-info mt-3 mb-3">
                            <i className="fas fa-chart-line me-2"></i>
                            <strong>Điểm tổng thể:</strong> {ocrData.data[0].overall_score}%
                        </div>

                        {/* Button xác thực */}
                        <div className="mt-3">
                            <button
                                className="btn btn-success btn-lg w-100"
                                onClick={handleVerifyKyc}
                                disabled={verifying}
                            >
                                {verifying ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Đang xác thực...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check-circle me-2"></i>
                                        Xác thực danh tính
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OcrIdentityForm;
