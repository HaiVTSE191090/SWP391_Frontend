import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authController } from "../../controller/AuthController";

type Props = {
    onSwitchToOcr: () => void;
};

export default function ManualIdentityForm({ onSwitchToOcr }: Props) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const [cccdNumber, setCccdNumber] = useState("");
  const [cccdIssueDate, setCccdIssueDate] = useState("");
  const [cccdIssuePlace, setCccdIssuePlace] = useState("");
  
  
  const [gplxNumber, setGplxNumber] = useState("");
  const [gplxRank, setGplxRank] = useState("");
  const [gplxExpiryDate, setGplxExpiryDate] = useState("");

  const handleSubmit = async () => {
    if (!cccdNumber || !cccdIssueDate || !cccdIssuePlace) {
      alert("Vui lòng nhập đầy đủ thông tin CCCD!");
      return;
    }

    setLoading(true);
    setMessage(null);
    
    try {

      // hỏi đăng xem phần này có cần phải 2 thằng CCCD và GPLX k
      const payload = {
        idNumber: cccdNumber,
        issueDate: cccdIssueDate,
        issuePlace: cccdIssuePlace,
        ...(gplxNumber && {
          licenseNumber: gplxNumber,
          licenseRank: gplxRank,
          licenseExpiryDate: gplxExpiryDate,
        }),
      };

      const result = await authController.verifyKyc(payload);

      if (result.success) {
        setMessage("Xác thực thành công! Tài khoản của bạn đã được cập nhật.");
        
        setTimeout(() => {
          if (token) {
            authController.getProfile(token).then((profileRes: any) => {
              const updatedUser = profileRes.data.data;
              authController.saveAuthData(token, updatedUser);
              
            });
          }
        }, 2000);
      } else {
        setMessage(` Xác thực thất bại: ${result.error}`);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Nhập tay thông tin CCCD & GPLX</h4>
        <button 
          className="btn btn-outline-primary"
          onClick={onSwitchToOcr}
        >
          <i className="fas fa-camera me-1"></i>
          Quét OCR thay thế
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Thông tin CCCD</h5>

          <div className="mb-3">
            <label htmlFor="soCCCD" className="form-label">Số CCCD *</label>
            <input
              id="soCCCD"
              type="text"
              className="form-control"
              placeholder="Nhập số CCCD (12 chữ số)"
              value={cccdNumber}
              onChange={(e) => setCccdNumber(e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="ngayCapCCCD" className="form-label">Ngày cấp *</label>
              <input
                id="ngayCapCCCD"
                type="date"
                className="form-control"
                value={cccdIssueDate}
                onChange={(e) => setCccdIssueDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="noiCapCCCD" className="form-label">Nơi cấp *</label>
              <input
                id="noiCapCCCD"
                type="text"
                className="form-control"
                placeholder="Ví dụ: CA TP.HCM"
                value={cccdIssuePlace}
                onChange={(e) => setCccdIssuePlace(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>

      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Thông tin GPLX (không bắt buộc)</h5>

          <div className="mb-3">
            <label htmlFor="soGPLX" className="form-label">Số GPLX</label>
            <input
              id="soGPLX"
              type="text"
              className="form-control"
              placeholder="Nhập số GPLX"
              value={gplxNumber}
              onChange={(e) => setGplxNumber(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="hangGPLX" className="form-label">Hạng</label>
              <select
                id="hangGPLX"
                className="form-select"
                value={gplxRank}
                onChange={(e) => setGplxRank(e.target.value)}
              >
                <option value="">-- Chọn hạng --</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="ngayHetHanGPLX" className="form-label">Ngày hết hạn</label>
              <input
                id="ngayHetHanGPLX"
                type="date"
                className="form-control"
                value={gplxExpiryDate}
                onChange={(e) => setGplxExpiryDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="d-grid">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Đang xác thực...
            </>
          ) : (
            <>
              <i className="fas fa-check-circle me-2"></i>
              Lưu & Xác thực
            </>
          )}
        </button>
      </div>
    </div>
  );
}
