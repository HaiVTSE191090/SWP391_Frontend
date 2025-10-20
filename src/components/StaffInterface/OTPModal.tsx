import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Popup nhập OTP, dùng cho xác thực OTP khách hàng

// Props:
// show: true/false để hiện/ẩn popup
// onSubmit: hàm xử lý khi submit OTP
// onCancel: hàm xử lý khi bấm Cancel hoặc đóng popup
interface OTPModalProps {
  show: boolean;
  onSubmit: (otp: string) => void;
  onCancel: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ show, onSubmit, onCancel }) => {
  // State lưu giá trị OTP nhập vào
  const [otp, setOtp] = useState('');

  // Xử lý submit form OTP
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp); // Gửi mã OTP lên cho parent
  };

  // Xử lý thay đổi input OTP
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Xử lý khi bấm Cancel hoặc đóng popup
  const handleCancel = () => {
    setOtp('');
    onCancel();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered backdrop="static" keyboard={false}>
      {/* Nội dung popup OTP */}
      <Modal.Body style={{ borderRadius: 24, padding: 32, background: '#181818', color: '#fff' }}>
        <div className="text-center mb-3">
          <h5 className="fw-bold mb-3">Nhập mã OTP</h5>
          {/* Thông báo gửi OTP */}
          <div className="mb-4" style={{ fontSize: 14, color: '#ccc' }}>
            Mã OTP đã được gửi tới địa chỉ email của khách hàng.
          </div>
        </div>
        {/* Form nhập OTP */}
        <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center gap-3">
          <Form.Group className="w-100 mb-3" controlId="otpInput">
            <Form.Control
              type="text"
              placeholder="Mã OTP"
              value={otp}
              onChange={handleChange}
              style={{ textAlign: 'center', fontSize: 18, borderRadius: 8, padding: '12px 0' }}
              autoFocus
              required
            />
          </Form.Group>
          {/* 2 nút Submit và Cancel */}
          <div className="d-flex justify-content-center gap-3 w-100">
            <Button variant="primary" type="submit" className="px-4">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCancel} className="px-4">
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OTPModal;
