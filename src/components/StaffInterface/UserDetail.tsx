import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Image } from 'react-bootstrap';

interface RenterDetail {
  id: string | number;
  name: string;
  birth: string;
  phone: string;
  email: string;
  address: string;
  identityCard: string;
  license: string;
  avatarUrl: string; // Ảnh đại diện lấy từ Gmail
}

interface UserDetailProps {
  renterId: string | number;
  onBack?: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ renterId, onBack }) => {
  const [detail, setDetail] = useState<RenterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line
  }, [renterId]);

  const fetchDetail = async () => {
    setLoading(true);
    setError('');

    // TODO: Gọi API khi có backend
    // Mock data tạm
    setTimeout(() => {
      const mockDetail: RenterDetail = {
        id: renterId,
        name: "Nguyễn Văn A",
        birth: "1999-01-01",
        phone: "0912345678",
        email: "nguyenvana@gmail.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        identityCard: "123456789",
        license: "B2-123456",
        avatarUrl: `https://i.pravatar.cc/120?u=${renterId}`,
      };
      setDetail(mockDetail);
      setLoading(false);
    }, 500);
  };

  const handleVerify = async () => {
    // TODO: Gọi API khi có backend
    alert('Đã xác minh người thuê thành công!');
    fetchDetail(); // Refresh lại dữ liệu
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    
    // TODO: Gọi API khi có backend
    alert('Đã xóa người thuê thành công!');
    if (onBack) onBack(); // Quay về danh sách
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Đang tải thông tin...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
        {onBack && <Button onClick={onBack}>Quay lại</Button>}
      </Container>
    );
  }

  return (
    <Container className="py-4 d-flex flex-column align-items-center">
      <Card className="p-4 shadow" style={{ borderRadius: 24, minWidth: 400, maxWidth: 600, width: '100%' }}>
        <Row className="align-items-center">
          <Col xs={4} className="d-flex justify-content-center">
            <Image src={detail?.avatarUrl} roundedCircle width={90} height={90} alt="avatar" />
          </Col>
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
      <div className="d-flex justify-content-center gap-4 mt-4">
        <Button variant="success" size="lg" onClick={handleVerify}>Verify</Button>
        <Button variant="danger" size="lg" onClick={handleDelete}>Delete</Button>
      </div>
      {onBack && <Button variant="link" className="mt-3" onClick={onBack}>Quay lại danh sách</Button>}
    </Container>
  );
};

export default UserDetail;
