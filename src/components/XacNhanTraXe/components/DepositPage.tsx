import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner, Alert } from "react-bootstrap";
import "./DepositPage.css";
import { Vehicle } from "../../../models/VehicleModel";
import { Booking } from "../../../models/BookingModel";
import { useParams } from "react-router-dom";



export default function DepositPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/bookings/${bookingId}`);
        const data = res.data;
        setBooking(data);
        setLoadingBooking(false);

        if (data.vehicleId) {
          fetchVehicle(data.vehicleId);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin đặt xe:", err);
        setLoadingBooking(false);
        setErrorMsg("Không thể tải thông tin đặt xe.");
      }
    };

    const fetchVehicle = async (vehicleId: number) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/vehicles/${vehicleId}`);
        setVehicle(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin xe:", err);
        setErrorMsg("Không thể tải thông tin xe.");
      } finally {
        setLoadingVehicle(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleRedirectToMomo = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/api/bookings/deposit", {
        bookingId: booking?.id,
        paymentMethod: "momo",
        amount: booking?.deposit,
      });

      const data = res.data;
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setErrorMsg("Không thể tạo liên kết thanh toán.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi redirect sang MoMo:", err);
      setErrorMsg("Có lỗi xảy ra khi redirect sang MoMo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 deposit-page">
      <h2 className="text-center fw-bold mb-5">XÁC NHẬN ĐẶT XE</h2>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      {/* THÔNG TIN ĐẶT XE */}
      <section className="card-custom mb-4 info-box">
        <h5 className="fw-bold mb-3 text-primary">THÔNG TIN ĐẶT XE</h5>
        {loadingBooking ? (
          <p>Đang tải thông tin đặt xe...</p>
        ) : booking ? (
          <ul className="info-list">
            <li><strong>Mã đặt xe:</strong> {booking.id}</li>
            <li><strong>Thời gian thuê:</strong> {booking.startTime} - {booking.endTime}</li>
            <li><strong>Giá ước tính:</strong> {booking.estimatedPrice.toLocaleString()} VND</li>
            <li><strong>Tiền cọc:</strong> {booking.deposit.toLocaleString()} VND</li>
          </ul>
        ) : (
          <p className="text-muted">Không tìm thấy thông tin đặt xe.</p>
        )}
      </section>

      {/* THÔNG TIN XE */}
      <section className="card-custom mb-4 car-box">
        <h5 className="fw-bold mb-3 text-success">THÔNG TIN XE</h5>
        {loadingVehicle ? (
          <p>Đang tải thông tin xe...</p>
        ) : vehicle ? (
          <div className="car-info d-flex align-items-center flex-wrap gap-4">
            <div className="car-image shadow-sm">
              <i className="bi bi-car-front-fill" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            </div>
            <div className="car-details">
              <p><strong>Biển số:</strong> {vehicle.plateNumber}</p>
              <p><strong>Model:</strong> {vehicle.modelName || 'Xe điện'}</p>
              <p><strong>Pin:</strong> {vehicle.batteryLevel}%</p>
              <p><strong>Quãng đường đã đi:</strong> {vehicle.mileage.toLocaleString('vi-VN')} km</p>
              <p><strong>Trạng thái:</strong> {vehicle.status}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted">Không tìm thấy thông tin xe.</p>
        )}
      </section>

      {/* THANH TOÁN QUA MOMO */}
      <section className="card-custom fade-in text-center">
        <h5 className="fw-bold mb-3">Thanh toán qua MoMo</h5>
        <img
          src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
          alt="Momo"
          width={80}
          className="mb-3"
        />
        <p>Nhấn xác nhận để chuyển đến trang MoMo và thanh toán tiền cọc.</p>

        {!showConfirmBox ? (
          <Button
            variant="success"
            size="lg"
            onClick={() => setShowConfirmBox(true)}
            className="rounded-pill px-4"
          >
            Xác nhận thanh toán
          </Button>
        ) : (
          <div className="confirm-box mt-4 p-3 fade-in">
            <h6 className="fw-bold mb-2">Xác nhận thanh toán</h6>
            <p>
              Bạn sắp được chuyển hướng đến trang <strong>MoMo</strong> để thanh toán{" "}
              <strong>{booking?.deposit?.toLocaleString()} VND</strong>.
            </p>
            <p className="text-muted small">
              ⚠️ Vui lòng không tắt trình duyệt trong quá trình xử lý.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirmBox(false)}
              >
                Hủy
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleRedirectToMomo}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Đang xử lý...
                  </>
                ) : (
                  "Tiếp tục đến MoMo"
                )}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
