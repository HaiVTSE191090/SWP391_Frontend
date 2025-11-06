import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner, Alert } from "react-bootstrap";
import "./DepositPage.css";
import { Vehicle } from "../../../models/VehicleModel";
import { Booking } from "../../../models/BookingModel";
import { data, useParams } from "react-router-dom";
import { set } from "react-datepicker/dist/date_utils";



export default function DepositPage() {
  const [invoiceId, setInvoiceId] = useState<number>(0);
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [depositNumber, setDepositNumber] = useState<number>(5000000);
  const [selectedGateway, setSelectedGateway] = useState<"momo" | "payos" | null>(null);


  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/bookings/${bookingId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = res.data.data;
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
        const res = await axios.get(`http://localhost:8080/api/vehicle/detail/${vehicleId}`)
        const data = res.data.data;
        console.log("✅ Vehicle detail:", res.data.data);
        setVehicle(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin xe:", err);
        setErrorMsg("Không thể tải thông tin xe.");
      } finally {
        setLoadingVehicle(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleConfirm = async () => {
    setShowConfirmBox(true);
    try {
      const res = await axios.post(`http://localhost:8080/api/invoices/bookings/${bookingId}/invoices/deposit`, null, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const res2 = await axios.get(`http://localhost:8080/api/invoices/bookings/${bookingId}/invoices`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data2 = res2.data.data;
      setInvoiceId(data2[0].invoiceId);
      setDepositNumber(data2[0].depositAmount);
      console.log("✅ Tạo hóa đơn tiền cọc thành công:", res.data.data);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.data || "Đã xảy ra lỗi khi tạo hóa đơn tiền cọc.");
    }

  }


  const handleRedirectToMomo = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:8080/api/payments/invoice/${invoiceId}/momo`, {
        amount: depositNumber,
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = res.data.data;
      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        setErrorMsg("Không thể tạo liên kết thanh toán.");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.data || "Đã xảy ra lỗi khi tạo liên kết thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToPayOS = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8080/api/payments/invoice/${invoiceId}/payos`,
        { amount: depositNumber },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = res.data.data;
      if (data.checkoutUrl) {
        // ✅ Chuyển hướng đến link thanh toán PayOS
        window.location.href = data.checkoutUrl;
      } else if (data.qrCode) {
        // ✅ Nếu trả về QR code, mở tab mới để hiển thị
        const newTab = window.open();
        newTab!.document.write(`<img src="${data.qrCode}" alt="QR Code PayOS"/>`);
      } else {
        setErrorMsg("Không thể tạo liên kết thanh toán PayOS.");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi gọi PayOS:", err);
      setErrorMsg(err.response?.data?.message || "Đã xảy ra lỗi khi tạo liên kết PayOS.");
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
            <li><strong>Thời gian thuê:</strong> {booking.startDateTime.replace("T", " ")} - {booking.endDateTime.replace("T", " ")}</li>
            <li><strong>Giá ước tính:</strong> {booking.totalAmount.toLocaleString('vi-VN')} VND</li>
            <li><strong>Tiền cọc:</strong> {depositNumber.toLocaleString('vi-VN')} VND</li>
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
          <div className="car-info ">
            <ul className="info-list">
              <li><strong>Biển số:</strong> {vehicle.plateNumber}</li>
              <li><strong>Model:</strong> {vehicle.modelName || 'Xe điện'}</li>
              <li><strong>Pin:</strong> {vehicle.batteryLevel}%</li>
              <li><strong>Quãng đường đã đi:</strong> {vehicle.mileage.toLocaleString('vi-VN')} km</li>
              <li><strong>Trạng thái:</strong> {vehicle.status}</li>
            </ul>
          </div>
        ) : (
          <p className="text-muted">Không tìm thấy thông tin xe.</p>
        )}
      </section>

      {/* THANH TOÁN TIỀN CỌC */}
      <section className="card-custom fade-in text-center">
        <h5 className="fw-bold mb-3">Thanh toán tiền cọc</h5>
        <p>Chọn phương thức thanh toán bạn muốn sử dụng:</p>

        {!showConfirmBox ? (
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            {/* --- Nút MOMO --- */}
            <Button
              variant="success"
              size="lg"
              onClick={() => {
                setSelectedGateway("momo");
                handleConfirm();
              }}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                alt="MoMo"
                width={35}
                height={35}
              />
              Thanh toán bằng MoMo
            </Button>

            {/* --- Nút PAYOS --- */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setSelectedGateway("payos");
                handleConfirm();
              }}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <img
                src="https://cdn.payos.vn/logo/payos-logo.svg"
                alt="PayOS"
                width={35}
                height={35}
              />
              Thanh toán bằng PayOS
            </Button>
          </div>
        ) : (
          <div className="confirm-box mt-4 p-3 fade-in">
            <h6 className="fw-bold mb-2">Xác nhận thanh toán</h6>
            <p>
              Bạn sắp được chuyển hướng đến trang{" "}
              <strong>{selectedGateway === "momo" ? "MoMo" : "PayOS"}</strong> để thanh toán{" "}
              <strong>{depositNumber.toLocaleString("vi-VN")} VND</strong>.
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
                onClick={() =>
                  selectedGateway === "momo"
                    ? handleRedirectToMomo()
                    : handleRedirectToPayOS()
                }
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Đang xử lý...
                  </>
                ) : (
                  `Tiếp tục đến ${selectedGateway === "momo" ? "MoMo" : "PayOS"}`
                )}
              </Button>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
