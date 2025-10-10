import React, { useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import OcrIdentityForm from "../indentity/OcrForm";
import ManualIdentityForm from "../indentity/ManualIdentityForm";

type KycStatus = 'VERIFIED' | 'PENDING_VERIFICATION' | 'NEED_UPLOAD';

const KycVerification: React.FC = () => {
  const { user, loading, refetch } = useUserProfile();
  const [showManualForm, setShowManualForm] = useState(false);

  // Nếu đang loading hoặc chưa có user data
  if (loading) {
    return (
      <div className="container my-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2">Đang kiểm tra trạng thái xác thực...</p>
          </div>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="container my-4">
        <div className="card">
          <div className="card-body text-center">
            <h5 className="text-muted">Vui lòng đăng nhập để tiếp tục</h5>
          </div>
        </div>
      </div>
    );
  }

  const kycStatus: KycStatus = user.kycStatus || 'NEED_UPLOAD';

  // Nếu đã verified
  if (kycStatus === 'VERIFIED') {
    return (
      <div className="container my-4">
        <div className="card border-success">
          <div className="card-body text-center">
            <div className="text-success mb-3">
              <i className="fas fa-check-circle fa-3x"></i>
            </div>
            <h5 className="text-success fw-bold">Tài khoản đã được xác thực</h5>
            <p className="text-muted">
              Tài khoản của bạn đã được xác thực thành công. Bạn có thể sử dụng đầy đủ các tính năng.
            </p>
            <div className="mt-3">
              <span className="badge bg-success fs-6">
                <i className="fas fa-shield-alt me-1"></i>
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu đang pending verification
  if (kycStatus === 'PENDING_VERIFICATION') {
    return (
      <div className="container my-4">
        <div className="card border-warning">
          <div className="card-body text-center">
            <div className="text-warning mb-3">
              <i className="fas fa-clock fa-3x"></i>
            </div>
            <h5 className="text-warning fw-bold">Đang chờ xác thực</h5>
            <p className="text-muted">
              Thông tin của bạn đã được gửi và đang được xem xét. Vui lòng chờ trong ít phút.
            </p>
            <div className="mt-3">
              <span className="badge bg-warning fs-6">
                <i className="fas fa-hourglass-half me-1"></i>
                PENDING VERIFICATION
              </span>
            </div>
            <div className="mt-3">
              <button 
                className="btn btn-outline-primary"
                onClick={() => refetch()}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Kiểm tra lại trạng thái
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu cần verification - hiển thị form OCR
  return (
    <div className="container my-4">
      <div className="card border-info">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0 fw-bold">
            <i className="fas fa-id-card me-2"></i>
            Xác thực danh tính
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h6 className="alert-heading">
              <i className="fas fa-info-circle me-1"></i>
              Tại sao cần xác thực?
            </h6>
            <p className="mb-0">
              Để đảm bảo an toàn và tuân thủ quy định, chúng tôi cần xác thực danh tính của bạn 
              trước khi bạn có thể sử dụng đầy đủ các tính năng thuê xe.
            </p>
          </div>

          <div className="text-center mb-4">
            <span className="badge bg-info fs-6">
              <i className="fas fa-exclamation-triangle me-1"></i>
              NEED UPLOAD
            </span>
          </div>

          {/* Hiển thị form OCR hoặc Manual form */}
          {showManualForm ? (
            <ManualIdentityForm onSwitchToOcr={() => setShowManualForm(false)} />
          ) : (
            <OcrIdentityForm onSwitchToManual={() => setShowManualForm(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default KycVerification;
