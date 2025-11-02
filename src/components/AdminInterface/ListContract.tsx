import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./ListContract.css"
import { Contract, ContractStatus } from './types/api.type';
import * as authServicesForAdmin from './services/authServicesForAdmin';



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

    const fetchContracts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await authServicesForAdmin.getAllContracts();
            if (!data.success) {
                setError(data.err);
                setContracts([]);
                return;
            }
            setContracts(data.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách hợp đồng');
            console.error('Error fetching contracts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
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
                                <tr key={c.bookingId} onClick={() => handleViewDetails(c.bookingId)} className="clickable-row">
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