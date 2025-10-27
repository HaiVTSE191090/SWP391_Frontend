// Xóa logic render BookingDetail qua callback, khôi phục SPA truyền thống
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import ListRenter from './ListRenter';
import ChooseCar from './ChooseCar';
import { useNavigate } from 'react-router-dom';
import { getCarDetails, getStaffStation } from './services/authServices';


interface StationVehicle {
  vehicleId: number;
  plateNumber: string;
  batteryLevel: number;
  mileage: number;
  modelName: string;
  name: string;
  price: string;
  status: 'AVAILABLE' | 'IN-USE' | 'MAINTENANCE';
}

// Interface cho dữ liệu đã hợp nhất (sẽ lưu trong state 'mockCars')
interface MergedVehicle extends StationVehicle {
    // Thêm các trường lấy từ API detail
    image: string;
    pricePerDay: number; // Giá thuê/ngày (từ detail API)
    // Cập nhật trường status để bao gồm IN-USE (nếu logic của bạn cần)
    status: 'MAINTENANCE' | 'AVAILABLE' | 'IN-USE'; 
}



export default function Staff() {
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả xe');
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<MergedVehicle | null>(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [mockCars, setMockCars] = useState<MergedVehicle[]>([]);

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchStationData();
  }, []);



  // Thay thế fetchCar và fetchCarImage bằng hàm này
  const fetchStationData = async () => {
    setLoading(true);
    setError('');

    try {
      // Lấy danh sách xe tại trạm
      const stationResp = await getStaffStation();
      const stationVehicles: StationVehicle[] = stationResp?.data?.data || [];

      // Kiểm tra nếu không có xe nào
      if (stationVehicles.length === 0) {
        setMockCars([]);
        setLoading(false);
        return;
      }

      // Lặp qua danh sách để lấy ảnh chi tiết
      // Sử dụng Promise.all để gọi tất cả API chi tiết đồng thời
      const detailedVehicles = await Promise.all(
        stationVehicles.map(async (vehicle) => {
          // Gọi API chi tiết
          const detailResp = await getCarDetails(vehicle.vehicleId);
          const detailData = detailResp?.data?.data;

          // Hợp nhất dữ liệu: lấy URL ảnh đầu tiên
          return {
            ...vehicle, // Dữ liệu từ /my-station
            image: detailData?.imageUrls?.[0] || 'default-car-image-url',
            pricePerDay: detailData?.pricePerDay // Thêm giá thuê/ngày
            // Bạn có thể thêm các trường khác từ detailData vào đây
          };
        })
      );

      // Cập nhật state với danh sách xe đã có ảnh và chi tiết
      setMockCars(detailedVehicles);

    } catch (err) {
      // Xử lý lỗi tập trung tại đây
      console.error("Lỗi tải dữ liệu trạm:", err);
      setError("Không thể tải dữ liệu xe. Vui lòng thử lại.");
      // (Thêm logic logout nếu lỗi là 401 Unauthorized)
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    'Tất cả xe',
    'Xe có sẵn',
    'Xe đang cho thuê',
    'Xe bảo trì',
    'Danh sách người thuê',
    'Quản lý đặt xe',
    'Báo cáo',
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="badge bg-success">Có sẵn</span>;
      case 'rented':
        return <span className="badge bg-warning">Đang thuê</span>;
      case 'maintenance':
        return <span className="badge bg-danger">Bảo trì</span>;
      default:
        return <span className="badge bg-secondary">Không xác định</span>;
    }
  };

  const filteredCars = () => {
    switch (selectedCategory) {
      case 'Xe có sẵn':
        return mockCars.filter(car => car.status === 'AVAILABLE');
      case 'Xe đang cho thuê':
        return mockCars.filter(car => car.status === 'IN-USE');
      case 'Xe bảo trì':
        return mockCars.filter(car => car.status === 'MAINTENANCE');
      default:
        return mockCars;
    }
  };

  const handleMenuClick = (item: string) => {
    if (item === 'Danh sách người thuê') {
      navigate('/staff/renters');
    } else {
      setSelectedVehicleId(null);
      setSelectedVehicle(null);
      setSelectedCategory(item);
    }
    handleClose();
  };

  // Xử lý khi click vào xe
  const handleCarClick = (car: MergedVehicle) => {
    if (car.status === 'IN-USE') {
      setSelectedVehicleId(car.vehicleId);
      setSelectedVehicle(car);
    }
  }

  // Callback for SPA navigation to BookingDetail
  const handleShowBookingDetail = () => {
    setShowBookingDetail(true);
  };



  // Nếu đang xem chi tiết booking
  if (showBookingDetail) {
    const BookingDetail = require('./BookingDetail').default;
    return <BookingDetail />;
  }

  // Nếu đang xem chi tiết xe
  if (selectedVehicleId !== null && selectedVehicle !== null) {
    return (
      <ChooseCar
        vehicleId={selectedVehicleId}
        onBack={() => {
          setSelectedVehicleId(null);
          setSelectedVehicle(null);
        }}
        vehicleName={selectedVehicle.name}
        vehiclePrice={selectedVehicle.price}
        vehicleStatus={selectedVehicle.status}
        onShowBookingDetail={handleShowBookingDetail}
      />
    );
  }


  return (
    <div className="staff-interface">
      {/* Navigation Bar với Hamburger Menu */}
      <Navbar bg="dark" variant="dark" className="px-3">
        <Button variant="outline-light" onClick={handleShow} className="me-3">
          ☰
        </Button>
        <Navbar.Brand>Staff Dashboard</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link>Đăng xuất</Nav.Link>
        </Nav>
      </Navbar>

      {/* Hamburger Menu - Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu Quản lý</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {menuItems.map((item, index) => (
              <Nav.Link
                key={index}
                className={`py-3 border-bottom ${selectedCategory === item ? 'bg-light fw-bold' : ''}`}
                onClick={() => handleMenuClick(item)}
                style={{ cursor: 'pointer' }}
              >
                {item}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <Container fluid className="mt-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{selectedCategory}</h2>
              <Button variant="primary">Thêm xe mới</Button>
            </div>

            {/* Car Grid */}
            <Row>
              {filteredCars().map((car) => (
                <Col lg={4} md={6} sm={12} className="mb-4" key={car.vehicleId}>
                  <Card
                    className="h-100 shadow-sm"
                    style={{ cursor: car.status === 'IN-USE' ? 'pointer' : 'default' }}
                    onClick={() => handleCarClick(car)}
                  >
                    <Card.Img
                      variant="top"
                      src={car.image}
                      style={{ height: '200px', objectFit: 'cover' }}
                      alt={car.name}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{car.name}</Card.Title>
                      <Card.Text className="text-muted">{car.price}</Card.Text>
                      <div className="mb-3">
                        {getStatusBadge(car.status)}
                      </div>
                      <div className="mt-auto">
                        <Row>
                          <Col>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="w-100 mb-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Xem chi tiết xe
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              variant={car.status === 'AVAILABLE' ? 'success' : 'secondary'}
                              size="sm"
                              className="w-100"
                              disabled={car.status !== 'AVAILABLE'}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {car.status === 'AVAILABLE' ? 'Cho thuê' :
                                car.status === 'IN-USE' ? 'Đang thuê' : 'Bảo trì'}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {filteredCars().length === 0 && (
              <div className="text-center py-5">
                <h4 className="text-muted">Không có xe nào trong danh mục này</h4>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
