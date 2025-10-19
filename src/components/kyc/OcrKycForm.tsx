import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerCustom.css";
import { useAuth } from "../../hooks/useAuth";
import { ocrCCCD, ocrGPLX, submitKycVerification } from "../../services/kycService";
import { OcrCCCDData, OcrGPLXData, KycVerificationRequest } from "../../models/KycModel";
import { authController } from "../../controller/AuthController";
import { parseDateSafe } from "../../utils/dateHelpers";

type Props = {
  onSwitchToManual: () => void;
};

const OcrKycForm: React.FC<Props> = ({ onSwitchToManual }) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const [cccdImage, setCccdImage] = useState<File | null>(null);
  const [cccdData, setCccdData] = useState<OcrCCCDData | null>(null);
  const [isEditingCccd, setIsEditingCccd] = useState(false);

  const [gplxImage, setGplxImage] = useState<File | null>(null);
  const [gplxData, setGplxData] = useState<OcrGPLXData | null>(null);
  const [isEditingGplx, setIsEditingGplx] = useState(false);

  const handleCccdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCccdImage(file);
  };

  const handleGplxImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGplxImage(file);
  };

  const handleScanCCCD = async () => {
    if (!cccdImage) {
      setMessage({ type: "error", text: "Vui lòng chọn ảnh CCCD!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await ocrCCCD(cccdImage);
      if (result.data && result.data.length > 0) {
        setCccdData(result.data[0]);
        setMessage({ type: "success", text: "Quét CCCD thành công!" });
      } else {
        setMessage({ type: "error", text: "Không thể đọc thông tin từ ảnh CCCD." });
      }
    } catch (error: any) {
      console.error("OCR CCCD error:", error);
      setMessage({ type: "error", text: "Lỗi khi quét CCCD. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handleScanGPLX = async () => {
    if (!gplxImage) {
      setMessage({ type: "error", text: "Vui lòng chọn ảnh GPLX!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await ocrGPLX(gplxImage);
      if (result.data && result.data.length > 0) {
        setGplxData(result.data[0]);
        setMessage({ type: "success", text: "Quét GPLX thành công!" });
      } else {
        setMessage({ type: "error", text: "Không thể đọc thông tin từ ảnh GPLX." });
      }
    } catch (error: any) {
      console.error("OCR GPLX error:", error);
      setMessage({ type: "error", text: "Lỗi khi quét GPLX. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitKyc = async () => {
    if (!cccdData || !gplxData) {
      setMessage({ type: "error", text: "Vui lòng quét cả CCCD và GPLX trước khi gửi!" });
      return;
    }

    setVerifying(true);
    setMessage(null);

    try {
      const payload: KycVerificationRequest = {
        renterId: user?.renterId || 0,
        nationalId: cccdData.id,
        nationalName: cccdData.name,
        nationalDob: cccdData.dob,
        nationalAddress: cccdData.address || cccdData.home, //cái này
        nationalIssueDate: cccdData.issue_date, //sai cái này
        nationalExpireDate: cccdData.doe,
        driverLicense: gplxData.id,
        driverName: gplxData.name,
        driverAddress: gplxData.address,
        driverClass: gplxData.class,
        driverIssueDate: gplxData.issue_date, //cái này
        driverExpireDate: gplxData.doe,
        confidenceScore: Math.min(cccdData.overall_score, gplxData.overall_score),
      };

      console.log("Submitting KYC payload:", payload);

      const result = await submitKycVerification(payload);

      if (result.status === "success") {
        setMessage({ type: "success", text: "Xác thực KYC thành công! Đang cập nhật thông tin..." });

        setTimeout(() => {
          if (token) {
            authController.getProfile(token).then((profileRes: any) => {
              const updatedUser = profileRes.data.data;
              authController.saveAuthData(token, updatedUser);
              window.location.reload();
            });
          }
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.message || "Xác thực thất bại!" });
      }
    } catch (error: any) {
      console.error("KYC submission error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Lỗi khi gửi thông tin. Vui lòng thử lại.",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          Quét CCCD & GPLX bằng OCR
        </h4>
        <button className="btn btn-outline-secondary" onClick={onSwitchToManual}>
          Nhập thủ công
        </button>
      </div>

      {/* Modal thông báo */}
      {message && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${
                message.type === 'success' ? 'bg-success' : 
                message.type === 'error' ? 'bg-danger' : 
                'bg-info'
              } text-white`}>
                <h5 className="modal-title">
                  {message.type === 'success' ? 'Thành công' : 
                   message.type === 'error' ? 'Lỗi' : 
                   'ℹ Thông báo'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setMessage(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">{message.text}</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setMessage(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            1. Quét Căn cước công dân (CCCD)
          </h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Chọn ảnh CCCD</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCccdImageChange}
              className="form-control"
            />
          </div>

          {cccdImage && (
            <div className="text-center mb-3">
              <img
                src={URL.createObjectURL(cccdImage)}
                alt="CCCD Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "250px" }}
              />
            </div>
          )}

          <button
            className="btn btn-primary w-100"
            onClick={handleScanCCCD}
            disabled={loading || !cccdImage}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang quét...
              </>
            ) : (
              <>
                Quét CCCD
              </>
            )}
          </button>

          {cccdData && (
            <div className="mt-4 border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-success mb-0">
                  Thông tin đã quét
                </h6>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setIsEditingCccd(!isEditingCccd)}
                >
                  {isEditingCccd ? "Lưu" : "Chỉnh sửa"}
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Số CCCD:</label>
                  {isEditingCccd ? (
                    <input
                      type="text"
                      className="form-control"
                      value={cccdData.id}
                      onChange={(e) => setCccdData({...cccdData, id: e.target.value})}
                      maxLength={12}
                    />
                  ) : (
                    <div className="fw-bold">{cccdData.id}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Họ tên:</label>
                  {isEditingCccd ? (
                    <input
                      type="text"
                      className="form-control"
                      value={cccdData.name}
                      onChange={(e) => setCccdData({...cccdData, name: e.target.value})}
                    />
                  ) : (
                    <div className="fw-bold">{cccdData.name}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Ngày sinh:</label>
                  {isEditingCccd ? (
                    <DatePicker
                      selected={parseDateSafe(cccdData.dob)}
                      onChange={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-GB');
                          setCccdData({...cccdData, dob: formatted});
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Chọn ngày sinh"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      maxDate={new Date()}
                    />
                  ) : (
                    <div className="fw-bold">{cccdData.dob}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Ngày cấp:</label>
                  {isEditingCccd ? (
                    <DatePicker
                      selected={parseDateSafe(cccdData.issue_date)}
                      onChange={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-GB');
                          setCccdData({...cccdData, issue_date: formatted});
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Chọn ngày cấp"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={50}
                      maxDate={new Date()}
                    />
                  ) : (
                    <div className="fw-bold">{cccdData.issue_date}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Ngày hết hạn:</label>
                  {isEditingCccd ? (
                    <DatePicker
                      selected={parseDateSafe(cccdData.doe)}
                      onChange={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-GB');
                          setCccdData({...cccdData, doe: formatted});
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Chọn ngày hết hạn"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={50}
                      minDate={new Date()}
                    />
                  ) : (
                    <div className="fw-bold">{cccdData.doe || "N/A"}</div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-bold">Địa chỉ:</label>
                  {isEditingCccd ? (
                    <textarea
                      className="form-control"
                      value={cccdData.address || cccdData.home}
                      onChange={(e) => setCccdData({...cccdData, address: e.target.value})}
                      rows={2}
                    />
                  ) : (
                    <div className="fw-bold">{cccdData.address || cccdData.home}</div>
                  )}
                </div>
                <div className="col-12">
                  <small className="text-success">Độ tin cậy OCR: {cccdData.overall_score}%</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GPLX Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            2. Quét Giấy phép lái xe (GPLX)
          </h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Chọn ảnh GPLX</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleGplxImageChange}
              className="form-control"
            />
          </div>

          {gplxImage && (
            <div className="text-center mb-3">
              <img
                src={URL.createObjectURL(gplxImage)}
                alt="GPLX Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "250px" }}
              />
            </div>
          )}

          <button
            className="btn btn-success w-100"
            onClick={handleScanGPLX}
            disabled={loading || !gplxImage}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang quét...
              </>
            ) : (
              <>
                Quét GPLX
              </>
            )}
          </button>

          {gplxData && (
            <div className="mt-4 border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-success mb-0">
                  Thông tin đã quét
                </h6>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setIsEditingGplx(!isEditingGplx)}
                >
                  {isEditingGplx ? "Lưu" : "Chỉnh sửa"}
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Số GPLX:</label>
                  {isEditingGplx ? (
                    <input
                      type="text"
                      className="form-control"
                      value={gplxData.id}
                      onChange={(e) => setGplxData({...gplxData, id: e.target.value})}
                      maxLength={12}
                    />
                  ) : (
                    <div className="fw-bold">{gplxData.id}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Họ tên:</label>
                  {isEditingGplx ? (
                    <input
                      type="text"
                      className="form-control"
                      value={gplxData.name}
                      onChange={(e) => setGplxData({...gplxData, name: e.target.value})}
                    />
                  ) : (
                    <div className="fw-bold">{gplxData.name}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Hạng:</label>
                  {isEditingGplx ? (
                    <select
                      className="form-select"
                      value={gplxData.class}
                      onChange={(e) => setGplxData({...gplxData, class: e.target.value})}
                    >
                      <option value="">-- Chọn hạng --</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="A3">A3</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C">C</option>
                      <option value="C1">C1</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  ) : (
                    <div className="fw-bold">{gplxData.class}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Ngày cấp:</label>
                  {isEditingGplx ? (
                    <DatePicker
                      selected={parseDateSafe(gplxData.issue_date)}
                      onChange={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-GB');
                          setGplxData({...gplxData, issue_date: formatted});
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Chọn ngày cấp"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={50}
                      maxDate={new Date()}
                    />
                  ) : (
                    <div className="fw-bold">{gplxData.issue_date}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Ngày hết hạn:</label>
                  {isEditingGplx ? (
                    <DatePicker
                      selected={parseDateSafe(gplxData.doe)}
                      onChange={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-GB');
                          setGplxData({...gplxData, doe: formatted});
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Chọn ngày hết hạn"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={50}
                      minDate={new Date()}
                    />
                  ) : (
                    <div className="fw-bold">{gplxData.doe}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold">Ngày sinh:</label>
                  {isEditingGplx ? (
                    <DatePicker
                      selected={parseDateSafe(gplxData.dob)}
                      onChange={(date) => {
                        if (date) {
                          const formatted = date.toLocaleDateString('en-GB');
                          setGplxData({...gplxData, dob: formatted});
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Chọn ngày sinh"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      maxDate={new Date()}
                    />
                  ) : (
                    <div className="fw-bold">{gplxData.dob || "N/A"}</div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-bold">Địa chỉ:</label>
                  {isEditingGplx ? (
                    <textarea
                      className="form-control"
                      value={gplxData.address}
                      onChange={(e) => setGplxData({...gplxData, address: e.target.value})}
                      rows={2}
                    />
                  ) : (
                    <div className="fw-bold">{gplxData.address}</div>
                  )}
                </div>
                <div className="col-12">
                  <small className="text-success">Độ tin cậy OCR: {gplxData.overall_score}%</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      {cccdData && gplxData && (
        <div className="card shadow-sm border-info">
          <div className="card-body text-center">
            <h5 className="mb-3">
              Sẵn sàng gửi thông tin xác thực
            </h5>
            <button
              className="btn btn-info btn-lg px-5"
              onClick={handleSubmitKyc}
              disabled={verifying}
            >
              {verifying ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang xác thực...
                </>
              ) : (
                <>
                  Gửi thông tin KYC
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcrKycForm;
