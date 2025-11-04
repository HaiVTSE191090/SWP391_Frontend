import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Button, Spinner, Alert, Table, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { BookingResponse } from './types/api.type';
import {
    getBookingDetail,
    updateBookingStatusToReserved,
    updateBookingStatusToCancelled
} from './services/authServicesForAdmin';

const BookingDetail: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                setLoading(true);
                const result = await getBookingDetail(Number(bookingId));

                if (result.success && result.data) {
                    setBooking(result.data as any);
                } else {
                    setError(result.message || 'Không thể tải thông tin booking');
                }
            } catch (err) {
                setError('Lỗi kết nối server');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookingDetail();

    }, [bookingId]);


    const handleApprove = () => {
        setActionType('approve');
        setShowConfirmModal(true);
    };

    const handleReject = () => {
        setActionType('reject');
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (!bookingId || !actionType) return;

        try {
            setActionLoading(true);
            setShowConfirmModal(false);

            let result;
            if (actionType === 'approve') {
                result = await updateBookingStatusToReserved(bookingId);
            } else {
                result = await updateBookingStatusToCancelled(Number(bookingId));
            }

            if (result.success) {
                alert(result.message || 'Cập nhật thành công');
                navigate(-1);
            } else {
                setError(result.message || 'Không thể cập nhật trạng thái');
            }
        } catch (err) {
            setError('Lỗi khi cập nhật trạng thái');
            console.error(err);
        } finally {
            setActionLoading(false);
            setActionType(null);
        }
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
        const statusConfig: { [key: string]: { variant: string; text: string } } = {
            'RESERVED': { variant: 'warning', text: 'Đã đặt chỗ' },
            'CONFIRMED': { variant: 'info', text: 'Đã xác nhận' },
            'IN_PROGRESS': { variant: 'primary', text: 'Đang thuê' },
            'COMPLETED': { variant: 'success', text: 'Hoàn thành' },
            'CANCELLED': { variant: 'danger', text: 'Đã hủy' }
        };
        const config = statusConfig[status] || { variant: 'secondary', text: status };
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    const getDepositStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { variant: string; text: string } } = {
            'PENDING': { variant: 'warning', text: 'Chờ thanh toán' },
            'PAID': { variant: 'success', text: 'Đã thanh toán' },
            'REFUNDED': { variant: 'info', text: 'Đã hoàn trả' },
            'FAILED': { variant: 'danger', text: 'Thất bại' }
        };
        const config = statusConfig[status] || { variant: 'secondary', text: status };
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải thông tin booking...</span>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <Alert variant="danger">
                {error}
                <div className="mt-3">
                    <Button variant="outline-primary" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                </div>
            </Alert>
        );
    }

    if (!booking) {
        return (
            <Alert variant="warning">
                Không tìm thấy thông tin booking
                <div className="mt-3">
                    <Button variant="outline-primary" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                </div>
            </Alert>
        );
    }

    const canApproveOrReject = booking.status !== 'RESERVED' &&
        booking.status !== 'CANCELLED' &&
        booking.status !== 'COMPLETED';

    return (
        <div>
            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white pb-0 border-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title as="h2">Chi tiết Booking #{booking.bookingId}</Card.Title>
                        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                            Quay lại
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                    <Row className="mb-4">
                        <Col md={6}>
                            <h5 className="mb-3">Thông tin người thuê</h5>
                            <Table bordered size="sm">
                                <tbody>
                                    <tr>
                                        <td className="bg-light" style={{ width: '40%' }}><strong>Tên</strong></td>
                                        <td>{booking.renterName}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-light"><strong>ID Người thuê</strong></td>
                                        <td>#{booking.renterId}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>

                        <Col md={6}>
                            <h5 className="mb-3">Thông tin xe</h5>
                            <Table bordered size="sm">
                                <tbody>
                                    <tr>
                                        <td className="bg-light" style={{ width: '40%' }}><strong>Tên xe</strong></td>
                                        <td>{booking.vehicleName}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-light"><strong>ID Xe</strong></td>
                                        <td>#{booking.vehicleId}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h5 className="mb-3">Nhân viên phụ trách</h5>
                            <Table bordered size="sm">
                                <tbody>
                                    <tr>
                                        <td className="bg-light" style={{ width: '40%' }}><strong>Tên nhân viên</strong></td>
                                        <td>{booking.staffName || <span className="text-muted">Chưa phân công</span>}</td>
                                    </tr>
                                    {booking.staffId && (
                                        <tr>
                                            <td className="bg-light"><strong>ID Nhân viên</strong></td>
                                            <td>#{booking.staffId}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Col>

                        <Col md={6}>
                            <h5 className="mb-3">Trạng thái</h5>
                            <Table bordered size="sm">
                                <tbody>
                                    <tr>
                                        <td className="bg-light" style={{ width: '40%' }}><strong>Trạng thái booking</strong></td>
                                        <td>{getStatusBadge(booking.status)}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-light"><strong>Trạng thái đặt cọc</strong></td>
                                        <td>{getDepositStatusBadge(booking.depositStatus)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <h5 className="mb-3">Thời gian thuê</h5>
                            <Table bordered size="sm">
                                <tbody>
                                    <tr>
                                        <td className="bg-light" style={{ width: '20%' }}><strong>Bắt đầu</strong></td>
                                        <td>{formatDate(booking.startDateTime)}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-light"><strong>Kết thúc</strong></td>
                                        <td>{formatDate(booking.endDateTime)}</td>
                                    </tr>
                                    {booking.actualReturnTime && (
                                        <tr>
                                            <td className="bg-light"><strong>Trả xe thực tế</strong></td>
                                            <td className="text-success">{formatDate(booking.actualReturnTime)}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="bg-light"><strong>Ngày tạo</strong></td>
                                        <td>{formatDate(booking.createdAt)}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-light"><strong>Cập nhật lần cuối</strong></td>
                                        <td>{formatDate(booking.updatedAt)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <h5 className="mb-3">Thông tin giá</h5>
                            <Table bordered size="sm">
                                <tbody>
                                    <tr>
                                        <td className="bg-light" style={{ width: '20%' }}><strong>Giá theo giờ</strong></td>
                                        <td>{formatCurrency(booking.priceSnapshotPerHour)}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-light"><strong>Giá theo ngày</strong></td>
                                        <td>{formatCurrency(booking.priceSnapshotPerDay)}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-light"><strong>Tổng tiền</strong></td>
                                        <td><strong className="text-primary fs-5">{formatCurrency(booking.totalAmount)}</strong></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {canApproveOrReject && (
                        <Row>
                            <Col className="d-flex justify-content-end gap-3">
                                <Button
                                    variant="danger"
                                    size="lg"
                                    onClick={handleReject}
                                    disabled={actionLoading}
                                >
                                    {actionLoading && actionType === 'reject' ? (
                                        <>
                                            <Spinner size="sm" animation="border" className="me-2" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        'Không đồng ý'
                                    )}
                                </Button>
                                <Button
                                    variant="success"
                                    size="lg"
                                    onClick={handleApprove}
                                    disabled={actionLoading}
                                >
                                    {actionLoading && actionType === 'approve' ? (
                                        <>
                                            <Spinner size="sm" animation="border" className="me-2" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        'Đồng ý'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    )}

                    {booking.status === 'RESERVED' && (
                        <Alert variant="success" className="mt-3">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Booking này đã được duyệt (RESERVED)
                        </Alert>
                    )}

                    {booking.status === 'CANCELLED' && (
                        <Alert variant="danger" className="mt-3">
                            <i className="bi bi-x-circle-fill me-2"></i>
                            Booking này đã bị hủy
                        </Alert>
                    )}

                    {booking.status === 'COMPLETED' && (
                        <Alert variant="info" className="mt-3">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Booking này đã hoàn thành
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actionType === 'approve' ? 'Xác nhận đồng ý' : 'Xác nhận từ chối'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {actionType === 'approve' ? (
                        <p>Bạn có chắc chắn muốn <strong className="text-success">đồng ý</strong> booking này?</p>
                    ) : (
                        <p>Bạn có chắc chắn muốn <strong className="text-danger">từ chối</strong> booking này?</p>
                    )}
                    <p className="text-muted small mb-0">
                        Booking ID: <strong>#{booking.bookingId}</strong>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant={actionType === 'approve' ? 'success' : 'danger'}
                        onClick={handleConfirmAction}
                    >
                        {actionType === 'approve' ? 'Đồng ý' : 'Từ chối'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BookingDetail;
