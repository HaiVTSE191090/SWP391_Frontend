import { useCallback, useState } from "react";
import api from "../services/apiClient";
import { ApiResponse } from "../models/AuthModel";

import {
  AdminReportResponse,
  BlacklistedRenter,
  BookingReportDetail,
  WarningRequest,
  WarningResponse,
} from "../models/BlacklistModel";

export function useBlacklist() {
  const [reports, setReports] = useState<AdminReportResponse[]>([]);
  const [reportDetail, setReportDetail] = useState<BookingReportDetail | null>(
    null
  );
  const [blacklist, setBlacklist] = useState<BlacklistedRenter[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadAdminReports = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<AdminReportResponse[]>>(
        "/api/admin/reports"
      );
      setReports(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.data || "Không thể tải danh sách báo cáo");
    } finally {
      setIsLoading(false);
    }
  }, []);


  const loadReportDetail = useCallback(async (bookingId: number) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<BookingReportDetail>>(
        `/api/admin/reports/${bookingId}`
      );
      setReportDetail(res.data.data);
    } catch (err: any) {
      console.error("Failed to load report detail:", err);
      setError(err.response?.data?.data || "Không thể tải chi tiết báo cáo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadBlacklist = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<BlacklistedRenter[]>>(
        "/api/admin/blacklist"
      );
      setBlacklist(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.data || "Không thể tải danh sách đen");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendWarning = async (warningData: WarningRequest) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post<ApiResponse<WarningResponse>>(
        "/api/admin/warning",
        warningData
      );

      if (res.data.status === "success") {
        return {
          success: true,
          data: res.data.data,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        err: error.response?.data?.data || "Gửi cảnh báo thất bại",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reports,
    reportDetail,
    blacklist,
    error,
    isLoading,
    loadAdminReports,
    loadReportDetail,
    loadBlacklist,
    sendWarning,
  };
}
