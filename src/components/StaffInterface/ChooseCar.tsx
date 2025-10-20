import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Image } from 'react-bootstrap';
import axios from 'axios';

// Thông tin chi tiết xe
interface VehicleDetail {
  id: string | number;
  name: string;
  image: string;
  licensePlate: string; // Biển số xe
  status: string;       // Trạng thái (Available, Rented, Maintenance...)
  stationId: string;    // ID trạm
}

// Thông tin booking
interface BookingInfo {
  renterName: string;   // Tên người thuê
  staffName: string;    // Tên nhân viên
  vehicleName: string;  // Tên xe
  bookingDate: string;  // Ngày đặt
}

interface ChooseCarProps {
  vehicleId: string | number;
  onBack?: () => void;
  vehicleImage?: string;  // Hình ảnh xe từ Staff
  vehicleName?: string;   // Tên xe từ Staff
  vehiclePrice?: string;  // Giá xe từ Staff
  vehicleStatus?: string; // Trạng thái xe từ Staff
  onShowBookingDetail?: () => void; // Callback chuyển sang BookingDetail
}

const ChooseCar: React.FC<ChooseCarProps> = ({ 
  vehicleId, 
  onBack, 
  vehicleImage, 
  vehicleName,
  vehiclePrice,
  vehicleStatus,
  onShowBookingDetail
}) => {
  // const navigate = useNavigate();
  // const params = useParams();
  const [vehicleDetail, setVehicleDetail] = useState<VehicleDetail | null>(null);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tự động load data khi vào trang
  useEffect(() => {
    fetchVehicleDetail();
    fetchBookingInfo();
    // eslint-disable-next-line
  }, [vehicleId]);

  // Hàm tải chi tiết xe từ API
  const fetchVehicleDetail = async () => {
    try {
      setLoading(true);
      setError('');
      
      // TODO: Thay bằng API thật khi có backend
      // const res = await axios.get(`/api/vehicles/${vehicleId}`);
      // setVehicleDetail(res.data);
      
      // Sử dụng thông tin xe từ Staff (không cần mock delay)
      setVehicleDetail({
        id: vehicleId,
        name: vehicleName || 'Unknown Vehicle',
        image: vehicleImage || 'https://via.placeholder.com/400x300?text=No+Image',
        licensePlate: '51A-12345', // TODO: Lấy từ API
        status: vehicleStatus || 'Unknown', // Lấy từ Staff
        stationId: 'ST001'         // TODO: Lấy từ API
      });
      setLoading(false);
    } catch (err: any) {
      setError('Không thể tải thông tin xe!');
      setLoading(false);
    }
  };

  // Hàm tải thông tin booking từ API
  const fetchBookingInfo = async () => {
    try {
      // TODO: Thay bằng API thật
      // const res = await axios.get(`/api/bookings/vehicle/${vehicleId}`);
      // setBookingInfo(res.data);
      
      // Mock data booking
      setBookingInfo({
        renterName: 'Nguyễn Văn A',      // TODO: Lấy từ API
        staffName: 'Trần Thị B',         // TODO: Lấy từ API
        vehicleName: vehicleName || 'Unknown Vehicle',
        bookingDate: '2025-10-15 14:30:00' // TODO: Lấy từ API
      });
    } catch (err: any) {
      console.error('Không thể tải thông tin booking:', err);
    }
  };

  // Xử lý khi click vào nút booking
  // Xử lý khi click vào nút booking
  const handleClickBooking = () => {
    // Gọi callback từ Staff để chuyển sang BookingDetail
    if (onShowBookingDetail) {
      onShowBookingDetail();
    }
  };
  // ...existing code...

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
        {onBack && <Button onClick={onBack}>Quay lại</Button>}
      </Container>
    );
  }

  // Hiển thị giao diện
  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-center fw-bold">Chi tiết xe đang cho thuê</h2>
        </Col>
      </Row>

      <Row>
        {/* Sidebar: List Renter */}
        <Col md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">List Renter</h5>
              <div className="d-flex flex-column gap-2">
                <Button variant="outline-primary" size="sm">
                  Vehicles available
                </Button>
                <Button variant="outline-primary" size="sm">
                  Vehicles Renting
                </Button>
                <Button variant="outline-primary" size="sm">
                  Vehicle Reserved
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Choose car section */}
          <Card className="shadow-sm mt-3">
            <Card.Body className="text-center">
              <h6 className="fw-bold mb-3">Choose car</h6>
              <Button 
                variant="primary" 
                onClick={handleClickBooking}
                className="w-100"
              >
                Xem chi tiết booking
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                {/* Hình ảnh xe */}
                <Col md={5} className="mb-3">
                  <div 
                    className="border rounded p-3 text-center" 
                    style={{ backgroundColor: '#e9ecef', minHeight: '250px' }}
                  >
                    <Image 
                      src={vehicleDetail?.image} 
                      alt={vehicleDetail?.name}
                      fluid
                      rounded
                      style={{ maxHeight: '220px', objectFit: 'contain' }}
                    />
                  </div>
                </Col>

                {/* Chi tiết xe */}
                <Col md={7} className="mb-3">
                  <div 
                    className="border rounded p-3" 
                    style={{ backgroundColor: '#e9ecef', minHeight: '250px' }}
                  >
                    <h5 className="fw-bold mb-3">Thông tin chi tiết xe</h5>
                    <div className="mb-2">
                      <strong>Tên xe:</strong> {vehicleDetail?.name}
                    </div>
                    <div className="mb-2">
                      <strong>Giá thuê:</strong> {vehiclePrice || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Biển số xe:</strong> {vehicleDetail?.licensePlate}
                    </div>
                    <div className="mb-2">
                      <strong>Trạng thái:</strong>{' '}
                      <span className={`badge ${
                        vehicleDetail?.status === 'rented' ? 'bg-warning' : 
                        vehicleDetail?.status === 'available' ? 'bg-success' : 
                        vehicleDetail?.status === 'maintenance' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {vehicleDetail?.status === 'rented' ? 'Đang thuê' :
                         vehicleDetail?.status === 'available' ? 'Có sẵn' :
                         vehicleDetail?.status === 'maintenance' ? 'Bảo trì' : vehicleDetail?.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Station ID:</strong> {vehicleDetail?.stationId}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Thông tin booking */}
              <Row className="mt-3">
                <Col>
                  <div 
                    className="border rounded p-3" 
                    style={{ backgroundColor: '#e9ecef', minHeight: '150px' }}
                  >
                    <h5 className="fw-bold mb-3">Thông tin booking</h5>
                    {bookingInfo ? (
                      <Row>
                        <Col md={6} className="mb-2">
                          <strong>Renter Name:</strong> {bookingInfo.renterName}
                        </Col>
                        <Col md={6} className="mb-2">
                          <strong>Staff Name:</strong> {bookingInfo.staffName}
                        </Col>
                        <Col md={6} className="mb-2">
                          <strong>Vehicle Name:</strong> {bookingInfo.vehicleName}
                        </Col>
                        <Col md={6} className="mb-2">
                          <strong>Booking Date:</strong> {bookingInfo.bookingDate}
                        </Col>
                      </Row>
                    ) : (
                      <p className="text-muted">Không có thông tin booking</p>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>

            {/* Footer */}
            <Card.Footer className="text-center">
              {onBack && (
                <Button variant="secondary" onClick={onBack}>
                  Quay lại danh sách xe
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChooseCar;
