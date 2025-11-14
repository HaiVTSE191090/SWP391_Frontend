import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BookingResponse } from './types/api.type';
import { getAllBookings } from './services/authServicesForAdmin';
import "./ListBooking.css";

// Component chính
const ListBooking: React.FC = () => {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("PENDING");

    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const result = await getAllBookings();

            if (result.success) {
                setBookings(result.data);
            } else {
                setError(result.message || "không tải được booking");
            }
        } catch (err) {
            setError('Lỗi kết nối server');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const handleViewDetails = (id: number) => {
        navigate(`${id}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'RESERVED': 'warning',
            'CONFIRMED': 'info',
            'IN_PROGRESS': 'primary',
            'COMPLETED': 'success',
            'CANCELLED': 'danger'
        };
        return statusMap[status] || 'secondary';
    };

    const getDepositStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'PENDING': 'warning',
            'PAID': 'success',
            'REFUNDED': 'info',
            'FAILED': 'danger'
        };
        return statusMap[status] || 'secondary';
    };

    // Filter bookings based on selected status
    const filteredBookings = useMemo(() => {
        if (filterStatus === "ALL") {
            return bookings;
        }
        return bookings.filter(booking => booking.status === filterStatus);
    }, [bookings, filterStatus]);

    const handleViewInvoice = (bookingId: number) => {
        navigate(`invoices/${bookingId}`)
    }

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-white pb-0 border-0">
                <Row className="align-items-center">
                    <Col>
                        <Card.Title as="h2">Danh sách Booking</Card.Title>
                    </Col>
                    <Col xs="auto">
                        <Form.Group className="mb-0">
                            <Form.Label className="me-2 mb-0">Lọc theo trạng thái:</Form.Label>
                            <Form.Select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{ width: 'auto', display: 'inline-block' }}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="PENDING">PENDING</option>
                                <option value="RESERVED">RESERVED</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                        <Spinner animation="border" variant="primary" />
                        <span className="ms-3">Đang tải dữ liệu...</span>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center p-5">
                        <h5 className="mt-3">Không có booking nào</h5>
                        <p className="text-muted">
                            {filterStatus === "ALL" 
                                ? "Chưa có booking nào được tạo trong hệ thống." 
                                : `Không có booking nào với trạng thái ${filterStatus}.`}
                        </p>
                    </div>
                ) : (
                    <Table responsive hover className="align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người thuê</th>
                                <th>Xe</th>
                                <th>Nhân viên</th>
                                <th>Thời gian thuê</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Đặt cọc</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr
                                    key={booking.bookingId}
                                    onClick={() => handleViewDetails(booking.bookingId)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td><strong>#{booking.bookingId}</strong></td>
                                    <td>
                                        <div>
                                            <strong>{booking.renterName}</strong>
                                            <br />
                                            <small className="text-muted">
                                                ID: {booking.renterId}
                                            </small>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{booking.vehicleName}</strong>
                                            <br />
                                            <small className="text-muted">
                                                ID: {booking.vehicleId}
                                            </small>
                                        </div>
                                    </td>
                                    <td>
                                        {booking.staffName ? (
                                            <div>
                                                <strong>{booking.staffName}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    ID: {booking.staffId}
                                                </small>
                                            </div>
                                        ) : (
                                            <span className="text-muted">Chưa phân công</span>
                                        )}
                                    </td>
                                    <td>
                                        <div>
                                            <small className="text-muted d-block">Bắt đầu:</small>
                                            {formatDate(booking.startDateTime)}
                                            <br />
                                            <small className="text-muted d-block mt-1">Kết thúc:</small>
                                            {formatDate(booking.endDateTime)}
                                            {booking.actualReturnTime && (
                                                <>
                                                    <br />
                                                    <small className="text-success d-block mt-1">
                                                        Trả xe: {formatDate(booking.actualReturnTime)}
                                                    </small>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{formatCurrency(booking.totalAmount)}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {formatCurrency(booking.priceSnapshotPerHour)}/giờ
                                        </small>
                                        <br />
                                        <small className="text-muted">
                                            {formatCurrency(booking.priceSnapshotPerDay)}/ngày
                                        </small>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${getStatusBadge(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${getDepositStatusBadge(booking.depositStatus)}`}>
                                            {booking.depositStatus}
                                        </span>
                                    </td>
                                    <td className="">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(booking.bookingId);
                                            }}
                                            className='m-1'
                                        >
                                            Xem chi tiết
                                        </Button>

                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewInvoice(booking.bookingId);
                                            }}
                                            
                                        >
                                            danh sách hóa đơn
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

export default ListBooking;