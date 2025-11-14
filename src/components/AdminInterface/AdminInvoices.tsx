import React, { useEffect } from 'react';
// 1. Import các components Bootstrap bạn yêu cầu
import {
    Card,
    Table,
    Button,
    Spinner,
    Alert,
    Form, // Dùng cho bộ lọc
    Row,  // Dùng cho bộ lọc
    Col,  // Dùng cho bộ lọc
    Badge // Thêm Badge để hiển thị trạng thái cho đẹp
} from 'react-bootstrap';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useInvoice } from '../../hooks/useInvoice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminInvoices = () => {

    const {bookingId} = useParams<{bookingId: string}>()
    const {
        getInvoicesByBookingId,
        markAsPaid,
        data: invoices,
        isLoading,
        error
    } = useInvoice();

    useEffect(() => {
        if (bookingId) {
            getInvoicesByBookingId(bookingId);
        }
    }, [bookingId, getInvoicesByBookingId]);

    const handleMarkPaid = async (invoiceId: number, currentStatus: string) => {

        // 4.1. Kiểm tra, nếu đã PAID thì không làm gì
        if (currentStatus === 'PAID') {
            toast.info("Hóa đơn này đã được thanh toán rồi.");
            return;
        }

        // 4.2. Gọi API từ hook
        // (Hook của bạn tự set isLoading, nên nút sẽ bị disabled)
        const res = await markAsPaid(invoiceId);

        // 4.3. Xử lý kết quả
        // (Giả định bạn đã sửa lỗi 'success: true' trong catch ở hook)
        if (res.success) {
            toast.success(res.message || "Đánh dấu thanh toán thành công!");

            // 4.4. Tải lại danh sách hóa đơn
            if (bookingId) {
                getInvoicesByBookingId(bookingId);
            }
        } else {
            toast.error(res.message || "Đánh dấu thanh toán thất bại.");
        }
    }

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-2">Đang tải danh sách hóa đơn...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                <strong>Lỗi:</strong> {error}
            </Alert>
        );
    }

    // 9. Xử lý không có dữ liệu
    if (!invoices || invoices.length === 0) {
        return (
            <Alert variant="info">
                Không tìm thấy hóa đơn nào cho booking này.
            </Alert>
        );
    }

    // 10. Trạng thái THÀNH CÔNG (hiển thị danh sách)
    return (
        <Card className="mt-4">
            <Card.Header>
                <Card.Title as="h5">Danh Sách Hóa Đơn</Card.Title>
                <span className="text-muted">Cho Booking #{bookingId}</span>
            </Card.Header>
            <Card.Body>
                {/* Sử dụng Form, Row, Col để tạo bộ lọc */}
                <Form className="mb-3">
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Lọc theo loại HĐ:</Form.Label>
                                <Form.Select size="sm">
                                    <option value="">Tất cả</option>
                                    <option value="DEPOSIT">Hóa đơn cọc</option>
                                    <option value="FINAL">Hóa đơn cuối</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Lọc theo trạng thái:</Form.Label>
                                <Form.Select size="sm">
                                    <option value="">Tất cả</option>
                                    <option value="PAID">Đã thanh toán</option>
                                    <option value="PENDING">Chờ xử lý</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                {/* Sử dụng Table để hiển thị danh sách */}
                <Table striped bordered hover responsive="lg">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Loại HĐ</th>
                            <th>Trạng thái</th>
                            <th>Tổng tiền</th>
                            <th>Tiền cọc</th>
                            <th>Ngày tạo</th>
                            <th>Thanh toán lúc</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.invoiceId}>
                                <td><strong>#{invoice.invoiceId}</strong></td>
                                <td>
                                    {invoice.type === 'DEPOSIT'
                                        ? 'Hóa đơn cọc'
                                        : 'Hóa đơn cuối'}
                                </td>
                                <td>
                                    <Badge bg={invoice.status === 'PAID' ? 'success' : 'warning'}>
                                        {invoice.status === 'PAID' ? 'Đã thanh toán' : 'Chờ xử lý'}
                                    </Badge>
                                </td>
                                {/* Format tiền tệ */}
                                <td>{invoice.totalAmount.toLocaleString('vi-VN')} đ</td>
                                <td>{invoice.depositAmount.toLocaleString('vi-VN')} đ</td>
                                {/* Format ngày giờ */}
                                <td>
                                    {format(new Date(invoice.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                                </td>
                                <td>
                                    {invoice.completedAt ?
                                        format(new Date(invoice.completedAt), 'HH:mm dd/MM/yyyy', { locale: vi }) : 'N/A'}
                                </td>
                                <td>
                                    {invoice.status !== 'PAID' ? (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleMarkPaid(invoice.invoiceId, invoice.status)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Đang xử lý..." : "Đánh dấu đã thanh toán"}
                                        </Button>
                                    ) : (
                                        <span className="text-success fw-bold">
                                            <i className="bi bi-check-circle-fill me-1"></i>
                                            Đã thanh toán
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default AdminInvoices;