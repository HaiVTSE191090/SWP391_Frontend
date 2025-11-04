import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getProfile } from "../../services/authService";
import { User } from "../../models/AuthModel";
import "./UserProfile.css";

const UserProfile: React.FC = () => {
  const userContext = useContext(UserContext);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userContext?.token) {
        setError("Vui lòng đăng nhập để xem thông tin");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProfile(userContext.token);

        if (response.data) {
          setProfileData(response.data);
          setError(null);
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userContext?.token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    // TODO: Implement update profile API
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        [field]: value,
      });
    }
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="user-profile-container">
        <div className="no-data-message">
          <p>Không tìm thấy thông tin người dùng</p>
        </div>
      </div>
    );
  }

  const getKycStatusText = (status?: string) => {
    switch (status) {
      case "VERIFIED":
        return "Đã xác thực";
      case "PENDING_VERIFICATION":
        return "Đang chờ xác thực";
      case "NEED_UPLOAD":
        return "Cần tải lên";
      default:
        return "Chưa xác thực";
    }
  };

  const getKycStatusClass = (status?: string) => {
    switch (status) {
      case "VERIFIED":
        return "status-verified";
      case "PENDING_VERIFICATION":
        return "status-pending";
      case "NEED_UPLOAD":
        return "status-need-upload";
      default:
        return "status-unverified";
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <h2 className="profile-title">Thông tin cá nhân</h2>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3 className="section-title">Thông tin cơ bản</h3>

            <div className="info-group">
              <label className="info-label">Họ và tên</label>
              {isEditing ? (
                <input
                  type="text"
                  className="info-input"
                  value={profileData.fullName || ""}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              ) : (
                <p className="info-value">{profileData.fullName || "Chưa cập nhật"}</p>
              )}
            </div>

            <div className="info-group">
              <label className="info-label">Email</label>
              <p className="info-value">{profileData.email}</p>
              <span className="info-note">Email không thể thay đổi</span>
            </div>

            <div className="info-group">
              <label className="info-label">Số điện thoại</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="info-input"
                  value={profileData.phoneNumber || ""}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
              ) : (
                <p className="info-value">{profileData.phoneNumber || "Chưa cập nhật"}</p>
              )}
            </div>

            <div className="info-group">
              <label className="info-label">Địa chỉ</label>
              {isEditing ? (
                <textarea
                  className="info-textarea"
                  value={profileData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="info-value">{profileData.address || "Chưa cập nhật"}</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Trạng thái tài khoản</h3>

            {/* Trạng thái KYC */}
            <div className="info-group">
              <label className="info-label">Trạng thái KYC</label>
              <div className="status-container">
                <span className={`status-badge ${getKycStatusClass(profileData.kycStatus)}`}>
                  {getKycStatusText(profileData.kycStatus)}
                </span>
                {profileData.kycStatus !== "VERIFIED" && (
                  <a href="/kyc-verification" className="verify-link">
                    Xác thực ngay
                  </a>
                )}
              </div>
            </div>

            {/* Trạng thái tài khoản */}
            <div className="info-group">
              <label className="info-label">Trạng thái tài khoản</label>
              <span className={`status-badge ${profileData.blacklisted ? "status-blocked" : "status-active"}`}>
                {profileData.blacklisted ? "Bị khóa" : "Hoạt động"}
              </span>
            </div>

            {/* Mã người thuê */}
            {profileData.renterId && (
              <div className="info-group">
                <label className="info-label">Mã người thuê</label>
                <p className="info-value">#{profileData.renterId}</p>
              </div>
            )}

            {/* 🪙 Ví của bạn */}
            <div className="info-group wallet-section">
              <label className="info-label">Ví của bạn</label>
              <div className="wallet-box">
                <p className="wallet-balance">
                  {"500.000 VND"}
                </p>
                <button
                  className="btn btn-outline-primary view-transactions-btn"
                  onClick={() => window.location.href = "/wallet/transactions"}
                >
                  Xem các giao dịch của bạn
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-secondary" onClick={handleCancel}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Lưu thay đổi
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={handleEdit}>
              <i className="fas fa-edit"></i> Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
