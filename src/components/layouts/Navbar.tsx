import React from "react";
import logo from "../../images/favicon.png";
import { useState, useEffect, useCallback, useRef } from "react";
import { LogOut, User, Bell, ChevronRight } from 'lucide-react'; // Thêm ChevronRight
// Giả định getStaffNotifications, getUserName, staffLogout đã được export
import { getUserName, staffLogout, getStaffNotifications } from "../StaffInterface/services/authServices"; 
import { useNavigate, useLocation } from "react-router-dom";


// Khai báo type cho Notification
interface Notification {
  notificationId: number;
  title: string;
  message: string;
  recipientType: 'STAFF' | 'USER';
  recipientId: number;
  isRead: boolean;
  // Giả định có thêm trường thời gian (createdAt)
  createdAt?: string; 
}

const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [staffName, setStaffName] = useState<string>(getUserName());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Ref để tham chiếu container thông báo (thay thế document.getElementById)
  const notificationRef = useRef<HTMLLIElement>(null); 

  // --- LOGIC GỌI API ---
  const fetchNotifications = useCallback(async (currentName: string) => {
    if (currentName) {
      try {
        const response = await getStaffNotifications();
        if (response && response.data && response.data.data) {
          // Chỉ lấy 10 thông báo gần nhất để hiển thị trong dropdown
          setNotifications(response.data.data.slice(0, 10)); 
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    } else {
      setNotifications([]);
    }
  }, []);

  // --- LOGIC EFFECTS ---
  
  // 1. Kiểm tra trạng thái đăng nhập VÀ LẤY THÔNG BÁO khi URL thay đổi
  useEffect(() => {
    const currentName = getUserName();
    
    if (staffName !== currentName) {
      setStaffName(currentName);
    }
    fetchNotifications(currentName);
  }, [location.pathname, staffName, fetchNotifications]);


  // 2. Logic đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra xem click có nằm ngoài container thông báo không
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false);
      }
    };

    if (showNotificationsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationsDropdown]);

  
  // --- HÀM XỬ LÝ SỰ KIỆN ---

  const handleLogout = () => {
    staffLogout(); 
    setStaffName(""); 
    setNotifications([]);
    navigate("/"); 
  };
  
  const toggleNotifications = () => {
    setShowNotificationsDropdown(prev => !prev);
  };

  const handleNotificationClick = (notificationId: number) => {
    // TODO: Bổ sung API gọi đánh dấu thông báo đã đọc
    // TODO: Bổ sung logic chuyển hướng dựa trên loại thông báo (notification.title/message)
    console.log(`Clicked notification ID: ${notificationId}`);
    setShowNotificationsDropdown(false); // Đóng dropdown sau khi click
  };

  // --- PHẦN RENDER ---

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // TÁCH HÀM RENDER DROPDOWN RA NGOÀI (giúp renderNavItems gọn hơn)
  const renderNotificationDropdown = () => {
      if (!showNotificationsDropdown) return null;

      return (
        <div 
          className="dropdown-menu dropdown-menu-end show p-3 shadow-lg"
          style={{
            minWidth: '350px', 
            maxHeight: '450px',
            overflowY: 'auto',
            zIndex: 1050, 
            position: 'absolute', 
            borderRadius: '0.75rem',
            // Thay thế cho bg-white
            backgroundColor: '#ffffff' 
          }}
        >
          <h5 className="fw-bold border-bottom pb-3 mb-3 text-dark">Thông báo ({unreadCount} chưa đọc)</h5>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <a 
                key={notification.notificationId} 
                onClick={() => handleNotificationClick(notification.notificationId)}
                // Tối ưu hóa UI: Dùng background đậm nhẹ cho item chưa đọc
                className={`d-flex align-items-center py-2 px-3 mb-2 rounded-3 text-decoration-none transition-all ${!notification.isRead ? 'bg-light-blue fw-bold text-dark' : 'text-secondary bg-hover-light'}`}
                style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                <div className="flex-grow-1">
                  <div className="text-truncate" style={{ maxWidth: '280px', fontSize: '0.9rem' }}>
                    {notification.title}
                  </div>
                  <small className={`${!notification.isRead ? 'text-primary' : 'text-muted'}`}>{notification.message}</small>
                </div>
                <ChevronRight size={18} className="ms-2 flex-shrink-0 text-muted" />
              </a>
            ))
          ) : (
            <div className="text-center text-muted py-5">
                <Bell size={36} className="mb-2" />
                <p>Bạn không có thông báo mới nào.</p>
            </div>
          )}
          
          <div className="border-top pt-2 mt-2">
            <button 
                className="btn btn-sm w-100 text-primary fw-bold" 
                onClick={() => { navigate('/staff/notifications'); setShowNotificationsDropdown(false); }}>
              Xem tất cả
            </button>
          </div>
        </div>
      );
  };


  // Logic render các mục navigation dựa trên trạng thái đăng nhập
  const renderNavItems = () => {
      if (staffName) {
            return (
        <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-3">
          
          {/* MỤC THÔNG BÁO */}
          {/* Dùng ref thay cho id */}
          <li className="nav-item mx-3 position-relative" ref={notificationRef}>
            <button
              className="btn btn-link p-0 border-0"
              onClick={toggleNotifications}
            >
              <Bell size={24} className="text-primary cursor-pointer" />
              {unreadCount > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.65rem' }}
                >
                  {unreadCount}
                  <span className="visually-hidden">thông báo chưa đọc</span>
                </span>
              )}
            </button>
            
            {/* GỌI HÀM RENDER DROPDOWN */}
            {renderNotificationDropdown()}
          </li>

          {/* HIỂN THỊ TÊN NHÂN VIÊN */}
          <li className="nav-item mx-3 d-flex align-items-center">
             <User className="text-success me-2" size={20} />
            <span className="nav-link fw-bold text-success">
              Xin chào, {staffName}!
            </span>
          </li>
          
          {/* NÚT ĐĂNG XUẤT */}
          <li className="nav-item">
            <button
              className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center"
              onClick={handleLogout}
            >
              <LogOut size={18} className="me-2" />
              Đăng xuất
            </button>
          </li>
        </ul>
      );
    } else {
      // Chưa đăng nhập (phần Guest giữ nguyên)
      return (
        <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-3">
          <li className="nav-item mx-3">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item mx-3">
            <a className="nav-link" href="/staff-login">Staff Login</a>
          </li>
          <li className="nav-item">
            <button
              className="btn btn-primary rounded-pill px-4 py-2"
              onClick={() => setShowModal(true)}
            >
              Đăng kí miễn phí
            </button>
          </li>
        </ul>
      );
    }
  };


  return (
    <>
      <style>{`
        /* CSS tuỳ chỉnh cho Navbar */
        .navbar-brand .text-primary { color: #4678e5ff !important; }
        .nav-link { 
          font-weight: 500;
          color: #374151 !important; 
        }
        .nav-link:hover { color: #4678e5ff !important; }
        .cursor-pointer { cursor: pointer; }
        /* Style mới cho thông báo chưa đọc */
        .bg-light-blue { background-color: #eaf3ffff; }
        .bg-hover-light:hover { background-color: #f7f7f7; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
      <nav className="navbar navbar-expand-lg bg-white border-bottom px-4">
        <div className="container-fluid">
          {/* Logo + Brand */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src={logo}
              alt="EV Station"
              height="80"
              className="me-3"
            />
            <span className="fw-bold text-primary fs-1">EV Station</span>
          </a>

          <div className="collapse navbar-collapse" id="navbarNav">
            {renderNavItems()} 
          </div>
        </div>
      </nav>

      {/* Simple Sign-up modal rendered when showModal true */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title w-100 text-center fw-bold fs-3">Đăng ký</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <form>
                    <div className="mb-4">
                      <input type="text" className="form-control" placeholder="Số điện thoại" />
                    </div>
                    <div className="mb-4">
                      <input type="text" className="form-control" placeholder="Tên hiển thị" />
                    </div>
                    <div className="mb-4">
                      <input type="password" className="form-control" placeholder="Mật khẩu" />
                    </div>
                    <div className="form-check mb-4">
                      <input className="form-check-input" type="checkbox" id="agree" />
                      <label className="form-check-label" htmlFor="agree">
                        Tôi đã đọc và đồng ý với <a href="#">Chính sách & quy định</a>
                      </label>
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                      Đăng ký
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;