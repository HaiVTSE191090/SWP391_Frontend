import { useState } from "react";

import { RefundResponse } from "../models/WalletModel";
import api from "../services/apiClient";
import { ApiResponse } from "../components/AdminInterface/types/api.type";
export function useWallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RefundResponse | null>(null);

  const refundByAdmin = async (bookingId: number | string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await api.post<ApiResponse<any>>(
        `/api/wallet/refund/admin-cancel/${bookingId}`
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Hoàn cọc (Admin) thất bại");
      }
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: true,
        message: error.response?.data.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refundByRenter = async (bookingId: number | string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await api.post<ApiResponse<RefundResponse>>(
        `/api/wallet/refund/renter-cancel/${bookingId}`
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Hoàn cọc (renter) thất bại");
      }

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: true,
        message: error.response?.data.message,
      };
    } finally {
      setIsLoading(false);
    }
  };
  return {
    refundByAdmin,
    refundByRenter,
    isLoading,
    error,
    data,
  };
}
