import React from "react";
import logo from "../../images/favicon.png"; // logo trong src/images
import { useState } from "react";
import SignUpForm from "../auth/SignUpForm";
import LoginForm from "../auth/LoginForm";
import { LoginResponse } from "../../models/AuthModel";
import { useLoginController } from "../../controller/useLoginController";



const Navbar: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);


  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Đã đăng xuất!");
  };


  const {res} = useLoginController();




  return (
    <>
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
                      className="btn btn-outline-primary px-4"
                      data-bs-toggle="modal"
                      data-bs-target="#loginForm"
                    >
                      Đăng nhập
                    </button>
                    <LoginForm />
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-primary rounded-pill shadow w-100 px-4 py-2"
                      data-bs-toggle="modal"
                      data-bs-target="#signUpForm"
                    >
                      Đăng ký miễn phí
                    </button>
                    <SignUpForm />
                  </li>
                </>
              ) : (
                // Nếu đã đăng nhập
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle fw-bold"
                      href="#"
                      id="userMenu"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Xin chào, Harry
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" href="#">
                          Lịch sử thuê xe
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Tài khoản của tôi
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
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

      {/* Modal */}


    </>
  );
};

export default Navbar;