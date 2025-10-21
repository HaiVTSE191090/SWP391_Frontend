import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Offcanvas, Button, Spinner, Alert } from 'react-bootstrap';
import ListRenter from './ListRenter';
import ChooseCar from './ChooseCar';
import { useVehicle } from '../../hooks/useVehicle';
import { Vehicle } from '../../models/VehicleModel';

// Hàm lấy ảnh xe theo vehicleId (giống VehicleCard.tsx)
const getVehicleImage = (vehicleId: number) => {
  try {
    const imageNumber = ((vehicleId - 1) % 9) + 1;
    return require(`../../images/car-list/Car-${imageNumber}.png`);
  } catch (error) {
    console.warn(`Image not found for vehicleId ${vehicleId}, using default`);
    return require(`../../images/car-list/Car.png`);
  }
};

export default function Staff() {
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả xe');
  const [showListRenter, setShowListRenter] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  
  // Sử dụng VehicleContext thông qua useVehicle hook
  const { 
    vehicles, 
    loading, 
    error, 
    loadVehiclesByStation,
    formatBattery,
    formatMileage
  } = useVehicle();
  
  const [stationId] = useState<number>(1); // Mặc định station 1

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetch vehicles từ Context/Controller
  useEffect(() => {
    loadVehiclesByStation(stationId);
  }, [stationId, loadVehiclesByStation]);

  const menuItems = [
    'Tất cả xe',
    'Xe có sẵn',
    'Xe đang cho thuê',
    'Xe bảo trì',
    'Danh sách người thuê',
    'Quản lý đặt xe',
    'Báo cáo',
  ];

  const getStatusBadge = (status: Vehicle['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="badge bg-success">Có sẵn</span>;
      case 'IN_USE':
        return <span className="badge bg-warning">Đang thuê</span>;
      case 'MAINTENANCE':
        return <span className="badge bg-danger">Bảo trì</span>;
      default:
        return <span className="badge bg-secondary">Không xác định</span>;
    }
  };

  const filteredCars = () => {
    switch (selectedCategory) {
      case 'Xe có sẵn':
        return vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE');
      case 'Xe đang cho thuê':
        return vehicles.filter((vehicle) => vehicle.status === 'IN_USE');
      case 'Xe bảo trì':
        return vehicles.filter((vehicle) => vehicle.status === 'MAINTENANCE');
      default:
        return vehicles;
    }
  };

  const handleMenuClick = (item: string) => {
    if (item === 'Danh sách người thuê') {
      setShowListRenter(true);
      setSelectedVehicleId(null);
      setSelectedVehicle(null);
    } else {
      setShowListRenter(false);
      setSelectedVehicleId(null);
      setSelectedVehicle(null);
      setSelectedCategory(item);
    }
    handleClose();
  };

  // Xử lý khi click vào xe
  const handleCarClick = (vehicle: Vehicle) => {
    if (vehicle.status === 'IN_USE') {
      setSelectedVehicleId(vehicle.vehicleId);
      setSelectedVehicle(vehicle);
    }
  };

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
        vehicleImage={getVehicleImage(selectedVehicle.vehicleId)}
        vehicleName={selectedVehicle.modelName || 'Xe không rõ tên'}
        vehiclePrice={`Biển số: ${selectedVehicle.plateNumber}`}
        vehicleStatus={selectedVehicle.status}
        onShowBookingDetail={handleShowBookingDetail}
      />
    );
  }

  // Nếu đang xem Danh sách người thuê
  if (showListRenter) {
    return (
      <div className="staff-interface">
        <Navbar bg="black" variant="dark" className="px-4">
          <Button variant="outline-light" onClick={handleShow} className="me-3">
            ☰
          </Button>
          <Navbar.Brand>Staff Dashboard - Danh sách người thuê</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link>Đăng xuất</Nav.Link>
          </Nav>
        </Navbar>

        <Offcanvas show={show} onHide={handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu Quản lý</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {menuItems.map((item, index) => (
                <Nav.Link
                  key={index}
                  className={`py-3 border-bottom ${item === 'Danh sách người thuê' ? 'bg-light fw-bold' : ''}`}
                  onClick={() => handleMenuClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item}
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        <ListRenter />
      </div>
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

            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải danh sách xe...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <Alert variant="danger">
                <Alert.Heading>Lỗi tải dữ liệu</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </Alert>
            )}

            {/* Car Grid */}
            {!loading && !error && (
              <>
                <Row>
                  {filteredCars().map((vehicle) => (
                    <Col lg={4} md={6} sm={12} className="mb-4" key={vehicle.vehicleId}>
                      <Card 
                        className="h-100 shadow-sm"
                        style={{ cursor: vehicle.status === 'IN_USE' ? 'pointer' : 'default' }}
                        onClick={() => handleCarClick(vehicle)}
                      >
                        <Card.Img
                          variant="top"
                          src={getVehicleImage(vehicle.vehicleId)}
                          style={{ height: '200px', objectFit: 'cover' }}
                          alt={vehicle.modelName || 'Vehicle'}
                        />
                        <Card.Body className="d-flex flex-column">
                          <Card.Title>{vehicle.modelName || 'Xe không rõ tên'}</Card.Title>
                          <Card.Text className="text-muted">
                            <small>🚗 Biển số: {vehicle.plateNumber}</small><br />
                            <small>🔋 Pin: {formatBattery(vehicle.batteryLevel)}</small><br />
                            <small>📏 Km đã đi: {formatMileage(vehicle.mileage)}</small>
                          </Card.Text>
                          <div className="mb-3">
                            {getStatusBadge(vehicle.status)}
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
                                  variant={vehicle.status === 'AVAILABLE' ? 'success' : 'secondary'} 
                                  size="sm" 
                                  className="w-100"
                                  disabled={vehicle.status !== 'AVAILABLE'}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {vehicle.status === 'AVAILABLE' ? 'Cho thuê' : 
                                   vehicle.status === 'IN_USE' ? 'Đang thuê' : 'Bảo trì'}
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
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
