import { useCallback, useState } from "react";
import { StationRequest, StationResponse } from "../models/StationModel";
import { ApiResponse } from "../models/AuthModel";
import api from "../services/apiClient";

export function useAdminStation() {
  const [station, setStation] = useState<StationResponse>();
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const API_URL = "/api/stations";

  const loadAllStations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<StationResponse[]>>(
        `${API_URL}/all`
      );
      if (res.data.status === "success" || res.data.code === 200) {
        setStations(res.data.data);
      }
      return {
        success: false,
      };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.data || "Lỗi máy chủ khi tải danh sách trạm";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStationById = useCallback(async (stationId: number) => {
    setError("");
    setIsLoading(true);
    setStation(undefined);
    try {
      const res = await api.get<ApiResponse<StationResponse>>(
        `${API_URL}/${stationId}`
      );
      if (res.data.status === "success" || res.data.code === 200) {
        setStation(res.data.data);
      }
      return {
        success: false,
      };
    } catch (err: any) {
      const errMsg =
        err.response?.data?.data || "Lỗi máy chủ khi tải chi tiết trạm";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStation = async (data: StationRequest) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post<ApiResponse<StationResponse>>(
        API_URL + "/create",
        data
      );
      if (res.data.status === "success" || res.data.code === 201) {
        return {
          success: true,
          data: res.data.data,
          message: "Tạo mới thành công!",
        };
      }
      return {
        success: false,
        message: res.data.data || "Tạo mới thất bại",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.data ||
          "Tạo mới thất bại",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateStation = async (
    stationId: number,
    data: Partial<StationRequest>
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.put<ApiResponse<StationResponse>>(
        `${API_URL}/${stationId}`,
        data
      );
      if (res.data.status === "success" || res.data.code === 200) {
        return {
          success: true,
          data: res.data.data,
        };
      }
      return {
        success: false,
        message: res.data.data || "Cập nhật thất bại",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.data ||
          "Cập nhật thất bại",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStation = async (stationId: number) => {
    setIsLoading(true);
    setError("");
    try {
      // API của bạn trả về string, nhưng hook mẫu là null, nên dùng any
      const res = await api.delete<ApiResponse<any>>(`${API_URL}/${stationId}`);
      if (res.data.status === "success" || res.data.code === 200) {
        return {
          success: true,
          message: res.data.data || "Xóa thành công",
        };
      }
      return {
        success: false,
        message: res.data.data || "Xóa thất bại",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.data ||
          "Xóa thất bại",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    station,
    stations,
    error,
    isLoading,
    setStation,
    loadAllStations,
    loadStationById,
    createStation,
    updateStation,
    deleteStation,
  };
}
