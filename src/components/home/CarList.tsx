import React from "react";
import vf9 from "../../images/car-list/Car.png"; 
import vf7 from "../../images/car-list/Car-2.png";
import vf6 from "../../images/car-list/Car-7.png";
import vf3p from "../../images/car-list/source/vf31.png";
import vf3b from "../../images/car-list/source/vf3-blue.jpg";
import vf3r from "../../images/car-list/source/vf3-red.png";
import vf5 from "../../images/car-list/Car-4.png";
import vf8 from "../../images/car-list/Car-1.png";

type Car = {
  id: number;
  name: string;
  variant: string;     // ví dụ: E-SUV, City Car...
  pricePerDay: number; // VND/day
  image?: string;      // sẽ thay bằng import ảnh thật sau
  seats?: number;
  rangeKm?: number;
  gearbox?: "AT" | "MT";
};

//nơi để demo, sẽ thay bằng API sau
const defaultCars: Car[] = [
  { id: 1, name: "VinFast VF 9",  variant: "E-SUV",     pricePerDay: 2590000, seats: 6,  rangeKm: 400, gearbox: "AT", image: vf9 },
  { id: 2, name: "VinFast VF 7",  variant: "Crossover", pricePerDay: 1500000, seats: 5,  rangeKm: 350, gearbox: "AT", image: vf7 },
  { id: 3, name: "VinFast VF 6 Plus", variant: "B-SUV", pricePerDay: 1250000, seats: 5,  rangeKm: 330, gearbox: "AT", image: vf6 },
  { id: 4, name: "VinFast VF 3",  variant: "City Car",  pricePerDay: 590000,  seats: 4,  rangeKm: 210, gearbox: "AT", image: vf3p },
  { id: 5, name: "VinFast VF 3",  variant: "City Car",  pricePerDay: 590000,  seats: 4,  rangeKm: 210, gearbox: "AT", image: vf3b },
  { id: 6, name: "VinFast VF 3",  variant: "City Car",  pricePerDay: 590000,  seats: 4,  rangeKm: 210, gearbox: "AT", image: vf3r },
  { id: 7, name: "VinFast VF 5",  variant: "A-SUV",     pricePerDay: 1000000, seats: 5,  rangeKm: 300, gearbox: "AT", image: vf5 },
  { id: 8, name: "VinFast VF 8",  variant: "D-SUV",     pricePerDay: 1750000, seats: 5,  rangeKm: 420, gearbox: "AT", image: vf8 },
  { id: 9, name: "VinFast VF 5 Plus", variant: "A-SUV", pricePerDay: 1250000, seats: 5,  rangeKm: 300, gearbox: "AT", image: vf5 },
];

function formatVND(n: number) {
  return n.toLocaleString("vi-VN");
}

export const CarList: React.FC<{ cars?: Car[] }> = ({ cars = defaultCars }) => {
  return (
    <section className="container py-5">
      <h2 className="text-center fw-bold mb-4">Xe dành cho bạn</h2>

      <div className="row g-4">
        {cars.map((car) => (
          <div key={car.id} className="col-12 col-sm-6 col-md-4">
            <div
              className="card h-100 shadow-sm border-0 position-relative"
              style={{ transition: "transform .18s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Nút yêu thích (demo) */}
              <button
                type="button"
                className="btn btn-light border position-absolute top-0 end-0 m-2 rounded-circle"
                aria-label="Yêu thích"
              >
                ❤
              </button>

              {/* Ảnh: dùng ratio + object-fit để thay ảnh sau rất dễ */}
              <div className="ratio ratio-16x9 bg-light">
                <img
                  src={
                    car.image && car.image.length > 0
                      ? car.image
                      : "https://via.placeholder.com/600x340?text=Car+Image"
                  }
                  alt={car.name}
                  className="img-fluid p-3 object-fit-contain"
                />
              </div>

              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">{car.name}</h6>
                    <small className="text-muted">{car.variant}</small>
                  </div>
                </div>

                {/* Thông số nhanh */}
                <ul className="list-inline small text-muted mt-3 mb-0">
                  <li className="list-inline-item me-3">🚘 {car.seats ?? 5} chỗ</li>
                  <li className="list-inline-item me-3">⚡ {car.rangeKm ?? 300} km</li>
                  <li className="list-inline-item">🕹 {car.gearbox ?? "AT"}</li>
                </ul>
              </div>

              <div className="card-footer bg-white">
                <div className="fw-bold">
                  {formatVND(car.pricePerDay)} VND
                  <span className="text-muted">/Ngày</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
