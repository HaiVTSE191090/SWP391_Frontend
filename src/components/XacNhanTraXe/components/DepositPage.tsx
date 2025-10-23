import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner, Alert } from "react-bootstrap";
import "./DepositPage.css";
import { Vehicle } from "../../../models/VehicleModel";
import { Booking } from "../../../models/BookingModel";

export default function DepositPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🛰️ Lấy dữ liệu đặt xe
  useEffect(() => {
    const fetchBooking = async (bookingId: number) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/bookings/2`);
        const data = res.data.data;
        setBooking(data);
        setLoadingBooking(false);

        if (data.vehicleId) {
          fetchVehicle(data.vehicleId);
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi tải thông tin đặt xe:", err);
        setErrorMsg("Không thể tải thông tin đặt xe.");
        setLoadingBooking(false);
      }
    };

    const fetchVehicle = async (vehicleId: number) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/vehicle/detail/${vehicleId}`);
        const data: Vehicle = res.data.data;
        setVehicle(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin xe:", err);
        setErrorMsg("Không thể tải thông tin xe.");
      } finally {
        setLoadingVehicle(false);
      }
    };

    fetchBooking(1); // 🧩 Tạm thời test bookingId = 1
  }, []);

  // 🧾 Bước 1: Cập nhật trạng thái booking + tạo invoice
  const handleConfirmBooking = async () => {
    if (!booking) return;
    setLoading(true);
    setErrorMsg("");

    try {
      // 1️⃣ PUT booking → reserved
      await axios.put(`http://localhost:8080/api/bookings/${booking.bookingId}/status/reserved`);
      console.log("✅ Booking đã cập nhật sang RESERVED");

      // 2️⃣ POST tạo invoice deposit
      const depositAmount = booking.totalAmount * 0.1;
      const resInvoice = await axios.post(
        `http://localhost:8080/api/invoices/bookings/${booking.bookingId}/invoices/deposit`,
        {
          depositAmount,
          notes: "Deposit",
        }
      );

      const createdInvoice = resInvoice.data.data;
      console.log("🧾 Invoice tạo thành công:", createdInvoice);
      setInvoiceId(createdInvoice.invoiceId);
      setShowConfirmBox(true);
    } catch (err: any) {
      console.error("❌ Lỗi khi xác nhận đặt xe:", err);
      setErrorMsg("Không thể xác nhận đặt xe.");
    } finally {
      setLoading(false);
    }
  };

  // 💸 Bước 2: Gọi API MoMo và redirect
  const handleRedirectToMomo = async () => {
    if (!invoiceId || !booking) {
      setErrorMsg("Thiếu thông tin hóa đơn hoặc đặt xe.");
      return;
    }

    try {
      setLoading(true);
      const amount = booking.totalAmount * 0.1;
      const res = await axios.post(`http://localhost:8080/api/payments/invoice/${invoiceId}/momo`, {
        amount,
      });

      const payUrl = res.data.data.payUrl;
      if (payUrl) {
        window.location.href = payUrl; // 🔁 Redirect đến trang test-payment.momo.vn
      } else {
        setErrorMsg("Không thể tạo liên kết thanh toán MoMo.");
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
            <li><strong>Mã đặt xe:</strong> {booking.bookingId}</li>
            <li><strong>Thời gian thuê:</strong> {booking.startDateTime} - {booking.endDateTime}</li>
            <li><strong>Giá ước tính:</strong> {booking.totalAmount.toLocaleString()} VND</li>
            <li><strong>Tiền cọc:</strong> {(booking.totalAmount * 0.1).toLocaleString()} VND</li>
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
              src="https://storage.googleapis.com/vinfast-images/vf3.jpg"
              alt={vehicle.vehicleName}
              className="car-image shadow-sm"
            />
            <div className="car-details">
              <p><strong>Tên xe:</strong> {vehicle.vehicleName}</p>
              <p><strong>Hãng:</strong> {vehicle.modelName}</p>
              <p><strong>Biển số:</strong> {vehicle.plateNumber}</p>
              <p><strong>Pin:</strong> {vehicle.batteryLevel}</p>
              <p><strong>Quãng đường:</strong> {vehicle.mileage}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted">Không tìm thấy thông tin xe.</p>
        )}
      </section>

      {/* NÚT THANH TOÁN */}
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
            onClick={handleConfirmBooking}
            disabled={loading}
            className="rounded-pill px-4"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Đang xử lý...
              </>
            ) : (
              "Xác nhận thanh toán"
            )}
          </Button>
        ) : (
          <div className="confirm-box mt-4 p-3 fade-in">
            <h6 className="fw-bold mb-2">Xác nhận thanh toán</h6>
            <p>
              Bạn sắp được chuyển hướng đến trang <strong>MoMo</strong> để thanh toán{" "}
              <strong>{((booking?.totalAmount ?? 0) * 0.1).toLocaleString()} VND</strong>

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
