import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Card } from 'react-bootstrap';
import {  useNavigate } from 'react-router-dom';
import "./ListContract.css"

type ContractStatus = 'ADMIN_SIGNED' | 'CANCELLED' | 'FULLY_SIGNED' | 'PENDING_ADMIN_SIGNATURE';

interface Contract {
    id: number;
    renterName: string;
    bookingId: number;
    status: ContractStatus;
    createdAt: string;
}

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

const ListContract: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError('');
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

    const handleViewDetails = (id: number) => {
        navigate(`${id}`);
    };


    return (
        <Card className="shadow-sm border-0 list-contract-card">
            <Card.Header className="bg-white pb-0 border-0">
                <Card.Title as="h2">Danh sách Hợp đồng</Card.Title>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                        <Spinner animation="border" variant="primary" />
                        <span className="ms-3">Đang tải dữ liệu...</span>
                    </div>
                ) : contracts.length === 0 ? (
                    <div className="text-center p-5">

                        <h5 className="mt-3">Không có hợp đồng nào</h5>
                        <p className="text-muted">Chưa có hợp đồng nào được tạo trong hệ thống.</p>
                    </div>
                ) : (
                    <Table responsive hover className="contract-table align-middle">
                        <thead>
                            <tr>
                                <th>ID HĐ</th>
                                <th>Mã Booking</th>
                                <th>Tên Người thuê</th>
                                <th>Ngày Tạo</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map((c) => (
                                <tr key={c.id} onClick={() => handleViewDetails(c.id)} className="clickable-row">
                                    <td><strong>#{c.id}</strong></td>
                                    <td>#{c.bookingId}</td>
                                    <td>{c.renterName}</td>
                                    <td>{c.createdAt}</td>
                                    <td>{getStatusBadge(c.status)}</td>
                                    <td className="text-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); handleViewDetails(c.id); }}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );

};

export default ListContract;