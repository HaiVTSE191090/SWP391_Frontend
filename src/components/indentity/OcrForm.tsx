import React, { useState } from "react";
import { ocrAPI } from "../../services/ocrService";

type Props = {
    onSwitchToManual: () => void;
};

const OcrIdentityForm: React.FC<Props> = ({ onSwitchToManual }) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [ocrData, setOcrData] = useState<any>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const handleUpload = async () => {
        if (!image) return alert("Chưa chọn ảnh CCCD hoặc GPLX!");
        setLoading(true);
        try {
            const result = await ocrAPI(image);
            setOcrData(result.data);
        } catch (err) {
            alert("Lỗi kết nối mạng không ổn định.");
        } finally {
            setLoading(false);
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

            {ocrData && (
                <div className="card">
                    <div className="card-body">
                        <h6 className="fw-bold">Kết quả OCR:</h6>
                        <pre className="bg-light p-2 rounded">
                            {JSON.stringify(ocrData, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OcrIdentityForm;
