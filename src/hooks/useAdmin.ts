import { useCallback, useState } from "react";
import { AdminResponse, UpdateAdminRequest } from "../models/AdminModel";
import { ApiResponse } from "../components/AdminInterface/types/api.type";
import api from "../services/apiClient";
export function useAdmin() {
    const [profile, setProfile] = useState<AdminResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    /**
     * Tải thông tin cá nhân của admin đang đăng nhập (GET /api/admin/me)
     */
    const loadAdminProfile = useCallback(async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await api.get<ApiResponse<AdminResponse>>("/api/admin/me");
        setProfile(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.data || "Không thể tải thông tin cá nhân");
      } finally {
        setIsLoading(false);
      }
    }, []);


    const updateAdminProfile = async (data: UpdateAdminRequest) => {
      setIsLoading(true);
      setError("");
      try {
        const res = await api.put<ApiResponse<AdminResponse>>(
          "/api/admin/me",
          data
        );

        if (res.data.status === "success") {
          // Cập nhật state profile tại đây
          setProfile(res.data.data);
          return {
            success: true,
            data: res.data.data,
          };
        }
      } catch (error: any) {
        const errMsg = error.response?.data?.data || "Lỗi khi cập nhật hồ sơ";
        setError(errMsg);
        return {
          success: false,
          err: errMsg,
        };
      } finally {
        setIsLoading(false);
      }
    };

    return {
      profile,
      isLoading,
      error,
      loadAdminProfile,
      updateAdminProfile,
    };
}
