import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
// Giả định service này tồn tại (Bạn đã cung cấp đoạn code API này)
// import { getBookingInfoForContract } from './services/authServices'; 

// Interface cho dữ liệu booking theo cấu trúc API mới
interface BookingDetailResponse {
    bookingId: number;
    vehicleName: string;
    vehiclePlate: string;
    renterName: string;
    renterEmail: string;
    renterPhone: string;
    staffName: string;
    startDateTime: string;
    endDateTime: string;
    pricePerHour: number;
    pricePerDay: number;
    bookingStatus: 'RESERVED' | 'COMPLETED' | 'CANCELLED' | string;
    // Thêm các trường cần thiết cho UI
    photoBeforeUrl: string; 
    photoAfterUrl: string; 
}

// Mock data booking (giả lập dữ liệu API và các trường thiếu)
const mockBookingDetail = (bookingId: number) => ({
    bookingId: bookingId,
    vehicleName: "VF e34 Xanh Biển",
    vehiclePlate: "59A6-78901",
    renterName: "Vũ Đình Hải",
    renterEmail: "user13@email.com",
    renterPhone: "0701111113",
    staffName: "Lê Văn A",
    startDateTime: "2025-11-01T18:11:27",
    endDateTime: "2025-11-07T18:11:27",
    pricePerHour: 150000,
    pricePerDay: 15000000,
    bookingStatus: "RESERVED",
    photoBeforeUrl: 'https://via.placeholder.com/300x180?text=Chua+chup+truoc+thue',
    photoAfterUrl: 'https://via.placeholder.com/300x180?text=Chua+chup+sau+tra',
});


function BookingDetail() {
    const { bookingId } = useParams<{ bookingId: string }>(); 
    const bookingIdNumber = bookingId ? parseInt(bookingId) : 0;
    
    const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    // Fetch API để lấy chi tiết booking
    useEffect(() => {
        const fetchDetail = async () => {
            if (!bookingIdNumber) {
                setError("Thiếu ID Booking.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                // Thay thế bằng logic gọi getBookingInfoForContract(bookingIdNumber) thực tế của bạn
                // const response = await getBookingInfoForContract(bookingIdNumber);
                // const apiData = response.data.data;

                await new Promise(resolve => setTimeout(resolve, 500)); 
                const completeBookingData = mockBookingDetail(bookingIdNumber);
                
                setBooking(completeBookingData as BookingDetailResponse);
                setLoading(false);

            } catch (err) {
                console.error("Error fetching booking detail:", err);
                setError("Không thể tải chi tiết Booking. Vui lòng thử lại.");
                setLoading(false);
            }
        };

        fetchDetail();
    }, [bookingIdNumber]);

    // HANDLER CHUYỂN HƯỚNG ĐẾN TRANG CHỤP ẢNH
    const handleUploadPhoto = (type: 'before' | 'after') => {
        if (booking) {
            navigate(`/staff/booking/${booking.bookingId}/photo/${type}`);
        }
    };
    // Handler cho Report (vẫn giữ nguyên)
    const handleCreateReport = () => {
        alert("Chuyển hướng đến trang tạo Report hoặc mở Modal.");
    };
    
    // --- Hiển thị Loading/Error State ---
    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /> Đang tải thông tin booking...</Container>;
    if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!booking) return <Container className="py-5 text-center">Không tìm thấy thông tin booking.</Container>;


    // Format tiền tệ
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    
    return (
        <Container className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Row className="mb-4">
                <Col><h2 className="text-center fw-bold text-primary">Chi Tiết Booking #{booking.bookingId}</h2></Col>
            </Row>
            
            <Card className="shadow-lg mb-5">
                <Card.Body>
                    <h4 className="fw-bold mb-4 border-bottom pb-2">Thông tin Hợp đồng và Xe</h4>
                    <Row>
                        <Col md={6}>
                            <Table bordered hover size="sm" className="bg-white">
                                <tbody>
                                    <tr><td className="fw-medium">Tên Người Thuê</td><td>{booking.renterName}</td></tr>
                                    <tr><td className="fw-medium">Email Người Thuê</td><td>{booking.renterEmail}</td></tr>
                                    <tr><td className="fw-medium">SĐT Người Thuê</td><td>{booking.renterPhone}</td></tr>
                                    <tr><td className="fw-medium">Tên Nhân viên</td><td>{booking.staffName}</td></tr>
                                    <tr><td className="fw-medium">Trạng thái</td><td><span className="badge bg-info">{booking.bookingStatus}</span></td></tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <Table bordered hover size="sm" className="bg-white">
                                <tbody>
                                    <tr><td className="fw-medium">Tên Xe</td><td>{booking.vehicleName}</td></tr>
                                    <tr><td className="fw-medium">Biển số Xe</td><td>{booking.vehiclePlate}</td></tr>
                                    <tr><td className="fw-medium">Bắt đầu</td><td>{new Date(booking.startDateTime).toLocaleString()}</td></tr>
                                    <tr><td className="fw-medium">Kết thúc</td><td>{new Date(booking.endDateTime).toLocaleString()}</td></tr>
                                    <tr><td className="fw-medium">Giá/Giờ</td><td>{formatCurrency(booking.pricePerHour)}</td></tr>
                                    <tr><td className="fw-medium">Giá/Ngày</td><td>{formatCurrency(booking.pricePerDay)}</td></tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    
                    <h4 className="fw-bold mt-4 mb-3 border-bottom pb-2">Thủ tục Check-in/Check-out</h4>
                    
                    {/* NÚT HÀNH ĐỘNG MỚI */}
                    <Row className="mb-4 justify-content-center">
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="secondary" className="w-100" onClick={() => handleUploadPhoto('before')}>
                                📸 Ảnh chụp **trước khi** thuê
                            </Button>
                        </Col>
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="warning" className="w-100" onClick={handleCreateReport}>
                                ⚠️ **Report** (Báo cáo hư hỏng/sự cố)
                            </Button>
                        </Col>
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="secondary" className="w-100" onClick={() => handleUploadPhoto('after')}>
                                📷 Ảnh chụp **sau khi** trả
                            </Button>
                        </Col>
                    </Row>

                    {/* HIỂN THỊ ẢNH (Chỉ để tham khảo, ảnh thực sẽ được hiển thị khi được cập nhật từ PhotoCapturePage) */}
                    <Row className="mt-4">
                        <Col md={6} className="text-center">
                            <h6 className="fw-medium">Ảnh trước khi thuê</h6>
                            <img src={booking.photoBeforeUrl} alt="Ảnh trước khi thuê" className="img-fluid border p-1" style={{ maxWidth: '400px', borderRadius: 8 }} />
                        </Col>
                        <Col md={6} className="text-center">
                            <h6 className="fw-medium">Ảnh sau khi trả</h6>
                            <img src={booking.photoAfterUrl} alt="Ảnh sau khi trả" className="img-fluid border p-1" style={{ maxWidth: '400px', borderRadius: 8 }} />
                        </Col>
                    </Row>

                </Card.Body>
                <Card.Footer className="text-center text-muted">Booking Management System</Card.Footer>
            </Card>
        </Container>
    );
}

export default BookingDetail;