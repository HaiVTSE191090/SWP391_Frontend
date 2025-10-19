import React from "react";
import VehicleList from "../components/vehicle/VehicleList";


const VehiclesPage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3">Tất cả xe có sẵn</h1>
        <p className="text-muted">
          Danh sách xe từ tất cả các trạm
        </p>
      </div>

      <VehicleList showStation={true} title="" />
    </div>
  );
};

export default VehiclesPage;
