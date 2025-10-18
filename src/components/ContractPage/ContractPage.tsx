import React, { useState, useEffect } from "react";
import { Button, Alert, Spinner } from "react-bootstrap";
import "./Contract.css";

export default function ContractOtpPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const mockData = {
    renterName: "Nguyễn Văn A",
    renterAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    renterCccd: "079123456789",
    vehicleName: "VinFast Evo200",
    plateNumber: "59A-123.45",
    startDate: "08:00 30/09/2025",
    endDate: "18:00 30/09/2025",
    totalPrice: "400.000 VND",
    companyName: "CÔNG TY TNHH EV Rental",
    representative: "Dangdangdang – Giám đốc",
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = () => {
    setLoading(true);
    setTimeout(() => {
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCode(randomOtp);
      setOtpSent(true);
      setCountdown(180); // 3 phút
      setLoading(false);
    }, 1500);
  };

  const handleDownloadPDF = () => {
    alert("📄 Giả lập tải file PDF hợp đồng thuê xe...");
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="contract-otp container mt-5 p-5 shadow-sm bg-white">
      {/* Header */}
      <div className="text-center">
        <h6 className="fw-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h6>
        <p>Độc lập - Tự do - Hạnh phúc</p>
        <hr className="divider" />
        <h4 className="fw-bold my-3">HỢP ĐỒNG THUÊ XE ĐIỆN TỬ</h4>
      </div>

      {/* Thông tin hợp đồng */}
      <div className="card p-4 mb-4">
        <h6 className="fw-bold">Bên A (Người thuê xe)</h6>
        <p>Họ tên: {mockData.renterName}</p>
        <p>Địa chỉ: {mockData.renterAddress}</p>
        <p>Số CCCD/CMND: {mockData.renterCccd}</p>

        <h6 className="fw-bold mt-3">Bên B (Bên cho thuê xe)</h6>
        <p>{mockData.companyName}</p>
        <p>Đại diện: {mockData.representative}</p>

        <h6 className="fw-bold mt-4">Thông tin xe thuê</h6>
        <ul>
          <li>Xe: {mockData.vehicleName}</li>
          <li>Biển số: {mockData.plateNumber}</li>
          <li>Thời gian thuê: {mockData.startDate} → {mockData.endDate}</li>
          <li>Tổng giá trị hợp đồng: {mockData.totalPrice}</li>
        </ul>

        <h6 className="fw-bold mt-4">Điều khoản chính</h6>
        <ul>
          <li>Bên A có trách nhiệm giữ gìn tài sản thuê cẩn thận.</li>
          <li>Bên B bàn giao xe đúng tình trạng hoạt động tốt.</li>
          <li>Hợp đồng có hiệu lực khi OTP được xác nhận bởi nhân viên trạm.</li>
        </ul>
      </div>

      {/* Gửi OTP */}
      <div className="text-center">
        {!otpSent ? (
          <>
            <Button variant="success" size="lg" onClick={handleSendOtp} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Gửi mã OTP"}
            </Button>
            <p className="mt-3 text-muted">
              Mã OTP sẽ được gửi đến email hoặc số điện thoại bạn đã đăng ký.
            </p>
          </>
        ) : (
          <div className="otp-box text-center">
            <Alert variant="info">
              <strong>Mã OTP:</strong>{" "}
              <span className="otp-code">{otpCode}</span> <br />
              OTP còn hiệu lực trong {formatTime(countdown)} phút.
            </Alert>
            <p className="text-muted">
              👉 Vui lòng đọc mã OTP này cho nhân viên trạm để hoàn tất ký hợp đồng.
            </p>
            {countdown <= 0 && (
              <Button variant="outline-primary" onClick={handleSendOtp}>
                Gửi lại OTP
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Nút tải hợp đồng */}
      <div className="text-center mt-5">
        <Button variant="primary" onClick={handleDownloadPDF}>
          📄 Tải hợp đồng PDF
        </Button>
      </div>
    </div>
  );
}
