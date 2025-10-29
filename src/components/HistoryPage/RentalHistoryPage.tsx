import React, { useEffect, useState } from "react";
import { Button, Spinner, Badge } from "react-bootstrap";
import "./RentalHistoryPage.css";
import {Booking} from "../../models/BookingModel";
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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => 
      {
        try {
          const token = localStorage.getItem("token"); 
          const res = await axios.get("http://localhost:8080/api/renter/bookings",{
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

  // Hiển thị loading
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
              >
                Nhận xe
              </Button>
              <Button
                variant={
                  b.status === "IN_USE" ? "success" : "secondary"
                }
                disabled={b.status !== "IN_USE"}
              >
                Trả xe
              </Button>
              
               {b.status === "PENDING" && (
                <Button variant="danger">Hủy đơn đặt xe</Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
