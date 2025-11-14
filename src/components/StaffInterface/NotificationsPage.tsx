import React, { useState, useEffect, useCallback } from 'react';
// Đảm bảo import cả hai hàm API từ services
import { getStaffNotifications, markNotificationAsRead } from './services/authServices';
import { Bell, CheckCircle, Clock } from 'lucide-react';

// Khai báo type cho Notification
interface Notification {
  notificationId: number;
  title: string;
  message: string;
  recipientType: 'STAFF' | 'USER';
  recipientId: number;
  isRead: boolean;
  createdAt?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Hàm lấy tất cả thông báo
  const fetchAllNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStaffNotifications();
      if (response && response.data && response.data.data) {
        // Sắp xếp theo ID giảm dần (thông báo mới nhất lên đầu)
        const sortedNoti = response.data.data.sort((a: Notification, b: Notification) =>
          b.notificationId - a.notificationId
        );
        setNotifications(sortedNoti);
      }
    } catch (err) {
      console.error("Lỗi khi lấy tất cả thông báo:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);


  // 2. Hàm xử lý Đánh dấu đã đọc (Sử dụng API PATCH)
  const handleMarkAsRead = async (id: number) => {
    try {
      // Gọi API PATCH: Đợi server xác nhận
      await markNotificationAsRead(id);

      // API THÀNH CÔNG: Cập nhật state local để giao diện thay đổi
      setNotifications(prev => prev.map(n =>
        n.notificationId === id ? { ...n, isRead: true } : n
      ));
      console.log(`Thông báo ${id} đã được đánh dấu đã đọc thành công.`);

    } catch (err) {
      console.error(`Lỗi khi gọi API đánh dấu đã đọc cho ID ${id}:`, err);
      // API LỖI: Báo lỗi cho người dùng
      alert("Lỗi: Không thể đánh dấu đã đọc. Vui lòng thử lại.");
    }
  };


  // --- Logic Hiển thị Loading/Error ---
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;


  // --- Render UI Chính ---
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-primary d-flex align-items-center">
          <Bell size={32} className="me-3" />
          Tất cả Thông báo
        </h2>

        {/* Nút đánh dấu tất cả đã đọc */}
        {unreadCount > 0 && (
          <button
            className="btn btn-outline-success btn-sm d-flex align-items-center"
            onClick={() => console.log("Đánh dấu tất cả đã đọc")} // Thay thế bằng hàm API thực tế nếu có
          >
            <CheckCircle size={18} className="me-2" />
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="list-group">
        {notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="fs-5">Bạn không có thông báo nào.</p>
          </div>
        ) : (
          notifications.map(noti => (
            <a
              key={noti.notificationId}
              href="#" // Giữ là href="#" để kích hoạt sự kiện onClick
              className={`list-group-item list-group-item-action ${!noti.isRead ? 'bg-light-blue fw-bold' : ''}`}

              // 3. Gọi hàm Đánh dấu đã đọc khi click
              onClick={(e) => {
                e.preventDefault();
                if (!noti.isRead) {
                  handleMarkAsRead(noti.notificationId);
                }
                // Thêm logic chuyển hướng đến trang chi tiết ở đây nếu cần
              }}
              style={{ borderLeft: !noti.isRead ? '5px solid #0d6efd' : '1px solid #dee2e6' }}
            >
              <div className="d-flex w-100 justify-content-between">
                <h6 className={`mb-1 ${!noti.isRead ? 'text-dark' : 'text-secondary'}`}>{noti.title}</h6>
                <small className="text-muted d-flex align-items-center">
                  <Clock size={14} className="me-1" />
                  {noti.createdAt ? new Date(noti.createdAt).toLocaleDateString() : 'Vừa xong'}
                </small>
              </div>
              <p className="mb-1 text-truncate" style={{ maxWidth: '95%' }}>{noti.message}</p>
              {!noti.isRead && <small className="text-primary">Mới</small>}
            </a>
          ))
        )}
      </div>

      {/* Thêm style CSS cần thiết */}
      <style>{`
        .bg-light-blue { background-color: #eaf3ffff !important; }
      `}</style>
    </div>
  );
};

export default NotificationsPage;