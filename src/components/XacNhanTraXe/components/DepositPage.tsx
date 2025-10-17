import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import "./DepositPage.css";

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  estimatedPrice: number;
  deposit: number;
  vehicleId: number;
}

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  plateNumber: string;
  battery: string;
  range: string;
  imageUrl: string;
}

export default function DepositPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🛰️ Lấy dữ liệu đặt xe từ backend
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/bookings/101"); // ví dụ
        const data = await response.json();
        setBooking(data);
        setLoadingBooking(false);

        // Sau khi có thông tin booking → gọi tiếp để lấy thông tin xe
        if (data.vehicleId) {
          fetchVehicle(data.vehicleId);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin đặt xe:", err);
        setLoadingBooking(false);
      }
    };

    const fetchVehicle = async (vehicleId: number) => {
      try {
        const res = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}`);
        const vehicleData = await res.json();
        setVehicle(vehicleData);
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin xe:", err);
      } finally {
        setLoadingVehicle(false);
      }
    };

    fetchBooking();
  }, []);

  const handleRedirectToMomo = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/bookings/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking?.id,
          paymentMethod: "momo",
          amount: booking?.deposit,
        }),
      });

      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Không thể tạo liên kết thanh toán.");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi redirect sang MoMo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 deposit-page">
      <h2 className="text-center fw-bold mb-5">Xác nhận đặt xe</h2>

      {/* THÔNG TIN ĐẶT XE */}
      <section className="card-custom mb-4 info-box">
        <h5 className="fw-bold mb-3 text-primary">THÔNG TIN ĐẶT XE</h5>
        {loadingBooking ? (
          <p>Đang tải thông tin đặt xe...</p>
        ) : booking ? (
          <ul className="info-list">
            <li>
              <strong>Mã đặt xe:</strong> {booking.id}
            </li>
            <li>
              <strong>Thời gian thuê:</strong>{" "}
              {booking.startTime} - {booking.endTime}
            </li>
            <li>
              <strong>Giá ước tính:</strong>{" "}
              {booking.estimatedPrice.toLocaleString()} VND
            </li>
            <li>
              <strong>Tiền cọc:</strong>{" "}
              {booking.deposit.toLocaleString()} VND
            </li>
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
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="car-image shadow-sm"
            />
            <div className="car-details">
              <p><strong>Tên xe:</strong> {vehicle.name}</p>
              <p><strong>Hãng:</strong> {vehicle.brand}</p>
              <p><strong>Biển số:</strong> {vehicle.plateNumber}</p>
              <p><strong>Pin:</strong> {vehicle.battery}</p>
              <p><strong>Quãng đường:</strong> {vehicle.range}</p>
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
        <Button
          variant="success"
          size="lg"
          onClick={() => setShowConfirm(true)}
          className="rounded-pill px-4"
        >
          Xác nhận thanh toán
        </Button>
      </section>

      {/* Modal xác nhận */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>
            Bạn sắp được chuyển hướng sang trang thanh toán của{" "}
            <strong>MoMo</strong> để thanh toán{" "}
            <strong>{booking?.deposit?.toLocaleString()} VND</strong>.
          </p>
          <p className="text-muted">
            Vui lòng không tắt trình duyệt trong quá trình xử lý.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={handleRedirectToMomo}
            disabled={loading}
            className="px-4"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Đang chuyển hướng...
              </>
            ) : (
              "Tiếp tục đến MoMo"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
