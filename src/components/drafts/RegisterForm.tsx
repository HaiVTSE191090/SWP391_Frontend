import React from "react";
import bg from "./images/vf.png"; // import ảnh từ src/images

const RegisterForm: React.FC = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="p-4"
        style={{
          width: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "12px",
        }}
      >
        <h4 className="text-center mb-4">ĐĂNG KÝ TÀI KHOẢN</h4>

        <form>
          <div className="mb-3">
            <input type="text" placeholder="Họ và tên" className="form-control rounded-pill" />
          </div>
          <div className="mb-3">
            <input type="email" placeholder="Email" className="form-control rounded-pill" />
          </div>
          <div className="mb-3">
            <input type="text" placeholder="Số điện thoại" className="form-control rounded-pill" />
          </div>
          <div className="mb-3">
            <input type="password" placeholder="Mật Khẩu" className="form-control rounded-pill" />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary rounded-pill fw-bold">
              ĐĂNG KÝ NGAY
            </button>
          </div>
        </form>

        <p className="text-center mt-3 mb-1">Hoặc đăng nhập với</p>
        <div className="d-grid mb-3">
          <button className="btn btn-light border rounded-pill">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width="20"
              className="me-2"
            />
            Đăng nhập bằng GOOGLE
          </button>
        </div>

        <p className="text-center">
          Bạn đã có tài khoản?{" "}
          <a href="/login" className="fw-bold">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
