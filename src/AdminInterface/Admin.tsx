import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Giả định dùng React Router

// --- Component Sidebar ---
const AdminSidebar: React.FC = () => {
  // Styling để mô phỏng giao diện tối (Dark Mode)
  const sidebarStyle: React.CSSProperties = {
    backgroundColor: '#000000', // Nền đen
    color: '#ffffff', // Chữ trắng
    minHeight: '100vh', // Chiếm toàn bộ chiều cao màn hình
    paddingTop: '20px',
  };

  const linkStyle: React.CSSProperties = {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '10px 0',
    display: 'block',
    borderLeft: '3px solid transparent',
    paddingLeft: '15px',
    cursor: 'pointer',
  };

  const activeLinkStyle = {
    ...linkStyle,
    borderLeft: '3px solid #007bff', // Màu xanh lam cho link đang active (mô phỏng)
  };

  return (
    <div style={sidebarStyle}>
      <div className="d-flex flex-column">
        {/* List Điểm Thuê */}
        <Link to="/admin/locations" style={linkStyle}>
          List Điểm Thuê
        </Link>
        
        {/* List Khách Hàng (hoặc Người Thuê) */}
        {/* Giả định link này tương ứng với component ListRenter bạn đã cung cấp trước đó */}
        <Link to="/admin/customers" style={activeLinkStyle as React.CSSProperties}> 
          List Khách Hàng
        </Link>
        
        {/* LIST REPORTED BOOKING */}
        <Link to="/admin/reported-bookings" style={linkStyle}>
          LIST REPORTED BOOKING
        </Link>
        
        {/* Hợp đồng chờ ký duyệt */}
        <Link to="/admin/pending-contracts" style={linkStyle}>
          Hợp đồng chờ ký duyệt
        </Link>
      </div>
    </div>
  );
};

// --- Component Biểu đồ (Mô phỏng) ---
const BarChartMock: React.FC = () => {
  // Styling mô phỏng nền và khung biểu đồ màu tối
  const chartContainerStyle: React.CSSProperties = {
    backgroundColor: '#1c1c1c', // Nền hơi xám đậm
    border: '1px solid #444444',
    borderRadius: '15px',
    padding: '30px',
    height: '400px', // Chiều cao cố định cho mô phỏng
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  };

  // Tạo các cột biểu đồ mô phỏng
  const bars = [80, 120, 150, 90, 30, 100, 70, 95];

  const barStyle = (height: number): React.CSSProperties => ({
    backgroundColor: 'transparent',
    border: '1px solid #ffffff', // Viền màu trắng
    width: '10%',
    height: `${height}px`,
    borderRadius: '2px 2px 0 0',
  });

  return (
    <Card style={{ backgroundColor: '#000000', border: 'none' }}>
      <div style={chartContainerStyle}>
        {bars.map((h, index) => (
          <div key={index} style={barStyle(h)} />
        ))}
        {/* Thêm trục X và Y mô phỏng nếu cần */}
      </div>
    </Card>
  );
};

// --- Component Chính Admin Dashboard ---
const AdminDashboard: React.FC = () => {
  // Áp dụng styling cho toàn bộ trang
  const pageStyle: React.CSSProperties = {
    backgroundColor: '#121212', // Nền đen/xám đậm cho toàn bộ trang
    minHeight: '100vh',
    color: '#ffffff',
  };
  
  return (
    <div style={pageStyle}>
      <Container fluid>
        <Row>
          {/* Cột Sidebar bên trái (3/12) */}
          <Col xs={3} className="p-0">
            <AdminSidebar />
          </Col>

          {/* Cột Nội dung chính bên phải (9/12) */}
          <Col xs={9} className="p-4">
            <h1>Admin Dashboard</h1>
            <p className="text-muted">Tổng quan và thống kê hệ thống</p>
            
            <Row className="mt-4">
              <Col md={12}>
                <h3 className="mb-3">Thống kê hoạt động</h3>
                <BarChartMock />
              </Col>
            </Row>

            {/* Thêm các phần tử dashboard khác tại đây */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;