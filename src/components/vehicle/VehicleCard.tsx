import React from "react";
import { useNavigate } from "react-router-dom";
import { VehicleWithStation, getVehicleStatusText, getVehicleStatusColor } from "../../models/VehicleModel";
import { useVehicle } from "../../hooks/useVehicle";

interface VehicleCardProps {
  vehicle: VehicleWithStation;
  showStation?: boolean;
}

/**
 * Component card hiển thị thông tin xe
 * Làm việc với dữ liệu thực từ BE
 */
const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, showStation = false }) => {
  const navigate = useNavigate();
  const { formatBattery, formatMileage, isVehicleAvailable } = useVehicle();

  const available = isVehicleAvailable(vehicle);
  const statusText = getVehicleStatusText(vehicle.status);
  const statusColor = getVehicleStatusColor(vehicle.status);

  const handleClick = () => {
    navigate(`/vehicles/${vehicle.vehicleId}`);
  };

  /**
   * Lấy hình ảnh xe từ assets
   * Map vehicleId với ảnh trong src/images/car-list/
   * Có 9 ảnh (Car-1.png đến Car-9.png), nếu vehicleId > 9 thì lặp lại
   */
  const getVehicleImage = () => {
    try {
      // Map vehicleId với số ảnh (1-9)
      // Nếu vehicleId = 1 → Car-1.png
      // Nếu vehicleId = 10 → Car-1.png (10 % 9 = 1)
      const imageNumber = ((vehicle.vehicleId - 1) % 9) + 1;
      return require(`../../images/car-list/Car-${imageNumber}.png`);
    } catch (error) {
      // Fallback nếu không tìm thấy ảnh
      console.warn(`Image not found for vehicleId ${vehicle.vehicleId}, using default`);
      return require(`../../images/car-list/Car.png`);
    }
  };

  return (
    <div
      className="card h-100 shadow-sm"
      style={{ 
        cursor: available ? "pointer" : "not-allowed", 
        transition: "all 0.3s",
        opacity: available ? 1 : 0.7
      }}
      onClick={available ? handleClick : undefined}
      onMouseEnter={(e) => {
        if (available) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (available) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      {/* Image */}
      <div className="position-relative">
        <img
          src={getVehicleImage()}
          className="card-img-top"
          alt={vehicle.plateNumber}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <span className={`position-absolute top-0 end-0 m-2 badge bg-${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="card-body">
        {/* Model Name (hoặc Plate Number nếu không có model) - Main title */}
        <h5 className="card-title fw-bold mb-1">
          {vehicle.modelName || vehicle.plateNumber}
        </h5>
        <p className="text-muted small mb-2">
          <i className="bi bi-credit-card me-1"></i>
          Biển số: {vehicle.plateNumber}
        </p>

        {/* Station info */}
        {showStation && (
          <div className="mb-3">
            <p className="text-muted small mb-1">
              <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
              <strong>{vehicle.stationName}</strong>
            </p>
            <p className="text-muted small mb-0">
              <i className="bi bi-map"></i> {vehicle.stationLocation}
            </p>
          </div>
        )}

        {/* Vehicle info */}
        <div className="row g-2 mt-2">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="bi bi-battery-charging text-success me-1"></i>
              <small className="fw-semibold">{formatBattery(vehicle.batteryLevel)}</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="bi bi-speedometer2 text-primary me-1"></i>
              <small>{formatMileage(vehicle.mileage)}</small>
            </div>
          </div>
        </div>

        {/* Last service date */}
        {vehicle.lastServiceDate && (
          <div className="mt-2">
            <small className="text-muted">
              <i className="bi bi-wrench"></i> Bảo trì: {new Date(vehicle.lastServiceDate).toLocaleDateString('vi-VN')}
            </small>
          </div>
        )}
      </div>

      {/* Footer button */}
      <div className="card-footer bg-white border-0 pt-0">
        <button
          className={`btn w-100 ${available ? 'btn-primary' : 'btn-secondary'}`}
          disabled={!available}
          onClick={(e) => {
            e.stopPropagation();
            if (available) {
              navigate(`/vehicles/${vehicle.vehicleId}`);
            }
          }}
        >
          {available ? (
            <>
              <i className="bi bi-eye me-1"></i> Xem chi tiết
            </>
          ) : (
            <>
              <i className="bi bi-x-circle me-1"></i> Không khả dụng
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
