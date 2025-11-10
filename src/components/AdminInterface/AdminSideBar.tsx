import React from "react";
import {
    LayoutDashboard,
    UserCircle,
    Package,
    Receipt,
    AlertCircle,
    ChevronFirst,
    MonitorCog,
    CarFront,
    EvCharger
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import userImage from "../../images/User_Icon.png";
import "./AdminSideBar.css";
import path from "path";

export const AdminSideBar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin" },
        { icon: <UserCircle size={20} />, text: "Khách Hàng", path: "/admin/customers" },
        { icon: <Package size={20} />, text: "Hợp Đồng", path: "/admin/contract" },
        { icon: <Receipt size={20} />, text: "Booking (Chờ duyệt)", path: "/admin/booking", alert: true },
        { icon: <MonitorCog size={20} />, text: "Thiết Lập Điều Khoản", path: "/admin/config" },
        { icon: <CarFront size={20} />, text: "Thiết Lập Mẫu Xe", path: "/admin/vehicle-model" },
        { icon: <EvCharger size={20} />, text: "Thiết Lập Trạm Xe", path: "/admin/station" },

    ];

    return (
        <aside className="admin-sidebar">
            <nav className="sidebar-nav">
                <div className="sidebar-header">
                    <h2 className="title">Admin</h2>
                    <ChevronFirst />
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

                <div className="sidebar-footer">
                    <img src={userImage} alt="user" className="user-img" />
                    <div className="user-info">
                        <h4>Admin</h4>
                        <span>admin@gmail.com</span>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

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
