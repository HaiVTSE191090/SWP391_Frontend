import React from "react";
import logo from "../../images/logo.png"; // logo trong src/images

const Navbar: React.FC = () => {
  return (
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
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item mx-3">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="#">Features</a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="#">Pricing</a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="#">Gallery</a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="#">Team</a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="#">Sign in</a>
            </li>
            <li className="nav-item ms-lg-4">
              <a className="btn btn-primary rounded-pill px-4 py-2" href="#">
                Start for free
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
