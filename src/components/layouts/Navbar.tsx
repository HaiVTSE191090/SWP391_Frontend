import React from "react";
import logo from "../../images/favicon.png"; // logo trong src/images
import { useState } from "react";
import SignUpForm from "../auth/SignUpForm";



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

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-3">
              <li className="nav-item mx-3">
                <a className="nav-link" href="#">Đăng nhập</a>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-primary rounded-pill px-4 py-2"
                  onClick={() => setShowModal(true)}
                >
                  Đăng ký miễn phí
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <div className="modal-header">
                <h5 className="modal-title">Đăng ký tài khoản</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <SignUpForm />
              </div>
            </div>
          </div>
          {/* backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          ></div>
        </div>
      )}
    </>
  );
};

export default Navbar;