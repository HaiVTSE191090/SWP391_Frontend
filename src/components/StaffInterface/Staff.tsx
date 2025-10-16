import React, { useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';

interface Car {
  id: number;
  name: string;
  image: string;
  price: string;
  status: 'available' | 'rented' | 'maintenance';
}

// Mock data - thay thế bằng dữ liệu từ car list của bạn
const mockCars: Car[] = [
  { id: 1, name: 'Honda City', image: '/api/placeholder/300/200', price: '500,000 VND/ngày', status: 'available' },
  { id: 2, name: 'Toyota Vios', image: '/api/placeholder/300/200', price: '550,000 VND/ngày', status: 'rented' },
  { id: 3, name: 'Hyundai Accent', image: '/api/placeholder/300/200', price: '520,000 VND/ngày', status: 'available' },
  { id: 4, name: 'Mazda 3', image: '/api/placeholder/300/200', price: '600,000 VND/ngày', status: 'maintenance' },
  { id: 5, name: 'Kia Cerato', image: '/api/placeholder/300/200', price: '580,000 VND/ngày', status: 'available' },
  { id: 6, name: 'Nissan Sunny', image: '/api/placeholder/300/200', price: '530,000 VND/ngày', status: 'available' },
];

export default function Staff() {
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả xe');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const menuItems = [
    'Tất cả xe',
    'Xe có sẵn',
    'Xe đang cho thuê',
    'Xe bảo trì',
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
                onClick={() => {
                  setSelectedCategory(item);
                  handleClose();
                }}
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
                  <Card className="h-100 shadow-sm">
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
                            <Button variant="outline-primary" size="sm" className="w-100 mb-2">
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
