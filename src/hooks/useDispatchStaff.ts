import { useCallback, useState } from "react";
import { ApiResponse } from "../components/AdminInterface/types/api.type";
import { AssignStaffRequest, StaffResponse } from "../models/StaffModel";
import api from "../services/apiClient";

const getStaffByStationIdApi = (stationId: number) => {
  return api.get<ApiResponse<StaffResponse[]>>(
    `/api/admin/stations/${stationId}/staff`
  );
};

const assignStaffApi = (data: AssignStaffRequest) => {
  return api.post<ApiResponse<string>>(
    "/api/admin/dispatch/assign-staff",
    data
  );
};

// Hook để quản lý logic
export const useStaffDispatch = () => {
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách staff tại trạm
  const loadStaffList = useCallback(async (stationId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getStaffByStationIdApi(stationId);
      if (res.data.code === 200) {
        setStaffList(res.data.data);
        return{
            succeess: true,
            data: res.data.data,
        }
      } else {
        return { message: res.data.message || "Lỗi tải danh sách nhân viên" };
      }
    } catch (err: any) {
      setError(err.message);
      return {
        succeess: true,
        message: err.response?.data?.data
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dispatchStaff = async (data: AssignStaffRequest) => {
    try {
      const res = await assignStaffApi(data);
      if (res.data.status === "success") {
        return { success: true, message: res.data.data };
      } else {
        return { message: res.data.message || "Lỗi tải danh sách nhân viên" };
      }
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  return {
    staffList,
    isLoading,
    error,
    loadStaffList,
    dispatchStaff,
  };
};
