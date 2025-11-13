import { useCallback, useState } from "react";
import api from "../services/apiClient"; // Giả định apiClient
import { ApiResponse } from "../models/AuthModel"; // Giả định ApiResponse
import { Notification } from "../models/NotifyModel"; // <-- Sửa đường dẫn nếu cần

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");


  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get<ApiResponse<Notification[]>>(
        "/api/notifications/my"
      );
      setNotifications(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.data || "Không thể tải thông báo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Đánh dấu một thông báo là đã đọc (PATCH /api/notifications/{notificationId}/read)
   */
  const markAsRead = async (notificationId: number) => {
    // Không set isLoading toàn cục để tránh làm giật lag cả trang
    // chỉ cập nhật state
    try {
      const res = await api.patch<ApiResponse<string>>(
        `/api/notifications/${notificationId}/read`
      );

      if (res.data.status === "success") {
        setNotifications((prevNotifications) =>
          prevNotifications.map((noti) =>
            noti.notificationId === notificationId
              ? { ...noti, isRead: true } 
              : noti
          )
        );
        return { success: true };
      }
    } catch (error: any) {

      return {
        success: false,
        err: error.response?.data?.data || "Lỗi khi đánh dấu đã đọc",
      };
    }
  };

  return {
    notifications,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
  };
}
