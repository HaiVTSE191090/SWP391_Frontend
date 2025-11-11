// hooks/useReportService.ts
import { useState, useCallback } from "react";
import api from "../services/apiClient";
import { ApiResponse } from "../components/AdminInterface/types/api.type";
import {
  DashboardReportDto,
  RevenueReportDto,
  BookingReportDto,
  VehicleReportDto,
  StationReportDto,
  RevenueReportRequest,
  BookingReportRequest,
  VehicleReportRequest,
} from "../models/ReportModel";

export const useReportService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboardReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<DashboardReportDto>>(
        "/api/admin/reports/dashboard"
      );
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRevenueReport = useCallback(async (params: RevenueReportRequest) => {
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<RevenueReportDto>>(
        "/api/admin/reports/revenue",
        { params }
      );
      if (res.data.code === 200) return res.data.data;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBookingReport = useCallback(async (params: BookingReportRequest) => {
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<BookingReportDto>>(
        "/api/admin/reports/bookings",
        { params }
      );
      if (res.data.code === 200) return res.data.data;
    } catch (err: any) {
      setError(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getVehicleReport = useCallback(async (params: VehicleReportRequest) => {
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<VehicleReportDto>>(
        "/api/admin/reports/vehicles",
        { params }
      );
      if (res.data.code === 200) return res.data.data;
    } catch (err: any) {
      setError(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStationReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<ApiResponse<StationReportDto>>(
        "/api/admin/reports/stations"
      );
      if (res.data.code === 200) return res.data.data;
    } catch (err: any) {
      setError(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getDashboardReport,
    getRevenueReport,
    getBookingReport, 
    getVehicleReport, 
    getStationReport,
  };
};
