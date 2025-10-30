import React from "react";
import logo from "../../images/favicon.png"; 
import { useState, useEffect } from "react";
import { LogOut, User } from 'lucide-react';
import { getUserName, staffLogout } from "../StaffInterface/services/authServices";
import { useNavigate, useLocation } from "react-router-dom";


const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [staffName, setStaffName] = useState<string>(getUserName());
  const navigate = useNavigate();
  // KHAI BÁO MỚI: Sử dụng hook useLocation
  const location = useLocation();

  // BỔ SUNG LOGIC: Kiểm tra lại trạng thái đăng nhập (localStorage) mỗi khi URL thay đổi
  useEffect(() => {
    const currentName = getUserName();
    // Nếu tên trong state khác với tên trong localStorage (ví dụ: vừa đăng nhập)
    if (staffName !== currentName) {
      setStaffName(currentName);
    }
  }, [location.pathname, staffName]);

  
  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    staffLogout(); // 1. Xóa Token và tên khỏi localStorage (dùng hàm từ services)
    setStaffName(""); // 2. Cập nhật trạng thái local để hiển thị lại Navbar Guest
    navigate("/"); // 3. Chuyển hướng người dùng về trang đăng nhập
  };

  // Logic render các mục navigation dựa trên trạng thái đăng nhập
  const renderNavItems = () => {
      if (staffName) {
            return (
        <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-3">
          <li className="nav-item mx-3 d-flex align-items-center">
             <User className="text-success me-2" size={20} />
            <span className="nav-link fw-bold text-success">
              Xin chào, {staffName}!
            </span>
          </li>
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
      // Chưa đăng nhập (staffName rỗng): "Home", "Staff Login", "Đăng kí miễn phí"
      return (
        <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-3">
          <li className="nav-item mx-3">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item mx-3">
            {/* Chuyển hướng đến trang Đăng nhập Staff thực tế */}
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
        .navbar-brand .text-primary { color: #4678e5ff !important; }
        .nav-link { 
          font-weight: 500;
          color: #374151 !important; 
        }
        .nav-link:hover { color: #4678e5ff !important; }
      `}</style>
      <nav className="navbar navbar-expand-lg bg-white border-bottom px-4">
        <div className="container-fluid">
          {/* Logo + Brand */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            {/* Giữ lại thẻ img nếu bạn có logo */}
            <img
              src={logo}
              alt="EV Station"
              height="80"
              className="me-3"
            />
            <span className="fw-bold text-primary fs-1">EV Station</span>
          </a>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* THAY THẾ: Gọi hàm renderNavItems() để quyết định nội dung */}
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
