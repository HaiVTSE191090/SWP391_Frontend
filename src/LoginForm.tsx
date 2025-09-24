import React from "react";
import bg from "./images/vf.png";

const LoginForm: React.FC = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-75 p-5 rounded-4 shadow" style={{ width: "400px" }}>
        <h4 className="text-center mb-5">ĐĂNG NHẬP</h4>

        <form>
          <div className="mb-4">
            <input type="email" placeholder="Email" className="form-control rounded-pill" />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Mật khẩu" className="form-control rounded-pill" />
          </div>

          <div className="d-grid mb-4">
            <button type="submit" className="btn btn-primary rounded-pill fw-bold py-2">
              ĐĂNG NHẬP NGAY
            </button>
          </div>
        </form>

        <p className="text-center mb-3">Hoặc đăng nhập với</p>
        <div className="d-grid mb-4">
          <button className="btn btn-light border rounded-pill py-2">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width="20"
              className="me-2"
            />
            Đăng nhập bằng GOOGLE
          </button>
        </div>

        <p className="text-center mb-0">
          Chưa có tài khoản?{" "}
          <a href="/register" className="fw-bold">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
