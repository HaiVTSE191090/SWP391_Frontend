import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    UserCircle,
    Package,
    Receipt,
    AlertCircle,
        MonitorCog,
    CarFront,
    EvCharger,
    Car,
    Bell
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import userImage from "../../images/User_Icon.png";
import "./AdminSideBar.css";
import { useAdmin } from "../../hooks/useAdmin";
import { useNotification } from "../../hooks/useNotify";
import { Badge, Button, ListGroup, Modal } from "react-bootstrap";

export const AdminSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { profile, loadAdminProfile, isLoading } = useAdmin();
    const { notifications, loadNotifications, markAsRead } = useNotification();
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    useEffect(() => {
        loadAdminProfile();
        loadNotifications();
    }, [loadAdminProfile, loadNotifications]);
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const handleCloseModal = () => setShowNotifyModal(false);
    const handleShowModal = () => setShowNotifyModal(true);

    const handleViewAll = () => {
        handleCloseModal();
        navigate("/admin/notifications");
    };

    const handleNotificationClick = (notificationId: number) => {
        markAsRead(notificationId);
        // (Tùy chọn) Bạn có thể thêm logic điều hướng ở đây,
        // ví dụ: nếu message chứa 'booking #60', thì navigate qua booking đó.

        // Tạm thời chỉ đóng modal
        handleCloseModal();
    };
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin" },
        { icon: <UserCircle size={20} />, text: "Khách Hàng", path: "/admin/customers" },
        { icon: <Package size={20} />, text: "Hợp Đồng", path: "/admin/contract" },
        { icon: <Receipt size={20} />, text: "Booking (Chờ duyệt)", path: "/admin/booking", alert: true },
        { icon: <MonitorCog size={20} />, text: "Thiết Lập Điều Khoản", path: "/admin/config" },
        { icon: <CarFront size={20} />, text: "Thiết Lập Mẫu Xe", path: "/admin/vehicle-model" },
        { icon: <EvCharger size={20} />, text: "Thiết Lập Trạm Xe", path: "/admin/station" },
        { icon: <Car size={20} />, text: "Xe điện", path: "/admin/vehicles" },

    ];

    return (
        <aside className="admin-sidebar">
            <nav className="sidebar-nav">
                <div className="sidebar-header">
                    <h2 className="title">Admin</h2>
                    <button
                        className="notification-bell"
                        onClick={handleShowModal} // <-- Sửa
                    >
                        <Bell size={20} />
                        {unreadNotifications.length > 0 && (
                            <span className="notification-badge">
                                {unreadNotifications.length}
                            </span>
                        )}
                    </button>
                </div>

                <ul className="sidebar-menu">
                    {menuItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            icon={item.icon}
                            text={item.text}
                            active={location.pathname === item.path}
                            alert={item.alert}
                            path={item.path}
                        />
                    ))}
                </ul>

                <Link
                    to="/admin/profile" // <-- 3. ĐẶT ĐƯỜNG DẪN CỦA BẠN
                    className="sidebar-footer" // Giữ nguyên class
                    style={{ textDecoration: "none" }} // 4. Bỏ gạch chân
                >                    <img src={userImage} alt="user" className="user-img" />
                    <div className="user-info">
                        {isLoading || !profile ? (
                            <>
                                <h4>Đang tải...</h4>
                                <span>...</span>
                            </>
                        ) : (
                            <>
                                <h4>{profile.fullName}</h4>
                                <span>{profile.email}</span>
                            </>
                        )}
                    </div>
                </Link>
            </nav>

            <Modal show={showNotifyModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <ListGroup variant="flush">
                        {notifications.length > 0 ? (
                            notifications.slice(0, 10).map((noti) => ( // Hiển thị 10 noti mới nhất
                                <ListGroup.Item
                                    key={noti.notificationId}
                                    action // Cho phép bấm
                                    onClick={() => handleNotificationClick(noti.notificationId)}
                                    // CSS cho thông báo chưa đọc
                                    className={!noti.isRead ? "notification-item-unread" : ""}
                                >
                                    <div className="d-flex justify-content-between">
                                        <strong className="me-2">{noti.title}</strong>
                                        {!noti.isRead && (
                                            <Badge bg="primary" pill>
                                                Mới
                                            </Badge>
                                        )}
                                    </div>
                                    <small>{noti.message}</small>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p className="text-center text-muted">Không có thông báo nào.</p>
                        )}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleViewAll}>
                        Xem tất cả thông báo
                    </Button>
                </Modal.Footer>
            </Modal>
        </aside>
    );
};

// const NotificationBell = ({ unreadCount }: { unreadCount: number }) => {
//     return (
//         <Link to="/admin/notifications" className="notification-bell">
//             <Bell size={20} />
//             {unreadCount > 0 && (
//                 <span className="notification-badge">{unreadCount}</span>
//             )}
//         </Link>
//     );
// };

const SidebarItem = ({ icon, text, active, alert, path }: any) => {
    return (
        <li className={`sidebar-item ${active ? "active" : ""}`}>
            <Link to={path} className="sidebar-link">
                <span className="sidebar-icon">{icon}</span><span className="sidebar-text">{text}</span>
                {alert && <AlertCircle size={14} className="alert-dot" />}
            </Link>
        </li>
    );
};
