import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ConfirmationPopup from './ConfirmationPopup';
import { deleteRenter, getRenterDetails, verifyRenter } from './services/authServices';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DocumentDetail {
  documentNumber: string;
  fullName: string;
  type: 'NATIONAL_ID' | 'DRIVER_LICENSE' | string;
  issueDate: string;
  expiryDate: string;
  verifiedAt: string | null;
}

interface RenterDetail {
  renterId: number;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | string;
  cccd: DocumentDetail;
  gplx: DocumentDetail;
}

const UserDetail: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { id } = useParams(); //  lấy id từ URL
  const renterId = Number(id);
  const [detail, setDetail] = useState<RenterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'danger' | 'warning' | 'info',
  });
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await getRenterDetails(renterId);
      if (userData && userData.data && userData.data.status === 'success') {
        setDetail(userData.data.data);
      } else {
        setError(userData?.data?.message || 'Không thể tải dữ liệu renter.');
        setDetail(null);
      }
    } catch (err: any) {
      console.error("Lỗi khi fetch chi tiết renter:", err);
      setError(err.response?.data?.message || err.message || 'Lỗi mạng hoặc máy chủ.');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [renterId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]); // chạy lại khi id đổi


  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString; // Trả về chuỗi gốc nếu format lỗi
    }
  };

  const handleVerify = async () => {
    try {
      const resp = await verifyRenter(renterId);
      if (resp?.data?.status === 'success') {
        setPopupConfig({
          title: 'Thành công',
          message: 'Tài khoản đã được xác minh thành công.',
          type: 'success',
        });
        setShowPopup(true);

        // Reload lại trang sau 1.5 giây
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setPopupConfig({
        title: 'Lỗi',
        message: 'Xác minh tài khoản thất bại.',
        type: 'danger',
      });
      setShowPopup(true);
    }
  };

  const handleDelete = async () => {
    try {
      const resp = await deleteRenter(renterId);
      if (resp?.data?.status === 'success') {
        setPopupConfig({
          title: 'Thành công',
          message: 'Tài khoản đã được xóa thành công.',
          type: 'success',
        });
        setShowPopup(true);

        // Reload lại trang sau 1.5 giây
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setPopupConfig({
        title: 'Lỗi',
        message: 'Xóa tài khoản thất bại.',
        type: 'danger',
      });
      setShowPopup(true);
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
    <Container className="py-4">
      {/* Nút quay lại (di chuyển lên trên) */}
      {onBack && (
        <Button variant="link" onClick={onBack} className="mb-2 p-0">
          &larr; Quay lại danh sách
        </Button>
      )}

      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title as="h4" className="mb-0">
              {detail?.fullName} (ID: {detail?.renterId})
            </Card.Title>
            <Card.Subtitle className="text-muted">Chi tiết Renter</Card.Subtitle>
          </div>
          <Badge
            bg={detail?.status === 'VERIFIED' ? 'success' : 'warning'}
            className="p-2"
          >
            {detail?.status === 'VERIFIED' ? 'Đã xác thực' : 'Chờ xác thực'}
          </Badge>
        </Card.Header>

        <Card.Body>
          {/* ---- THÔNG TIN CÁ NHÂN ---- */}
          <Row className="mb-4">
            <h5 className="mb-3 border-bottom pb-2">Thông tin cá nhân</h5>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Ngày sinh:</strong> {formatDate(detail?.dateOfBirth)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Số điện thoại:</strong> {detail?.phoneNumber}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Email:</strong> {detail?.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Địa chỉ:</strong> {detail?.address}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {/* ---- THÔNG TIN GIẤY TỜ ---- */}
          <Row>
            <h5 className="mb-3 border-bottom pb-2">Thông tin giấy tờ</h5>
            {/* Cột CCCD */}
            <Col md={6}>
              <Card>
                <Card.Header className="bg-light">
                  <i className="bi bi-person-vcard-fill me-2"></i>
                  Căn cước công dân (CCCD)
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Số CCCD:</strong> {detail?.cccd?.documentNumber || 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Họ tên:</strong> {detail?.cccd?.fullName || 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Ngày cấp:</strong> {formatDate(detail?.cccd?.issueDate)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Ngày hết hạn:</strong> {formatDate(detail?.cccd?.expiryDate)}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            {/* Cột GPLX */}
            <Col md={6} className="mt-3 mt-md-0">
              <Card>
                <Card.Header className="bg-light">
                  <i className="bi bi-car-front-fill me-2"></i>
                  Giấy phép lái xe (GPLX)
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Số GPLX:</strong> {detail?.gplx?.documentNumber || 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Họ tên:</strong> {detail?.gplx?.fullName || 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Ngày cấp:</strong> {formatDate(detail?.gplx?.issueDate)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Ngày hết hạn:</strong> {formatDate(detail?.gplx?.expiryDate)}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {detail?.status === 'PENDING_VERIFICATION' && (
        <div className="d-flex justify-content-center gap-4 mt-4">
          <Button variant="success" size="lg" onClick={handleVerify}>
            <i className="bi bi-check-circle-fill me-2"></i>
            Xác thực
          </Button>
          <Button variant="danger" size="lg" onClick={handleDelete}>
            <i className="bi bi-trash-fill me-2"></i>
            Xóa
          </Button>
        </div>
      )}

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
