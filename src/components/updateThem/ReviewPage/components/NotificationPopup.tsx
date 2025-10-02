import React from 'react';
import './NotificationPopup.css';

interface PopupProps {
  type: 'duplicate' | 'age' | 'confirmation' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onReject?: () => void;
  data?: any;
}

const NotificationPopup: React.FC<PopupProps> = ({
  type,
  isOpen,
  onClose,
  onConfirm,
  onReject,
  data
}) => {
  if (!isOpen || !type) return null;

  // Popup trùng lặp
  if (type === 'duplicate') {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-box" onClick={(e) => e.stopPropagation()}>
          <h3>⚠️ Tài liệu trùng lặp</h3>
          <p>Tài liệu đã được sử dụng để đăng ký trước đó. Vui lòng đăng nhập.</p>
          <button className="btn-ok" onClick={onClose}>Đồng ý</button>
        </div>
      </div>
    );
  }

  // Popup không đủ tuổi
  if (type === 'age') {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-box" onClick={(e) => e.stopPropagation()}>
          <h3>🚫 Không đủ điều kiện</h3>
          <p>Độ tuổi tối thiểu để thuê xe là 21. Tài khoản của bạn hiện chưa đáp ứng.</p>
          <button className="btn-ok" onClick={onClose}>Đồng ý</button>
        </div>
      </div>
    );
  }

  // Popup xác nhận thông tin
  if (type === 'confirmation') {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-box confirmation" onClick={(e) => e.stopPropagation()}>
          <h3>📄 Xác nhận thông tin CCCD</h3>
          <p>Vui lòng kiểm tra thông tin:</p>
          
          {data && (
            <div className="info-box">
              <div className="info-row">
                <span>Họ tên:</span> <strong>{data.ten}</strong>
              </div>
              <div className="info-row">
                <span>CCCD:</span> <strong>{data.cccd}</strong>
              </div>
              <div className="info-row">
                <span>Ngày sinh:</span> <strong>{data.ngaySinh}</strong>
              </div>
              <div className="info-row">
                <span>Địa chỉ:</span> <strong>{data.diaChi}</strong>
              </div>
            </div>
          )}

          <div className="btn-group">
            <button className="btn-cancel" onClick={onReject}>Không đồng ý</button>
            <button className="btn-confirm" onClick={onConfirm}>Đồng ý</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default NotificationPopup;