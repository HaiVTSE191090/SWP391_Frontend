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
              height="80" // 👈 chỉnh to hơn
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
                    Đăng kí miễn phí
                  </button>
                </li>
              </ul>
            </div>
        </div>
      </nav>
      {/* Modal */}
      {showModal
      }
    </>
  );
};

export default Navbar;