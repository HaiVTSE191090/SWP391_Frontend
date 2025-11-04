import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { getCarDetails } from './services/authServices';

// Interface cho dữ liệu xe từ API
interface VehicleDetail {
  vehicleId: number;
  vehicleName: string;
  plateNumber: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  description: string;
  modelName: string;
  stationName: string;
  pricePerHour: number;
  pricePerDay: number;
  batteryLevel: number;
  mileage: number;
  imageUrls: string[];
}

const ChooseCar: React.FC = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  
  const [vehicleDetail, setVehicleDetail] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tải dữ liệu xe khi component mount
  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetail(Number(vehicleId));
    }
  }, [vehicleId]);

  // Hàm gọi API lấy chi tiết xe
  const fetchVehicleDetail = async (id: number) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getCarDetails(id);
      const data = response?.data?.data;
      
      if (data) {
        setVehicleDetail(data);
      } else {
        setError('Không tìm thấy thông tin xe!');
      }
    } catch (err: any) {
      console.error('Lỗi khi tải thông tin xe:', err);
      setError('Không thể tải thông tin xe! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm hiển thị badge trạng thái
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge bg="success">Có sẵn</Badge>;
      case 'IN_USE':
        return <Badge bg="warning">Đang cho thuê</Badge>;
      case 'MAINTENANCE':
        return <Badge bg="danger">Bảo trì</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Hàm quay lại trang Staff
  const handleBack = () => {
    navigate('/staff');
  };

  // Đang loading
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Đang tải thông tin xe...</div>
      </Container>
    );
  }

  // Có lỗi
  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={handleBack} variant="primary">Quay lại</Button>
      </Container>
    );
  }

  // Không có dữ liệu
  if (!vehicleDetail) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">Không tìm thấy thông tin xe!</Alert>
        <Button onClick={handleBack} variant="primary">Quay lại</Button>
      </Container>
    );
  }

  // Hiển thị giao diện chi tiết xe
  return (
    <Container className="py-4">
      {/* Header với nút quay lại */}
      <Row className="mb-4">
        <Col>
          <Button variant="outline-secondary" onClick={handleBack} className="mb-3">
            ← Quay lại
          </Button>
          <h2 className="fw-bold">Chi tiết xe</h2>
        </Col>
      </Row>

      <Row>
        {/* Cột trái: Hình ảnh xe */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Img
              variant="top"
              src={vehicleDetail.imageUrls[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={vehicleDetail.vehicleName}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Card>
        </Col>

        {/* Cột phải: Thông tin xe */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h4 className="fw-bold mb-4">{vehicleDetail.vehicleName}</h4>
              
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Biển số xe:</strong>
                  <span>{vehicleDetail.plateNumber}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Trạng thái:</strong>
                  {getStatusBadge(vehicleDetail.status)}
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Model:</strong>
                  <span>{vehicleDetail.modelName}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Trạm:</strong>
                  <span>{vehicleDetail.stationName}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Giá thuê/giờ:</strong>
                  <span className="text-success fw-bold">
                    {vehicleDetail.pricePerHour.toLocaleString('vi-VN')} VNĐ
                  </span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Giá thuê/ngày:</strong>
                  <span className="text-success fw-bold">
                    {vehicleDetail.pricePerDay.toLocaleString('vi-VN')} VNĐ
                  </span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Pin:</strong>
                  <span>
                    <Badge bg={vehicleDetail.batteryLevel > 50 ? 'success' : vehicleDetail.batteryLevel > 20 ? 'warning' : 'danger'}>
                      {vehicleDetail.batteryLevel}%
                    </Badge>
                  </span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <strong>Số km đã đi:</strong>
                  <span>{vehicleDetail.mileage.toLocaleString('vi-VN')} km</span>
                </ListGroup.Item>
              </ListGroup>
              
              {vehicleDetail.description && (
                <div className="mt-4">
                  <h6 className="fw-bold">Mô tả:</h6>
                  <p className="text-muted">{vehicleDetail.description}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChooseCar;
