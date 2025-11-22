 import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// Props của popup
interface ConfirmationPopupProps {
  show: boolean;           // true = hiện, false = ẩn
  onHide: () => void;      // Hàm đóng popup
  title: string;           // Tiêu đề popup
  message: string;         // Nội dung
  type: 'success' | 'danger' | 'warning' | 'info';  // Màu: xanh/đỏ/vàng/xanh dương
  icon?: string;           // Icon tùy chỉnh (nếu không có dùng mặc định)
}

// Component popup thông báo
const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  show,
  onHide,
  title,
  message,
  type,
  icon
}) => {
  // Hàm chọn màu icon theo type
  const getIconStyle = () => {
    const baseStyle = {
      fontSize: '48px',
      marginBottom: '16px',
      display: 'block'
    };

    switch (type) {
      case 'success': return { ...baseStyle, color: '#28a745' }; // Xanh
      case 'danger': return { ...baseStyle, color: '#dc3545' };  // Đỏ
      case 'warning': return { ...baseStyle, color: '#ffc107' }; // Vàng
      case 'info': return { ...baseStyle, color: '#17a2b8' };    // Xanh dương
      default: return baseStyle;
    }
  };

  // Icon mặc định nếu không truyền prop icon
  const getDefaultIcon = () => {
    switch (type) {
      case 'success': return '';
      case 'danger': return '';
      case 'warning': return '';
      case 'info': return '';
      default: return '';
    }
  };

  // Màu viền trên popup
  const getBorderColor = () => {
    switch (type) {
      case 'success': return '#28a745';
      case 'danger': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#28a745';
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"    // Không đóng khi click ra ngoài
      keyboard={false}     // Không đóng bằng ESC
    >
      <Modal.Body 
        className="text-center py-4" 
        style={{ borderTop: `4px solid ${getBorderColor()}` }}
      >
        {/* Icon */}
        <div style={getIconStyle()}>
          {icon || getDefaultIcon()}
        </div>
        
        {/* Tiêu đề */}
        <h4 className="fw-bold mb-3">{title}</h4>
        
        {/* Nội dung */}
        <p className="text-muted mb-4">{message}</p>
        
        {/* Nút OK */}
        <Button 
          variant={type}
          onClick={onHide}
          className="px-4"
        >
          OK
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationPopup;
