import React, { useState } from "react";
import OcrKycForm from "./OcrKycForm";
import ManualKycForm from "./ManualKycForm";
import { useAuth } from "../../hooks/useAuth";

type KycStatus = 'VERIFIED' | 'PENDING_VERIFICATION' | 'NEED_UPLOAD';

const KycVerification: React.FC = () => {
  const { user, loading } = useAuth();
  const [showManualForm, setShowManualForm] = useState(false);
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

  if (!user) {
    return (
      <div className="container my-4">
        <div className="card">
          <div className="card-body text-center">
            <h5 className="text-muted">Vui lòng đăng nhập để tiếp tục</h5>
            <p className="text-secondary mt-2">Bạn cần đăng nhập trước khi xác thực danh tính</p>
          </div>
        </div>
      </div>
    );
  }

  const kycStatus: KycStatus = user.kycStatus || 'NEED_UPLOAD';

  if (kycStatus === 'VERIFIED') {
    return (
      <div className="container my-4">
        <div className="card border-success">
          <div className="card-body text-center">
            <h5 className="text-success fw-bold">Tài khoản đã được xác thực</h5>
            <p className="text-muted">
              Tài khoản của bạn đã được xác thực thành công. Bạn có thể sử dụng đầy đủ các tính năng.
            </p>
            <div className="mt-3">
              <span className="badge bg-success fs-6">
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kycStatus === 'PENDING_VERIFICATION') {
    return (
      <div className="container my-4">
        <div className="card border-warning">
          <div className="card-body text-center">
            <h5 className="text-warning fw-bold">Đang chờ xác thực</h5>
            <p className="text-muted">
              Thông tin của bạn đã được gửi và đang được xem xét. Vui lòng chờ trong ít phút.
            </p>
            <div className="mt-3">
              <span className="badge bg-warning fs-6">
                PENDING VERIFICATION
              </span>
            </div>
            <div className="mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => window.location.reload()}
              >
                Kiểm tra lại trạng thái
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container my-4">
      <div className="card border-info">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0 fw-bold">
            Xác thực danh tính
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h6 className="alert-heading">
              Tại sao cần xác thực?
            </h6>
            <p className="mb-0">
              Để đảm bảo an toàn và tuân thủ quy định, chúng tôi cần xác thực danh tính của bạn
              trước khi bạn có thể sử dụng đầy đủ các tính năng thuê xe.
            </p>
          </div>

          <div className="text-center mb-4">
            <span className="badge bg-info fs-6">
              NEED UPLOAD
            </span>
          </div>

          {showManualForm ? (
            <ManualKycForm onSwitchToOcr={() => setShowManualForm(false)} />
          ) : (
            <OcrKycForm onSwitchToManual={() => setShowManualForm(true)} />
          )}
        </div>
      </div>
    </div>
  );

};

export default KycVerification;
