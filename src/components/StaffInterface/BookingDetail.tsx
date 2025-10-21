import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';

// Component trang chi tiết booking, dùng mock data để phát triển UI khi chưa có API

// Interface cho dữ liệu booking (thông tin chi tiết booking)
interface Booking {
    id: string | number;
    renterName: string;
    staffName: string;
    carName: string;
    startDate: string;
    endDate: string;
    price: string;
    status: string;
    accessories: string[];
    photoBefore: string;
    photoAfter: string;
}

// Interface cho phụ tùng (accessory)
interface Accessory {
    id: string | number;
    name: string;
}

// Interface cho hóa đơn (invoice)
interface Invoice {
    id: string | number;
    bookingId: string | number;
    total: string;
    details: string;
}

// Interface cho báo cáo (report)
interface Report {
    id: string | number;
    bookingId: string | number;
    content: string;
}

const mockBooking: Booking = {
    id: 1,
    renterName: 'Nguyễn Văn A',
    staffName: 'Trần Thị B',
    carName: 'VinFast VF7 Black',
    startDate: '2025-10-18 09:00',
    endDate: '2025-10-20 18:00',
    price: '2,000,000 VND',
    status: 'Đang thuê',
    accessories: ['Bộ dụng cụ sửa xe', 'Bơm lốp'],
    photoBefore: 'https://via.placeholder.com/200x120?text=Before',
    photoAfter: 'https://via.placeholder.com/200x120?text=After',
};

// Mock data phụ tùng (giả lập danh sách phụ tùng)
const mockAccessories: Accessory[] = [
    { id: 1, name: 'Bộ dụng cụ sửa xe' },
    { id: 2, name: 'Bơm lốp' },
    { id: 3, name: 'Dây câu bình' },
];

function BookingDetail() {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [report, setReport] = useState<Report | null>(null);
    const [photoBefore, setPhotoBefore] = useState<string>('');
    const [photoAfter, setPhotoAfter] = useState<string>('');

    useEffect(() => {
        setBooking(mockBooking);
        setAccessories(mockAccessories);
        setSelectedAccessories(mockBooking.accessories);
        setPhotoBefore(mockBooking.photoBefore);
        setPhotoAfter(mockBooking.photoAfter);
    }, []);

    const handleAccessoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedAccessories(value);
    };

    const handleUploadBefore = () => {
        setPhotoBefore('https://via.placeholder.com/200x120?text=Uploaded+Before');
    };

    const handleUploadAfter = () => {
        setPhotoAfter('https://via.placeholder.com/200x120?text=Uploaded+After');
    };

    const handleCreateInvoice = () => {
        setInvoice({
            id: 1,
            bookingId: booking?.id || 0,
            total: booking?.price || '0 VND',
            details: 'Chi tiết hóa đơn: ...',
        });
    };

    const handleCreateReport = () => {
        setReport({
            id: 1,
            bookingId: booking?.id || 0,
            content: 'Nội dung báo cáo: ...',
        });
    };

    if (!booking) return <Container className="py-5 text-center">Đang tải thông tin booking...</Container>;

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Row className="mb-4">
                <Col><h2 className="text-center fw-bold">Thông tin Booking</h2></Col>
            </Row>
            <Row>
                <Col md={3} className="mb-3">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">List Renter</h5>
                            <div className="d-flex flex-column gap-2">
                                <Button variant="outline-primary" size="sm">Vehicles available</Button>
                                <Button variant="outline-primary" size="sm">Vehicles Renting</Button>
                                <Button variant="outline-primary" size="sm">Vehicle Reserved</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <div className="border rounded p-3 mb-4" style={{ backgroundColor: '#e9ecef' }}>
                                <h5 className="fw-bold mb-3">Thông tin booking</h5>
                                <Table bordered size="sm">
                                    <tbody>
                                        <tr><td>Renter Name</td><td>{booking.renterName}</td></tr>
                                        <tr><td>Staff Name</td><td>{booking.staffName}</td></tr>
                                        <tr><td>Car Name</td><td>{booking.carName}</td></tr>
                                        <tr><td>Start Date</td><td>{booking.startDate}</td></tr>
                                        <tr><td>End Date</td><td>{booking.endDate}</td></tr>
                                        <tr><td>Price</td><td>{booking.price}</td></tr>
                                        <tr><td>Status</td><td>{booking.status}</td></tr>
                                        <tr><td>Accessories</td><td>{selectedAccessories.join(', ')}</td></tr>
                                    </tbody>
                                </Table>
                            </div>
                            <Row className="mb-3">
                                <Col md={4} className="mb-2">
                                    <Button variant="success" className="w-100" onClick={handleCreateInvoice}>Tạo hóa đơn</Button>
                                </Col>
                                <Col md={8} className="mb-2">
                                    <Form.Select multiple value={selectedAccessories} onChange={handleAccessoryChange}>
                                        {accessories.map(acc => (
                                            <option key={acc.id} value={acc.name}>{acc.name}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4} className="mb-2">
                                    <Button variant="secondary" className="w-100" onClick={handleUploadBefore}>Click to upload car photo before rent</Button>
                                </Col>
                                <Col md={4} className="mb-2">
                                    <Button variant="warning" className="w-100" onClick={handleCreateReport}>Report</Button>
                                </Col>
                                <Col md={4} className="mb-2">
                                    <Button variant="secondary" className="w-100" onClick={handleUploadAfter}>Click to upload car photo after rent</Button>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6} className="text-center">
                                    <div>Ảnh trước khi thuê:</div>
                                    <img src={photoBefore} alt="before" style={{ maxWidth: '100%', borderRadius: 8 }} />
                                </Col>
                                <Col md={6} className="text-center">
                                    <div>Ảnh sau khi trả:</div>
                                    <img src={photoAfter} alt="after" style={{ maxWidth: '100%', borderRadius: 8 }} />
                                </Col>
                            </Row>
                            {invoice && (
                                <Card className="mb-3">
                                    <Card.Body>
                                        <h6>Hóa đơn</h6>
                                        <div><strong>Tổng tiền:</strong> {invoice.total}</div>
                                        <div>{invoice.details}</div>
                                    </Card.Body>
                                </Card>
                            )}
                            {report && (
                                <Card className="mb-3">
                                    <Card.Body>
                                        <h6>Báo cáo</h6>
                                        <div>{report.content}</div>
                                    </Card.Body>
                                </Card>
                            )}
                        </Card.Body>
                        <Card.Footer className="text-center">footer</Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BookingDetail;