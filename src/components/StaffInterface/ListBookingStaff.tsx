import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getStaffStationBookings } from './services/authServices';
import { Link } from 'react-router-dom';

// Cập nhật Interface để khớp với dữ liệu API
interface BookingContract {
    bookingId: number;
    vehicleName: string;
    stationName: string;
    renterName: string;
    bookingStatus: 'RESERVED' | 'COMPLETED' | 'CANCELLED' | string;
    startDateTime: string;
    endDateTime: string;
    contractId: number | null;
    contractStatus: 'NOT_CREATED' | 'PENDING_ADMIN_SIGNATURE' | 'APPROVED' | 'REJECTED' | string;
    contractFileUrl: string | null;
    renterSignedAt: string | null;
    staffSignedAt: string | null;
}

// Component chính
const ListBookingStaff: React.FC = () => {
    const [bookings, setBookings] = useState<BookingContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch API danh sách Booking của trạm
    useEffect(() => {
        fetchBooking();
    }, []);

    const fetchBooking = async () => {
        setLoading(true);
        setError('');

        try {
            // Giả định getStaffStationBookings trả về data có cấu trúc: { data: { data: BookingContract[] } }
            // Lưu ý: Đảm bảo 'getStaffStationBookings' đã được import đúng từ './services/authServices'
            const response = await getStaffStationBookings(); 

            setBookings(response?.data?.data || []);

        } catch (error) {
            console.error('Lỗi khi lấy danh sách booking:', error);
            setError('Không thể tải danh sách booking/hợp đồng của trạm.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // Render badge theo trạng thái Booking
    const renderBookingStatusBadge = (status?: string) => {
        switch (status) {
            case 'RESERVED':
                return <Badge bg="primary">Đã đặt</Badge>;
            case 'COMPLETED':
                return <Badge bg="success">Hoàn thành</Badge>;
            case 'CANCELLED':
                return <Badge bg="danger">Đã hủy</Badge>;
            default:
                return <Badge bg="secondary">Chưa rõ</Badge>;
        }
    };

    // Render badge theo trạng thái Hợp đồng
    const renderContractStatusBadge = (status?: string) => {
        switch (status) {
            case 'NOT_CREATED':
                return <Badge bg="info">Chưa tạo</Badge>;
            case 'PENDING_ADMIN_SIGNATURE':
                return <Badge bg="warning">Chờ Admin ký</Badge>;
            case 'APPROVED':
                return <Badge bg="success">Đã duyệt</Badge>;
            case 'REJECTED':
                return <Badge bg="danger">Đã từ chối</Badge>;
            default:
                return <Badge bg="secondary">---</Badge>;
        }
    };

    // Handler cho nút "Tạo/Xem Chi tiết Hợp đồng"
    const handleContractAction = (booking: BookingContract) => {
        // 1. Chưa tạo hợp đồng: Tạo hợp đồng
        if (booking.contractStatus === 'NOT_CREATED') {
            navigate(`/staff/booking/${booking.bookingId}/create-contract`);
        } 
        // 2. Chờ Admin ký hoặc Đã duyệt: Chuyển hướng đến trang Chi tiết Booking (Staff thực hiện Check-in/Check-out)
        else if (booking.contractStatus === 'PENDING_ADMIN_SIGNATURE' || booking.contractStatus === 'APPROVED') {
            navigate(`/staff/booking/${booking.bookingId}/detail`); 
        }
        // 3. Trường hợp khác (ví dụ: Rejected, Completed): Xem chi tiết Hợp đồng (nếu có contractId)
        else if (booking.contractId) {
            navigate(`/staff/contract/${booking.contractId}`);
        }
    };

    // --- Hiển thị Loading State ---
    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
                <p className="mt-2">Đang tải danh sách booking...</p>
            </Container>
        );
    }

    // --- Hiển thị Error State ---
    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={fetchBooking}>
                        Thử lại
                    </Button>
                </Alert>
            </Container>
        );
    }

    // --- Hiển thị Main Content ---
    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Danh Sách Booking Tại Trạm</h2>
                <Button variant="primary" onClick={fetchBooking}>
                    <i className="bi bi-arrow-clockwise"></i> Làm mới
                </Button>
            </div>

            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tên Người Thuê</th>
                            <th>Tên Xe</th>
                            <th>Trạm</th>
                            <th>Trạng thái Booking</th>
                            <th>Trạng thái Hợp đồng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((b) => (
                                <tr key={b.bookingId}>
                                    <td>{b.bookingId}</td>
                                    <td>{b.renterName}</td>
                                    <td>{b.vehicleName}</td>
                                    <td>{b.stationName}</td>
                                    <td>
                                        {renderBookingStatusBadge(b.bookingStatus)}
                                    </td>
                                    <td>
                                        {renderContractStatusBadge(b.contractStatus)}
                                    </td>
                                    <td>
                                        <Button
                                            variant={b.contractStatus === 'NOT_CREATED' ? "success" : "primary"}
                                            size="sm"
                                            onClick={() => handleContractAction(b)}
                                            // Vô hiệu hóa nút nếu booking đã hủy
                                            disabled={b.bookingStatus === 'CANCELLED'}
                                        >
                                            {/* Logic hiển thị theo trạng thái */}
                                            {b.contractStatus === 'PENDING_ADMIN_SIGNATURE' || b.contractStatus === 'APPROVED' 
                                                ? 'Thực hiện/Xem chi tiết' 
                                                : b.contractStatus === 'NOT_CREATED' ? 'Tạo Hợp đồng' : 'Xem Chi tiết'}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center text-muted">
                                    Không có Booking nào tại trạm.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {bookings.length > 0 && (
                <div className="text-muted">
                    <small>Tổng số booking: {bookings.length}</small>
                </div>
            )}

        </Container>
    );
};

export default ListBookingStaff;