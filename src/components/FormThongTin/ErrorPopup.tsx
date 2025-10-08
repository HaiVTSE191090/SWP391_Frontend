import React from 'react';
import './ErrorPopup.css';

interface ErrorPopupProps {
  errors: string[];
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ errors, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Lỗi Xác Thực</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="popup-body">
          <div className="error-icon">
            ⚠️
          </div>
          <div className="error-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                • {error}
              </div>
            ))}
          </div>
        </div>
        
        <div className="popup-footer">
          <button className="ok-btn" onClick={onClose}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;