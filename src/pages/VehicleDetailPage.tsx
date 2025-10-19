import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVehicle } from "../hooks/useVehicle";


const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicle, loading, error, getVehicleDetail, formatPrice, isVehicleAvailable } = useVehicle();

  useEffect(() => {
    if (id) {
      getVehicleDetail(parseInt(id));
    }
  }, [id, getVehicleDetail]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3">Đang tải thông tin xe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Không tìm thấy thông tin xe
        </div>
      </div>
    );
  }

  const available = isVehicleAvailable(vehicle);

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Quay lại
      </button>

      <div className="row">
        {/* Hình ảnh */}
        <div className="col-md-6">
          <img
            src={vehicle.imageUrl || "/placeholder-car.jpg"}
            alt={vehicle.name}
            className="img-fluid rounded shadow"
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </div>

        {/* Thông tin */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="fw-bold">{vehicle.name}</h1>
            <span className={`badge ${available ? "bg-success" : "bg-secondary"} fs-6`}>
              {available ? "Có sẵn" : "Không khả dụng"}
            </span>
          </div>

          <div className="mb-4">
            <h5 className="text-muted">{vehicle.brand}</h5>
            <p className="text-muted">
              <i className="bi bi-geo-alt-fill"></i> {vehicle.stationName || "Chưa cập nhật"}
            </p>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Thông số kỹ thuật</h5>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-lightning-charge-fill text-primary fs-4 me-2"></i>
                    <div>
                      <small className="text-muted d-block">Pin</small>
                      <strong>{vehicle.battery}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-speedometer2 text-primary fs-4 me-2"></i>
                    <div>
                      <small className="text-muted d-block">Quãng đường</small>
                      <strong>{vehicle.range}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-card-text text-primary fs-4 me-2"></i>
                    <div>
                      <small className="text-muted d-block">Biển số</small>
                      <strong>{vehicle.plateNumber}</strong>
                    </div>
                  </div>
                </div>
                {vehicle.color && (
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-palette-fill text-primary fs-4 me-2"></i>
                      <div>
                        <small className="text-muted d-block">Màu sắc</small>
                        <strong>{vehicle.color}</strong>
                      </div>
                    </div>
                  </div>
                )}
                {vehicle.year && (
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar-event text-primary fs-4 me-2"></i>
                      <div>
                        <small className="text-muted d-block">Năm sản xuất</small>
                        <strong>{vehicle.year}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Giá thuê */}
          {(vehicle.pricePerHour || vehicle.pricePerDay) && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">Giá thuê</h5>
                <div className="row">
                  {vehicle.pricePerHour && (
                    <div className="col-6">
                      <div className="text-center p-3 border rounded">
                        <small className="text-muted d-block">Theo giờ</small>
                        <h4 className="text-primary fw-bold mb-0">
                          {formatPrice(vehicle.pricePerHour)}
                        </h4>
                      </div>
                    </div>
                  )}
                  {vehicle.pricePerDay && (
                    <div className="col-6">
                      <div className="text-center p-3 border rounded">
                        <small className="text-muted d-block">Theo ngày</small>
                        <h4 className="text-primary fw-bold mb-0">
                          {formatPrice(vehicle.pricePerDay)}
                        </h4>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mô tả */}
          {vehicle.description && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">Mô tả</h5>
                <p className="mb-0">{vehicle.description}</p>
              </div>
            </div>
          )}

          {/* Tính năng */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">Tính năng</h5>
                <ul className="list-unstyled">
                  {vehicle.features.map((feature: string, index: number) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Button thuê xe */}
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary btn-lg"
              disabled={!available}
              onClick={() => {
                // Navigate to booking page
                navigate(`/booking?vehicleId=${vehicle.id}`);
              }}
            >
              {available ? "Thuê xe ngay" : "Xe không khả dụng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
