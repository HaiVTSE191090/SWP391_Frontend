import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup, Form, InputGroup, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getContractTermsTemplate,
    getBookingInfoForContract,
    createContract,
    sendContractToAdmin,
    getUserName
} from './services/authServices';

// --- Định nghĩa Interfaces (Giữ nguyên) ---
interface TermCondition {
    termNumber: number;
    termTitle: string;
    termContent: string;
}

interface BookingInfo {
    bookingId: number;
    vehicleName: string;
    vehiclePlate: string;
    stationName: string;
    renterName: string;
    renterEmail: string;
    renterPhone: string;
    staffName: string;
    bookingStatus: string;
    startDateTime: string;
    endDateTime: string;
    pricePerDay: number;
    depositAmount: number;
    contractId: number | null;
    renterId: number;
    vehicleId: number;
    // Các trường khác được sử dụng trong fetchData nhưng không khai báo trong interface chính
    renterIdentityCard?: string;
    staffCCCD?: string;
    staffBirthYear?: number;
    renterBirthYear?: number;
}

// Định nghĩa kiểu dữ liệu cho Toast state
interface ToastState {
    show: boolean;
    message: string;
    variant: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary' | 'light' | 'dark';
}
// --- Kết thúc Interfaces ---


const CreateContract: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const id = Number(bookingId);
    const navigate = useNavigate();

    const currentStaffName = getUserName();

    const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
    const [terms, setTerms] = useState<TermCondition[]>([]);
    const [editableTerms, setEditableTerms] = useState<TermCondition[]>([]);

    const [loading, setLoading] = useState(true);

    const [contractId, setContractId] = useState<number | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);

    const [notes, setNotes] = useState<string>('');
    const [deposit, setDeposit] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // STATE MỚI: Quản lý Toast
    const [appToast, setAppToast] = useState<ToastState>({
        show: false,
        message: "",
        variant: "info",
    });

    /**
     * HÀM MỚI: Hiển thị Toast với nội dung và màu sắc
     */
    const showToast = useCallback((message: string, variant: ToastState['variant']) => {
        // Đặt show=true, nội dung và variant mới để kích hoạt Toast
        setAppToast({ show: true, message, variant });
    }, []);

    // --- HÀM TÁCH BIỆT: Fetch Dữ liệu ---
    const fetchData = useCallback(async () => {
        if (!id || isNaN(id)) {
            showToast('ID Booking không hợp lệ.', 'danger'); // Dùng Toast
            setLoading(false);
            return;
        }

        setLoading(true);
        // setError(''); // Loại bỏ setError

        try {
            // TOAST INFO: Đang tải dữ liệu
            showToast('Đang tải thông tin Booking và Điều khoản...', 'info');

            const bookingResponse = await getBookingInfoForContract(id);
            const apiData = bookingResponse?.data?.data || {};

            // Xử lý logic gán dữ liệu
            const info: BookingInfo = {
                ...apiData,
                renterId: apiData.renterId,
                vehicleId: apiData.vehicleId,
                // Gán các trường bổ sung
                renterIdentityCard: apiData.renterIdentityCard,
                staffCCCD: apiData.staffCCCD,
                staffBirthYear: apiData.staffBirthYear,
                renterBirthYear: apiData.renterBirthYear,
                staffName: currentStaffName,
            } as BookingInfo;

            if (info && info.bookingId) {
                setBookingInfo(info);
                setContractId(info.contractId || null);

                // Tính toán giá trị (Giữ nguyên)
                setDeposit(info.depositAmount || 0);
                const start = new Date(info.startDateTime);
                const end = new Date(info.endDateTime);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setTotalPrice(diffDays * (info.pricePerDay || 0));
            } else {
                throw new Error('Không tìm thấy thông tin Booking.');
            }

            const termsResponse = await getContractTermsTemplate();
            setTerms(termsResponse?.data?.data || []);

            // Tắt Toast Info sau khi tải xong
            setAppToast(prev => ({ ...prev, show: false }));

        } catch (err) {
            setAppToast(prev => ({ ...prev, show: false })); // Tắt info toast
            const errorMessage = (err as any).response?.data?.message || 'Không thể tải dữ liệu để tạo hợp đồng.';
            showToast(errorMessage, 'danger'); // Dùng Toast Lỗi
        } finally {
            setLoading(false);
        }
    }, [id, currentStaffName, showToast]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Khởi tạo và Cập nhật Điều khoản
    useEffect(() => {
        if (terms.length > 0) {
            setEditableTerms(terms.map(term => ({ ...term })));
        }
    }, [terms]);

    const updateTerm = useCallback((index: number, key: keyof TermCondition, value: string | number) => {
        setEditableTerms(prevTerms =>
            prevTerms.map((term, i) =>
                i === index ? { ...term, [key]: value } : term
            )
        );
    }, []);

    const handleTermContentChange = (index: number, newContent: string) => {
        updateTerm(index, 'termContent', newContent);
    };

    const handleTermTitleChange = (index: number, newTitle: string) => {
        updateTerm(index, 'termTitle', newTitle);
    };

    const handleAddTerm = () => {
        const newTermNumber = editableTerms.length + 1;
        const newTerm: TermCondition = {
            termNumber: newTermNumber,
            termTitle: `Điều khoản ${newTermNumber} (Mới)`,
            termContent: 'Nhập nội dung cho điều khoản mới này...'
        };
        setEditableTerms(prevTerms => [...prevTerms, newTerm]);
    };

    // --- 2. Handler Tạo Hợp đồng (Bước 1: createContract) ---
    const handleCreateContract = async () => {
        setIsSending(true);
        // setError(''); // Loại bỏ setError

        if (!bookingInfo) {
            setIsSending(false);
            showToast('Thiếu thông tin Booking cần thiết.', 'danger'); // Dùng Toast Lỗi
            return;
        }

        try {
            // TOAST INFO: Đang gửi yêu cầu tạo hợp đồng
            showToast("Đang gửi yêu cầu tạo Hợp đồng...", "info");

            // PAYLOAD TỐI GIẢN CHÍNH XÁC THEO YÊU CẦU CỦA BE
            const payload = {
                bookingId: id,
                contractType: "ELECTRONIC",

                renterId: bookingInfo.renterId,
                vehicleId: bookingInfo.vehicleId,
                depositAmount: deposit,
                totalPrice: totalPrice,
                notes: notes,
                staffName: currentStaffName,

                terms: editableTerms.map(term => ({
                    termNumber: term.termNumber,
                    termTitle: term.termTitle,
                    termContent: term.termContent
                })),
            };

            const response = await createContract(payload);
            const newContractId = response.data?.data?.contractId;

            // Ẩn toast info
            setAppToast(prev => ({ ...prev, show: false }));

            if (newContractId) {
                setContractId(newContractId);
                // THAY THẾ alert() BẰNG TOAST SUCCESS (Màu Xanh Lá)
                showToast(`Hợp đồng ID ${newContractId} đã được tạo thành công!`, 'success');
            } else {
                showToast('Tạo hợp đồng thành công nhưng không nhận được Contract ID.', 'warning');
            }

        } catch (err) {
            setAppToast(prev => ({ ...prev, show: false })); // Ẩn toast info
            const errorMessage = (err as any).response?.data?.message || 'Lỗi: Không thể tạo hợp đồng.';
            showToast(errorMessage, 'danger'); // Dùng Toast Lỗi
        } finally {
            setIsSending(false);
        }
    };

    // --- 3. Handler Gửi Admin (Bước 2: sendContractToAdmin) ---
    const handleSendToAdmin = async () => {
        if (!contractId) {
            showToast('Không tìm thấy Contract ID để gửi.', 'danger');
            return;
        }

        setIsSending(true);
        // setError(''); // Loại bỏ setError

        try {
            // TOAST INFO: Đang gửi Admin
            showToast("Đang gửi Hợp đồng đến Admin...", "info");

            await sendContractToAdmin(contractId);

            // Ẩn toast info
            setAppToast(prev => ({ ...prev, show: false }));

            setIsSent(true);
            // KHÔNG DÙNG MODAL NỮA, DÙNG TOAST
            showToast(`Hợp đồng ID ${contractId} đã được gửi thành công đến Admin để ký duyệt!`, 'success');

            // Chuyển hướng sau khi toast kịp hiển thị
            setTimeout(() => {
                navigate('/staff/bookings');
            }, 3000);

        } catch (err) {
            setAppToast(prev => ({ ...prev, show: false })); // Ẩn toast info
            const errorMessage = (err as any).response?.data?.message || 'Lỗi khi gửi Hợp đồng đến Admin.';
            showToast(errorMessage, 'danger'); // Dùng Toast Lỗi
        } finally {
            setIsSending(false);
        }
    };

    // --- UI Renders (Điều chỉnh loại bỏ SuccessModal) ---

    // Loại bỏ SuccessModal

    const renderActionButton = () => {
        // ... (Giữ nguyên logic render nút)
        if (isSent) {
            return (
                <Button variant="success" size="lg" disabled>
                    Đã gửi Admin
                </Button>
            );
        }
        if (contractId) {
            return (
                <Button
                    variant="warning"
                    size="lg"
                    onClick={handleSendToAdmin}
                    disabled={isSending}
                >
                    {isSending ? <Spinner size="sm" animation="border" /> : 'Gửi Hợp đồng cho Admin'}
                </Button>
            );
        }
        return (
            <Button
                variant="primary"
                size="lg"
                onClick={handleCreateContract}
                disabled={isSending || !bookingInfo || terms.length === 0}
            >
                {isSending ? <Spinner size="sm" animation="border" /> : ' Lập & Lưu Hợp đồng'}
            </Button>
        );
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="info" />
                <p className="mt-3">Đang chuẩn bị dữ liệu Hợp đồng...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa' }}>

            {/* 💡 TOAST CONTAINER CỦA REACT-BOOTSTRAP (MỚI) */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
                <Toast
                    bg={appToast.variant}
                    onClose={() => setAppToast(prev => ({ ...prev, show: false }))}
                    show={appToast.show}
                    // Toast Info (đang xử lý) sẽ không tự đóng
                    delay={appToast.variant === 'info' ? undefined : 3000}
                    autohide={appToast.variant !== 'info'}
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {appToast.variant === 'success' ? 'Thành công' :
                                appToast.variant === 'info' ? 'Đang xử lý' : 'Lỗi/Cảnh báo'}
                        </strong>
                        <small>{new Date().toLocaleTimeString('vi-VN')}</small>
                    </Toast.Header>
                    {/* Đảm bảo chữ trắng trừ trường hợp Toast màu Light */}
                    <Toast.Body className={appToast.variant === 'light' ? 'text-dark' : 'text-white'}>
                        {appToast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Row className="mb-4">
                <Col>
                    <h2 className="text-primary"> Tạo Hợp đồng Thuê Xe (Booking ID: {id})</h2>
                </Col>
            </Row>

            {/* Loại bỏ Alert cũ, chỉ dùng Toast cho thông báo lỗi */}
            {/* {error && <Alert variant="danger" className="shadow-sm">{error}</Alert>} */}

            <Row>
                {/* Cột trái: Thông tin Booking (Readonly) */}
                <Col lg={5} className="mb-4">
                    <Card className="shadow-sm border-0">
                        <Card.Header as="h5" className="bg-primary text-white">
                            Thông tin Booking {contractId && `(Hợp đồng ID: ${contractId})`}
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Tên Staff:</strong> {bookingInfo?.staffName || 'N/A'}</ListGroup.Item>
                                <ListGroup.Item><strong>Trạng thái:</strong> {bookingInfo?.bookingStatus || 'N/A'}</ListGroup.Item>
                                <ListGroup.Item><strong>Tên KH:</strong> {bookingInfo?.renterName || 'N/A'}</ListGroup.Item>
                                <ListGroup.Item><strong>Email KH:</strong> {bookingInfo?.renterEmail || 'N/A'}</ListGroup.Item>
                                <ListGroup.Item><strong>Phone KH:</strong> {bookingInfo?.renterPhone || 'N/A'}</ListGroup.Item>
                                <ListGroup.Item><strong>Tên xe:</strong> {bookingInfo?.vehicleName || 'N/A'}</ListGroup.Item>
                                <ListGroup.Item><strong>Biển số:</strong> {bookingInfo?.vehiclePlate || 'N/A'}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cột phải: Các Điều khoản (Editable) và Nút Hành động */}
                <Col lg={7}>
                    <Card className="shadow-sm border-0">
                        <Card.Header as="h5" className="bg-secondary text-white d-flex justify-content-between align-items-center">
                            Chỉnh sửa Điều khoản Hợp đồng
                            <Button variant="outline-light" size="sm" onClick={handleAddTerm}>
                                + Thêm Điều khoản
                            </Button>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <Form>
                                {/* VÒNG LẶP CHO PHÉP CHỈNH SỬA NỘI DUNG VÀ TIÊU ĐỀ ĐIỀU KHOẢN */}
                                {editableTerms.map((term, index) => (
                                    <div key={index} className="mb-4 p-3 border rounded bg-light">
                                        <Row className="mb-2 align-items-center">
                                            <Col xs={1} className='fw-bold text-dark'>{term.termNumber}.</Col>
                                            <Col xs={11}>
                                                <Form.Control
                                                    type="text"
                                                    className="fw-bold"
                                                    value={term.termTitle}
                                                    onChange={(e) => handleTermTitleChange(index, e.target.value)}
                                                    placeholder={`Tiêu đề điều khoản ${term.termNumber}`}
                                                />
                                            </Col>
                                        </Row>
                                        <Form.Control
                                            as="textarea"
                                            rows={Math.max(3, Math.ceil(term.termContent.length / 80))}
                                            value={term.termContent}
                                            onChange={(e) => handleTermContentChange(index, e.target.value)}
                                            placeholder="Nhập nội dung điều khoản..."
                                        />
                                    </div>
                                ))}

                                {terms.length === 0 && <Alert variant="info" className="text-center">Không có điều khoản mẫu nào để chỉnh sửa.</Alert>}

                                <h5 className="mt-4 mb-3 text-secondary">Ghi chú (Tùy chọn)</h5>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Thêm ghi chú đặc biệt cho hợp đồng này..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </Form>
                        </Card.Body>

                        <Card.Footer className='d-flex justify-content-end'>
                            {renderActionButton()}
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateContract;