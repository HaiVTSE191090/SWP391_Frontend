import React from "react";
import VehicleList from "../components/vehicle/VehicleList";

const StationVehiclesPage: React.FC = () => {
  // Giả sử stationId = 1 (có thể lấy từ useParams)
  const stationId = 1;

  return (
    <VehicleList
      stationId={stationId}
      showStation={false}
      title="Xe tại trạm này"
    />
  );
};

export default StationVehiclesPage;
