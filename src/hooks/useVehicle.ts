import { useContext } from "react";
import { VehicleContext, VehicleContextType } from "../context/VehicleContext";

/**
 * Custom hook để sử dụng VehicleContext với type-safe
 */
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
