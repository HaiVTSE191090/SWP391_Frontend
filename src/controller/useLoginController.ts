import { useState } from "react";
import { LoginRequest } from "../models/AuthModel";
import { loginApi, loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const useLoginController = () => {
  const [form, setForm] = useState<LoginRequest>({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginWithGoogle = (credentialRes: string) => {
    console.log(credentialRes);
    navigate(-1);
    const data = loginWithGoogle(credentialRes);
    // nhận dữ liệu từ backend
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await loginApi(form);

      if (result.status === "success" || result.code === 200) {
        setMessage("Đăng nhập thành công!");
      } else {
        setError(result.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err: any) {
      setError("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    message,
    handleChange,
    handleSubmit,
    handleLoginWithGoogle,
  };
};
