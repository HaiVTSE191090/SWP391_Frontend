import React, { useState } from "react";
import { ocrAPI } from "../../services/ocrService";
import { verifyKyc } from "../../services/authService";

type Props = {
    onSwitchToManual: () => void;
};

const OcrIdentityForm: React.FC<Props> = ({ onSwitchToManual }) => {
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
            // Gửi dữ liệu OCR để verify KYC
            const payload = {
                ocrData: ocrData,
                documentType: 'CCCD' // hoặc 'GPLX' tùy vào loại giấy tờ
            };
            
            const result = await verifyKyc(payload);
            
            if (result.status === "success") {
                setMessage("Xác thực thành công! Trạng thái tài khoản đã được cập nhật.");
                
                // Trigger event để refresh user profile
                setTimeout(() => {
                    window.dispatchEvent(new Event('userLogin'));
                    window.location.reload();
                }, 2000);
            } else {
                setMessage("Xác thực thất bại. Vui lòng kiểm tra lại thông tin.");
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

                    <button
                        className="btn btn-primary me-2"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Đang quét..." : "Bắt đầu nhận diện"}
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={onSwitchToManual}
                    >
                        Nhập tay thay thế
                    </button>
                </div>
            </div>

            {message && (
                <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                </div>
            )}

            {ocrData && (
                <div className="card">
                    <div className="card-body">
                        <h6 className="fw-bold">Kết quả OCR:</h6>
                        <pre className="bg-light p-2 rounded">
                            {JSON.stringify(ocrData, null, 2)}
                        </pre>
                        
                        <div className="mt-3">
                            <button
                                className="btn btn-success"
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
                                        <i className="fas fa-check me-2"></i>
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
