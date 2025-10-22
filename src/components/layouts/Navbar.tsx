import React from "react";
import logo from "../../images/favicon.png"; // logo trong src/images
import { useState } from "react";

const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

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

          <div className="collapse navbar-collapse" id="navbarNav">
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