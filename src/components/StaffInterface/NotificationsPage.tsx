import React, { useState, useEffect, useCallback } from 'react';
import { getStaffNotifications } from './services/authServices'; // Cập nhật đường dẫn nếu cần
import { Bell, CheckCircle, Clock } from 'lucide-react';

// Khai báo type cho Notification (giống trong Navbar)
interface Notification {
  notificationId: number;
  title: string;
  message: string;
  recipientType: 'STAFF' | 'USER';
  recipientId: number;
  isRead: boolean;
  createdAt?: string; // Giả định có trường thời gian
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy thông báo
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
  
  // TODO: Hàm xử lý Đánh dấu đã đọc (cần bổ sung API trong services)
  const handleMarkAsRead = (id: number) => {
    // Logic gọi API đánh dấu đã đọc
    console.log(`Đánh dấu thông báo ${id} là đã đọc`);
    
    // Cập nhật state local ngay lập tức để có phản hồi nhanh
    setNotifications(prev => prev.map(n => 
        n.notificationId === id ? { ...n, isRead: true } : n
    ));
  };


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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-primary d-flex align-items-center">
          <Bell size={32} className="me-3" />
          Tất cả Thông báo
        </h2>
        {/* Nút đánh dấu tất cả đã đọc (nếu có API hỗ trợ) */}
        {unreadCount > 0 && (
          <button 
            className="btn btn-outline-success btn-sm d-flex align-items-center"
            onClick={() => console.log("Đánh dấu tất cả đã đọc")} // Thay thế bằng hàm API thực tế
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
              href="#" // Thay thế bằng link chi tiết của booking/contract
              className={`list-group-item list-group-item-action ${!noti.isRead ? 'bg-light-blue fw-bold' : ''}`}
              onClick={() => handleMarkAsRead(noti.notificationId)}
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