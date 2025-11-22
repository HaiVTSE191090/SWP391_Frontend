import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button, Form, Row, Col, Spinner, Alert, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getBookingDetail, getInvoiceDetail, payInvoiceByCash } from "./services/authServices";

interface Booking {
  bookingId: number;
  renterId: number;
  renterName: string;
  vehicleId: number;
  vehicleName: string;
  staffReceiveId?: number;
  staffReceiveName?: string;
  staffReturnId?: number;
  staffReturnName?: string;
  startDateTime: string;
  endDateTime: string;
  actualReturnTime?: string;
  totalAmount: number;
  depositStatus: string;
  status: string;
  priceSnapshotPerHour?: number;
  priceSnapshotPerDay?: number;
}

interface Invoice {
  invoiceId: number;
  bookingId: number;
  totalAmount: number;
  depositAmount: number;
  amountRemaining: number;
  status: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [amountToPay, setAmountToPay] = useState(0);
  const [paying, setPaying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy amountToPay từ location.state nếu có
        if (location.state?.amountToPay) {
          setAmountToPay(location.state.amountToPay);
        }
        
        if (!invoiceId) {
          toast.error("Không tìm thấy invoiceId!");
          navigate(-1);
          return;
        }
        
        // Fetch invoice detail
        const invoiceRes = await getInvoiceDetail(Number(invoiceId));
        const invoiceData = invoiceRes.data.data;
        setInvoice(invoiceData);
        
        // Nếu không có amountToPay từ state, tính từ invoice
        if (!location.state?.amountToPay) {
          const remaining = invoiceData.totalAmount - invoiceData.depositAmount;
          setAmountToPay(remaining > 0 ? remaining : 0);
        }
        
        // Fetch booking detail
        if (invoiceData.bookingId) {
          const bookingRes = await getBookingDetail(invoiceData.bookingId);
          if (bookingRes?.data?.data) {
            setBooking(bookingRes.data.data);
          }
        }
        
      } catch (error: any) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error(
          error.response?.data?.message || "Không thể tải thông tin!",
          { position: "top-right", autoClose: 3000 }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoiceId, location.state, navigate]);

  // Xử lý thanh toán
  const handlePayment = () => {
    if (amountToPay === 0) {
      toast.error("Số tiền thanh toán phải lớn hơn 0!");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!invoice) return;

    setPaying(true);
    setShowConfirmModal(false);
    
    try {
      await payInvoiceByCash(invoice.invoiceId, amountToPay);
      toast.success("Thanh toán tiền mặt thành công!");
      
      // Chờ 1.5s rồi quay lại trang invoice detail
      setTimeout(() => {
        navigate(`/staff/invoice/${invoice.invoiceId}`);
      }, 1500);
      
    } catch (error: any) {
      console.error("Lỗi khi thanh toán:", error);
      const errorMsg = error.response?.data?.message || "Không thể thanh toán!";
      toast.error(errorMsg);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!booking || !invoice) {
    return (
      <Alert variant="warning" className="text-center mt-5">
        Không tìm thấy thông tin booking hoặc hóa đơn.
      </Alert>
    );
  }

  return (
    <div className="container py-4">
      {/* Phần hiển thị thông tin booking */}
      <Card className="shadow-sm p-4 mb-4">
        <h4 className="fw-bold text-center mb-4">
          THANH TOÁN TIỀN MẶT
        </h4>

        <Row className="mb-4">
          <Col md={6}>
            <h6 className="fw-bold border-bottom pb-2 mb-3">Thông tin Booking</h6>
            <p className="mb-2">
              <strong>Mã Booking:</strong> {booking.bookingId}
            </p>
            <p className="mb-2">
              <strong>Tên khách hàng:</strong> {booking.renterName}
            </p>
            <p className="mb-2">
              <strong>Xe thuê:</strong> {booking.vehicleName}
            </p>
            {booking.staffReceiveName && (
              <p className="mb-2">
                <strong>Nhân viên giao xe:</strong> {booking.staffReceiveName}
              </p>
            )}
            {booking.staffReturnName && (
              <p className="mb-2">
                <strong>Nhân viên nhận xe:</strong> {booking.staffReturnName}
              </p>
            )}
            <p className="mb-2">
              <strong>Thời gian bắt đầu thuê:</strong><br />
              {new Date(booking.startDateTime).toLocaleString("vi-VN")}
            </p>
            <p className="mb-2">
              <strong>Thời gian kết thúc (dự kiến):</strong><br />
              {new Date(booking.endDateTime).toLocaleString("vi-VN")}
            </p>
            {booking.actualReturnTime && (
              <p className="mb-2">
                <strong>Thời gian trả xe (thực tế):</strong><br />
                <span className="text-success fw-bold">
                  {new Date(booking.actualReturnTime).toLocaleString("vi-VN")}
                </span>
              </p>
            )}
            <p className="mb-2">
              <strong>Trạng thái:</strong>{" "}
              <span className={`badge ${
                booking.status === 'COMPLETED' ? 'bg-success' :
                booking.status === 'IN_USE' ? 'bg-primary' :
                booking.status === 'CONFIRMED' ? 'bg-info' : 'bg-secondary'
              }`}>
                {booking.status}
              </span>
            </p>
          </Col>
          <Col md={6}>
            <h6 className="fw-bold border-bottom pb-2 mb-3">Thông tin thanh toán</h6>
            <p className="mb-2">
              <strong>Ngày thanh toán:</strong> {new Date().toLocaleString("vi-VN")}
            </p>
            <p className="mb-2">
              <strong>Phương thức:</strong>{" "}
              <span className="badge bg-success">Tiền mặt</span>
            </p>
            <p className="mb-2">
              <strong>Tiền cọc:</strong>{" "}
              <span className="text-info fw-bold">
                {invoice.depositAmount.toLocaleString("vi-VN")} VND
              </span>
              {booking.depositStatus === "PAID" && (
                <span className="badge bg-success ms-2">Đã thanh toán</span>
              )}
            </p>
            <div className="border-start border-danger border-4 ps-3 py-2 bg-light mt-3">
              <p className="mb-0">
                <strong>Số tiền cần thanh toán:</strong>{" "}
                <span className="text-danger fw-bold fs-4">
                  {amountToPay.toLocaleString("vi-VN")} VND
                </span>
              </p>
            </div>
          </Col>
        </Row>

        <div className="mt-4 text-center text-muted small">
          <p className="mb-0">Cảm ơn quý khách đã sử dụng dịch vụ!</p>
          <p className="mb-0">Hotline: 1900-xxxx | Email: support@example.com</p>
        </div>
      </Card>

      {/* Phần nút xử lý */}
      <Card className="shadow-sm p-4">
        <div className="d-flex gap-3 justify-content-center">
          <Button
            variant="success"
            size="lg"
            onClick={handlePayment}
            className="px-5"
            disabled={paying}
          >
            {paying ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>Xác nhận thanh toán ({amountToPay.toLocaleString("vi-VN")} VND)</>
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
            className="px-5"
            disabled={paying}
          >
            Quay lại
          </Button>
        </div>
      </Card>

      {/* Modal xác nhận thanh toán */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Xác nhận thanh toán tiền mặt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Số tiền thanh toán:</strong>{" "}
            <span className="fs-5 fw-bold">
              {amountToPay.toLocaleString("vi-VN")} VND
            </span>
          </Alert>
          <p className="mb-0">Bạn có chắc chắn muốn xác nhận khách hàng đã thanh toán số tiền trên bằng tiền mặt?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleConfirmPayment}>
            Xác nhận thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentPage;
