import React, { useState } from 'react';
import './BasicInfoForm.css';
import ErrorPopup from './ErrorPopup';

interface FormData {
  hoTen: string;
  email: string;
  soDienThoai: string;
  matKhau: string;
}

const BasicInfoForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    hoTen: '',
    email: '',
    soDienThoai: '',
    matKhau: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);

  // Giả lập database của các email và số điện thoại đã tồn tại
  const existingEmails = ['test@example.com', 'user@gmail.com', 'admin@domain.com'];
  const existingPhones = ['0123456789', '0987654321', '0369258147'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    // Kiểm tra các trường bắt buộc
    if (!formData.hoTen.trim()) {
      newErrors.push('Họ tên không được để trống');
    }

    if (!formData.email.trim()) {
      newErrors.push('Email không được để trống');
    } else {
      // Kiểm tra format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.push('Email không đúng định dạng');
      }
      // Kiểm tra email đã tồn tại
      else if (existingEmails.includes(formData.email)) {
        newErrors.push('Email này đã được sử dụng');
      }
    }

    if (!formData.soDienThoai.trim()) {
      newErrors.push('Số điện thoại không được để trống');
    } else {
      // Kiểm tra format số điện thoại Việt Nam
      const phoneRegex = /^(0|\+84)[0-9]{9}$/;
      if (!phoneRegex.test(formData.soDienThoai)) {
        newErrors.push('Số điện thoại không đúng định dạng');
      }
      // Kiểm tra số điện thoại đã tồn tại
      else if (existingPhones.includes(formData.soDienThoai)) {
        newErrors.push('Số điện thoại này đã được sử dụng');
      }
    }

    if (!formData.matKhau.trim()) {
      newErrors.push('Mật khẩu không được để trống');
    } else if (formData.matKhau.length < 6) {
      newErrors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setShowErrorPopup(true);
    } else {
      // Xử lý khi form hợp lệ
      console.log('Form submitted successfully:', formData);
      alert('Thông tin đã được lưu! Chuyển sang bước tiếp theo...');
    }
  };

  const closeErrorPopup = (): void => {
    setShowErrorPopup(false);
    setErrors([]);
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h1 className="form-title">NHẬP THÔNG TIN CƠ BẢN</h1>
        
        <form onSubmit={handleSubmit} className="basic-info-form">
          <input
            type="text"
            name="hoTen"
            value={formData.hoTen}
            onChange={handleInputChange}
            placeholder="Họ và tên"
            className="form-input"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form-input"
          />

          <input
            type="tel"
            name="soDienThoai"
            value={formData.soDienThoai}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
            className="form-input"
          />

          <input
            type="password"
            name="matKhau"
            value={formData.matKhau}
            onChange={handleInputChange}
            placeholder="Mật khẩu"
            className="form-input"
          />

          <button type="submit" className="register-btn">
            TIẾP TỤC
          </button>
        </form>


      </div>

      {showErrorPopup && (
        <ErrorPopup 
          errors={errors} 
          onClose={closeErrorPopup}
        />
      )}
    </div>
  );
};

export default BasicInfoForm;