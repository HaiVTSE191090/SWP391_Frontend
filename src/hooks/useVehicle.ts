import { useContext } from "react";
import { VehicleContext, VehicleContextType } from "../context/VehicleContext";
import api from "../services/apiClient";

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);

  if (!context) {
    throw new Error(
      "useVehicle must be used within a VehicleProvider. " +
      "Wrap your component tree with <VehicleProvider>.</VehicleProvider>"
    );
  }

  return context;
};

export const getImgUrl = async (vehicleId: number) => {
  try {
    const res = await api.get(`api/vehicle/detail/${vehicleId}`);
    return res.data.data.imageUrls[0];
  } catch (error:any) {
    return {
      error: "Lỗi khi tải ảnh xe: ",
    }
  }

}
