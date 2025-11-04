import axios from "axios";
import api from "./AdminApiConfig";
import {
  ApiResponse,
  Booking,
  BookingResponse,
  Contract,
  ContractDetail,
  ServiceResponse,
} from "../types/api.type";
import { jwtDecode } from "jwt-decode";

const baseURL = "http://localhost:8080";

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await api.post(`/api/auth/login/admin`, {
      email,
      password,
    });

    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      const decoded = jwtDecode<any>(response.data.data.token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("userId", decoded.userId);
    }

    return response.data;
  } catch (error: any) {
    console.error("🔴 Lỗi đăng nhập Admin:", error);

    let errorMessage = error.response?.data?.data;

    if (error.response) {
      const res = error.response.data;

      // ✅ Xử lý cả 3 dạng trả về từ backend
      if (res?.data) {
        if (typeof res.data === "string") {
          // Dạng "Sai mật khẩu"
          errorMessage = res.data;
        } else if (typeof res.data === "object") {
          // Dạng { password: "Mật khẩu cần có ít nhất..." }
          const fields = Object.values(res.data);
          if (fields.length > 0) {
            errorMessage = fields.join(", ");
          }
        }
      } else if (res?.message) {
        // Dạng có trường message riêng
        errorMessage = res.message;
      } else if (error.response.statusText) {
        errorMessage = error.response.statusText;
      }
    }

    return {
      success: false,
      err: errorMessage,
    };
  }
};

export const adminLogout = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    return { success: true, message: "Đăng xuất thành công." };
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra khi đăng xuất." };
  }
};

export const getAllContracts = async (): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<Booking[]>>(
      "/api/admin/contracts?status=PENDING_ADMIN_SIGNATURE"
    );

    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }
    const contracts: Contract[] = response.data.data.map((booking, index) => ({
      id: index + 1,
      bookingId: booking.bookingId,
      renterName: booking.renterName,
      status: "PENDING_ADMIN_SIGNATURE",
      createdAt: booking.startDateTime,
    }));

    return {
      success: true,
      data: contracts,
    };
  } catch (error: any) {
    return {
      success: false,
      err: error.response?.data?.data,
    };
  }
};

export const getBookingDetail = async (
  bookingId: number
): Promise<ServiceResponse<Booking>> => {
  try {
    const response = await api.get<ApiResponse<Booking>>(
      `/api/bookings/${bookingId}`
    );

    if (!response.data.data) {
      return {
        success: false,
        message: "false",
      };
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.data || "Không thể tải thông tin đơn đặt xe",
    };
  }
};

/**
 * Lấy chi tiết hợp đồng theo ID
 */
export const getContractDetail = async (
  contractId: number
): Promise<ServiceResponse<ContractDetail>> => {
  try {
    const response = await api.get<ApiResponse<ContractDetail>>(
      `/api/admin/contracts/${contractId}`
    );

    if (!response.data.data) {
      return {
        success: false,
        message: "Không tìm thấy thông tin hợp đồng",
      };
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể tải chi tiết hợp đồng",
    };
  }
};

/**
 * Lấy chi tiết contract theo bookingId
 */
export const getContractByBookingId = async (
  bookingId: number
): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<ContractDetail>>(
      `/api/contracts/${bookingId}`
    );

    if (!response.data.data) {
      return {
        success: false,
        message: "Không tìm thấy thông tin hợp đồng",
      };
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.data || "Không thể tải chi tiết hợp đồng",
    };
  }
};

/**
 * Xem file hợp đồng PDF
 */
export const viewContractPDF = async (
  contractId: number
): Promise<ServiceResponse<Blob>> => {
  try {
    const response = await api.get(`/api/contracts/view/${contractId}`, {
      responseType: "blob",
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể tải file hợp đồng",
    };
  }
};

/**
 * Admin gửi OTP để ký hợp đồng
 */
export const sendAdminOTP = async (
  contractId: number
): Promise<ServiceResponse<null>> => {
  try {
    const response = await api.post<ApiResponse<null>>(
      `/api/admin/contracts/${contractId}/send-otp`,
      {},
      {
        params: {
          contractId,
          adminId: localStorage.getItem("userId"),
        },
      }
    );

    return {
      success: true,
      message: response.data.message || "Mã OTP đã được gửi đến email",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể gửi mã OTP",
    };
  }
};

/**
 * Admin xác thực OTP và ký hợp đồng
 */
export const signContractByAdmin = async (
  contractId: number,
  otpCode: string
): Promise<ServiceResponse<null>> => {
  try {
    const response = await api.post<ApiResponse<null>>(
      `/api/admin/contracts/verify-sign`,
      {
        contractId: contractId,
        adminId: localStorage.getItem("userId"),
        otpCode: otpCode,
        approved: true,
      }
    );

    return {
      success: true,
      message: response.data.data || "Hợp đồng đã được ký thành công",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.data ||
        "Mã OTP không hợp lệ hoặc không thể ký hợp đồng",
    };
  }
};

/**
 * 
 * @returns trả về hết booking
 */
export const getAllBookings = async (): Promise<any> => {
  try {
    const res = await api.get<ApiResponse<BookingResponse[]>>(
      "/api/bookings/admin/all"
    );
    if (res.data.status === "success") {
      return {
        success: true,
        data: res.data.data,
      };
    }
    return {
      success: false,
      message: "Không có thông tin booking",
    };
  } catch (error: any) {
    console.error("Lỗi lấy danh sách booking:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.data ||
        "Không thể tải danh sách booking",
    };
  }
};

/**
 * Cập nhật trạng thái booking thành RESERVED
 */
export const updateBookingStatusToReserved = async (
  bookingId: string
): Promise<ServiceResponse<null>> => {
  try {
    const response = await api.put<ApiResponse<null>>(
      `/api/bookings/${bookingId}/status/reserved`
    );

    return {
      success: true,
      message: response.data.message || "Cập nhật trạng thái RESERVED thành công",
    };
  } catch (error: any) {
    console.log("Lỗi cập nhật trạng thái RESERVED:", error);
    
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.data ||
        "Không thể cập nhật trạng thái booking",
    };
  }
};

/**
 * Cập nhật trạng thái booking thành CANCELLED
 */
export const updateBookingStatusToCancelled = async (
  bookingId: number
): Promise<ServiceResponse<null>> => {
  try {
    const response = await api.put<ApiResponse<null>>(
      `/api/bookings/${bookingId}/cancel`
    );

    return {
      success: true,
      message: response.data.message || "Đã hủy booking thành công",
    };
  } catch (error: any) {
    console.error("Lỗi hủy booking:", error);
    
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.data ||
        "Không thể hủy booking",
    };
  }
};

