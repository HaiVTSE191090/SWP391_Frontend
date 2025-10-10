import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

interface PopupProps {
  type: 'duplicate' | 'age' | 'confirmation' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onReject?: () => void;
  data?: any;
}

const NotificationPopup: React.FC<PopupProps> = ({
  type,
  isOpen,
  onClose,
  onConfirm,
  onReject,
  data
}) => {
  if (!type) return null;

  // Popup trùng lặp
  if (type === 'duplicate') {
    return (
      <Modal show={isOpen} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Tài liệu trùng lặp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tài liệu đã được sử dụng để đăng ký trước đó. Vui lòng đăng nhập.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onClose}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Popup không đủ tuổi
  if (type === 'age') {
    return (
      <Modal show={isOpen} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>🚫 Không đủ điều kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Độ tuổi tối thiểu để thuê xe là 21. Tài khoản của bạn hiện chưa đáp ứng.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onClose}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Popup xác nhận thông tin
  if (type === 'confirmation') {
    return (
      <Modal show={isOpen} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📄 Xác nhận thông tin CCCD</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Vui lòng kiểm tra thông tin:</p>
          
          {data && (
            <div className="border rounded p-3 bg-light">
              <Row className="mb-2">
                <Col sm={4}><span>Họ tên:</span></Col>
                <Col sm={8}><strong>{data.ten}</strong></Col>
              </Row>
              <Row className="mb-2">
                <Col sm={4}><span>CCCD:</span></Col>
                <Col sm={8}><strong>{data.cccd}</strong></Col>
              </Row>
              <Row className="mb-2">
                <Col sm={4}><span>Ngày sinh:</span></Col>
                <Col sm={8}><strong>{data.ngaySinh}</strong></Col>
              </Row>
              <Row>
                <Col sm={4}><span>Địa chỉ:</span></Col>
                <Col sm={8}><strong>{data.diaChi}</strong></Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onReject}>
            Không đồng ý
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return null;
};

export default NotificationPopup;