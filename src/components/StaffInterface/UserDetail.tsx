import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Image } from 'react-bootstrap';
import { RenterController } from '../../controller/RenterController';

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

    // Gọi Controller - KHÔNG gọi API trực tiếp
    const result = await RenterController.getRenterDetail(renterId);

    if (result.success) {
      setDetail(result.data);
      setLoading(false);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const result = await RenterController.verifyRenter(renterId);
    
    if (result.success) {
      alert(result.message);
      fetchDetail(); // Refresh lại dữ liệu
    } else {
      alert(`Lỗi: ${result.error}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    
    const result = await RenterController.deleteRenter(renterId);
    
    if (result.success) {
      alert(result.message);
      if (onBack) onBack(); // Quay về danh sách
    } else {
      alert(`Lỗi: ${result.error}`);
    }
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
