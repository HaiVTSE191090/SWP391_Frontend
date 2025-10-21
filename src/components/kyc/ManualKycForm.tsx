import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { submitKycVerification } from "../../services/kycService";
import { KycVerificationRequest } from "../../models/KycModel";
import { authController } from "../../controller/AuthController";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerCustom.css";
import { convertToDateInput, parseDateSafe } from "../../utils/dateHelpers";

type Props = {
  onSwitchToOcr: () => void;
};

export default function ManualKycForm({ onSwitchToOcr }: Props) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CCCD Fields
  const [nationalId, setNationalId] = useState("");
  const [nationalName, setNationalName] = useState("");
  const [nationalDob, setNationalDob] = useState("");
  const [nationalAddress, setNationalAddress] = useState("");
  const [nationalIssueDate, setNationalIssueDate] = useState("");
  const [nationalExpireDate, setNationalExpireDate] = useState("");

  // GPLX Fields
  const [driverLicense, setDriverLicense] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverAddress, setDriverAddress] = useState("");
  const [driverClass, setDriverClass] = useState("");
  const [driverIssueDate, setDriverIssueDate] = useState("");
  const [driverExpireDate, setDriverExpireDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CCCD
    if (!nationalId || !nationalName || !nationalDob || !nationalAddress || 
        !nationalIssueDate || !nationalExpireDate) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin CCCD!" });
      return;
    }

    // Validate GPLX
    if (!driverLicense || !driverName || !driverAddress || !driverClass || 
        !driverIssueDate || !driverExpireDate) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin GPLX!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload: KycVerificationRequest = {
        renterId: user?.renterId || 0,
        nationalId: nationalId,
        nationalName: nationalName,
        nationalDob: convertToDateInput(nationalDob), // Convert DD/MM/YYYY to YYYY-MM-DD
        nationalAddress: nationalAddress,
        nationalIssueDate: nationalIssueDate ? convertToDateInput(nationalIssueDate) : undefined,
        nationalExpireDate: convertToDateInput(nationalExpireDate),
        driverLicense: driverLicense,
        driverName: driverName,
        driverAddress: driverAddress,
        driverClass: driverClass,
        driverIssueDate: convertToDateInput(driverIssueDate),
        driverExpireDate: convertToDateInput(driverExpireDate),
        confidenceScore: 0, // Manual input = 0
      };

      console.log("Submitting KYC payload:", payload);

      const result = await submitKycVerification(payload);

      if (result.status === "success") {
        setMessage({ type: "success", text: "Xác thực KYC thành công! Đang chuyển hướng..." });

        // Refresh user data
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
        // Hiển thị lỗi từ backend
        if (result.data) {
          if (typeof result.data === 'string') {
            // Trường hợp data là string đơn giản
            setMessage({ type: "error", text: result.data });
          } else if (typeof result.data === 'object') {
            // Trường hợp data là object chứa validation errors
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
      console.error("KYC submission error:", error);
      
      // Field name mapping để hiển thị thân thiện hơn
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
      
      // Xử lý lỗi từ backend
      if (error.response?.data?.data) {
        if (typeof error.response.data.data === 'string') {
          // Trường hợp data là string đơn giản
          setMessage({ type: "error", text: error.response.data.data });
        } else if (typeof error.response.data.data === 'object') {
          // Trường hợp data là object chứa validation errors
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
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          Nhập thông tin KYC thủ công
        </h4>
        <button className="btn btn-outline-primary" onClick={onSwitchToOcr}>
          Quét OCR
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`}>
          <div style={{ whiteSpace: 'pre-line' }}>{message.text}</div>
          <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* CCCD Section */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              Thông tin Căn cước công dân (CCCD)
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Số CCCD <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: 842827589954"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  maxLength={12}
                  required
                />
                <small className="text-muted">12 chữ số</small>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: NGUYEN VAN A"
                  value={nationalName}
                  onChange={(e) => setNationalName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Ngày sinh <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={parseDateSafe(nationalDob)}
                  onChange={(date) => {
                    if (date) {
                      setNationalDob(date.toLocaleDateString('en-GB'));
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Chọn ngày sinh"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  maxDate={new Date()}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Địa chỉ thường trú <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
                  value={nationalAddress}
                  onChange={(e) => setNationalAddress(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Ngày cấp <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={parseDateSafe(nationalIssueDate)}
                  onChange={(date) => {
                    if (date) {
                      setNationalIssueDate(date.toLocaleDateString('en-GB'));
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Chọn ngày cấp"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50}
                  maxDate={new Date()}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Ngày hết hạn <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={parseDateSafe(nationalExpireDate)}
                  onChange={(date) => {
                    if (date) {
                      setNationalExpireDate(date.toLocaleDateString('en-GB'));
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Chọn ngày hết hạn"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50}
                  minDate={new Date()}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* GPLX Section */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              Thông tin Giấy phép lái xe (GPLX)
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Số GPLX <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: 325210689484"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  maxLength={12}
                  required
                />
                <small className="text-muted">12 chữ số</small>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: NGUYEN VAN A"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Địa chỉ <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
                  value={driverAddress}
                  onChange={(e) => setDriverAddress(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Hạng GPLX <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={driverClass}
                  onChange={(e) => setDriverClass(e.target.value)}
                  required
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
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Ngày cấp <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={parseDateSafe(driverIssueDate)}
                  onChange={(date) => {
                    if (date) {
                      setDriverIssueDate(date.toLocaleDateString('en-GB'));
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Chọn ngày cấp"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50}
                  maxDate={new Date()}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Ngày hết hạn <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={parseDateSafe(driverExpireDate)}
                  onChange={(date) => {
                    if (date) {
                      setDriverExpireDate(date.toLocaleDateString('en-GB'));
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Chọn ngày hết hạn"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50}
                  minDate={new Date()}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-grid gap-2">
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
}
