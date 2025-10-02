import React from 'react';
import './ReviewConfirmPage.css';

interface UserInfo {
  email: string;
  sdt: string;
  cccd: string;
  gplx: string;
  ten: string;
  ngaySinh: string;
  diaChi: string;
  gioiTinh: string;
}

interface ReviewConfirmPageProps {
  userInfo: UserInfo;
  onSubmit: () => void;
  onEdit: () => void;
  onBack?: () => void;
}

const ReviewConfirmPage: React.FC<ReviewConfirmPageProps> = ({
  userInfo,
  onSubmit,
  onEdit,
  onBack
}) => {
  return (
    <div className="review-container">
      <div className="review-header">
        <h1>📋 Xem lại & Xác nhận</h1>
        <p>Vui lòng kiểm tra kỹ thông tin trước khi gửi đăng ký</p>
      </div>

      <div className="review-content">
        {/* Thông tin cá nhân */}
        <div className="info-section">
          <h3>👤 Thông tin cá nhân</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Họ và tên:</span>
              <span className="value">{userInfo.ten}</span>
            </div>
            <div className="info-item">
              <span className="label">Ngày sinh:</span>
              <span className="value">{userInfo.ngaySinh}</span>
            </div>
            <div className="info-item">
              <span className="label">Giới tính:</span>
              <span className="value">{userInfo.gioiTinh}</span>
            </div>
            <div className="info-item">
              <span className="label">Địa chỉ:</span>
              <span className="value">{userInfo.diaChi}</span>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="info-section">
          <h3>📞 Thông tin liên hệ</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{userInfo.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">{userInfo.sdt}</span>
            </div>
          </div>
        </div>

        {/* Giấy tờ tùy thân */}
        <div className="info-section">
          <h3>📄 Giấy tờ tùy thân</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Số CCCD:</span>
              <span className="value cccd">{userInfo.cccd}</span>
            </div>
            <div className="info-item">
              <span className="label">Số GPLX:</span>
              <span className="value gplx">{userInfo.gplx}</span>
            </div>
          </div>
        </div>

        {/* Lưu ý quan trọng */}
        <div className="warning-section">
          <div className="warning-box">
            <h4>⚠️ Lưu ý quan trọng</h4>
            <ul>
              <li>Vui lòng kiểm tra kỹ tất cả thông tin trước khi xác nhận</li>
              <li>Thông tin sai lệch có thể ảnh hưởng đến quá trình thuê xe</li>
              <li>Sau khi gửi đăng ký, bạn sẽ nhận được email xác nhận</li>
              <li>CCCD và GPLX phải còn hiệu lực và chính chủ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="action-buttons">
        {onBack && (
          <button className="btn-back" onClick={onBack}>
            ← Quay lại
          </button>
        )}
        
        <button className="btn-edit" onClick={onEdit}>
          ✏️ Chỉnh sửa
        </button>
        
        <button className="btn-submit" onClick={onSubmit}>
          ✅ Đồng ý & Gửi đăng ký
        </button>
      </div>
    </div>
  );
};

export default ReviewConfirmPage;