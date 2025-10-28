import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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
    onSubmit(otp);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleCancel = () => {
    setOtp('');
    onCancel();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered backdrop="static" keyboard={false}>
      <Modal.Body style={{ borderRadius: 24, padding: 32, background: '#181818', color: '#fff' }}>
        <div className="text-center mb-3">
          <h5 className="fw-bold mb-3">Nhập mã OTP</h5>
          <div className="mb-4" style={{ fontSize: 14, color: '#ccc' }}>
            Mã OTP đã được gửi tới địa chỉ email của khách hàng.
          </div>
        </div>
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
