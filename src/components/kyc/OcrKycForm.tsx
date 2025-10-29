import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerCustom.css";
import { useAuth } from "../../hooks/useAuth";
import { ocrCCCD, ocrGPLX, submitKycVerification } from "../../services/kycService";
import { OcrCCCDData, OcrGPLXData, KycVerificationRequest } from "../../models/KycModel";
import { authController } from "../../controller/AuthController";
import { parseDateSafe, convertToDateInput } from "../../utils/dateHelpers";
import { useNavigate } from "react-router-dom";

type Props = {
  onSwitchToManual: () => void;
};

const OcrKycForm = ({ onSwitchToManual }: Props) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const [cccdFrontImage, setCccdFrontImage] = useState<File | null>(null);
  const [cccdBackImage, setCccdBackImage] = useState<File | null>(null);
  const [cccdData, setCccdData] = useState<OcrCCCDData | null>(null);
  const [isEditingCccd, setIsEditingCccd] = useState(false);

  const [gplxFrontImage, setGplxFrontImage] = useState<File | null>(null);
  const [gplxBackImage, setGplxBackImage] = useState<File | null>(null);
  const [gplxData, setGplxData] = useState<OcrGPLXData | null>(null);
  const [isEditingGplx, setIsEditingGplx] = useState(false);
  const navigate = useNavigate();

  const handleCccdFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCccdFrontImage(file);
  };

  const handleCccdBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCccdBackImage(file);
  };

  const handleGplxFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGplxFrontImage(file);
  };

  const handleGplxBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGplxBackImage(file);
  };

  const handleScanCCCD = async () => {
    if (!cccdFrontImage || !cccdBackImage) {
      setMessage({ type: "error", text: "Vui lòng chọn đầy đủ ảnh CCCD mặt trước và mặt sau!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const resultFront = await ocrCCCD(cccdFrontImage);
      const resultBack = await ocrCCCD(cccdBackImage);

      if (resultFront.data && resultFront.data.length > 0 &&
        resultBack.data && resultBack.data.length > 0) {

        const frontData = resultFront.data[0];
        const backData = resultBack.data[0];

        const mergedData: OcrCCCDData = {
          id: frontData.id || backData.id || "",
          name: frontData.name || backData.name || "",
          dob: frontData.dob || backData.dob || "",
          sex: frontData.sex || backData.sex || "",
          nationality: frontData.nationality || backData.nationality || "",
          home: frontData.home || backData.home || "",
          address: frontData.address || backData.address || "",
          doe: backData.doe || frontData.doe || "",
          issue_date: backData.issue_date || frontData.issue_date || "",
          issue_loc: backData.issue_loc || frontData.issue_loc || "",
          overall_score: Math.max(frontData.overall_score || 0, backData.overall_score || 0),
          id_prob: Math.max(frontData.id_prob || 0, backData.id_prob || 0),
          name_prob: Math.max(frontData.name_prob || 0, backData.name_prob || 0),
          dob_prob: Math.max(frontData.dob_prob || 0, backData.dob_prob || 0),
          sex_prob: Math.max(frontData.sex_prob || 0, backData.sex_prob || 0),
          nationality_prob: Math.max(frontData.nationality_prob || 0, backData.nationality_prob || 0),
        };

        setCccdData(mergedData);
        setMessage({ type: "success", text: "Quét CCCD (cả 2 mặt) thành công!" });
      } else {
        setMessage({ type: "error", text: "Không thể đọc thông tin từ một hoặc cả hai ảnh CCCD." });
      }
    } catch (error: any) {
      console.error("OCR CCCD error:", error);
      setMessage({ type: "error", text: "Lỗi khi quét CCCD. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handleScanGPLX = async () => {
    if (!gplxFrontImage || !gplxBackImage) {
      setMessage({ type: "error", text: "Vui lòng chọn đầy đủ ảnh GPLX mặt trước và mặt sau!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const resultFront = await ocrGPLX(gplxFrontImage);
      const resultBack = await ocrGPLX(gplxBackImage);

      if (resultFront.data && resultFront.data.length > 0 &&
        resultBack.data && resultBack.data.length > 0) {

        const frontData = resultFront.data[0];
        const backData = resultBack.data[0];

        const mergedData: OcrGPLXData = {
          id: frontData.id || backData.id || "",
          name: frontData.name || backData.name || "",
          dob: frontData.dob || backData.dob || "",
          address: frontData.address || backData.address || "",
          class: frontData.class || backData.class || "",
          issue_date: backData.issue_date || frontData.issue_date || "",
          doe: backData.doe || frontData.doe || "",
          overall_score: Math.max(frontData.overall_score || 0, backData.overall_score || 0),
        };

        setGplxData(mergedData);
        setMessage({ type: "success", text: "Quét GPLX (cả 2 mặt) thành công!" });
      } else {
        setMessage({ type: "error", text: " Không thể đọc thông tin từ một hoặc cả hai ảnh GPLX." });
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
        nationalDob: convertToDateInput(cccdData.dob),
        nationalAddress: cccdData.address || cccdData.home,
        nationalIssueDate: convertToDateInput(cccdData.issue_date),
        nationalExpireDate: convertToDateInput(cccdData.doe),
        driverLicense: gplxData.id,
        driverName: gplxData.name,
        driverAddress: gplxData.address,
        driverClass: gplxData.class,
        driverIssueDate: convertToDateInput(gplxData.issue_date),
        driverExpireDate: convertToDateInput(gplxData.doe),
        confidenceScore: Math.min(cccdData.overall_score, gplxData.overall_score),
      };


      console.log("KYC Payload:", payload);
      const result = await submitKycVerification(payload);

      if (result.status === "success") {
        setMessage({ type: "success", text: "Xác thực KYC thành công! Đang cập nhật thông tin..." });

        setTimeout(() => {
          if (token) {
            authController.getProfile(token).then((profileRes: any) => {
              const updatedUser = profileRes.data.data;
              authController.saveAuthData(token, updatedUser);
            });
            navigate(-1)
          }
        }, 500);
      } else {
        if (result.data) {
          if (typeof result.data === 'string') {
            setMessage({ type: "error", text: result.data });
          } else if (typeof result.data === 'object') {
            const errors = Object.entries(result.data)
              .map(([field, msg]) => `• ${msg}`)
              .join('\n');
            setMessage({ type: "error", text: errors });
          }
        } else {
          setMessage({ type: "error", text: result.message || "Xác thực thất bại!" });
        }
      }
    } catch (error: any) {
      console.error("OcrKycForm handleSubmitKyc:", error);

      const fieldNames: Record<string, string> = {
        renterId: "Mã người thuê",
        nationalId: "Số CCCD",
        nationalName: "Tên trên CCCD",
        nationalDob: "Ngày sinh (CCCD)",
        nationalAddress: "Địa chỉ (CCCD)",
        nationalIssueDate: "Ngày cấp CCCD",
        nationalExpireDate: "Ngày hết hạn CCCD",
        driverLicense: "Số GPLX",
        driverName: "Tên trên GPLX",
        driverAddress: "Địa chỉ (GPLX)",
        driverClass: "Hạng GPLX",
        driverIssueDate: "Ngày cấp GPLX",
        driverExpireDate: "Ngày hết hạn GPLX",
        confidenceScore: "Điểm tin cậy"
      };

      if (error.response?.data?.data) {
        if (typeof error.response.data.data === 'string') {
          setMessage({ type: "error", text: error.response.data.data });
        } else if (typeof error.response.data.data === 'object') {
          const errors = Object.entries(error.response.data.data)
            .map(([field, msg]) => {
              const displayName = fieldNames[field] || field;
              return `🔸 ${displayName}: ${msg}`;
            })
            .join('\n');
          setMessage({ type: "error", text: errors });
        }
      } else {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Lỗi khi gửi thông tin. Vui lòng thử lại.",
        });
      }
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

      {message && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${message.type === 'success' ? 'bg-success' :
                message.type === 'error' ? 'bg-danger' :
                  'bg-info'
                } text-white`}>
                <h5 className="modal-title">
                  {message.type === 'success' ? 'Thành công' :
                    message.type === 'error' ? 'Lỗi' :
                      'Thông báo'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMessage(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0 white-space-pre-line">{message.text}</p>
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

      {/* CCCD Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            1. Quét Căn cước công dân (CCCD)
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Mặt trước CCCD */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Ảnh mặt trước</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCccdFrontImageChange}
                className="form-control"
              />
              {cccdFrontImage && (
                <div className="text-center mt-3">
                  <img
                    src={URL.createObjectURL(cccdFrontImage)}
                    alt="CCCD Mặt trước"
                    className="img-fluid rounded border"
                    style={{ maxHeight: "200px" }}
                  />
                  <p className="text-success small mt-2 mb-0">Đã chọn mặt trước</p>
                </div>
              )}
            </div>

            {/* Mặt sau CCCD */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Ảnh mặt sau</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCccdBackImageChange}
                className="form-control"
              />
              {cccdBackImage && (
                <div className="text-center mt-3">
                  <img
                    src={URL.createObjectURL(cccdBackImage)}
                    alt="CCCD Mặt sau"
                    className="img-fluid rounded border"
                    style={{ maxHeight: "200px" }}
                  />
                  <p className="text-success small mt-2 mb-0">Đã chọn mặt sau</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleScanCCCD}
              disabled={loading || !cccdFrontImage || !cccdBackImage}
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
            {(!cccdFrontImage || !cccdBackImage) && (
              <small className="text-muted d-block mt-2 text-center">
                Vui lòng chọn đầy đủ ảnh mặt trước và mặt sau
              </small>
            )}
          </div>

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
                      onChange={(e) => setCccdData({ ...cccdData, id: e.target.value })}
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
                      onChange={(e) => setCccdData({ ...cccdData, name: e.target.value })}
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
                          setCccdData({ ...cccdData, dob: formatted });
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
                          setCccdData({ ...cccdData, issue_date: formatted });
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
                          setCccdData({ ...cccdData, doe: formatted });
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
                      onChange={(e) => setCccdData({ ...cccdData, address: e.target.value })}
                      rows={2}
                    />
                  ) : (
                    <div className="fw-bold">{cccdData.address || cccdData.home}</div>
                  )}
                </div>
                <div className="col-12">
                  <div className="alert alert-success mb-0 py-2">
                    <small>Độ tin cậy OCR: <strong>{cccdData.overall_score}%</strong></small>
                  </div>
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
          <div className="row g-3">
            {/* Mặt trước GPLX */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Ảnh mặt trước</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleGplxFrontImageChange}
                className="form-control"
              />
              {gplxFrontImage && (
                <div className="text-center mt-3">
                  <img
                    src={URL.createObjectURL(gplxFrontImage)}
                    alt="GPLX Mặt trước"
                    className="img-fluid rounded border"
                    style={{ maxHeight: "200px" }}
                  />
                  <p className="text-success small mt-2 mb-0">Đã chọn mặt trước</p>
                </div>
              )}
            </div>

            {/* Mặt sau GPLX */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Ảnh mặt sau</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleGplxBackImageChange}
                className="form-control"
              />
              {gplxBackImage && (
                <div className="text-center mt-3">
                  <img
                    src={URL.createObjectURL(gplxBackImage)}
                    alt="GPLX Mặt sau"
                    className="img-fluid rounded border"
                    style={{ maxHeight: "200px" }}
                  />
                  <p className="text-success small mt-2 mb-0">Đã chọn mặt sau</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-success w-100"
              onClick={handleScanGPLX}
              disabled={loading || !gplxFrontImage || !gplxBackImage}
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
            {(!gplxFrontImage || !gplxBackImage) && (
              <small className="text-muted d-block mt-2 text-center">
                Vui lòng chọn đầy đủ ảnh mặt trước và mặt sau
              </small>
            )}
          </div>

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
                      onChange={(e) => setGplxData({ ...gplxData, id: e.target.value })}
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
                      onChange={(e) => setGplxData({ ...gplxData, name: e.target.value })}
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
                      onChange={(e) => setGplxData({ ...gplxData, class: e.target.value })}
                    >
                      <option value="">-- Chọn hạng --</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="A3">A3</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
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
                          setGplxData({ ...gplxData, issue_date: formatted });
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
                          setGplxData({ ...gplxData, doe: formatted });
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
                          setGplxData({ ...gplxData, dob: formatted });
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
                      onChange={(e) => setGplxData({ ...gplxData, address: e.target.value })}
                      rows={2}
                    />
                  ) : (
                    <div className="fw-bold">{gplxData.address}</div>
                  )}
                </div>
                <div className="col-12">
                  <div className="alert alert-success mb-0 py-2">
                    <small>Độ tin cậy OCR: <strong>{gplxData.overall_score}%</strong></small>
                  </div>
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
