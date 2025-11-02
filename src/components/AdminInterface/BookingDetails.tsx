import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

// Định nghĩa các kiểu dữ liệu enum từ cấu trúc bảng
type BookingStatus = 'CANCELLED' | 'COMPLETED' | 'EXPIRED' | 'IN_USE' | 'PENDING' | 'RESERVED'; //
type DepositStatus = 'PAID' | 'PENDING' | 'REFUNDED'; //

// Interface chi tiết cho dữ liệu Booking dựa trên cấu trúc bảng
interface BookingDetailData {
    id: number; // booking_id
    renterName: string; // Tên Người thuê (Giả định JOIN)
    vehicleName: string; // Tên Xe (Giả định JOIN)
    status: BookingStatus;
    depositStatus: DepositStatus;
    totalAmount: number; // total_amount
    startDate: string; // start_date_time
    endDate: string; // end_date_time
    createdAt: string; // created_at
    pricePerDay: number; // price_snapshot_per_day
    pricePerHour: number; // price_snapshot_per_hour
    renterId: number; // renter_id
}

const BookingDetail: React.FC = () => {
    // Lấy ID từ URL
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<BookingDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Hàm tiện ích để hiển thị trạng thái
    const getStatusBadge = (status: BookingStatus | DepositStatus) => {
        let variant: string;
        switch (status) {
            case 'PENDING':
                variant = 'warning';
                break;
            case 'RESERVED':
            case 'PAID':
            case 'IN_USE':
                variant = 'success';
                break;
            case 'CANCELLED':
            case 'EXPIRED':
            case 'REFUNDED':
                variant = 'danger';
                break;
            default:
                variant = 'secondary';
        }
        return <span className={`badge bg-${variant}`}>{status}</span>;
    };

    // Giả lập fetch API chi tiết Booking
    useEffect(() => {
        setLoading(true);
        setError('');
        // TODO: Thay bằng API thực tế: GET /api/admin/bookings/:id
        setTimeout(() => {
            const bookingId = parseInt(id || '0');
            if (bookingId === 1) {
                setBooking({
                    id: 1,
                    renterName: 'Nguyễn Văn A',
                    vehicleName: 'VinFast VF7 - BS: 30A-123.45',
                    status: 'PENDING',
                    depositStatus: 'PAID',
                    totalAmount: 5000000,
                    startDate: '2025-11-01 08:00',
                    endDate: '2025-11-03 18:00',
                    createdAt: '2025-10-28 10:30',
                    pricePerDay: 1500000,
                    pricePerHour: 150000,
                    renterId: 101,
                });
            } else if (bookingId === 2) {
                setBooking({
                    id: 2,
                    renterName: 'Trần Thị B',
                    vehicleName: 'Toyota Vios - BS: 51F-987.65',
                    status: 'PENDING',
                    depositStatus: 'PENDING',
                    totalAmount: 3000000,
                    startDate: '2025-11-05 09:00',
                    endDate: '2025-11-07 09:00',
                    createdAt: '2025-10-29 15:00',
                    pricePerDay: 1000000,
                    pricePerHour: 100000,
                    renterId: 102,
                });
            } else {
                setError('Không tìm thấy Booking');
            }
            setLoading(false);
        }, 800);
    }, [id]);

    // Handler cho nút "Xác nhận" (Đồng ý cho thuê)
    const handleConfirm = async () => {
        if (!booking || booking.status !== 'PENDING') return;
        setIsProcessing(true);
        setError('');
        try {
            // TODO: GỌI API THỰC TẾ: POST /api/admin/bookings/:id/confirm
            // Theo sơ đồ: ĐỒNG Ý CHO THUÊ -> GỬI THÔNG BÁO TẠO HỢP ĐỒNG CHO STATION ADMIN
            
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            alert(`Xác nhận Booking ID ${id} thành công! (Booking chuyển trạng thái và gửi thông báo cho Station Admin)`);
            navigate('/admin/booking'); // Quay lại danh sách Booking
        } catch (err: any) {
            setError(err.message || 'Lỗi khi xác nhận Booking.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handler cho nút "Hủy" (Từ chối cho thuê)
    const handleCancel = async () => {
        if (!booking || booking.status !== 'PENDING') return;
        if (!window.confirm('Bạn có chắc chắn muốn HỦY Booking này không? Việc này sẽ gửi mail từ chối cho người thuê.')) return;

        setIsProcessing(true);
        setError('');
        try {
            // TODO: GỌI API THỰC TẾ: POST /api/admin/bookings/:id/cancel
            // Theo sơ đồ: TỪ CHỐI CHO THUÊ -> GỬI MAIL CHO RENTER BOOKING BỊ TỪ CHỐI
            
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            alert(`Hủy Booking ID ${id} thành công! (Đã gửi mail từ chối và xử lý hoàn cọc)`);
            navigate('/admin/booking'); // Quay lại danh sách Booking
        } catch (err: any) {
            setError(err.message || 'Lỗi khi hủy Booking.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center"><Spinner animation="border" variant="primary" /></Container>
        );
    }

    if (error) {
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!booking) {
        return <Container className="mt-4"><Alert variant="info">Không tìm thấy thông tin Booking.</Alert></Container>;
    }

    // Chỉ cho phép xử lý nếu trạng thái đang là PENDING
    const isPending = booking.status === 'PENDING';
    
    return (
        <Container className="mt-4">
            <h2 className="mb-4">Chi tiết Booking #{booking.id}</h2>

            <Card className="shadow-sm">
                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                    Thông tin chi tiết Booking (Từ bảng Booking)
                    {getStatusBadge(booking.status)}
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Mã Booking (booking_id):</strong> {booking.id}</ListGroup.Item>
                                <ListGroup.Item><strong>Người Thuê (renter_id):</strong> {booking.renterName} ({booking.renterId})</ListGroup.Item>
                                <ListGroup.Item><strong>Xe Thuê (vehicle_id):</strong> {booking.vehicleName}</ListGroup.Item>
                                <ListGroup.Item><strong>Ngày Tạo (created_at):</strong> {booking.createdAt}</ListGroup.Item>
                                <ListGroup.Item><strong>Cập nhật gần nhất (updated_at):</strong> {/* Giả định có trường updated_at */ new Date().toLocaleString()}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Bắt đầu thuê (start_date_time):</strong> {booking.startDate}</ListGroup.Item>
                                <ListGroup.Item><strong>Kết thúc thuê (end_date_time):</strong> {booking.endDate}</ListGroup.Item>
                                <ListGroup.Item><strong>Giá/Ngày (price_snapshot_per_day):</strong> {booking.pricePerDay.toLocaleString('vi-VN')} VNĐ</ListGroup.Item>
                                <ListGroup.Item><strong>Tổng Tiền (total_amount):</strong> <span className="text-primary fw-bold">{booking.totalAmount.toLocaleString('vi-VN')} VNĐ</span></ListGroup.Item>
                                <ListGroup.Item><strong>Trạng thái cọc (deposit_status):</strong> {getStatusBadge(booking.depositStatus)}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    {isPending ? (
                        <div className="d-flex justify-content-end">
                            <Button 
                                variant="success" 
                                className="me-3" 
                                onClick={handleConfirm}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Xác nhận (Đồng ý cho thuê)'}
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={handleCancel}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Hủy (Từ chối cho thuê)'}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-muted">Booking đã được xử lý ({booking.status})</div>
                    )}
                </Card.Footer>
            </Card>

            <Button variant="outline-secondary" className="mt-3" onClick={() => navigate('/admin/booking')}>
                &larr; Quay lại Danh sách Booking
            </Button>
        </Container>
    );
};

export default BookingDetail;