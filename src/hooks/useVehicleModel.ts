import { useCallback, useState } from "react";
import {
  VehicleModelRequest,
  VehicleModelResponse,
} from "../models/VehicleModalModel";
import { ApiResponse } from "../models/AuthModel";
import api from "../services/apiClient";

export function useVehicleModel() {
  const [vehicleModel, setVehicleModel] = useState<VehicleModelResponse>();
  const [vehicleModels, setVehicleModels] = useState<VehicleModelResponse[]>(
    []
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const API_URL = "/api/vehicle-models";

  const loadAllVehicleModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<VehicleModelResponse[]>>(API_URL);
      if (res.data.status === "success") {
        setVehicleModels(res.data.data);
      }
      return {
        success: false,
      };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.đata || "Lỗi máy chủ khi tải mẫu xe";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadVehicleModelById = useCallback(async (modelId: number) => {
    setError("");
    setIsLoading(true);
    setVehicleModel(undefined); // Reset state của vehicleModel cũ
    try {
      const res = await api.get<ApiResponse<VehicleModelResponse>>(
        `${API_URL}/${modelId}`
      );
      if (res.data.status === "success") {
        setVehicleModel(res.data.data);
      }
      return {
        success: false,
      };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.data || "Lỗi máy chủ khi tải chi tiết";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVehicleModel = async (data: VehicleModelRequest) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post<ApiResponse<VehicleModelResponse>>(
        API_URL+"/create",
        data
      );
      if (res.data.status === "success") {
        return {
          success: true,
          data: res.data.data,
          message: "Tạo mới thành công!",
        };
      }
      return {
        success: false,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.data || "Tạo mới thất bại",
      };
    } finally {
      setIsLoading(false);
    }
  }; // Cập nhật một mẫu xe

  const updateVehicleModel = async (
    modelId: number,
    data: Partial<VehicleModelRequest>
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.put<ApiResponse<VehicleModelResponse>>(
        `${API_URL}/${modelId}`,
        data
      );
      if (res.data.status === "success") {
        return {
          success: true,
          data: res.data.data,
          message: "Cập nhật thành công!",
        };
      }
      return {
        success: false,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.data || "Cập nhật thất bại",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicleModel = async (modelId: number) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.delete<ApiResponse<null>>(`${API_URL}/${modelId}`);
      if (res.data.status === "success") {
        return {
          success: true,
          message: "Xóa thành công",
        };
      }
      return {
        success: false,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.data || "Xóa thất bại",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vehicleModel,
    vehicleModels,
    error,
    isLoading,
    setVehicleModel,
    loadAllVehicleModels,
    loadVehicleModelById,
    createVehicleModel,
    updateVehicleModel,
    deleteVehicleModel,
  };
}
