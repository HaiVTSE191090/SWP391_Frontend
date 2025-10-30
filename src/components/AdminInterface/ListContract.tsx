import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// Định nghĩa trạng thái Contract từ cấu trúc bảng
type ContractStatus = 'ADMIN_SIGNED' | 'CANCELLED' | 'FULLY_SIGNED' | 'PENDING_ADMIN_SIGNATURE';

// Interface cho Contract
interface Contract {
    id: number; // contract_id
    renterName: string; // Tên Người thuê (Giả định JOIN)
    bookingId: number; // booking_id
    status: ContractStatus;
    createdAt: string;
}

// Sidebar (giống AdminSidebar để giữ giao diện thống nhất)
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
                <Link to="/admin" style={linkStyle}>Dashboard</Link>
                <Link to="/admin/locations" style={linkStyle}>List Điểm Thuê</Link>
                <Link to="/admin/customers" style={linkStyle}>List Khách Hàng</Link>
                <Link to="/admin/contract" style={activeLinkStyle as React.CSSProperties}>List Contract</Link>
                <Link to="/admin/booking" style={linkStyle}>Hợp đồng chờ ký duyệt</Link>
            </div>
        </div>
    );
};

// Hàm hiển thị Badge trạng thái
const getStatusBadge = (status: ContractStatus) => {
    let variant: string;
    switch (status) {
        case 'PENDING_ADMIN_SIGNATURE':
            variant = 'warning';
            break;
        case 'FULLY_SIGNED':
            variant = 'success';
            break;
        case 'CANCELLED':
            variant = 'danger';
            break;
        case 'ADMIN_SIGNED':
            variant = 'primary';
            break;
        default:
            variant = 'secondary';
    }
    return <span className={`badge bg-${variant}`}>{status}</span>;
};

// Component chính ListContract
const ListContract: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Giả lập fetch API danh sách Contract
    useEffect(() => {
        setLoading(true);
        setError('');
        // TODO: Thay bằng API thực tế: GET /api/admin/contracts
        setTimeout(() => {
            setContracts([
                { id: 101, renterName: 'Nguyễn Văn A', bookingId: 1, createdAt: '2025-10-28 11:00', status: 'PENDING_ADMIN_SIGNATURE' },
                { id: 102, renterName: 'Trần Thị B', bookingId: 2, createdAt: '2025-10-29 16:30', status: 'FULLY_SIGNED' },
                { id: 103, renterName: 'Lê Văn C', bookingId: 3, createdAt: '2025-10-30 09:00', status: 'ADMIN_SIGNED' },
                { id: 104, renterName: 'Phạm Thị D', bookingId: 4, createdAt: '2025-10-30 10:00', status: 'PENDING_ADMIN_SIGNATURE' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Handler cho nút "Xem chi tiết"
    const handleViewDetails = (id: number) => {
        // Chuyển hướng sang trang chi tiết Contract
        navigate(`/admin/contract/${id}`);
    };

    return (
        <Container className="p-4">
            <h2 className="mb-4">Danh sách Hợp đồng</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table bordered hover responsive>
                    <thead style={{ background: '#e9ecef' }}>
                        <tr>
                            <th>ID HĐ</th>
                            <th>Mã Booking</th>
                            <th>Name Renter</th>
                            <th>Ngày Tạo</th>
                            <th>Trạng thái</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center">Không có hợp đồng nào</td></tr>
                        ) : contracts.map((c, idx) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.bookingId}</td>
                                <td>{c.renterName}</td>
                                <td>{c.createdAt}</td>
                                <td>{getStatusBadge(c.status)}</td>
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
        </Container>
    );
};

export default ListContract;