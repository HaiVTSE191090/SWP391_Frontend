import React from "react";
import VehicleList from "../components/vehicle/VehicleList";

const StationVehiclesPage: React.FC = () => {
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
