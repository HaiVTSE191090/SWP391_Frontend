import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BasicInfoForm.css';

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

  const [validated, setValidated] = useState(false);

  // Danh sách email và số điện thoại đã tồn tại
  const existingEmails = ['test@example.com', 'user@gmail.com'];
  const existingPhones = ['0123456789', '0987654321'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    return form.checkValidity();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);
    
    if (validateForm()) {
      console.log('Form OK:', formData);
      alert('Thông tin đã lưu thành công!');
    } else {
      alert('Vui lòng kiểm tra lại thông tin!');
    }
  };

  return (
    <div className="form-container">
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} md={6} lg={5}>
            <div className="form-wrapper bg-white rounded-4 shadow-lg p-5">
              <h1 className="form-title text-center fw-bold mb-4">
                NHẬP THÔNG TIN CƠ BẢN
              </h1>
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Họ tên */}
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleInputChange}
                    placeholder="Họ và tên"
                    size="lg"
                    className="rounded-pill"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui lòng nhập họ tên
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    size="lg"
                    className="rounded-pill"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  />
                  <Form.Control.Feedback type="invalid">
                    Email không hợp lệ
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Số điện thoại */}
                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    size="lg"
                    className="rounded-pill"
                    required
                    pattern="[0-9]{10}"
                  />
                  <Form.Control.Feedback type="invalid">
                    Số điện thoại không hợp lệ
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Mật khẩu */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    name="matKhau"
                    value={formData.matKhau}
                    onChange={handleInputChange}
                    placeholder="Mật khẩu"
                    size="lg"
                    className="rounded-pill"
                    required
                    minLength={6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Mật khẩu tối thiểu 6 ký tự
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary"
                    size="lg"
                    className="rounded-pill fw-bold"
                  >
                    TIẾP TỤC
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BasicInfoForm;