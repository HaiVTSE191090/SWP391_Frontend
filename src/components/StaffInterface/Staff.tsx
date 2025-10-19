import React, { useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import ListRenter from './ListRenter';
import ChooseCar from './ChooseCar';

// Import ảnh xe trực tiếp từ thư mục
import vf3Blue from '../../images/car-list/source/vf3-blue.jpg';
import vf3Red from '../../images/car-list/source/vf3-red.png';
import vf3 from '../../images/car-list/source/vf3.png';
import vf31 from '../../images/car-list/source/vf31.png';
import vf5Grey from '../../images/car-list/source/vf5-grey.png';
import vf5PlusRed from '../../images/car-list/source/vf5-plus-red.png';
import vf7Black from '../../images/car-list/source/vf7-black.png';
import vf8Grey from '../../images/car-list/source/vf8-grey.png';

interface Car {
  id: number;
  name: string;
  image: string;
  price: string;
  status: 'available' | 'rented' | 'maintenance';
}

// Mock data - sử dụng ảnh xe thật từ thư mục local
const mockCars: Car[] = [
  { id: 1, name: 'VinFast VF3 Blue', image: vf3Blue, price: '500,000 VND/ngày', status: 'available' },
  { id: 2, name: 'VinFast VF3 Red', image: vf3Red, price: '550,000 VND/ngày', status: 'rented' },
  { id: 3, name: 'VinFast VF3', image: vf3, price: '520,000 VND/ngày', status: 'available' },
  { id: 4, name: 'VinFast VF3.1', image: vf31, price: '600,000 VND/ngày', status: 'maintenance' },
  { id: 5, name: 'VinFast VF5 Grey', image: vf5Grey, price: '650,000 VND/ngày', status: 'available' },
  { id: 6, name: 'VinFast VF5 Plus Red', image: vf5PlusRed, price: '700,000 VND/ngày', status: 'available' },
  { id: 7, name: 'VinFast VF7 Black', image: vf7Black, price: '850,000 VND/ngày', status: 'rented' },
  { id: 8, name: 'VinFast VF8 Grey', image: vf8Grey, price: '950,000 VND/ngày', status: 'available' },
];

export default function Staff() {
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả xe');
  const [showListRenter, setShowListRenter] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Car | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        return mockCars.filter(car => car.status === 'available');
      case 'Xe đang cho thuê':
        return mockCars.filter(car => car.status === 'rented');
      case 'Xe bảo trì':
        return mockCars.filter(car => car.status === 'maintenance');
      default:
        return mockCars;
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
  const handleCarClick = (car: Car) => {
    if (car.status === 'rented') {
      setSelectedVehicleId(car.id);
      setSelectedVehicle(car);
    }
  };

  // Nếu đang xem chi tiết xe
  if (selectedVehicleId !== null && selectedVehicle !== null) {
    return (
      <ChooseCar 
        vehicleId={selectedVehicleId} 
        onBack={() => {
          setSelectedVehicleId(null);
          setSelectedVehicle(null);
        }}
        vehicleImage={selectedVehicle.image}
        vehicleName={selectedVehicle.name}
        vehiclePrice={selectedVehicle.price}
        vehicleStatus={selectedVehicle.status}
      />
    );
  }

  // Nếu đang xem Danh sách người thuê
  if (showListRenter) {
    return (
      <div className="staff-interface">
        <Navbar bg="dark" variant="dark" className="px-3">
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

            {/* Car Grid */}
            <Row>
              {filteredCars().map((car) => (
                <Col lg={4} md={6} sm={12} className="mb-4" key={car.id}>
                  <Card 
                    className="h-100 shadow-sm"
                    style={{ cursor: car.status === 'rented' ? 'pointer' : 'default' }}
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
                              variant={car.status === 'available' ? 'success' : 'secondary'} 
                              size="sm" 
                              className="w-100"
                              disabled={car.status !== 'available'}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {car.status === 'available' ? 'Cho thuê' : 
                               car.status === 'rented' ? 'Đang thuê' : 'Bảo trì'}
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
