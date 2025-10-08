import { useState } from "react";
import { LoginRequest, LoginResponse } from "../models/AuthModel";
import { loginApi } from "../services/authService";


export const useLoginController = () => {
  const [form, setForm] = useState<LoginRequest>({ phone: +84, password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [res, setRes] = useState<LoginResponse>({code: 0, message: ""})
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // nhận dữ liệu từ backend
  const handleLoginWithGoogle = async (credentialRes: string) => {
    
    try {
      // const data: LoginResponse = await loginWithGoogle(credentialRes);
      const data: LoginResponse = {
        code: 10,
        message:"thang lon",
        
      };
      return data;
    } catch (error) {
      console.error("Google login error:", error);
      return {
        code: 500,
        message: "Đăng nhập Google thất bại",
      };
    }
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
    res,
    handleChange,
    handleSubmit,
    handleLoginWithGoogle,
    setRes
  };
};
