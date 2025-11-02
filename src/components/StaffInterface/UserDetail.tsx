import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ConfirmationPopup from './ConfirmationPopup';
import { deleteRenter, getRenterDetails, verifyRenter } from './services/authServices';

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

  useEffect(() => {
    fetchDetail();
  }, []); // chạy lại khi id đổi

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    const userData = await getRenterDetails(renterId);
    setDetail(userData?.data?.data || null);
    setLoading(false);
  };

  const handleVerify = async () => {
    try {
      const resp = await verifyRenter(renterId);
      if (resp?.data?.status === 'success') {
        setPopupConfig({
          title: 'Success',
          message: 'The account has been successfully verified',
          type: 'success',
        });
        setShowPopup(true)
      }
    } catch (err) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to verify account',
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
          title: 'Success',
          message: 'The account has been successfully deleted',
          type: 'success',
        });
      }
      setShowPopup(true);
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to delete account',
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
    <Container className="py-4 d-flex flex-column align-items-center">
      <Card className="p-4 shadow" style={{ borderRadius: 24, minWidth: 400, maxWidth: 600, width: '100%' }}>
        <Row className="align-items-center">
          <Col xs={8}>
            <Row>
              <Col xs={6} className="mb-2">
                <strong>Name:</strong> {detail?.fullName}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Birth:</strong> {detail?.dateOfBirth}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Phone:</strong> {detail?.phoneNumber}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Email:</strong> {detail?.email}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Address:</strong> {detail?.address}
              </Col>
              <Col xs={6} className="mb-2">
                <strong>Identity Card:</strong> {detail?.cccd.documentNumber}
              </Col>
              <Col xs={12} className="mb-2">
                <strong>License:</strong> {detail?.gplx.documentNumber}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {detail?.status === 'PENDING_VERIFICATION' && (
        <div className="d-flex justify-content-center gap-4 mt-4">
          <Button variant="success" size="lg" onClick={handleVerify}>
            Verify
          </Button>
          <Button variant="danger" size="lg" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}

      {onBack && (
        <Button variant="link" className="mt-3" onClick={onBack}>
          Quay lại danh sách
        </Button>
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
