import React from 'react';
import { Container, Row, Col, Card, Button, Alert, ButtonGroup } from 'react-bootstrap';

interface UserInfo {
  email: string;
  sdt: string;
  cccd: string;
  gplx: string;
  ten: string;
  ngaySinh: string;
  diaChi: string;
  gioiTinh: string;
}

interface ReviewConfirmPageProps {
  userInfo: UserInfo;
  onSubmit: () => void;
  onEdit: () => void;
  onBack?: () => void;
}

const ReviewConfirmPage: React.FC<ReviewConfirmPageProps> = ({
  userInfo,
  onSubmit,
  onEdit,
  onBack
}) => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card>
            <Card.Header>
              <h1 className="mb-1">📋 Xem lại & Xác nhận</h1>
              <p className="mb-0 text-muted">Vui lòng kiểm tra kỹ thông tin trước khi gửi đăng ký</p>
            </Card.Header>
            <Card.Body>
              {/* Thông tin cá nhân */}
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">👤 Thông tin cá nhân</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <strong>Họ và tên:</strong>
                      <div>{userInfo.ten}</div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Ngày sinh:</strong>
                      <div>{userInfo.ngaySinh}</div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Giới tính:</strong>
                      <div>{userInfo.gioiTinh}</div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Địa chỉ:</strong>
                      <div>{userInfo.diaChi}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Thông tin liên hệ */}
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">📞 Thông tin liên hệ</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <strong>Email:</strong>
                      <div>{userInfo.email}</div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Số điện thoại:</strong>
                      <div>{userInfo.sdt}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Giấy tờ tùy thân */}
              <Card className="mb-3">
                <Card.Header>
                  <h5 className="mb-0">📄 Giấy tờ tùy thân</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <strong>Số CCCD:</strong>
                      <div className="font-monospace">{userInfo.cccd}</div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <strong>Số GPLX:</strong>
                      <div className="font-monospace">{userInfo.gplx}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Lưu ý quan trọng */}
              <Alert variant="warning">
                <Alert.Heading>⚠️ Lưu ý quan trọng</Alert.Heading>
                <ul className="mb-0">
                  <li>Vui lòng kiểm tra kỹ tất cả thông tin trước khi xác nhận</li>
                  <li>Thông tin sai lệch có thể ảnh hưởng đến quá trình thuê xe</li>
                  <li>Sau khi gửi đăng ký, bạn sẽ nhận được email xác nhận</li>
                  <li>CCCD và GPLX phải còn hiệu lực và chính chủ</li>
                </ul>
              </Alert>
            </Card.Body>
            
            {/* Nút hành động */}
            <Card.Footer>
              <ButtonGroup className="w-100">
                {onBack && (
                  <Button variant="outline-secondary" onClick={onBack}>
                    ← Quay lại
                  </Button>
                )}
                
                <Button variant="outline-primary" onClick={onEdit}>
                  ✏️ Chỉnh sửa
                </Button>
                
                <Button variant="primary" onClick={onSubmit}>
                  ✅ Đồng ý & Gửi đăng ký
                </Button>
              </ButtonGroup>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReviewConfirmPage;