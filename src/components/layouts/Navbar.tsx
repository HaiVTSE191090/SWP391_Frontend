import React, { useContext, useEffect } from "react";
import logo from "../../images/favicon.png"; // logo trong src/images
import { useState } from "react";
import SignUpForm from "../auth/SignUpForm";
import LoginForm from "../auth/LoginForm";
import { FormProvider } from "../../context/FormContext";
import { UserContext } from "../../context/UserContext";
import { useUserProfile } from "../../hooks/useUserProfile";



const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Sử dụng hook để lấy thông tin user từ API
  const { user: userProfile, loading: profileLoading } = useUserProfile();

  const userCtx = useContext(UserContext)
  if (userCtx === null) return null;
  const { logout } = userCtx

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false);
    }
  }, [userProfile])



  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom px-4">
        <div className="container-fluid">
          {/* Logo + Brand */}
          <button className="navbar-brand d-flex align-items-center btn btn-link p-0" type="button">
            <img
              src={logo}
              alt="EV Station"
              height="80"
              className="me-3"
            />
            <span className="fw-bold text-primary fs-1">EV Station</span>
          </button>

          {/* Toggle button (mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-3">
              {/* Nếu chưa đăng nhập */}
              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary px-4"
                      data-bs-toggle="modal"
                      data-bs-target="#loginForm"
                    >
                      Đăng nhập
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill shadow w-100 px-4 py-2"
                      data-bs-toggle="modal"
                      data-bs-target="#signUpForm"
                    >
                      Đăng ký miễn phí
                    </button>
                  </li>
                </>
              ) : (
                // Nếu đã đăng nhập
                <>
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle fw-bold btn btn-link"
                      id="userMenu"
                      data-bs-toggle="dropdown"
                      type="button"
                    >
                      Xin chào, {userProfile?.fullName || userProfile?.email || "Guest"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button className="dropdown-item" type="button">
                          Lịch sử thuê xe
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown-item" 
                          type="button"
                          onClick={() => window.location.href = '/kyc-verification'}
                        >
                          <i className="fas fa-id-card me-2"></i>
                          Xác thực danh tính
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" type="button">
                          Tài khoản của tôi
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={logout}>
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>
      </nav>

      {/* Modals mount ở root để tránh mount/unmount nhiều lần */}
      <FormProvider>
        <LoginForm />
      </FormProvider>
      <SignUpForm />


    </>
  );
};

export default Navbar;