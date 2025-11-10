import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingDetail, deleteBookingImage, uploadCarImage } from './services/authServices';
import { toast } from 'react-toastify';
import axios from 'axios';

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
    vehicleComponent: string; // Tên phụ tùng
}

// Danh sách giả định các phụ tùng xe cần kiểm tra
// Trong thực tế, bạn có thể fetch danh sách này từ API
const VEHICLE_COMPONENTS = [
    'Tất cả phụ tùng',
    'Thân xe (ngoài)',
    'Nội thất',
    'Động cơ',
    'Bánh xe/Lốp',
    'Đèn/Gương',
    'Khác'
];

interface FinalInvoice {
    invoiceId: number;
    bookingId: number;
    type: string;
    totalAmount: number;
    amountRemaining: number;
    status: string;
    paymentMethod: string;
    notes: string;
    createdAt: string;
}

function BookingDetail() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const bookingIdNumber = bookingId ? parseInt(bookingId) : 0;

    const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
    const [beforeImages, setBeforeImages] = useState<BookingImage[]>([]);
    const [afterImages, setAfterImages] = useState<BookingImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [invoice, setInvoice] = useState<FinalInvoice | null>(null);
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
    const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);

    // State cho Select Box Phụ tùng
    const [selectedComponent, setSelectedComponent] = useState(VEHICLE_COMPONENTS[0]);
    
    // Ref cho input file ẩn (dùng cho update ảnh)
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

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

            try {
                const response = await getBookingDetail(bookingIdNumber);
                if (response?.data?.data) {
                    const bookingData = response.data.data;
                    setBooking(bookingData);

                    // Phân loại ảnh theo imageType
                    const before = bookingData.bookingImages.filter((img: BookingImage) => img.imageType === 'BEFORE_RENTAL');
                    const after = bookingData.bookingImages.filter((img: BookingImage) => img.imageType === 'AFTER_RENTAL');

                    setBeforeImages(before);
                    setAfterImages(after);

                } else {
                    setError("Không thể tải chi tiết Booking. Vui lòng thử lại.");
                }
            } catch (err) {
                console.error("Lỗi tải chi tiết booking:", err);
                setError("Đã xảy ra lỗi trong quá trình tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [bookingIdNumber]);

    // Lọc ảnh theo phụ tùng được chọn
    const filteredBeforeImages = beforeImages.filter(img =>
        selectedComponent === VEHICLE_COMPONENTS[0] || img.vehicleComponent === selectedComponent
    );

    const filteredAfterImages = afterImages.filter(img =>
        selectedComponent === VEHICLE_COMPONENTS[0] || img.vehicleComponent === selectedComponent
    );


    // HANDLER CHUYỂN HƯỚNG ĐẾN TRANG CHỤP ẢNH
    const handleUploadPhoto = (type: 'before' | 'after') => {
        if (!booking) return;

        const typeMapping: { [key: string]: string } = {
            'before': 'BEFORE_RENTAL',
            'after': 'AFTER_RENTAL'
        };

        const targetImageType = typeMapping[type];
        navigate(`/staff/booking/${booking.bookingId}/photo/${targetImageType}`);
    };

    // Handler cho Report
    const handleCreateReport = () => {
        if (!booking) return;
        const targetImageType = 'DAMAGE';
        navigate(`/staff/booking/${booking.bookingId}/photo/${targetImageType}`);
    };

    // Handler xóa ảnh
    const handleDeleteImage = async (imageId: number, imageType: 'BEFORE_RENTAL' | 'AFTER_RENTAL') => {
        if (!booking || !window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;

        try {
            setDeletingImageId(imageId);
            await deleteBookingImage(booking.bookingId, imageId);
            
            // Cập nhật state sau khi xóa thành công
            if (imageType === 'BEFORE_RENTAL') {
                setBeforeImages(prev => prev.filter(img => img.imageId !== imageId));
            } else {
                setAfterImages(prev => prev.filter(img => img.imageId !== imageId));
            }
            
            toast.success('Đã xóa ảnh thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa ảnh:', error);
            toast.error('Không thể xóa ảnh. Vui lòng thử lại.');
        } finally {
            setDeletingImageId(null);
        }
    };

    // Handler mở dialog chọn file để update ảnh
    const handleUpdateImageClick = (imageId: number) => {
        const inputRef = fileInputRefs.current[imageId];
        if (inputRef) {
            inputRef.click();
        }
    };

    // Handler upload ảnh mới (update)
    const handleUpdateImage = async (
        imageId: number, 
        file: File, 
        imageType: 'BEFORE_RENTAL' | 'AFTER_RENTAL',
        vehicleComponent: string,
        description: string
    ) => {
        if (!booking) return;

        try {
            setUploadingImageId(imageId);
            
            // Xóa ảnh cũ trước
            await deleteBookingImage(booking.bookingId, imageId);
            
            // Upload ảnh mới
            const response = await uploadCarImage(
                booking.bookingId,
                imageType,
                vehicleComponent,
                description,
                file
            );

            if (response?.data?.data?.imageUrl) {
                // Tạo object ảnh mới
                const newImage: BookingImage = {
                    imageId: Date.now(), // Tạm thời dùng timestamp, backend sẽ trả về ID thật
                    imageUrl: response.data.data.imageUrl,
                    description: description,
                    createdAt: new Date().toISOString(),
                    imageType: imageType,
                    vehicleComponent: vehicleComponent
                };

                // Cập nhật state với ảnh mới
                if (imageType === 'BEFORE_RENTAL') {
                    setBeforeImages(prev => prev.map(img => 
                        img.imageId === imageId ? newImage : img
                    ));
                } else {
                    setAfterImages(prev => prev.map(img => 
                        img.imageId === imageId ? newImage : img
                    ));
                }

                toast.success('Đã cập nhật ảnh thành công!');
                
                // Reload lại data để đồng bộ với server
                window.location.reload();
            } else {
                toast.error('Upload ảnh mới thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật ảnh:', error);
            toast.error('Không thể cập nhật ảnh. Vui lòng thử lại.');
        } finally {
            setUploadingImageId(null);
        }
    };


    // Handler cho Hủy Booking (Xác nhận và gọi API hủy)
    const handleCancelBooking = () => {
        if (!booking) return;
        if (window.confirm(`Bạn có chắc chắn muốn HỦY Booking #${booking.bookingId} không?`)) {
            // TODO: Triển khai gọi API hủy booking tại đây
            alert(`Tính năng hủy booking #${booking.bookingId} đang được phát triển...`);
            // Sau khi hủy thành công:
            // navigate('/staff/list-bookings'); 
        }
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

                    <h4 className="fw-bold mt-4 mb-3 border-bottom pb-2">Thủ tục Check-in/Check-out & Hành động</h4>

                    {/* NÚT HÀNH ĐỘNG MỚI */}
                    <Row className="mb-4 justify-content-center">
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="secondary" className="w-100" onClick={() => handleUploadPhoto('before')}>
                                <b>Ảnh chụp trước khi thuê</b>
                            </Button>
                        </Col>
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="warning" className="w-100" onClick={handleCreateReport}>
                                <b>Report</b> (Báo cáo hư hỏng/sự cố)
                            </Button>
                        </Col>
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="secondary" className="w-100" onClick={() => handleUploadPhoto('after')}>
                                <b>Ảnh chụp sau khi trả</b>
                            </Button>
                        </Col>
                    </Row>

                    {/* HÀNG NÚT HÀNH ĐỘNG THỨ HAI */}
                    <Row className="mb-4 justify-content-center">
                        <Col xs={12} md={6} className="mb-2">
                            {/* Logic hiển thị nút Tạo Hóa đơn (chỉ khi hoàn tất trả xe) */}
                            <Button
                                variant="success"
                                className="w-100"
                                
                                disabled={booking.status !== 'COMPLETED' || booking.actualReturnTime === null} // Chỉ cho phép tạo HĐ khi xe đã trả (COMPLETED)
                            >
                                Tạo Hóa đơn
                            </Button>
                        </Col>
                        <Col xs={12} md={6} className="mb-2">
                            {/* Logic hiển thị nút Hủy Booking */}
                            <Button
                                variant="danger"
                                className="w-100"
                                onClick={handleCancelBooking}
                                disabled={booking.status === 'COMPLETED' || booking.status === 'CANCELLED'} // Không cho hủy nếu đã hoàn thành hoặc đã hủy
                            >
                                Hủy
                            </Button>
                        </Col>
                    </Row>


                    {/* SELECT BOX PHỤ TÙNG */}
                    <Row className="mt-4 mb-3">
                        <Col>
                            <h6 className="fw-bold mb-2">Lọc ảnh theo Phụ tùng</h6>
                            <Form.Select
                                value={selectedComponent}
                                onChange={(e) => setSelectedComponent(e.target.value)}
                                aria-label="Lọc ảnh theo phụ tùng xe"
                            >
                                {VEHICLE_COMPONENTS.map(component => (
                                    <option key={component} value={component}>
                                        {component}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* HIỂN THỊ ẢNH ĐÃ UPLOAD (ĐÃ LỌC) */}
                    <Row className="mt-4">
                        <Col md={6}>
                            <h6 className="fw-bold mb-3">📷 Ảnh trước khi thuê ({filteredBeforeImages.length})</h6>
                            {filteredBeforeImages.length === 0 ? (
                                <Alert variant="secondary">Chưa có ảnh nào được upload cho hạng mục này.</Alert>
                            ) : (
                                <div>
                                    {filteredBeforeImages.map((img) => (
                                        <Card key={img.imageId} className="mb-3 shadow-sm">
                                            <Card.Body>
                                                <img
                                                    src={img.imageUrl}
                                                    alt={img.vehicleComponent}
                                                    className="img-fluid mb-2"
                                                    style={{ maxHeight: '200px', width: '100%', objectFit: 'cover', borderRadius: 8 }}
                                                />
                                                <p className="mb-1"><strong>Hạng mục:</strong> {img.vehicleComponent}</p>
                                                {img.description && (
                                                    <p className="mb-2 text-muted"><strong>Mô tả:</strong> {img.description}</p>
                                                )}
                                                <small className="text-muted d-block mb-2">
                                                    Ngày chụp: {new Date(img.createdAt).toLocaleString()}
                                                </small>
                                                
                                                {/* Nút hành động */}
                                                <div className="d-flex gap-2 mt-2">
                                                    <Button 
                                                        variant="warning" 
                                                        size="sm"
                                                        onClick={() => handleUpdateImageClick(img.imageId)}
                                                        disabled={uploadingImageId === img.imageId || deletingImageId === img.imageId}
                                                    >
                                                        {uploadingImageId === img.imageId ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-1" />
                                                                Đang cập nhật...
                                                            </>
                                                        ) : (
                                                            '🔄 Cập nhật'
                                                        )}
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleDeleteImage(img.imageId, 'BEFORE_RENTAL')}
                                                        disabled={uploadingImageId === img.imageId || deletingImageId === img.imageId}
                                                    >
                                                        {deletingImageId === img.imageId ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-1" />
                                                                Đang xóa...
                                                            </>
                                                        ) : (
                                                            '🗑️ Xóa'
                                                        )}
                                                    </Button>
                                                </div>
                                                
                                                {/* Input file ẩn cho update */}
                                                <input
                                                    ref={(el) => { fileInputRefs.current[img.imageId] = el; }}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleUpdateImage(
                                                                img.imageId, 
                                                                e.target.files[0], 
                                                                'BEFORE_RENTAL',
                                                                img.vehicleComponent,
                                                                img.description
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Col>

                        <Col md={6}>
                            <h6 className="fw-bold mb-3">📷 Ảnh sau khi trả ({filteredAfterImages.length})</h6>
                            {filteredAfterImages.length === 0 ? (
                                <Alert variant="secondary">Chưa có ảnh nào được upload cho hạng mục này.</Alert>
                            ) : (
                                <div>
                                    {filteredAfterImages.map((img) => (
                                        <Card key={img.imageId} className="mb-3 shadow-sm">
                                            <Card.Body>
                                                <img
                                                    src={img.imageUrl}
                                                    alt={img.vehicleComponent}
                                                    className="img-fluid mb-2"
                                                    style={{ maxHeight: '200px', width: '100%', objectFit: 'cover', borderRadius: 8 }}
                                                />
                                                <p className="mb-1"><strong>Hạng mục:</strong> {img.vehicleComponent}</p>
                                                {img.description && (
                                                    <p className="mb-2 text-muted"><strong>Mô tả:</strong> {img.description}</p>
                                                )}
                                                <small className="text-muted d-block mb-2">
                                                    Ngày chụp: {new Date(img.createdAt).toLocaleString()}
                                                </small>
                                                
                                                {/* Nút hành động */}
                                                <div className="d-flex gap-2 mt-2">
                                                    <Button 
                                                        variant="warning" 
                                                        size="sm"
                                                        onClick={() => handleUpdateImageClick(img.imageId)}
                                                        disabled={uploadingImageId === img.imageId || deletingImageId === img.imageId}
                                                    >
                                                        {uploadingImageId === img.imageId ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-1" />
                                                                Đang cập nhật...
                                                            </>
                                                        ) : (
                                                            '🔄 Cập nhật'
                                                        )}
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleDeleteImage(img.imageId, 'AFTER_RENTAL')}
                                                        disabled={uploadingImageId === img.imageId || deletingImageId === img.imageId}
                                                    >
                                                        {deletingImageId === img.imageId ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-1" />
                                                                Đang xóa...
                                                            </>
                                                        ) : (
                                                            '🗑️ Xóa'
                                                        )}
                                                    </Button>
                                                </div>
                                                
                                                {/* Input file ẩn cho update */}
                                                <input
                                                    ref={(el) => { fileInputRefs.current[img.imageId] = el; }}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleUpdateImage(
                                                                img.imageId, 
                                                                e.target.files[0], 
                                                                'AFTER_RENTAL',
                                                                img.vehicleComponent,
                                                                img.description
                                                            );
                                                        }
                                                    }}
                                                />
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