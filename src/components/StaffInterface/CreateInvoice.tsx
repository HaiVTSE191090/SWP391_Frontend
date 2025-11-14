import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingDetail, getImageChecklist } from './services/authServices';
import { toast } from 'react-toastify';
import axios from 'axios';

// Interface cho dữ liệu booking
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
    status: string;
    depositStatus: string;
    createdAt: string;
    updatedAt: string;
    bookingImages: BookingImage[];
}

interface BookingImage {
    imageId: number;
    imageUrl: string;
    description: string;
    createdAt: string;
    imageType: 'BEFORE_RENTAL' | 'AFTER_RENTAL' | 'DAMAGE';
    vehicleComponent: string;
}

function CreateInvoice() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const bookingIdNumber = bookingId ? parseInt(bookingId) : 0;
    const navigate = useNavigate();

    const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        batteryLevel: 100,
        mileage: 0,
        hasDamage: false,
        damageDescription: '',
        damageFee: 0,
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const [canConfirmReturn, setCanConfirmReturn] = useState(false);
    const [checkingImages, setCheckingImages] = useState(false);

    // Fetch booking detail
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
                    setBooking(response.data.data);
                    checkImagesComplete(response.data.data);
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

    // Kiểm tra ảnh trước và sau thuê đã đầy đủ chưa
    const checkImagesComplete = async (bookingData: BookingDetailResponse) => {
        setCheckingImages(true);
        try {
            // Kiểm tra ảnh BEFORE_RENTAL
            const beforeChecklistRes = await getImageChecklist(bookingData.bookingId, 'BEFORE_RENTAL');
            const beforeComplete = beforeChecklistRes?.data?.data?.isComplete || false;

            // Kiểm tra ảnh AFTER_RENTAL
            const afterChecklistRes = await getImageChecklist(bookingData.bookingId, 'AFTER_RENTAL');
            const afterComplete = afterChecklistRes?.data?.data?.isComplete || false;

            // Chỉ cho phép xác nhận trả xe khi cả 2 loại ảnh đều đã hoàn thành
            setCanConfirmReturn(beforeComplete && afterComplete);

            if (!beforeComplete || !afterComplete) {
                toast.warning(
                    `⚠️ Chưa đủ ảnh để xác nhận trả xe!\n` +
                    `BEFORE_RENTAL: ${beforeComplete ? '✓' : '✗'}\n` +
                    `AFTER_RENTAL: ${afterComplete ? '✓' : '✗'}`
                );
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra ảnh:', error);
            setCanConfirmReturn(false);
        } finally {
            setCheckingImages(false);
        }
    };

    // Handler xác nhận trả xe
    const handleConfirmReturn = () => {
        if (!booking) return;
        if (!canConfirmReturn) {
            toast.error('❌ Chưa đủ ảnh BEFORE_RENTAL và AFTER_RENTAL để xác nhận trả xe!');
            return;
        }
        setShowModal(true); // mở modal nhập thông tin
    };


    // Loading/Error states
    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /> Đang tải thông tin booking...</Container>;
    if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!booking) return <Container className="py-5 text-center">Không tìm thấy thông tin booking.</Container>;

    // Format tiền tệ
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Lọc ảnh theo loại
    const beforeImages = booking.bookingImages.filter(img => img.imageType === 'BEFORE_RENTAL');
    const afterImages = booking.bookingImages.filter(img => img.imageType === 'AFTER_RENTAL');

    return (
        <Container className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center fw-bold text-primary">Tạo Hóa Đơn - Booking #{booking.bookingId}</h2>
                    <p className="text-center text-muted">Xác nhận trả xe và tạo hóa đơn thanh toán</p>
                </Col>
            </Row>

            <Card className="shadow-lg mb-4">
                <Card.Body>
                    <h4 className="fw-bold mb-4 border-bottom pb-2">Thông tin Booking</h4>
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

                    <h4 className="fw-bold mt-4 mb-3 border-bottom pb-2">Trạng thái Ảnh</h4>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Card className={beforeImages.length > 0 ? 'border-success' : 'border-warning'}>
                                <Card.Body>
                                    <h6 className="fw-bold">
                                        📷 Ảnh trước khi thuê
                                        <span className={`badge ms-2 ${beforeImages.length > 0 ? 'bg-success' : 'bg-warning'}`}>
                                            {beforeImages.length} ảnh
                                        </span>
                                    </h6>
                                    {beforeImages.length === 0 && (
                                        <small className="text-muted">Chưa có ảnh nào được upload</small>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className={afterImages.length > 0 ? 'border-success' : 'border-warning'}>
                                <Card.Body>
                                    <h6 className="fw-bold">
                                        📷 Ảnh sau khi trả
                                        <span className={`badge ms-2 ${afterImages.length > 0 ? 'bg-success' : 'bg-warning'}`}>
                                            {afterImages.length} ảnh
                                        </span>
                                    </h6>
                                    {afterImages.length === 0 && (
                                        <small className="text-muted">Chưa có ảnh nào được upload</small>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Nút hành động */}
                    <Row className="mt-4">
                        <Col xs={12} md={6} className="mb-2">
                            <Button
                                variant="secondary"
                                className="w-100"
                                onClick={() => navigate(-1)}
                            >
                                ⬅️ Quay lại
                            </Button>
                        </Col>
                        <Col xs={12} md={6} className="mb-2">
                            <Button
                                variant="success"
                                className="w-100"
                                onClick={handleConfirmReturn}
                                disabled={!canConfirmReturn || checkingImages}
                            >
                                {checkingImages ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Đang kiểm tra...
                                    </>
                                ) : (
                                    <>✅ Xác nhận trả xe và tạo hóa đơn</>
                                )}
                            </Button>
                        </Col>
                    </Row>

                    {!canConfirmReturn && !checkingImages && (
                        <Alert variant="warning" className="mt-3 mb-0">
                            <small>
                                <strong>⚠️ Lưu ý:</strong> Nút "Xác nhận trả xe" chỉ được kích hoạt khi đã có đầy đủ ảnh BEFORE_RENTAL và AFTER_RENTAL.
                            </small>
                        </Alert>
                    )}

                </Card.Body>
                <Card.Footer className="text-center text-muted">Invoice Management System</Card.Footer>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>📋 Nhập thông tin trả xe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Mức pin hiện tại (%)</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                max={100}
                                value={formData.batteryLevel}
                                onChange={(e) => setFormData({ ...formData, batteryLevel: Number(e.target.value) })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số km đã đi</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                value={formData.mileage}
                                onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Xe có hư hại"
                                checked={formData.hasDamage}
                                onChange={(e) => setFormData({ ...formData, hasDamage: e.target.checked })}
                            />
                        </Form.Group>

                        {formData.hasDamage && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mô tả hư hại</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.damageDescription}
                                        onChange={(e) => setFormData({ ...formData, damageDescription: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phí hư hại (VNĐ)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        value={formData.damageFee}
                                        onChange={(e) => setFormData({ ...formData, damageFee: Number(e.target.value) })}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú thêm</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button
                        variant="success"
                        onClick={async () => {
                            setSubmitting(true);
                            try {
                                const response = await axios.post(
                                    `http://localhost:8080/api/bookings/${booking?.bookingId}/return`,
                                    formData,
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem("token")}`
                                        }
                                    }
                                );
                                toast.success("✅ Cập nhật thông tin xe thành công!");
                                setShowModal(false);
                                // navigate(`/staff/invoice/create/${booking?.bookingId}`);
                            } catch (error) {
                                console.error(error);
                                toast.error("❌ Lỗi khi xác nhận trả xe!");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                        disabled={submitting}
                    >
                        {submitting ? <Spinner animation="border" size="sm" /> : "Xác nhận trả xe"}
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>

    );
}

export default CreateInvoice;
