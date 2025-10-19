import React, { useEffect } from "react";
import { useVehicle } from "../../hooks/useVehicle";
import VehicleCard from "./VehicleCard";

interface VehicleListProps {
  stationId?: number;
  showStation?: boolean;
  title?: string;
}

/**
 * Component hiển thị danh sách xe
 * Reusable - có thể dùng để hiển thị xe theo station
 */
const VehicleList: React.FC<VehicleListProps> = ({
  stationId,
  showStation = false,
  title = "Danh sách xe",
}) => {
  const { vehicles, loading, error, loadVehiclesByStation, loadAllVehicles } = useVehicle();

  useEffect(() => {
    if (stationId) {
      loadVehiclesByStation(stationId);
    } else {
      loadAllVehicles();
    }
  }, [stationId, loadVehiclesByStation, loadAllVehicles]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3">Đang tải danh sách xe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Không tìm thấy xe nào phù hợp
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">{title}</h2>
      <div className="row g-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.vehicleId} className="col-md-6 col-lg-4">
            <VehicleCard vehicle={vehicle} showStation={showStation} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
