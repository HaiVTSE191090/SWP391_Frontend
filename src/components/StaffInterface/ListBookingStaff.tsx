import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getStaffStationBookings } from './services/authServices';

// Interface - Định nghĩa kiểu dữ liệu cho Booking
interface BookingContract {
    bookingId: number;
    vehicleName: string;
    stationName: string;
    renterName: string;
    bookingStatus: string;
    startDateTime: string;
    endDateTime: string;
    contractId: number | null;
    contractStatus: string;
    contractFileUrl: string | null;
    renterSignedAt: string | null;
    staffSignedAt: string | null;
}

// Component chính
const ListBookingStaff: React.FC = () => {
    const [bookings, setBookings] = useState<BookingContract[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch bookings
    useEffect(() => {
        fetchBooking();
    }, []);

    // Hàm lấy dữ liệu booking từ API
    const fetchBooking = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getStaffStationBookings();
            const data = response?.data?.data || [];
            setBookings(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách booking:', error);
            setError('Không thể tải danh sách booking/hợp đồng của trạm.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm lọc booking theo trạng thái đã chọn
    const getFilteredBookings = () => {
        if (filterStatus === 'ALL') {
            return bookings; // Hiển thị tất cả
        }
        return bookings.filter(b => b.bookingStatus === filterStatus); // Lọc theo trạng thái
    };

    // Hàm đếm số lượng booking theo từng trạng thái
    const countBookingsByStatus = (status: string) => {
        if (status === 'ALL') {
            return bookings.length;
        }
        return bookings.filter(b => b.bookingStatus === status).length;
    };

    // Hàm hiển thị badge cho trạng thái Booking
    const renderBookingStatusBadge = (status: string) => {
        switch (status) {
            case 'CANCELLED': return <Badge bg="secondary">Đã hủy</Badge>;
            case 'COMPLETED': return <Badge bg="success">Hoàn thành</Badge>;
            case 'EXPIRED': return <Badge bg="danger">Hết hạn</Badge>;
            case 'IN_USE': return <Badge bg="info">Đang sử dụng</Badge>;
            case 'PENDING': return <Badge bg="warning">Chờ xử lý</Badge>;
            case 'RESERVED': return <Badge bg="primary">Đã đặt</Badge>;
            default: return <Badge bg="secondary">---</Badge>;
        }
    };

    // Hàm hiển thị badge cho trạng thái Contract
    const renderContractStatusBadge = (status: string) => {
        switch (status) {
            case 'NOT_CREATED': return <Badge bg="info">Chưa tạo</Badge>;
            case 'PENDING_ADMIN_SIGNATURE': return <Badge bg="warning">Chờ Admin ký</Badge>;
            case 'APPROVED': return <Badge bg="primary">Renter đã ký</Badge>;
            case 'ADMIN_SIGNED': return <Badge bg="success">Admin đã ký</Badge>;
            case 'FULLY_SIGNED': return <Badge bg="success">Ký hoàn tất</Badge>;
            case 'REJECTED': return <Badge bg="danger">Đã từ chối</Badge>;
            case 'CANCELLED': return <Badge bg="secondary">Đã hủy</Badge>;
            default: return <Badge bg="secondary">---</Badge>;
        }
    };

    // Hàm xử lý khi bấm nút Tạo/Xem hợp đồng
    const handleContractAction = (booking: BookingContract) => {
        if (booking.contractStatus === 'NOT_CREATED') {
            navigate(`/staff/booking/${booking.bookingId}/create-contract`);
        } else {
            navigate(`/staff/booking/${booking.bookingId}/detail`);
        }
    };

    // Hàm xử lý khi bấm nút Trả xe
    const handleReturnVehicle = (bookingId: number) => {
        navigate(`/staff/booking/${bookingId}/detail`);
    };

    // Hàm lấy text cho nút hành động
    const getButtonText = (contractStatus: string) => {
        if (contractStatus === 'NOT_CREATED') return 'Tạo Hợp đồng';
        if (contractStatus === 'PENDING_ADMIN_SIGNATURE') return 'Xem chi tiết';
        return 'Xem Chi tiết';
    };

    // Lấy danh sách booking đã được lọc
    const filteredBookings = getFilteredBookings();

    // --- RENDER UI ---
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

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={fetchBooking}>Thử lại</Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Danh Sách Booking Chưa Tạo Hợp Đồng</h2>
                <Button variant="primary" onClick={fetchBooking}>
                    <i className="bi bi-arrow-clockwise"></i> Làm mới
                </Button>
            </div>

            {/* Bộ lọc trạng thái */}
            <div className="mb-4 p-3 bg-light rounded">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <strong>Lọc theo trạng thái:</strong>
                    
                    {/* Nút Tất cả */}
                    <Button
                        size="sm"
                        variant={filterStatus === 'ALL' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilterStatus('ALL')}
                    >
                        Tất cả ({countBookingsByStatus('ALL')})
                    </Button>

                    {/* Nút Chờ xử lý */}
                    <Button
                        size="sm"
                        variant={filterStatus === 'PENDING' ? 'warning' : 'outline-warning'}
                        onClick={() => setFilterStatus('PENDING')}
                    >
                        Chờ xử lý ({countBookingsByStatus('PENDING')})
                    </Button>

                    {/* Nút Đã đặt */}
                    <Button
                        size="sm"
                        variant={filterStatus === 'RESERVED' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilterStatus('RESERVED')}
                    >
                        Đã đặt ({countBookingsByStatus('RESERVED')})
                    </Button>

                    {/* Nút Đang sử dụng */}
                    <Button
                        size="sm"
                        variant={filterStatus === 'IN_USE' ? 'info' : 'outline-info'}
                        onClick={() => setFilterStatus('IN_USE')}
                    >
                        Đang sử dụng ({countBookingsByStatus('IN_USE')})
                    </Button>

                    {/* Nút Hoàn thành */}
                    <Button
                        size="sm"
                        variant={filterStatus === 'COMPLETED' ? 'success' : 'outline-success'}
                        onClick={() => setFilterStatus('COMPLETED')}
                    >
                        Hoàn thành ({countBookingsByStatus('COMPLETED')})
                    </Button>

                    {/* Nút Hết hạn */}
                    <Button
                        size="sm"
                        variant={filterStatus === 'EXPIRED' ? 'danger' : 'outline-danger'}
                        onClick={() => setFilterStatus('EXPIRED')}
                    >
                        Hết hạn ({countBookingsByStatus('EXPIRED')})
                    </Button>

                    {/* Nút Đã hủy */}
                    <Button
                        size="sm"
                        variant={filterStatus === 'CANCELLED' ? 'secondary' : 'outline-secondary'}
                        onClick={() => setFilterStatus('CANCELLED')}
                    >
                        Đã hủy ({countBookingsByStatus('CANCELLED')})
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead className="table-dark">
                        <tr>
                            <th>STT</th>
                            <th>Tên Người Thuê</th>
                            <th>Tên Xe</th>
                            <th>Trạm</th>
                            <th>Trạng thái Booking</th>
                            <th>Trạng thái Hợp đồng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((b, index) => {
                                // Kiểm tra contract đã ký hoàn tất chưa
                                const isContractFullySigned = b.contractStatus === 'ADMIN_SIGNED' || b.contractStatus === 'FULLY_SIGNED';
                                // Kiểm tra booking có sẵn sàng trả xe không
                                const isReadyToReturn = b.bookingStatus === 'RESERVED';

                                return (
                                    <tr key={b.bookingId}>
                                        <td>{index + 1}</td>
                                        <td>{b.renterName}</td>
                                        <td>{b.vehicleName}</td>
                                        <td>{b.stationName}</td>
                                        <td>{renderBookingStatusBadge(b.bookingStatus)}</td>
                                        <td>{renderContractStatusBadge(b.contractStatus)}</td>
                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <Button
                                                    variant={b.contractStatus === 'NOT_CREATED' ? 'success' : 'primary'}
                                                    size="sm"
                                                    onClick={() => handleContractAction(b)}
                                                    disabled={b.bookingStatus === 'CANCELLED'}
                                                >
                                                    {getButtonText(b.contractStatus)}
                                                </Button>
                                                
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
                                    {filterStatus === 'ALL'
                                        ? 'Không có Booking nào tại trạm.'
                                        : `Không có Booking nào với trạng thái "${filterStatus}".`}
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

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center text-muted">
                <small>
                    Hiển thị: <strong>{filteredBookings.length}</strong> / Tổng: <strong>{bookings.length}</strong> booking
                </small>
            </div>
        </Container>
    );
};

export default ListBookingStaff;
