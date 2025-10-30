import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import ConfirmationPopup from './ConfirmationPopup';
// import OTPModal from './OTPModal';

// Thông tin chi tiết người thuê
interface RenterDetail {
  renterId: number;
  name: string;
  birth: string;
  phone: string;
  email: string;
  address: string;
  identityCard: string;
  license: string;
  avatarUrl: string;
}

// Props của component
interface UserDetailProps {
  renterId: string | number;
  onBack?: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ renterId, onBack }) => {
  const [detail, setDetail] = useState<RenterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'danger' | 'warning' | 'info'
  });
  // const [showOTPModal, setShowOTPModal] = useState(false);

  // Tự động load data khi vào trang
  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line
  }, [renterId]);

  // Hàm tải thông tin chi tiết
  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError('');
      
      // TODO: Thay bằng API thật
      // const res = await axios.get(`/api/renters/${renterId}`);
      // setDetail(res.data);
      
      // Mock data để test
      setTimeout(() => {
        setDetail({
          renterId: 1,
          name: 'Nguyễn Văn A',
          birth: '1999-01-01',
          phone: '0912345678',
          email: 'nguyenvana@gmail.com',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          identityCard: '123456789',
          license: 'B2-123456',
          avatarUrl: 'https://i.pravatar.cc/120?u=' + renterId
        });
        setLoading(false);
      }, 800);
    } catch (err: any) {
      setError('Không thể tải thông tin người dùng!');
      setLoading(false);
    }
  };

  // Xử lý khi bấm Verify

  const handleVerify = async () => {
    try {
      // TODO: Gọi API xác thực
      // await axios.post(`/api/renters/${renterId}/verify`);
      
      setPopupConfig({
        title: 'Success',
        message: 'The account has been successfully verified',
        type: 'success'
      });
      setShowPopup(true);
    } catch (err) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to verify account',
        type: 'danger'
      });
      setShowPopup(true);
    }
  };

  // Xử lý khi bấm Delete
  const handleDelete = async () => {
    try {
      // TODO: Gọi API xóa
      // await axios.delete(`/api/renters/${renterId}`);
      
      setPopupConfig({
        title: 'Success',
        message: 'The account has been successfully deleted',
        type: 'success'
      });
      setShowPopup(true);
      
      // Sau 2 giây tự động quay lại
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to delete account',
        type: 'danger'
      });
      setShowPopup(true);
    }
  };

  // Đang loading
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Đang tải thông tin...</div>
      </Container>
    );
  }

  // Có lỗi
  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
        {onBack && <Button onClick={onBack}>Quay lại</Button>}
      </Container>
    );
  }

  // Hiển thị giao diện
  return (
    <Container className="py-4 d-flex flex-column align-items-center">
      {/* Card thông tin */}
      <Card className="p-4 shadow" style={{ borderRadius: 24, minWidth: 400, maxWidth: 600, width: '100%' }}>
        <Row className="align-items-center">
          {/* Avatar */}
          <Col xs={4} className="d-flex justify-content-center">
            <Image 
              src={detail?.avatarUrl}
              roundedCircle
              width={90} 
              height={90} 
              alt="avatar" 
            />
          </Col>
          
          {/* Thông tin chi tiết */}
          <Col xs={8}>
            <Row>
              <Col xs={6} className="mb-2">
                <strong>Name:</strong> {detail?.name}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Birth:</strong> {detail?.birth}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Phone:</strong> {detail?.phone}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Email:</strong> {detail?.email}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Address:</strong> {detail?.address}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Identity Card:</strong> {detail?.identityCard}
              </Col>
              <Col xs={12} className="mb-2">
                <strong>License:</strong> {detail?.license}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      

      {/* 2 nút Verify và Delete */}
      <div className="d-flex justify-content-center gap-4 mt-4">
        <Button variant="success" size="lg" onClick={handleVerify}>
          Verify
        </Button>
        <Button variant="danger" size="lg" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      
      {/* Nút quay lại */}
      {onBack && (
        <Button variant="link" className="mt-3" onClick={onBack}>
          Quay lại danh sách
        </Button>
      )}

      {/* Popup OTP đã chuyển sang ListRenter */}
      {/* Popup thông báo */}
      <ConfirmationPopup
        show={showPopup}
        onHide={() => setShowPopup(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />
    </Container>
  );
};

export default UserDetail;
