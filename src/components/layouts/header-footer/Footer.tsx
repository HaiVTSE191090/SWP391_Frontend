import React from "react";
import logo from "../../images/logo.png"; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-top pt-5">
      <div className="container">
        <div className="row">
          {/* Logo + Brand */}
          <div className="col-md-6 d-flex align-items-center mb-4 mb-md-0">
            <img
              src={logo}
              alt="EV Station"
              height="80"
              className="me-3"
            />
            <h3 className="fw-bold text-primary m-0">EV Station</h3>
          </div>

          {/* Company Info */}
          <div className="col-md-6">
            <p className="mb-2">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              Công ty cổ phần thương mại dịch vụ EV Rental
            </p>
            <p className="mb-2">
              <i className="bi bi-telephone-fill text-primary me-2"></i>
              (123) 456-7890
            </p>
            <p className="mb-0 d-flex align-items-center">
              <i className="bi bi-envelope-fill text-primary me-2"></i>
              justinbiahoi123@gmail.com
            </p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Footer Menu */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <ul className="nav justify-content-center mb-3 mb-md-0 gap-4">
  <li className="nav-item">
    <a href="#" className="nav-link text-dark">ABOUT US</a>
  </li>
  <li className="nav-item">
    <a href="#" className="nav-link text-dark">CONTACT US</a>
  </li>
  <li className="nav-item">
    <a href="#" className="nav-link text-dark">HELP</a>
  </li>
  <li className="nav-item">
    <a href="#" className="nav-link text-dark">PRIVACY POLICY</a>
  </li>
  <li className="nav-item">
    <a href="#" className="nav-link text-dark">DISCLAIMER</a>
  </li>
</ul>


          <p className="text-muted mb-0">
            Copyright © 2025 • EV Station Co., Ltd
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
