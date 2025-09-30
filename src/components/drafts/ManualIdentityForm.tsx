import React from "react";

/**
 * UI-only: Form nhập tay CCCD & GPLX
 * Thuần Bootstrap 5 – chưa có xử lý nghiệp vụ hay gọi API.
 * Bạn có thể gắn handler onSubmit ở bên ngoài nếu cần sau này.
 */
export default function ManualIdentityForm() {
  return (
    <div className="container my-4">
      <h4 className="fw-bold mb-3">Nhập tay thông tin CCCD &amp; GPLX</h4>

      {/* Khối CCCD */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Thông tin CCCD</h5>

          <div className="mb-3">
            <label htmlFor="soCCCD" className="form-label">Số CCCD</label>
            <input
              id="soCCCD"
              type="text"
              className="form-control"
              placeholder="Nhập số CCCD (12 số)"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="ngayCapCCCD" className="form-label">Ngày cấp</label>
              <input id="ngayCapCCCD" type="date" className="form-control" />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="noiCapCCCD" className="form-label">Nơi cấp</label>
              <input
                id="noiCapCCCD"
                type="text"
                className="form-control"
                placeholder="Ví dụ: CA TP.HCM"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Khối GPLX */}
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
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="hangGPLX" className="form-label">Hạng</label>
              <select id="hangGPLX" className="form-select" defaultValue="">
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
              <input id="ngayHetHanGPLX" type="date" className="form-control" />
            </div>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="d-grid">
        <button type="button" className="btn btn-primary btn-lg">
          Lưu &amp; Tiếp tục
        </button>
      </div>
    </div>
  );
}
