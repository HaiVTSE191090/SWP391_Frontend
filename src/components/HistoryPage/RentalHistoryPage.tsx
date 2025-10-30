import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Badge, Modal } from "react-bootstrap";
import "./RentalHistoryPage.css";
import { Booking } from "../../models/BookingModel";
import axios from "axios";
import { set } from "react-datepicker/dist/date_utils";



const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function RentalHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/renter/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.data;
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin đơn đặt xe:", error);
        setErrorMsg("Không thể tải thông tin đặt xe.");
      }
    };

    setLoading(true);


    fetchData();
  }, []);

  const navigate = useNavigate();

  const fetchBookingDetail = async (bookingId: number) => {
    try {
      setLoadingDetail(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/renter/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedBooking(res.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn đặt xe", error);
      alert("Không thể tải chi tiết đơn đặt xe.");
    } finally {
      setLoadingDetail(false);
    }
  }

  const handleCancelClick = (bookingId: number) => {
    setBookingToCancel(bookingId);
    setShowCancelConfirm(true);
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Đang tải lịch sử thuê xe...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-center mb-4">
        Lịch sử thuê xe của người dùng
      </h3>

      {bookings.length === 0 ? (
        <p className="text-center text-muted">
          Bạn chưa có lịch sử thuê xe.
        </p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.bookingId}
            className="booking-card d-flex align-items-center shadow-sm p-3 rounded mb-3"
            onClick={() => fetchBookingDetail(b.bookingId)}
            style={{ cursor: "pointer" }}
          >
            <div className="flex-grow-1 px-3">
              <h5 className="fw-bold mb-1">{b.vehicleName}</h5>
              <p className="mb-1">
                <strong>Thời gian:</strong> {formatDateTime(b.startDateTime)} -{" "}
                {formatDateTime(b.endDateTime)}
              </p>
              <Badge
                bg={
                  b.status === "PENDING"
                    ? "warning"
                    : b.status === "IN_USE"
                      ? "success"
                      : "secondary"
                }
              >
                {b.status === "PENDING"
                  ? "Đang chờ nhận xe"
                  : b.status === "IN_USE"
                    ? "Đang sử dụng"
                    : "Hoàn tất"}
              </Badge>
            </div>
            <div className="d-flex gap-3">
              <Button
                variant={
                  b.status === "PENDING" ? "success" : "secondary"
                }
                disabled={b.status !== "PENDING"}
                onClick={(e) => {
                  navigate(`/contract-preview/${b.bookingId}`);
                  e.stopPropagation();
                }}
              >
                Nhận xe
              </Button>
              <Button
                variant={
                  b.status === "IN_USE" ? "success" : "secondary"
                }
                disabled={b.status !== "IN_USE"}
                onClick={(e) => {
                  e.stopPropagation(); // ⛔ Ngăn click lan ra thẻ cha
                  // Thêm logic trả xe ở đây
                }}
              >
                Trả xe
              </Button>

              {b.status === "PENDING" && (
                <Button variant="danger" onClick={(e) => {
                  handleCancelClick(b.bookingId);
                  e.stopPropagation();
                }}>
                  Hủy đơn đặt xe
                </Button>
              )}
            </div>

          </div>
        ))
      )}

      {selectedBooking && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          className="booking-detail-modal" // Thêm class tùy chỉnh
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <span className="modal-title-text">Chi tiết đơn đặt xe</span>
              <span className="modal-title-id">#{selectedBooking.bookingId}</span>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {loadingDetail ? (
              <div className="modal-loading">
                <Spinner animation="border" variant="primary" />
                <p>Đang tải chi tiết...</p>
              </div>
            ) : (
              <div className="modal-detail-content">
                <div className="detail-item">
                  <span className="label">Người thuê</span>
                  <span className="value">{selectedBooking.renterName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Xe</span>
                  <span className="value">{selectedBooking.vehicleName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Nhân viên</span>
                  <span className="value">{selectedBooking.staffName}</span>
                </div>

                <hr className="detail-divider" />

                <div className="detail-item">
                  <span className="label">Thời gian thuê</span>
                  <span className="value text-right">
                    {formatDateTime(selectedBooking.startDateTime)}<br />
                    đến {formatDateTime(selectedBooking.endDateTime)}
                  </span>
                </div>
                {selectedBooking.actualReturnTime && (
                  <div className="detail-item">
                    <span className="label">Trả thực tế</span>
                    <span className="value">{formatDateTime(selectedBooking.actualReturnTime)}</span>
                  </div>
                )}

                <hr className="detail-divider" />

                <div className="detail-item">
                  <span className="label">Giá/ngày</span>
                  <span className="value">{selectedBooking.priceSnapshotPerDay.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Đặt cọc</span>
                  <span className="value">{selectedBooking.depositStatus}</span>
                </div>
                <div className="detail-item total-amount">
                  <span className="label">Tổng tiền</span>
                  <span className="value">{selectedBooking.totalAmount.toLocaleString()} VND</span>
                </div>

                <div className="detail-item status-item">
                  <span className="label">Trạng thái</span>
                  <span className="value">
                    {selectedBooking.status === "PENDING"
                      ? "Đang chờ nhận xe"
                      : selectedBooking.status === "IN_USE"
                        ? "Đang sử dụng"
                        : "Đã hoàn thành"}
                  </span>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}

      <Modal
        show={showCancelConfirm}
        onHide={() => setShowCancelConfirm(false)}
        centered
        className="cancel-confirm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cảnh báo hủy đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger fw-bold">
            ⚠️ Bạn sẽ bị mất <strong>50% tiền cọc</strong> nếu hủy đơn này.
          </p>
          <p>Bạn có chắc chắn muốn hủy đơn không?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelConfirm(false)}>
            Không
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowCancelConfirm(false);
              //chỗ này sau này gọi API hủy đơn thật
              console.log("Gọi API hủy đơn cho booking:", bookingToCancel);
            }}
          >
            Có
          </Button>
        </Modal.Footer>
      </Modal>

    </div>

  );
}
