import React, { useEffect, useState } from "react";
import { Button, Spinner, Badge } from "react-bootstrap";
import "./RentalHistoryPage.css";

interface Booking {
  id: number;
  vehicleName: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function RentalHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  //giả lập API call
  useEffect(() => {
    const mockData: Booking[] = [
      {
        id: 1,
        vehicleName: "VinFast Vf5",
        imageUrl:
          "https://storage.googleapis.com/vinfast-images/evo200.jpg",
        startTime: "10:00 30/09/2025",
        endTime: "14:00 30/09/2025",
        status: "PENDING",
      },
      {
        id: 2,
        vehicleName: "VinFast Vf5 plus",
        imageUrl:
          "https://storage.googleapis.com/vinfast-images/feliz-s.jpg",
        startTime: "08:00 01/10/2025",
        endTime: "16:00 01/10/2025",
        status: "IN_USE",
      },
      {
        id: 3,
        vehicleName: "VinFast Vf8",
        imageUrl:
          "https://storage.googleapis.com/vinfast-images/klara-a2.jpg",
        startTime: "12:00 28/09/2025",
        endTime: "18:00 28/09/2025",
        status: "COMPLETED",
      },
    ];

    // Mô phỏng độ trễ API
    setTimeout(() => {
      setBookings(mockData);
      setLoading(false);
    }, 600);
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
            key={b.id}
            className="booking-card d-flex align-items-center shadow-sm p-3 rounded mb-3"
          >
            <img
              src={b.imageUrl}
              alt={b.vehicleName}
              className="car-thumb"
            />
            <div className="flex-grow-1 px-3">
              <h5 className="fw-bold mb-1">{b.vehicleName}</h5>
              <p className="mb-1">
                <strong>Thời gian:</strong> {b.startTime} - {b.endTime}
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
            <div className="d-flex gap-2">
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
            </div>
          </div>
        ))
      )}
    </div>
  );
}
