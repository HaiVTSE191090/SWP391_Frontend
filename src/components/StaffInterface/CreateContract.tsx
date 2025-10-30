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
    // Thêm các trường khác cần thiết cho Hợp đồng
}
// --- Kết thúc Interfaces ---


// Component chính
const CreateContract: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const id = Number(bookingId);
    const navigate = useNavigate();

    // Dữ liệu và trạng thái đã được typed
    const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
    const [terms, setTerms] = useState<TermCondition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Trạng thái Hợp đồng
    const [contractId, setContractId] = useState<number | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    
    // Form Inputs
    const [notes, setNotes] = useState<string>('');
    const [deposit, setDeposit] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    // --- 1. Fetch Dữ liệu (Booking Info & Template) ---
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
                // 1a. Lấy thông tin Booking (getBookingInfoForContract)
                const bookingResponse = await getBookingInfoForContract(id);
                // Ép kiểu dữ liệu trả về từ API
                const info: BookingInfo = bookingResponse?.data?.data; 
                
                if (info) {
                    setBookingInfo(info);
                    // Lấy contractId nếu đã tồn tại
                    setContractId(info.contractId || null); 
                    // Set giá trị mặc định cho form
                    setDeposit(info.depositAmount || 0);
                    
                    // Tính Tổng phí thuê dựa trên Booking Info
                    const start = new Date(info.startDateTime);
                    const end = new Date(info.endDateTime);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    setTotalPrice(diffDays * (info.pricePerDay || 0)); 
                } else {
                     throw new Error('Không tìm thấy thông tin Booking.');
                }
                
                // 1b. Lấy Điều khoản mẫu (getContractTermsTemplate)
                const termsResponse = await getContractTermsTemplate();
                // Ép kiểu dữ liệu trả về từ API
                setTerms(termsResponse?.data?.data || []);
                
            } catch (err) {
                // Xử lý lỗi Axios nếu có
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
        try {
            const payload = {
                bookingId: id,
                depositAmount: deposit,
                totalPrice: totalPrice,
                notes: notes,
                // Thêm các trường khác cần thiết từ bookingInfo (nếu BE yêu cầu)
                // Ví dụ: renterId: bookingInfo?.renterId,
            };

            // Gọi API tạo Hợp đồng
            const response = await createContract(payload);
            
            // Giả định API trả về contractId trong response.data.data
            const newContractId = response.data?.data?.contractId; 
            
            if (newContractId) {
                setContractId(newContractId); // Cập nhật ID để hiển thị nút Gửi Admin
                alert(`✅ Hợp đồng ID ${newContractId} đã được tạo thành công!`);
            } else {
                setError('Tạo hợp đồng thành công nhưng không nhận được Contract ID.');
            }

        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || 'Lỗi khi thực hiện tạo Hợp đồng.';
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
            // Gọi API gửi Admin
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

    // --- UI Renders ---

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="info" />
                <p className="mt-3">Đang chuẩn bị dữ liệu Hợp đồng...</p>
            </Container>
        );
    }

    // Modal thông báo thành công
    const SuccessModal = () => (
        <Modal show={showSuccessModal} onHide={() => { setShowSuccessModal(false); navigate('/staff/bookings'); }}>
            <Modal.Header closeButton className='bg-success text-white'>
                <Modal.Title>🚀 Gửi Thành Công!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Hợp đồng ID **{contractId}** đã được gửi thành công đến Admin để ký duyệt.</p>
                <p className='text-muted small'>Bạn sẽ được chuyển về trang danh sách Booking.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => { setShowSuccessModal(false); navigate('/staff/bookings'); }}>
                    Hoàn tất
                </Button>
            </Modal.Footer>
        </Modal>
    );

    // Nút Hành động chính
    const renderActionButton = () => {
        if (isSent) {
            return (
                <Button variant="success" size="lg" disabled>
                    ✅ Đã gửi Admin
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
                    {isSending ? <Spinner size="sm" animation="border" /> : '✉️ Gửi Hợp đồng cho Admin'}
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
                {isSending ? <Spinner size="sm" animation="border" /> : '📝 Lập & Lưu Hợp đồng'}
            </Button>
        );
    };


    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa' }}>
            <SuccessModal />
            <h2 className="mb-4 text-primary">📝 Tạo Hợp đồng Thuê Xe (Booking ID: {id})</h2>
            
            {error && <Alert variant="danger" className="shadow-sm">{error}</Alert>}

            <Row>
                {/* Cột trái: Thông tin Booking và Giá */}
                <Col lg={5} className="mb-4">
                    <Card className="shadow-sm border-0">
                        <Card.Header as="h5" className="bg-primary text-white">
                            Thông tin Booking {contractId && `(Hợp đồng ID: ${contractId})`}
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Khách hàng:</strong> {bookingInfo?.renterName} (Tel: {bookingInfo?.renterPhoneNumber || 'N/A'})
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>CCCD/CMND:</strong> {bookingInfo?.renterIdentityCard || 'Chưa xác định'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Xe thuê:</strong> {bookingInfo?.vehicleName}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Trạm nhận:</strong> {bookingInfo?.stationName}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Thời gian:</strong> {new Date(bookingInfo?.startDateTime || '').toLocaleString()} - {new Date(bookingInfo?.endDateTime || '').toLocaleString()}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer>
                            <h5 className="text-success mb-0">Tóm tắt Chi phí</h5>
                            <hr className='mt-1 mb-2'/>
                            <Form>
                                <Form.Group as={Row} className="mb-2 align-items-center">
                                    <Form.Label column sm="4" className='fw-bold'>Tiền cọc:</Form.Label>
                                    <Col sm="8">
                                        <InputGroup size="sm">
                                            <Form.Control type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} />
                                            <InputGroup.Text>VNĐ</InputGroup.Text>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="align-items-center">
                                    <Form.Label column sm="4" className='fw-bold'>Tổng phí thuê:</Form.Label>
                                    <Col sm="8">
                                        <InputGroup size="sm">
                                            <Form.Control type="number" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} />
                                            <InputGroup.Text>VNĐ</InputGroup.Text>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Card.Footer>
                    </Card>
                </Col>

                {/* Cột phải: Các Điều khoản và Nút Hành động */}
                <Col lg={7}>
                    <Card className="shadow-sm border-0">
                        <Card.Header as="h5" className="bg-secondary text-white">
                            Điều khoản Hợp đồng Mẫu ({terms.length} Điều khoản)
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <ListGroup variant="flush">
                                {terms.map((term: TermCondition) => ( 
                                    <ListGroup.Item key={term.termNumber} className="d-flex align-items-start">
                                        <div className="me-3 fw-bold text-primary" style={{ minWidth: '30px' }}>
                                            {term.termNumber}.
                                        </div>
                                        <div>
                                            <h6 className="mb-1 text-dark">{term.termTitle}</h6>
                                            <p className="mb-1 text-muted small">{term.termContent}</p>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                                {terms.length === 0 && <p className="text-center text-muted">Không có điều khoản mẫu nào được tải.</p>}
                            </ListGroup>
                            
                            <h5 className="mt-4 mb-3 text-secondary">Ghi chú (Tùy chọn)</h5>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Thêm ghi chú đặc biệt cho hợp đồng này..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
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