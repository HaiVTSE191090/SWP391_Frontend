import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup, Form, InputGroup, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
// Giả định authServices đã được import và chứa các hàm API mới
import { 
    getContractTermsTemplate, 
    getBookingInfoForContract, 
    createContract, 
    sendContractToAdmin 
} from './services/authServices';

// --- Định nghĩa Interfaces (Để đảm bảo Type Safety) ---
interface TermCondition {
    termNumber: number;
    termTitle: string;
    termContent: string;
}

interface BookingInfo {
    bookingId: number;
    vehicleName: string;
    stationName: string;
    renterName: string;
    renterPhoneNumber: string; 
    renterIdentityCard: string;
    startDateTime: string;
    endDateTime: string;
    pricePerDay: number; 
    depositAmount: number; 
    contractId: number | null;
    
    // THÊM: Các trường giả định cho bên cho thuê (Staff) và người thuê
    staffName: string; 
    staffCCCD: string;
    staffBirthYear: number;
    renterBirthYear: number; 
    // Thêm các ID quan trọng để gửi payload (GIẢ ĐỊNH có trong API)
    renterId: number; 
    vehicleId: number; 
}
// --- Kết thúc Interfaces ---


const CreateContract: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const id = Number(bookingId);
    const navigate = useNavigate();

    const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
    const [terms, setTerms] = useState<TermCondition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [contractId, setContractId] = useState<number | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    
    const [notes, setNotes] = useState<string>('');
    const [deposit, setDeposit] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Lấy Ngày, Tháng, Năm và Địa điểm hiện tại để điền vào Hợp đồng
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const location = bookingInfo?.stationName || 'TP. Hồ Chí Minh';
    
    //Fetch Dữ liệu (Booking Info & Template
    useEffect(() => {
        if (!id || isNaN(id)) {
            setError('ID Booking không hợp lệ.');
            setLoading(false);
            return;
        }
        
        const fetchData = async () => {
            setLoading(true);
            setError('');
            
            try {
                const bookingResponse = await getBookingInfoForContract(id);
                
                // GIẢ LẬP DỮ LIỆU ĐỂ ĐẢM BẢO CÁC TRƯỜNG TRONG INTERFACE ĐƯỢC ĐIỀN ĐẦY ĐỦ
                const info = {
                    ...bookingResponse?.data?.data,
                    // MOCKING: Thêm các ID quan trọng nếu API gốc thiếu
                    renterId: 123, 
                    vehicleId: 456, 
                    // MOCKING: Thông tin Staff và Năm sinh (đã giả định)
                    staffName: 'Lê Văn B', 
                    staffCCCD: '001190000000',
                    staffBirthYear: 1990, 
                    renterBirthYear: 1995, 
                } as BookingInfo; 
                
                if (info && info.bookingId) {
                    setBookingInfo(info);
                    setContractId(info.contractId || null); 
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
                
            } catch (err) {
                const errorMessage = (err as any).response?.data?.message || 'Không thể tải dữ liệu để tạo hợp đồng.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]); 

    // --- 2. Handler Tạo Hợp đồng (Bước 1: createContract) ---
    const handleCreateContract = async () => {
        setIsSending(true);
        setError('');
        
        // Kiểm tra bookingInfo để đảm bảo các ID quan trọng có sẵn
        if (!bookingInfo) {
             setIsSending(false);
             setError('Thiếu thông tin Booking cần thiết.');
             return;
        }

        try {
            // PAYLOAD CHÍNH XÁC: Gửi các ID quan trọng và mảng terms
            const payload = {
                bookingId: id,
                renterId: bookingInfo.renterId, // Thêm Renter ID
                vehicleId: bookingInfo.vehicleId, // Thêm Vehicle ID
                depositAmount: deposit,
                totalPrice: totalPrice,
                notes: notes,
                // THÊM: Gửi kèm danh sách các điều khoản (thường BE yêu cầu để lưu snapshot)
                terms: terms.map(term => ({
                    termNumber: term.termNumber,
                    termTitle: term.termTitle,
                    termContent: term.termContent
                })),
            };

            const response = await createContract(payload);
            const newContractId = response.data?.data?.contractId; 
            
            if (newContractId) {
                setContractId(newContractId);
                alert(`Hợp đồng ID ${newContractId} đã được tạo thành công!`);
            } else {
                setError('Tạo hợp đồng thành công nhưng không nhận được Contract ID.');
            }

        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || 'Lỗi khi thực hiện tạo Hợp đồng (400 Bad Request). Kiểm tra Payload!';
            setError(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    // --- 3. Handler Gửi Admin (Bước 2: sendContractToAdmin) ---
    const handleSendToAdmin = async () => {
        if (!contractId) {
            setError('Không tìm thấy Contract ID để gửi.');
            return;
        }

        setIsSending(true);
        setError('');
        try {
            await sendContractToAdmin(contractId);
            
            setIsSent(true); 
            setShowSuccessModal(true); 

        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || 'Lỗi khi gửi Hợp đồng đến Admin.';
            setError(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    // Nút Hành động chính
    const handleAction = contractId ? handleSendToAdmin : handleCreateContract;


    // --- UI Renders ---

    // Modal thông báo thành công
    const SuccessModal = () => (
        <Modal show={showSuccessModal} onHide={() => { setShowSuccessModal(false); navigate('/staff/bookings'); }}>
            <Modal.Header closeButton className='bg-success text-white'>
                <Modal.Title>Gửi Thành Công!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Hợp đồng ID **{contractId}** đã được gửi thành công đến Admin để ký duyệt.</p>
                <p className='text-muted small'>Bạn sẽ được chuyển về trang danh sách Booking.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => { setShowSuccessModal(false); navigate('/staff/bookings'); }}>Hoàn tất</Button>
            </Modal.Footer>
        </Modal>
    );

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="info" />
                <p className="mt-3">Đang chuẩn bị dữ liệu Hợp đồng...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <SuccessModal />
            <h2 className="mb-4 text-primary text-center">Tạo Hợp đồng Thuê Xe (Booking ID: {id})</h2>

            {error && <Alert variant="danger" className="shadow-sm">{error}</Alert>}
            
            <Card className="shadow-lg p-5 mx-auto border-0" style={{ maxWidth: '800px', border: '1px solid #ccc' }}>
                {/* Contract Content */}
                <div className="text-center mb-4">
                    <h4 className="mb-0">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                    <p className="fw-bold mb-5">Độc Lập - Tự Do - Hạnh Phúc</p>
                    <h2 className="text-uppercase fw-bold text-primary">HỢP ĐỒNG THUÊ XE</h2>
                </div>
                
                {/* 1. Phần Giới thiệu và thông tin bên A, B */}
                <div className="fs-6 mb-4">
                    Hôm nay, ngày <span className="underline-text fw-bold">{date}</span> tháng <span className="underline-text fw-bold">{month}</span> năm <span className="underline-text fw-bold">{year}</span>, tại <span className="underline-text fw-bold">{location}</span>, chúng tôi gồm:
                </div>
                
                <div className="ms-4 mb-4 contract-parties">
                    <h6 className="fw-bold text-uppercase mb-2">BÊN CHO THUÊ (Bên A):</h6>
                    <Row className="mb-1">
                        <Col xs={6}>Ông/Bà: <span className="underline-text">{bookingInfo?.staffName || 'N/A'}</span></Col>
                        <Col xs={6}>Sinh năm: <span className="underline-text">{bookingInfo?.staffBirthYear || 'N/A'}</span></Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={12}>CCCD: <span className="underline-text">{bookingInfo?.staffCCCD || 'N/A'}</span></Col>
                    </Row>
                    
                    <h6 className="fw-bold text-uppercase mb-2">BÊN THUÊ (Bên B):</h6>
                    <Row className="mb-1">
                        <Col xs={6}>Ông/Bà: <span className="underline-text">{bookingInfo?.renterName || 'N/A'}</span></Col>
                        <Col xs={6}>Sinh năm: <span className="underline-text">{bookingInfo?.renterBirthYear || 'N/A'}</span></Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={12}>CCCD: <span className="underline-text">{bookingInfo?.renterIdentityCard || 'N/A'}</span></Col>
                    </Row>
                </div>

                <div className="mb-4">
                    Hai bên đã thỏa thuận và thống nhất ký Hợp đồng thuê xe **{bookingInfo?.vehicleName || 'Ô tô điện'}** với những điều khoản cụ thể được trao đổi:
                </div>

                {/* 2. Phần Các Điều Khoản (Tích hợp Terms Template) */}
                <h6 className="fw-bold text-uppercase mb-3 text-secondary">CHI TIẾT ĐIỀU KHOẢN HỢP ĐỒNG:</h6>
                <ListGroup variant="flush" className="mb-4 contract-terms">
                    {terms.map((term: TermCondition, index) => (
                        <ListGroup.Item key={index} className="ps-0 border-0">
                            <span className="fw-bold text-dark">{term.termNumber}. {term.termTitle}:</span>
                            <span className="text-muted ms-2">{term.termContent}</span>
                        </ListGroup.Item>
                    ))}
                    <ListGroup.Item className="ps-0 border-0">
                        <span className="fw-bold text-dark">{terms.length + 1}. Chi phí và Tiền cọc:</span>
                        <span className="text-muted ms-2">
                            Tổng phí thuê: **{totalPrice.toLocaleString()} VNĐ**. Tiền cọc: **{deposit.toLocaleString()} VNĐ**.
                        </span>
                    </ListGroup.Item>
                </ListGroup>
                
                {/* Ghi chú */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-secondary">Ghi chú Hợp đồng (Tùy chọn):</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Thêm ghi chú đặc biệt cho hợp đồng này..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Form.Group>

                {/* 3. Phần Ký tên và Nút Hành động */}
                <Row className="mt-5 text-center">
                    <Col>
                        <p className="fw-bold">Bên Cho Thuê</p>
                        <p className="text-muted small">(Ký và ghi rõ họ tên)</p>
                    </Col>
                    <Col>
                        <p className="fw-bold">Bên Thuê</p>
                        <p className="text-muted small">(Ký và ghi rõ họ tên)</p>
                    </Col>
                </Row>

                <div className="d-flex justify-content-center gap-3 mt-5">
                    <Button variant="outline-secondary" size="lg" onClick={() => navigate(-1)} disabled={isSending}>
                        Hủy
                    </Button>
                    <Button 
                        variant={contractId ? "warning" : "primary"} 
                        size="lg" 
                        onClick={handleAction}
                        disabled={isSending || !bookingInfo || terms.length === 0}
                    >
                        {isSending ? <Spinner size="sm" animation="border" /> : (contractId ? 'Gửi Admin' : 'Tạo Hợp đồng')}
                    </Button>
                </div>
            </Card>
            
        </Container>
    );
};

export default CreateContract;