import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Badge, Modal } from "react-bootstrap";
import "./RentalHistoryPage.css";
import { Booking } from "../../models/BookingModel";
import axios from "axios";

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
  const [contractStatuses, setContractStatuses] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);

        // ✅ Lấy danh sách booking
        const res = await axios.get("http://localhost:8080/api/renter/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setBookings(data);

        // ✅ Lấy trạng thái hợp đồng tương ứng
        const statusMap: { [key: number]: string } = {};
        for (const bk of data) {
          try {
            const resContract = await axios.get(
              `http://localhost:8080/api/contracts/${bk.bookingId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            statusMap[bk.bookingId] = resContract.data.data?.status;
          } catch (err) {
            console.warn(`Không thể lấy trạng thái contract cho booking ${bk.bookingId}`);
          }
        }
        setContractStatuses(statusMap);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  };

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
      <h3 className="fw-bold text-center mb-4">Lịch sử thuê xe của người dùng</h3>

      {bookings.length === 0 ? (
        <p className="text-center text-muted">Bạn chưa có lịch sử thuê xe.</p>
      ) : (
        bookings.map((b) => {
          const contractStatus = contractStatuses[b.bookingId];

          return (
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
                      : b.status === "RESERVED"
                        ? "info"
                        : b.status === "IN_USE"
                          ? "success"
                          : b.status === "COMPLETED"
                            ? "secondary"
                            : b.status === "CANCELLED"
                              ? "danger"
                              : "dark"
                  }
                >
                  {b.status === "PENDING"
                    ? "Đang chờ duyệt"
                    : b.status === "RESERVED"
                      ? "Đang chờ nhận xe"
                      : b.status === "IN_USE"
                        ? "Đang sử dụng"
                        : b.status === "COMPLETED"
                          ? "Hoàn tất"
                          : b.status === "CANCELLED"
                            ? "Đã hủy"
                            : "Đã hết hạn"}
                </Badge>
              </div>

              {/* ---- Các nút hành động ---- */}
              <div className="d-flex flex-wrap align-items-center gap-2">

                {/* ✅ Nút Ký/Xem hợp đồng */}
                {(() => {
                  if (contractStatus === "CANCELLED") return null; // Ẩn nếu hợp đồng bị hủy

                  if (contractStatus === "PENDING_ADMIN_SIGNATURE") {
                    return (
                      <Button variant="secondary" disabled>
                        Ký hợp đồng
                      </Button>
                    );
                  }

                  if (contractStatus === "ADMIN_SIGNED") {
                    return (
                      <Button
                        variant="success"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const token = localStorage.getItem("token");
                            const res = await axios.get(
                              `http://localhost:8080/api/contracts/${b.bookingId}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            navigate(`/contract-preview/${b.bookingId}`, {
                              state: { contract: res.data.data },
                            });
                          } catch (error) {
                            alert("Không thể tải hợp đồng. Vui lòng thử lại.");
                          }
                        }}
                      >
                        Ký hợp đồng
                      </Button>
                    );
                  }

                  if (contractStatus === "FULLY_SIGNED") {
                    return (
                      <Button
                        variant="info"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const token = localStorage.getItem("token");
                            const res = await axios.get(
                              `http://localhost:8080/api/contracts/${b.bookingId}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            navigate(`/contract-preview/${b.bookingId}`, {
                              state: { contract: res.data.data },
                            });
                          } catch (error) {
                            alert("Không thể tải hợp đồng. Vui lòng thử lại.");
                          }
                        }}
                      >
                        Xem hợp đồng
                      </Button>
                    );
                  }

                  return (
                    <Button variant="secondary" disabled>
                      Chưa có hợp đồng
                    </Button>
                  );
                })()}

                {/* 💰 Nút Đặt cọc / Đã hoàn tiền */}
                {(() => {
                  if (b.depositStatus === "PENDING") {
                    return (
                      <Button
                        variant="warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Đặt cọc cho booking #${b.bookingId}`);
                        }}
                      >
                        Đặt cọc
                      </Button>
                    );
                  }

                  if (b.depositStatus === "REFUNDED") {
                    return (
                      <Button variant="outline-success" disabled>
                        Đã hoàn tiền
                      </Button>
                    );
                  }

                  // Nếu depositStatus = PAID hoặc null → không hiển thị gì
                  return null;
                })()}

                {/* ✅ Nút Trả xe */}
                <Button
                  variant={b.status === "IN_USE" ? "success" : "secondary"}
                  disabled={b.status !== "IN_USE"}
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Gọi API trả xe
                  }}
                >
                  Trả xe
                </Button>

                {/* ✅ Nút Hủy đơn (ẩn khi hợp đồng FULLY_SIGNED hoặc CANCELLED) */}
                {b.status === "RESERVED" &&
                  contractStatus !== "FULLY_SIGNED" &&
                  contractStatus !== "CANCELLED" && (
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelClick(b.bookingId);
                      }}
                    >
                      Hủy đơn đặt xe
                    </Button>
                  )}
              </div>
            </div>
          );
        })
      )}

      {/* Modal Chi tiết đơn */}
      {selectedBooking && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn đặt xe #{selectedBooking.bookingId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingDetail ? (
              <div className="text-center">
                <Spinner animation="border" /> Đang tải chi tiết...
              </div>
            ) : (
              <div>
                <p><strong>Người thuê:</strong> {selectedBooking.renterName}</p>
                <p><strong>Xe:</strong> {selectedBooking.vehicleName}</p>
                <p><strong>Nhân viên:</strong> {selectedBooking.staffName}</p>
                <p><strong>Thời gian:</strong> {formatDateTime(selectedBooking.startDateTime)} → {formatDateTime(selectedBooking.endDateTime)}</p>
                <p><strong>Tổng tiền:</strong> {selectedBooking.totalAmount.toLocaleString()} VND</p>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}

      {/* Modal xác nhận hủy */}
      <Modal show={showCancelConfirm} onHide={() => setShowCancelConfirm(false)} centered>
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
              console.log("API hủy đơn cho booking:", bookingToCancel);
            }}
          >
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
