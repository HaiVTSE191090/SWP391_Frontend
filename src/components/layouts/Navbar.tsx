import React from "react";
import logo from "../../images/favicon.png"; // logo trong src/images
import { useState } from "react";
import SignUpForm from "../auth/SignUpForm";



const Navbar: React.FC = () => {

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
                <a className="nav-link" href="#">Đăng nhập</a> {/* cái này phải là một cái button nếu muốn làm popup*/}
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-primary rounded-pill shadow w-100 px-4 py-2"
                  data-bs-toggle="modal"
                  data-bs-target="#signUpForm"
                  >
                  Đăng ký miễn phí
                </button>
                  <SignUpForm/>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal */}


    </>
  );
};

export default Navbar;