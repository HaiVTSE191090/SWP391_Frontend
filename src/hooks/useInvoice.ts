import { useCallback, useState } from "react";
// Giả định import từ các file service và type của bạn
import api from "../services/apiClient";
import { ApiResponse, InvoiceDetailResponse } from "../models/InvoiceModel";

/**
 * Hook để lấy danh sách hóa đơn
 * (Làm theo y hệt template 'useWallet' của bạn)
 */
export function useInvoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data là một MẢNG hóa đơn, dựa theo JSON bạn cung cấp lần trước
  const [data, setData] = useState<InvoiceDetailResponse[] | null>(null);

  /**
   * Hàm để gọi và lấy danh sách hóa đơn
   * (Tôi phải giả định API endpoint này)
   */
  const getInvoicesByBookingId =useCallback( async (bookingId: number | string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await api.get<ApiResponse<InvoiceDetailResponse[]>>(
        `/api/invoices/bookings/${bookingId}/invoices`
      );

      
      if (response.data.status === "success") {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Lấy hóa đơn thất bại");
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
  },[]);

  const markAsPaid = async (invoiceId: number | string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.patch<ApiResponse<InvoiceDetailResponse>>(
        `/api/invoices/invoices/${invoiceId}/mark-paid`
      );

      if (response.data.status === "success") {
      } else {
        setError(response.data.message || "Đánh dấu thanh toán thất bại");
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
    getInvoicesByBookingId, 
    markAsPaid,
    isLoading,
    error,
    data,
  };
}
