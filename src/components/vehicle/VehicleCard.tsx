import React from "react";
import { useNavigate } from "react-router-dom";
import { Vehicle } from "../../models/VehicleModel";
import { useVehicle } from "../../hooks/useVehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  showStation?: boolean;
}

/**
 * Component card hiển thị thông tin xe
 * Reusable - có thể dùng ở nhiều nơi (trang chủ, search, list, etc)
 */
const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, showStation = false }) => {
  const navigate = useNavigate();
  const { formatPrice, isVehicleAvailable } = useVehicle();

  const available = isVehicleAvailable(vehicle);

  const handleClick = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <div
      className="card h-100 shadow-sm hover-shadow"
      style={{ cursor: "pointer", transition: "all 0.3s" }}
      onClick={handleClick}
    >
      <div className="position-relative">
        <img
          src={vehicle.imageUrl || "/placeholder-car.jpg"}
          className="card-img-top"
          alt={vehicle.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <span
          className={`position-absolute top-0 end-0 m-2 badge ${
            available ? "bg-success" : "bg-secondary"
          }`}
        >
          {available ? "Có sẵn" : "Đã thuê"}
        </span>
      </div>

      <div className="card-body">
        <h5 className="card-title fw-bold mb-1">{vehicle.name}</h5>
        <p className="text-muted small mb-2">{vehicle.brand}</p>

        {showStation && vehicle.stationName && (
          <p className="text-muted small mb-2">
            <i className="bi bi-geo-alt-fill"></i> {vehicle.stationName}
          </p>
        )}

        <div className="row g-2 mb-3 mt-2">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
              <small>{vehicle.battery}</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="bi bi-speedometer2 text-primary me-1"></i>
              <small>{vehicle.range}</small>
            </div>
          </div>
        </div>

        {vehicle.pricePerHour && (
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">Giá thuê</span>
            <span className="fw-bold text-primary">
              {formatPrice(vehicle.pricePerHour)}/giờ
            </span>
          </div>
        )}
      </div>

      <div className="card-footer bg-white border-0 pt-0">
        <button
          className="btn btn-primary w-100"
          disabled={!available}
          onClick={(e) => {
            e.stopPropagation();
            if (available) {
              navigate(`/vehicles/${vehicle.id}`);
            }
          }}
        >
          {available ? "Xem chi tiết" : "Không khả dụng"}
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
