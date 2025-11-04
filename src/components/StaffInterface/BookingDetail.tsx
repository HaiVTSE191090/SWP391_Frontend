import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingDetail } from './services/authServices';

// Interface cho dữ liệu booking theo cấu trúc API mới
interface BookingDetailResponse {
    bookingId: number;
    renterId: number;
    renterName: string;
    vehicleId: number;
    vehicleName: string;
    staffId: number;
    staffName: string;
    priceSnapshotPerHour: number;
    priceSnapshotPerDay: number;
    startDateTime: string;
    endDateTime: string;
    actualReturnTime: string | null;
    totalAmount: number;
    status: 'RESERVED' | 'COMPLETED' | 'CANCELLED' | string;
    depositStatus: string;
    createdAt: string;
    updatedAt: string;
    bookingImages: BookingImage[];
}

// Interface cho ảnh từ API
interface BookingImage {
    imageId: number;
    imageUrl: string;
    description: string;
    createdAt: string;
    imageType: 'BEFORE_RENTAL' | 'AFTER_RENTAL' | 'DAMAGE';
    vehicleComponent: string;
}

function BookingDetail() {
    const { bookingId } = useParams<{ bookingId: string }>(); 
    const bookingIdNumber = bookingId ? parseInt(bookingId) : 0;
    
    const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
    const [beforeImages, setBeforeImages] = useState<BookingImage[]>([]);
    const [afterImages, setAfterImages] = useState<BookingImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    // Fetch API để lấy chi tiết booking và ảnh
    useEffect(() => {
        const fetchDetail = async () => {
            if (!bookingIdNumber) {
                setError("Thiếu ID Booking.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            
            const response = await getBookingDetail(bookingIdNumber);
            if (response?.data?.data) {
                const bookingData = response.data.data;
                setBooking(bookingData);
                
                // Phân loại ảnh theo imageType
                const before = bookingData.bookingImages.filter((img: BookingImage) => img.imageType === 'BEFORE_RENTAL');
                const after = bookingData.bookingImages.filter((img: BookingImage) => img.imageType === 'AFTER_RENTAL');
                
                setBeforeImages(before);
                setAfterImages(after);
                setLoading(false);
            } else {
                setError("Không thể tải chi tiết Booking. Vui lòng thử lại.");
                setLoading(false);
            }
        };

        fetchDetail();
    }, [bookingIdNumber]);

    // HANDLER CHUYỂN HƯỚNG ĐẾN TRANG CHỤP ẢNH - navigation trực tiếp
    const handleUploadPhoto = (type: 'before' | 'after') => {
        if (!booking) return;

        // Map button -> backend image type
        const typeMapping: { [key: string]: string } = {
            'before': 'BEFORE_RENTAL',
            'after': 'AFTER_RENTAL'
        };

        const targetImageType = typeMapping[type];
        navigate(`/staff/booking/${booking.bookingId}/photo/${targetImageType}`);
    };

    // Handler cho Report - navigation trực tiếp
    const handleCreateReport = () => {
        if (!booking) return;
        const targetImageType = 'DAMAGE';
        navigate(`/staff/booking/${booking.bookingId}/photo/${targetImageType}`);
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
                                    <tr><td className="fw-medium">ID Người Thuê</td><td>{booking.renterId}</td></tr>
                                    <tr><td className="fw-medium">Tên Nhân viên</td><td>{booking.staffName}</td></tr>
                                    <tr><td className="fw-medium">Trạng thái</td><td><span className="badge bg-info">{booking.status}</span></td></tr>
                                    <tr><td className="fw-medium">Trạng thái đặt cọc</td><td><span className="badge bg-success">{booking.depositStatus}</span></td></tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <Table bordered hover size="sm" className="bg-white">
                                <tbody>
                                    <tr><td className="fw-medium">Tên Xe</td><td>{booking.vehicleName}</td></tr>
                                    <tr><td className="fw-medium">Bắt đầu</td><td>{new Date(booking.startDateTime).toLocaleString()}</td></tr>
                                    <tr><td className="fw-medium">Kết thúc</td><td>{new Date(booking.endDateTime).toLocaleString()}</td></tr>
                                    <tr><td className="fw-medium">Giá/Giờ</td><td>{formatCurrency(booking.priceSnapshotPerHour)}</td></tr>
                                    <tr><td className="fw-medium">Giá/Ngày</td><td>{formatCurrency(booking.priceSnapshotPerDay)}</td></tr>
                                    <tr><td className="fw-medium">Tổng tiền</td><td className="fw-bold text-danger">{formatCurrency(booking.totalAmount)}</td></tr>
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

                    {/* HIỂN THỊ ẢNH ĐÃ UPLOAD */}
                    <Row className="mt-4">
                        <Col md={6}>
                            <h6 className="fw-bold mb-3">📸 Ảnh trước khi thuê ({beforeImages.length})</h6>
                            {beforeImages.length === 0 ? (
                                <Alert variant="secondary">Chưa có ảnh nào được upload</Alert>
                            ) : (
                                <div>
                                    {beforeImages.map((img) => (
                                        <Card key={img.imageId} className="mb-3">
                                            <Card.Body>
                                                <img 
                                                    src={img.imageUrl} 
                                                    alt={img.vehicleComponent} 
                                                    className="img-fluid mb-2" 
                                                    style={{ maxHeight: '200px', width: '100%', objectFit: 'cover', borderRadius: 8 }}
                                                />
                                                <p className="mb-1"><strong>Hạng mục:</strong> {img.vehicleComponent}</p>
                                                {img.description && (
                                                    <p className="mb-0 text-muted"><strong>Mô tả:</strong> {img.description}</p>
                                                )}
                                                <small className="text-muted">
                                                    Ngày chụp: {new Date(img.createdAt).toLocaleString()}
                                                </small>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Col>
                        
                        <Col md={6}>
                            <h6 className="fw-bold mb-3">📷 Ảnh sau khi trả ({afterImages.length})</h6>
                            {afterImages.length === 0 ? (
                                <Alert variant="secondary">Chưa có ảnh nào được upload</Alert>
                            ) : (
                                <div>
                                    {afterImages.map((img) => (
                                        <Card key={img.imageId} className="mb-3">
                                            <Card.Body>
                                                <img 
                                                    src={img.imageUrl} 
                                                    alt={img.vehicleComponent} 
                                                    className="img-fluid mb-2" 
                                                    style={{ maxHeight: '200px', width: '100%', objectFit: 'cover', borderRadius: 8 }}
                                                />
                                                <p className="mb-1"><strong>Hạng mục:</strong> {img.vehicleComponent}</p>
                                                {img.description && (
                                                    <p className="mb-0 text-muted"><strong>Mô tả:</strong> {img.description}</p>
                                                )}
                                                <small className="text-muted">
                                                    Ngày chụp: {new Date(img.createdAt).toLocaleString()}
                                                </small>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Col>
                    </Row>

                </Card.Body>
                <Card.Footer className="text-center text-muted">Booking Management System</Card.Footer>
            </Card>
        </Container>
    );
}

export default BookingDetail;