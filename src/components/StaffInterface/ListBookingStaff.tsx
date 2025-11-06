import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getStaffStationBookings } from './services/authServices';
import { Link } from 'react-router-dom';

// Cập nhật Interface để khớp với dữ liệu API/DB
interface BookingContract {
    bookingId: number;
    vehicleName: string;
    stationName: string;
    renterName: string;
    bookingStatus: 'RESERVED' | 'COMPLETED' | 'CANCELLED' | string;
    startDateTime: string;
    endDateTime: string;
    contractId: number | null;
    // Cập nhật các trạng thái để khớp với DB
    contractStatus: 'NOT_CREATED' | 'PENDING_ADMIN_SIGNATURE' | 'APPROVED' | 'REJECTED' | 'ADMIN_SIGNED' | 'FULLY_SIGNED' | 'CANCELLED' | string;
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
            const response = await getStaffStationBookings(); 
            const allBookings = response?.data?.data || [];
            
            // Lọc chỉ lấy booking có trạng thái hợp đồng là "NOT_CREATED" (Chưa tạo)
            const filteredBookings = allBookings.filter(
                (booking: BookingContract) => booking.contractStatus === 'NOT_CREATED'
            );
            
            // Sắp xếp theo ID từ lớn đến nhỏ
            const sortedBookings = filteredBookings.sort(
                (a: BookingContract, b: BookingContract) => b.bookingId - a.bookingId
            );
            
            setBookings(sortedBookings);

        } catch (error) {
            console.error('Lỗi khi lấy danh sách booking:', error);
            setError('Không thể tải danh sách booking/hợp đồng của trạm.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // Render badge theo trạng thái Booking (GIỮ NGUYÊN)
    const renderBookingStatusBadge = (status?: string) => {
        switch (status) {
            case 'RESERVED':
                return <Badge bg="primary">Đã đặt</Badge>;
            case 'COMPLETED':
                return <Badge bg="success">Hoàn thành</Badge>;
            case 'CANCELLED':
                return <Badge bg="danger">Đã hủy</Badge>;
            case 'IN_USE':
                return <Badge bg="danger">Đang sử dụng</Badge>;
            default:
                return <Badge bg="secondary">Chưa rõ</Badge>;
        }
    };

    // Render badge theo trạng thái Hợp đồng (ĐÃ CẬP NHẬT để khớp DB)
    const renderContractStatusBadge = (status?: string) => {
        switch (status) {
            case 'NOT_CREATED':
                return <Badge bg="info">Chưa tạo</Badge>;
            case 'PENDING_ADMIN_SIGNATURE':
                return <Badge bg="warning">Chờ Admin ký</Badge>;
            case 'APPROVED': // Giả sử trạng thái sau khi Renter ký, Admin chưa ký.
                return <Badge bg="primary">Renter đã ký</Badge>;
            case 'ADMIN_SIGNED':
                return <Badge bg="success">Admin đã ký</Badge>;
            case 'FULLY_SIGNED':
                return <Badge bg="success">**Ký hoàn tất**</Badge>;
            case 'REJECTED':
                return <Badge bg="danger">Đã từ chối</Badge>;
            case 'CANCELLED':
                return <Badge bg="secondary">Đã hủy</Badge>;
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
        // 2. Chờ Admin ký: Chuyển hướng đến trang Chi tiết Booking để nhân viên ký thay Admin (nếu có quyền) hoặc chờ
        else if (booking.contractStatus === 'PENDING_ADMIN_SIGNATURE') {
            navigate(`/staff/booking/${booking.bookingId}/detail`); 
        }
        // 3. Các trường hợp đã có contractId và đã ký (APPROVED, ADMIN_SIGNED, FULLY_SIGNED) hoặc Rejected/Cancelled: Xem chi tiết
        else if (booking.contractId) {
             navigate(`/staff/booking/${booking.bookingId}/detail`); 
        } else {
             // Dành cho các trạng thái không có contractId nhưng cần xem chi tiết booking
             navigate(`/staff/booking/${booking.bookingId}/detail`); 
        }
    };

    // Handler cho nút "Trả xe"
    const handleReturnVehicle = (bookingId: number) => {
        // Chuyển hướng đến trang chi tiết booking để thực hiện Check-out/Trả xe
        navigate(`/staff/booking/${bookingId}/detail`);
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
                <h2>Danh Sách Booking Chưa Tạo Hợp Đồng</h2>
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
                            bookings.map((b) => {
                                // Kiểm tra nếu contract đã được ký hoàn tất (ADMIN_SIGNED hoặc FULLY_SIGNED)
                                const isContractFullySigned = b.contractStatus === 'ADMIN_SIGNED' || b.contractStatus === 'FULLY_SIGNED';
                                // Kiểm tra nếu booking đang ở trạng thái sẵn sàng để trả xe (RESERVED hoặc trạng thái đang thuê)
                                const isReadyToReturn = b.bookingStatus === 'IN_USE';

                                return (
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
                                            <div className="d-flex gap-2 flex-wrap">
                                                
                                                {/* Nút Hành động chính */}
                                                <Button
                                                    variant={b.contractStatus === 'NOT_CREATED' ? "success" : "primary"}
                                                    size="sm"
                                                    onClick={() => handleContractAction(b)}
                                                    disabled={b.bookingStatus === 'CANCELLED'}
                                                >
                                                    {b.contractStatus === 'PENDING_ADMIN_SIGNATURE' 
                                                        ? 'Thực hiện/Ký hợp đồng' 
                                                        : b.contractStatus === 'NOT_CREATED' ? 'Tạo Hợp đồng' : 'Xem Chi tiết'}
                                                </Button>
                                                
                                                {/* Nút Trả xe - CHỈ HIỆN KHI BOOKING RESERVED VÀ CONTRACT FULLY SIGNED */}
                                                {isReadyToReturn && isContractFullySigned && (
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        onClick={() => handleReturnVehicle(b.bookingId)}
                                                    >
                                                        Trả xe
                                                    </Button>
                                                )}
                                                
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center text-muted">
                                    Không có Booking nào cần tạo hợp đồng tại trạm.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {bookings.length > 0 && (
                <div className="text-muted">
                    <small>Tổng số booking chưa tạo hợp đồng: {bookings.length}</small>
                </div>
            )}

        </Container>
    );
};

export default ListBookingStaff;