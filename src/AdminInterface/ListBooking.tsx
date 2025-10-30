import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate

// Sidebar giống AdminSidebar
const AdminSidebar: React.FC = () => {
    const sidebarStyle: React.CSSProperties = {
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        paddingTop: '20px',
    };
    const linkStyle: React.CSSProperties = {
        color: '#fff',
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
        borderLeft: '3px solid #007bff',
    };
    return (
        <div style={sidebarStyle}>
            <div className="d-flex flex-column">
                <Link to="/admin/locations" style={linkStyle}>List Điểm Thuê</Link>
                <Link to="/admin/customers" style={linkStyle}>List Khách Hàng</Link>
                <Link to="/admin/contract" style={linkStyle}>List Contract</Link>
                <Link to="/admin/booking" style={activeLinkStyle as React.CSSProperties}>Hợp đồng chờ ký duyệt</Link>
            </div>
        </div>
    );
};

// Interface cho hợp đồng chờ ký duyệt
interface PendingContract {
    id: number;
    renterName: string;
    createdAt: string;
    details: string;
}

// Component chính
const ListBooking: React.FC = () => {
    const [contracts, setContracts] = useState<PendingContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Khởi tạo useNavigate

    // Giả lập fetch API hợp đồng chờ ký duyệt
    useEffect(() => {
        setLoading(true);
        setError('');
        // TODO: Thay bằng API thực tế để lấy danh sách các Booking có status = PENDING
        setTimeout(() => {
            // Thêm nhiều mock data hơn để kiểm tra giao diện
            setContracts([
                { id: 1, renterName: 'Nguyễn Văn A', createdAt: '2025-10-28 10:30', details: 'Thuê xe VinFast VF7' },
                { id: 2, renterName: 'Trần Thị B', createdAt: '2025-10-29 15:00', details: 'Thuê xe Toyota Vios' },
                { id: 3, renterName: 'Lê Văn C', createdAt: '2025-10-29 17:45', details: 'Thuê xe Honda Civic' },
                { id: 4, renterName: 'Phạm Thị D', createdAt: '2025-10-30 08:00', details: 'Thuê xe Mazda 3' },
                { id: 5, renterName: 'Hoàng Văn E', createdAt: '2025-10-30 11:20', details: 'Thuê xe Kia Seltos' },
                { id: 6, renterName: 'Ngô Thị F', createdAt: '2025-10-30 14:05', details: 'Thuê xe Mercedes C300' },
                { id: 7, renterName: 'Đặng Văn G', createdAt: '2025-10-30 16:50', details: 'Thuê xe Ford Ranger' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Handler cho nút "Xem chi tiết"
    const handleViewDetails = (id: number) => {
        // Chuyển hướng sang trang chi tiết Booking
        navigate(`/admin/booking/${id}`);
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Container fluid>
                <Row>
                    {/* Sidebar */}
                    <Col xs={2} className="p-0">
                        <AdminSidebar />
                    </Col>
                    {/* Main content */}
                    <Col xs={10} className="p-4">
                        <h2 className="mb-4">Hợp đồng chờ ký duyệt (List Booking)</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <Table bordered hover responsive>
                                <thead style={{ background: '#e9ecef' }}>
                                    <tr>
                                        <th>STT</th>
                                        <th>Name Renter</th>
                                        <th>Ngày Tạo Hợp Đồng</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contracts.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center">Không có hợp đồng chờ ký duyệt</td></tr>
                                    ) : contracts.map((c, idx) => (
                                        <tr key={c.id}>
                                            <td>{idx + 1}</td>
                                            <td>{c.renterName}</td>
                                            <td>{c.createdAt}</td>
                                            <td>
                                                <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(c.id)}>
                                                    Xem chi tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ListBooking;