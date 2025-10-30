import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVehicle } from "../hooks/useVehicle";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";
import { useBooking } from "../hooks/useBooking";
import { getVehicleStatusText, getVehicleStatusColor } from "../models/VehicleModel";
import { checkAuthAndKyc, refreshUserFromBackend } from "../utils/authHelpers";
import { toast } from 'react-toastify';
import SearchBar, { LocationSelection, TimeSelection } from "../components/search/SearchBar";
import axios from "axios";

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { sendOTP } = useAuth();
  const [loc, setLoc] = useState<LocationSelection | null>(null);
  const [timeSel, setTimeSel] = useState<TimeSelection | null>(null);

  const {
    vehicleDetail,
    loading,
    error,
    loadVehicleDetail,
    formatBattery,
    formatMileage,
    formatPrice
  } = useVehicle();

  const { handleCreateBooking, bookingId } = useBooking();
  useEffect(() => {
    if (id) {
      loadVehicleDetail(parseInt(id));
    }
  }, [id, loadVehicleDetail]);

  const handleBooking = async () => {
    if (!timeSel) {
      toast.warning("Vui lòng chọn thời gian thuê xe", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    await refreshUserFromBackend();

    const authCheck = checkAuthAndKyc();

    if (authCheck.action === 'LOGIN') {
      openModal('loginForm');
      return;
    }

    if (authCheck.action === 'VERIFY_EMAIL_OTP') {
      if (authCheck.email) {
        const loadingToast = toast.loading("Đang gửi mã OTP...", {
          position: "top-center"
        });

        try {
          await sendOTP(authCheck.email);

          toast.update(loadingToast, {
            render: "Đã gửi mã OTP! Vui lòng kiểm tra email.",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          setTimeout(() => {
            openModal('otpVerificationModal');
          }, 500);
        } catch (error) {
          toast.update(loadingToast, {
            render: "Gửi OTP thất bại! Vui lòng thử lại.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      }
      return;
    }

    if (authCheck.action === 'UPLOAD_KYC') {
      toast.info("Vui lòng hoàn thành xác thực KYC để đặt xe", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate('/kyc-verification');
      }, 500);
      return;
    }

    if (authCheck.action === 'WAIT_APPROVAL') {
      toast.warning(authCheck.message || "Vui lòng đợi admin duyệt KYC", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    if (authCheck.action === 'PROCEED') {
      const startDateTime = `${timeSel.startDate}T${timeSel.startTime}:00`;
      const endDateTime = `${timeSel.endDate}T${timeSel.endTime}:00`;

      try {
        const res = await handleCreateBooking(parseInt(id!), startDateTime, endDateTime);
        // const res2 = await axios.put(`http://localhost:8080/api/bookings/${res.bookingId}/status/reserved`)
        // console.log("đây: ", res2)
        if(res.error || !res === undefined){
          toast.error(res.error, {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }

        toast.success("Đặt xe thành công!", {
          position: "top-center",
          autoClose: 3000,
        });
        
        setTimeout(() => {
          navigate(`/xac-nhan-dat-xe/${res.bookingId}`);
        }, 500);

      } catch (error: any) {
        toast.error(error.response?.data?.data, {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }
  };

  const handleSearch = (location: LocationSelection, time: TimeSelection) => {
    setLoc(location);
    setTimeSel(time);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải thông tin xe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
          Quay lại
        </button>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">
            Lỗi
          </h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!vehicleDetail) {
    return (
      <div className="container py-5">
        <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Quay lại
        </button>
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-circle me-2"></i>
            Không tìm thấy xe
          </h4>
          <p>Không tìm thấy thông tin xe với ID: {id}</p>
        </div>
      </div>
    );
  }

  const statusText = getVehicleStatusText(vehicleDetail.status);
  const statusColor = getVehicleStatusColor(vehicleDetail.status);
  const isAvailable = vehicleDetail.status === "AVAILABLE";

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        Quay lại
      </button>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <img
              src={vehicleDetail.imageUrls}
              className="card-img-top"
              alt={vehicleDetail.vehicleName}
              style={{ height: "300px", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.src = require('../images/car-list/Car.png');
              }}
            />
            <div className="card-body">
              <span className={`badge bg-${statusColor} fs-6`}>
                {statusText}
              </span>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="card-title fw-bold mb-3">{vehicleDetail.vehicleName}</h2>

              <div className="mb-3">
                <h5 className="text-muted">
                  {vehicleDetail.modelName}
                </h5>
              </div>

              <hr />

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div>
                      <small className="text-muted d-block">Biển số</small>
                      <strong>{vehicleDetail.plateNumber}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div>
                      <small className="text-muted d-block">Pin</small>
                      <strong>{formatBattery(vehicleDetail.batteryLevel)}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div>
                      <small className="text-muted d-block">Km đã đi</small>
                      <strong>{formatMileage(vehicleDetail.mileage)}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div>
                      <small className="text-muted d-block">Trạm</small>
                      <strong className="small">{vehicleDetail.stationName}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              {vehicleDetail.description && (
                <>
                  <h5 className="mb-3">Mô tả</h5>
                  <p className="text-muted">{vehicleDetail.description}</p>
                  <hr />
                </>
              )}

              <div className="mb-4">
                <h5 className="mb-3">Giá thuê</h5>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="card bg-light border-0">
                      <div className="card-body text-center">
                        <small className="text-muted d-block">Theo giờ</small>
                        <h4 className="text-primary mb-0">{formatPrice(vehicleDetail.pricePerHour)}</h4>
                        <small className="text-muted">/giờ</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-light border-0">
                      <div className="card-body text-center">
                        <small className="text-muted d-block">Theo ngày</small>
                        <h4 className="text-success mb-0">{formatPrice(vehicleDetail.pricePerDay)}</h4>
                        <small className="text-muted">/ngày</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="d-grid gap-2">
                {isAvailable ? (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleBooking}
                  >
                    Đặt xe ngay
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-lg" disabled>
                    Xe không khả dụng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
