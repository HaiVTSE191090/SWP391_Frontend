import React, { use, useContext, useEffect } from "react";
import logo from "../../images/favicon.png"; // logo trong src/images
import { useNavigate } from "react-router-dom";
import SignUpForm from "../auth/SignUpForm";
import LoginForm from "../auth/LoginForm";
import { FormProvider } from "../../context/FormContext";
import { UserContext } from "../../context/UserContext";



const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        console.log(JSON.parse(userData));
        console.log(user);
      } catch (error) {
        console.log("Invalid user data in localStorage, logging out.");
        if (userCtx) {
          userCtx.logout();
        }
      }
    }
  });


if (userCtx === null) {
  return null;
}

const { logout, user } = userCtx;


return (
  <>
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4">
      <div className="container-fluid">
        {/* Logo và tên trang */}
        <button className="navbar-brand d-flex align-items-center btn btn-link p-0" type="button" onClick={() => navigate("/")} >
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
            {!user ? (
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
                <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
                  <li className="nav-item">
                    <span className="fw-bold">
                      Xin chào, {user?.fullName || user?.email || "Guest"}
                    </span>
                  </li>

                  <li className="nav-item">
                    <button className="btn btn-link text-decoration-none">
                      Lịch sử thuê xe
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-link text-decoration-none"
                      onClick={() => navigate("/kyc-verification")}
                    >
                      <i className="fas fa-id-card me-2"></i>
                      Xác thực danh tính
                    </button>
                  </li>

                  <li className="nav-item">
                    <button className="btn btn-link text-decoration-none">
                      Tài khoản của tôi
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-link text-danger text-decoration-none"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>

              </>
            )}
          </ul>
        </div>

      </div>
    </nav>

    {/* Modals mount ở root để tránh mount/unmount nhiều lần */}
    <FormProvider>
      <LoginForm />
      <SignUpForm />
    </FormProvider>


  </>
);
};

export default Navbar;