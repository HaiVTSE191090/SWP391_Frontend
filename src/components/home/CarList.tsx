import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicle } from "../../hooks/useVehicle";
import VehicleCard from "../vehicle/VehicleCard";

/**
 * Component hiển thị danh sách xe trên trang chủ
 * Sử dụng VehicleContext theo MVC pattern
 */
export const CarList: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, loading, error, searchVehicles } = useVehicle();

  useEffect(() => {
    // Load tất cả xe có status AVAILABLE
    searchVehicles({ status: "AVAILABLE" });
  }, [searchVehicles]);

  if (loading) {
    return (
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">Xe dành cho bạn</h2>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải danh sách xe...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">Xe dành cho bạn</h2>
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return (
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">Xe dành cho bạn</h2>
        <div className="alert alert-info text-center" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Hiện chưa có xe nào khả dụng
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Xe dành cho bạn</h2>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/demo/vehicles")}
        >
          Xem tất cả <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>

      <div className="row g-4">
        {vehicles.slice(0, 6).map((vehicle) => (
          <div key={vehicle.id} className="col-12 col-sm-6 col-lg-4">
            <VehicleCard vehicle={vehicle} showStation={true} />
          </div>
        ))}
      </div>

      {vehicles.length > 6 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/demo/vehicles")}
          >
            Xem thêm {vehicles.length - 6} xe khác
          </button>
        </div>
      )}
    </section>
  );
};
