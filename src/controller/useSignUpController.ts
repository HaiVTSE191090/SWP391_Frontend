import { useState } from "react";
import { SignUpRequest } from "../models/AuthModel";
import { signUpApi, loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const useSignUpController = () => {
  const [phone, setPhone] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginWithGoogle = (credentialRes: string) => {
    navigate(-1);
    const data = loginWithGoogle(credentialRes);
    // nhận dữ liệu từ backend
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form: SignUpRequest = { phone, displayName, password, confirmPassword };
    const result = await signUpApi(form);
    if (result.error) {
      setError(result.message);
      setMessage("");
    } else {
      setMessage(result.message);
      setError("");
      navigate(-1);
    }
  };

  return {
    phone, displayName, password, confirmPassword,
    loading, error, message,
    setPhone, setdisplayName, setpassword, setconfirmPassword,
    handleLoginWithGoogle, onSubmit,
  };
};
