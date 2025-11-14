import React, { useEffect, useState } from "react";
import { Button, Spinner, Card, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Contract.css";
import { Booking } from "../../models/BookingModel";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ContractPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const contract = location.state?.contract;
  console.log("📄 Contract data:", contract);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingView, setLoadingView] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!contract?.bookingId) {
        setErrorMsg("Không tìm thấy ID đơn đặt xe trong hợp đồng.");
        setLoadingBooking(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/bookings/${contract.bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooking(res.data.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải booking:", err);
        setErrorMsg("Không thể tải thông tin đơn đặt xe.");
      } finally {
        setLoadingBooking(false);
      }
    };

    fetchBooking();
  }, [contract?.bookingId]);

  const handleViewContract = async () => {
    try {
      setLoadingView(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/api/contracts/view/${contract.contractId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("❌ Lỗi khi xem hợp đồng:", error);
      alert("Không thể tải file hợp đồng.");
    } finally {
      setLoadingView(false);
    }
  };

  const handleSendOtp = async (): Promise<void> => {
    try {
      setLoadingOtp(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:8080/api/renter/contracts/send-otp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { bookingId: contract.bookingId },
        }
      );

      setOtpSent(true);
      toast.success("✅ Mã OTP đã được gửi đến email của bạn!");
    } catch (error: any) {
      console.error("❌ Lỗi gửi OTP:", error);
      toast.error(
        error.response?.data?.data ||
        "⚠️ Không thể gửi mã OTP. Vui lòng thử lại."
      );
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSignContract = async (): Promise<void> => {
    if (!otp.trim()) {
      toast.warning("⚠️ Vui lòng nhập mã OTP trước khi ký.");
    }

    try {
      setLoadingSign(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:8080/api/renter/contracts/verify-sign`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            bookingId: contract.bookingId,
            otpCode: otp,
          },
        }
      );

      if (response.data) {
        setOtp("");
        toast.success("✅ Hợp đồng đã được ký thành công!");
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (error) {
      console.error("❌ Lỗi khi ký hợp đồng:", error);
      toast.error("❌ Mã OTP không hợp lệ hoặc hợp đồng không thể ký.");
    } finally {
      setLoadingSign(false);
    }
  };

  if (!contract) {
    return <p className="text-danger text-center mt-5">❌ Không tìm thấy thông tin hợp đồng.</p>;
  }

  return (
    <div className="container mt-5 p-5 shadow-sm bg-white rounded-4">
      <ToastContainer position="top-center" autoClose={2500} />
      <h3 className="text-center mb-4 fw-bold text-primary"> HỢP ĐỒNG THUÊ XE</h3>

      <Card className="border-0 shadow mb-4">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-2">
            <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
              <i className="bi bi-file-text-fill text-primary fs-3"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-1 text-dark">Thông tin đơn đặt xe</h5>
              <p className="text-muted mb-0">Mã đơn: <span className="fw-semibold text-dark">{booking?.bookingId}</span></p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12">
              <div className="bg-light rounded-3 p-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar-range text-primary fs-4 me-3"></i>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block mb-1">Thời gian thuê xe</small>
                    <div className="d-flex align-items-center flex-wrap">
                      <span className="fw-bold text-dark me-2">
                        {booking?.startDateTime?.replace("T", " ")}
                      </span>
                      <i className="bi bi-arrow-right text-primary mx-2"></i>
                      <span className="fw-bold text-dark">
                        {booking?.endDateTime?.replace("T", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border border-2 rounded-3 p-3 h-100">
                <div className="d-flex align-items-center">
                  <i className="bi bi-car-front-fill text-primary fs-4 me-3"></i>
                  <div>
                    <small className="text-muted d-block mb-1">Phương tiện</small>
                    <span className="fw-bold text-dark fs-6">{booking?.vehicleName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border border-2 rounded-3 p-3 h-100 bg-success bg-opacity-10">
                <div className="d-flex align-items-center">
                  <i className="bi bi-cash-stack text-success fs-4 me-3"></i>
                  <div>
                    <small className="text-muted d-block mb-1">Đơn giá theo ngày</small>
                    <span className="fw-bold text-success fs-5">
                      {booking?.priceSnapshotPerDay?.toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border border-2 rounded-3 p-3 h-100">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-info fs-4 me-3"></i>
                  <div>
                    <small className="text-muted d-block mb-1">Trạng thái đơn</small>
                    <span className="badge bg-info fs-6 px-3 py-2">{booking?.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border border-2 rounded-3 p-3 h-100">
                <div className="d-flex align-items-center">
                  <i className="bi bi-piggy-bank-fill text-warning fs-4 me-3"></i>
                  <div>
                    <small className="text-muted d-block mb-1">Tình trạng đặt cọc</small>
                    <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                      {booking?.depositStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Nút xem hợp đồng */}
      <div className="text-center mb-4">
        <Button variant="info" size="lg" onClick={handleViewContract} disabled={loadingView}>
          {loadingView ? (
            <>
              <Spinner animation="border" size="sm" /> Đang tải...
            </>
          ) : (
            "Xem hợp đồng"
          )}
        </Button>
      </div>

      {/* Hiển thị OTP & Ký hợp đồng chỉ khi contract.status === "ADMIN_SIGNED" */}
      {contract.status === "ADMIN_SIGNED" && (
        <div className="text-center mt-4">
          <h5 className="fw-bold mb-3 text-success">Xác thực ký hợp đồng</h5>

          {/* 6 ô nhập OTP */}
          <div className="d-flex justify-content-center gap-2 mb-3">
            {otp.split("").concat(Array(6 - otp.length).fill("")).map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!/^\d?$/.test(val)) return;
                  const newOtp =
                    otp.substring(0, index) + val + otp.substring(index + 1);
                  setOtp(newOtp);
                  if (val && index < 5) {
                    const next = document.getElementById(`otp-${index + 1}`);
                    (next as HTMLInputElement)?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[index] && index > 0) {
                    const prev = document.getElementById(`otp-${index - 1}`);
                    (prev as HTMLInputElement)?.focus();
                  }
                }}
                id={`otp-${index}`}
                className="form-control text-center fw-bold fs-4"
                style={{ width: "50px", height: "60px", fontSize: "24px" }}
              />
            ))}
          </div>

          {/* Button gửi lại OTP */}
          <div className="mb-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSendOtp}
              disabled={loadingOtp}
            >
              {loadingOtp ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>
            <div className="mt-2">
              <span className="text-muted">Không nhận được mã? </span>
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={handleSendOtp}
                disabled={loadingOtp}
              >
                Gửi lại
              </Button>
            </div>
          </div>

          {/* Button ký hợp đồng */}
          <div className="text-center">
            <Button
              variant="success"
              size="lg"
              className="fw-semibold"
              onClick={handleSignContract}
              disabled={loadingSign || otp.length < 6}
            >
              {loadingSign ? (
                <>
                  <Spinner animation="border" size="sm" /> Đang ký...
                </>
              ) : (
                "Xác nhận ký"
              )}
            </Button>
          </div>
        </div>
      )}


      {/* Nếu FULLY_SIGNED thì chỉ xem hợp đồng, không hiển thị OTP */}
      {contract.status === "FULLY_SIGNED" && (
        <p className="text-success text-center fw-bold mt-3">
          ✅ Hợp đồng đã được ký hoàn tất.
        </p>
      )}
    </div>
  );
}
