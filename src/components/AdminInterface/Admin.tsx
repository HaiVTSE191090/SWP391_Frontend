import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom'; 

const AdminSidebar: React.FC = () => {
    // Styling để mô phỏng giao diện tối (Dark Mode)
    const sidebarStyle: React.CSSProperties = {
        backgroundColor: '#000000', // Nền đen
        color: '#ffffff', // Chữ trắng
        minHeight: '100vh', // Chiếm toàn bộ chiều cao màn hình
        paddingTop: '20px',
        position: 'sticky', // Giữ sidebar cố định
        top: 0,
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
    
    // Lưu ý: Bạn nên dùng hook useLocation để xác định link active thực tế
    const activeLinkStyle = {
        ...linkStyle,
        borderLeft: '3px solid #007bff', 
    };

    return (
        <div style={sidebarStyle}>
            <div className="d-flex flex-column">
                <Link to="/admin" style={linkStyle}>
                    Dashboard
                </Link>
                <Link to="/admin/locations" style={linkStyle}>
                    List Điểm Thuê
                </Link>
                <Link to="/admin/customers" style={linkStyle}>
                    List Khách Hàng
                </Link>
                <Link to="/admin/contract" style={linkStyle}>
                    List Contract
                </Link>
                <Link 
                    to="/admin/booking" 
                    // Giả định đây là link active dựa trên yêu cầu trước đó
                    style={activeLinkStyle as React.CSSProperties}
                > 
                    List Booking (HĐ chờ duyệt)
                </Link>
            </div>
        </div>
    );
};

// --- Component Layout Chính AdminLayout ---
const AdminLayout: React.FC = () => {
    // Áp dụng styling cho toàn bộ trang
    const pageStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa', 
    };
    
    return (
        <div style={pageStyle}>
            <Container fluid className="p-0">
                <Row className="g-0">

                    <Col xs={2} className="p-0">
                        <AdminSidebar />
                    </Col>
                    <Col xs={10} className="p-4 bg-light" style={{ backgroundColor: '#f8f9fa' }}>
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminLayout; 

