import React from "react";
import rectangle44 from "./img/Rectangle 44.png";
import rectangle50 from "./img/Rectangle 50.png";
import rectangle51 from "./img/Rectangle 51.png";
import rectangle52 from "./img/Rectangle 52.png";
import rectangle53 from "./img/Rectangle 53.png";
import rectangle54 from "./img/Rectangle 54.png";
import rectangle55 from "./img/Rectangle 55.png";
// import "../guide-component/guide-style.css";

export const Guide: React.FC = () => {
  return (
    <section className="container py-5">
      {/* Section 1: Ưu điểm */}
      <div className="text-center mb-2">
        <h2 className="fw-bold">Ưu Điểm Của EV Rental</h2>
      </div>
      <p className="text-center text-muted mb-5">
        Những tính năng giúp bạn dễ dàng hơn khi thuê xe trên Mioto.
      </p>

      <div className="row g-4 mb-5">
        {/* Item 1 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 text-center">
            <img
              src={rectangle50}
              alt="Thủ tục đơn giản"
              className="card-img-top img-fluid p-2"
            />
            <div className="card-body">
              <h5 className="card-title">Thủ tục đơn giản</h5>
              <p className="card-text small text-muted">
                Chỉ cần có CCCD gắn chip (hoặc Passport) &amp; Giấy phép lái xe
                là bạn đã đủ điều kiện thuê xe trên Mioto.
              </p>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 text-center">
            <img
              src={rectangle51}
              alt="Thanh toán dễ dàng"
              className="card-img-top img-fluid p-2"
            />
            <div className="card-body">
              <h5 className="card-title">Thanh toán dễ dàng</h5>
              <p className="card-text small text-muted">
                Nhiều hình thức thanh toán: Momo, tiền mặt.
              </p>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 text-center">
            <img
              src={rectangle52}
              alt="Tìm điểm thuê dễ dàng"
              className="card-img-top img-fluid p-2"
            />
            <div className="card-body">
              <h5 className="card-title">Tìm điểm thuê dễ dàng</h5>
              <p className="card-text small text-muted">
                Chỉ đường đến điểm thuê gần nhất dễ dàng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Hướng dẫn */}
      <div className="text-center mb-2">
        <h3 className="fw-bold">Hướng Dẫn Thuê Xe</h3>
      </div>
      <p className="text-center text-muted mb-4">
        Chỉ với 4 bước đơn giản để trải nghiệm thuê xe Mioto một cách nhanh chóng
      </p>

      <div className="row g-4">
        {/* Bước 1 */}
        <div className="col-6 col-md-3">
          <figure className="text-center">
            <img src={rectangle44} alt="Đặt xe" className="img-fluid mb-2" />
            <figcaption className="fw-semibold small">
              Đặt xe trên web EV Rental
            </figcaption>
          </figure>
        </div>

        {/* Bước 2 */}
        <div className="col-6 col-md-3">
          <figure className="text-center">
            <img src={rectangle53} alt="Nhận xe" className="img-fluid mb-2" />
            <figcaption className="fw-semibold small">Nhận xe</figcaption>
          </figure>
        </div>

        {/* Bước 3 */}
        <div className="col-6 col-md-3">
          <figure className="text-center">
            <img
              src={rectangle54}
              alt="Bắt đầu hành trình"
              className="img-fluid mb-2"
            />
            <figcaption className="fw-semibold small">
              Bắt đầu hành trình
            </figcaption>
          </figure>
        </div>

        {/* Bước 4 */}
        <div className="col-6 col-md-3">
          <figure className="text-center">
            <img
              src={rectangle55}
              alt="Trả xe"
              className="img-fluid mb-2"
            />
            <figcaption className="fw-semibold small">
              Trả xe &amp; kết thúc chuyến đi
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};