import { useCallback, useState } from "react";
import api from "../services/apiClient";
import {
  ApiResponse,
  CreateVehicleDTO,
  UpdateVehicleDTO,
  
  VehicleResponse,
} from "../models/VehicleModel";

export function useVehicleAdmin() {
  const [vehicle, setVehicle] = useState<VehicleResponse>();
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllVehicles = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<VehicleResponse[]>>(
        "/api/admin/vehicles/all"
      );
      setVehicles(res.data.data);
      return { success: true, data: res.data.data };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Không thể tải danh sách xe";
      setError(errMsg);
      return { success: false, err: errMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadVehicleById = useCallback(async (id: number | string) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<VehicleResponse>>(
        `/api/admin/vehicles/${id}`
      );
      setVehicle(res.data.data); 
      return { success: true, data: res.data.data };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Không thể tải thông tin xe";
      setError(errMsg);
      return { success: false, err: errMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVehicle = async (dto: CreateVehicleDTO) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post<ApiResponse<VehicleResponse>>(
        "/api/admin/vehicles/create",
        dto
      );

      if (res.data.status === "success") {
        setVehicles((prev) => [res.data.data, ...prev]);
        return { success: true, data: res.data.data };
      } else {
        const errMsg = res.data.message || "Tạo xe thất bại";
        setError(errMsg);
        return { success: false, err: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Lỗi khi tạo xe";
      setError(errMsg);
      return { success: false, err: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicle = async (id: number | string, dto: UpdateVehicleDTO) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.put<ApiResponse<VehicleResponse>>(
        `/api/admin/vehicles/update/${id}`,
        dto
      );

      if (res.data.status === "success") {
        setVehicles((prev) =>
          prev.map((v) => (v.vehicleId === Number(id) ? res.data.data : v))
        );
        return { success: true, data: res.data.data };
      } else {
        const errMsg = res.data.message || "Cập nhật thất bại";
        setError(errMsg);
        return { success: false, err: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Lỗi khi cập nhật xe";
      setError(errMsg);
      return { success: false, err: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: number | string) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.delete<ApiResponse<string>>(
        `/api/admin/vehicles/delete/${id}`
      );

      if (res.data.status === "success") {
        setVehicles((prev) => prev.filter((v) => v.vehicleId !== Number(id)));
        return { success: true, message: res.data.data };
      } else {
        const errMsg = res.data.data || "Xoá thất bại";
        setError(errMsg);
        return { success: false, message: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.data || "Lỗi khi xoá xe";
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVehicleImage = async (vehicleId: number | string, file: File) => {
    setError("");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post<ApiResponse<string>>(
        `/api/admin/vehicles/${vehicleId}/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.status === "success") {
        return { success: true, data: res.data.data };
      } else {
        const errMsg = res.data.message || "Upload ảnh thất bại";
        setError(errMsg);
        return { success: false, err: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Lỗi khi upload ảnh";
      setError(errMsg);
      return { success: false, err: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vehicle,
    vehicles,
    error,
    loadVehicleById,
    isLoading,
    getAllVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    uploadVehicleImage,
  };
}
