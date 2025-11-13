export interface ApiResponse<T> {
  status: string;
  code: number;
  data: T;
  message: string | null;
}

export interface Notification {
  notificationId: number;
  title: string;
  message: string;
  recipientType: string;
  recipientId: number;
  isRead: boolean;
}
