import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Table, Alert, Button, Form, Row, Col, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getInvoiceDetail, getSpareParts, addInvoiceDetail, deleteInvoiceDetail, refundToWallet, refundToCash, completeBooking, getBookingDetail } from "./services/authServices";

interface SparePart {
  priceId: number;
  itemName: string;
  description: string;
  unitPrice: number;
  stockQuantity: number;
  sparePartType: string;
}

interface InvoiceDetail {
  invoiceDetailId: number;
  type: string;
  priceListId: number;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Invoice {
  invoiceId: number;
  bookingId: number;
  type: string;
  depositAmount: number;
  totalAmount: number;
  refundAmount: number;
  amountRemaining: number;
  status: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  completedAt: string | null;
  details: InvoiceDetail[];
}

interface BookingImage {
  imageId: number;
  imageUrl: string;
  description: string;
  createdAt: string;
  imageType: string;
  vehicleComponent: string;
}

interface BookingDetail {
  bookingId: number;
  depositStatus: string;
  bookingImages?: BookingImage[];
}

const InvoiceDetailPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho form thêm spare part
  const [selectedPartId, setSelectedPartId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState(false);
  
  // State cho modal hoàn tiền
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  
  // State cho completing booking
  const [completing, setCompleting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  // State cho xóa detail
  const [deletingDetailId, setDeletingDetailId] = useState<number | null>(null);
  const [showDeleteDetailModal, setShowDeleteDetailModal] = useState(false);
  const [detailToDelete, setDetailToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch invoice detail
        const invoiceRes = await getInvoiceDetail(Number(invoiceId));
        const invoiceData = invoiceRes.data.data;
        setInvoice(invoiceData);
        
        // Fetch booking detail để lấy depositStatus
        if (invoiceData.bookingId) {
          const bookingRes = await getBookingDetail(invoiceData.bookingId);
          if (bookingRes?.data?.data) {
            setBooking(bookingRes.data.data);
          }
        }
        
        // Fetch spare parts list
        const sparePartsRes = await getSpareParts();
        console.log('Spare parts response:', sparePartsRes.data);
        const parts = sparePartsRes.data.data || [];
        console.log('Spare parts array:', parts);
        setSpareParts(parts);
        
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
  }, [invoiceId]);

  // Handler thêm spare part vào hóa đơn
  const handleAddSparePart = async () => {
    if (!selectedPartId || quantity <= 0) {
      toast.warning("Vui lòng chọn phụ tùng và nhập số lượng hợp lệ!");
      return;
    }

    if (!selectedPart) {
      toast.error("Không tìm thấy thông tin phụ tùng!");
      return;
    }

    try {
      setAdding(true);
      
      // Tạo payload theo API spec
      const detail = {
        type: "SPAREPART",
        priceListId: selectedPartId,
        description: selectedPart.description,
        quantity: quantity,
        unitPrice: selectedPart.unitPrice
      };
      
      // Gọi API thêm spare part vào invoice
      await addInvoiceDetail(Number(invoiceId), detail);
      
      toast.success("Đã thêm phụ tùng vào hóa đơn!");
      
      // Reload lại invoice
      const res = await getInvoiceDetail(Number(invoiceId));
      setInvoice(res.data.data);
      
      // Reset form
      setSelectedPartId(0);
      setQuantity(1);
      
    } catch (error: any) {
      console.error("Lỗi khi thêm spare part:", error);
      const errorMsg = error.response?.data?.message || "Không thể thêm phụ tùng!";
      toast.error(errorMsg);
    } finally {
      setAdding(false);
    }
  };

  // Handler hoàn thành booking
  const handleCompleteBooking = async () => {
    if (!invoice) return;

    setCompleting(true);
    try {
      await completeBooking(invoice.bookingId);
      toast.success("Đã hoàn thành booking thành công!");
      setShowCompleteModal(false);
      
      // Chuyển về trang danh sách booking
      setTimeout(() => {
        navigate('/staff/bookings');
      }, 1500);
      
    } catch (error: any) {
      console.error("Lỗi khi hoàn thành booking:", error);
      const errorMsg = error.response?.data?.message || "Không thể hoàn thành booking!";
      toast.error(errorMsg);
      setCompleting(false);
    }
  };

  // Handler xóa chi tiết hóa đơn
  const handleDeleteDetailClick = (detailId: number) => {
    setDetailToDelete(detailId);
    setShowDeleteDetailModal(true);
  };

  const handleConfirmDeleteDetail = async () => {
    if (!invoice || !detailToDelete) return;

    setShowDeleteDetailModal(false);
    setDeletingDetailId(detailToDelete);
    try {
      await deleteInvoiceDetail(invoice.invoiceId, detailToDelete);
      toast.success('Đã xóa chi tiết hóa đơn!');
      
      // Reload lại invoice
      const res = await getInvoiceDetail(Number(invoiceId));
      setInvoice(res.data.data);
      
    } catch (error: any) {
      console.error('Lỗi khi xóa chi tiết:', error);
      const errorMsg = error.response?.data?.message || 'Không thể xóa chi tiết!';
      toast.error(errorMsg);
    } finally {
      setDeletingDetailId(null);
      setDetailToDelete(null);
    }
  };

  // Handler hoàn tiền
  const handleRefund = async (method: 'WALLET' | 'CASH') => {
    if (!invoice) return;
    
    if (!refundReason.trim()) {
      toast.warning("Vui lòng nhập lý do hoàn tiền!");
      return;
    }

    setRefunding(true);
    try {
      const refundFunc = method === 'WALLET' ? refundToWallet : refundToCash;
      await refundFunc(invoice.invoiceId, invoice.refundAmount, refundReason.trim());
      
      toast.success(`Đã hoàn tiền ${method === 'WALLET' ? 'vào ví' : 'mặt'} thành công!`);
      setShowRefundModal(false);
      setRefundReason("");
      
      // Reload invoice
      const res = await getInvoiceDetail(Number(invoiceId));
      setInvoice(res.data.data);
      
    } catch (error: any) {
      console.error("Lỗi khi hoàn tiền:", error);
      const errorMsg = error.response?.data?.message || "Không thể hoàn tiền!";
      toast.error(errorMsg);
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải thông tin hóa đơn...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <Alert variant="warning" className="text-center mt-5">
        Không tìm thấy hóa đơn #{invoiceId}.
      </Alert>
    );
  }

  const selectedPart = spareParts.find(part => part.priceId === selectedPartId);

  return (
    <div className="container-fluid py-4">
      <Row>
        {/* Cột trái - Chi tiết hóa đơn */}
        <Col md={8}>
          <Card className="shadow-sm p-4">
            <h4 className="fw-bold text-center mb-3">
              Chi tiết hóa đơn #{invoice.invoiceId}
            </h4>

        <div className="mb-3">
          <p>
            <strong>Mã Booking:</strong> {invoice.bookingId}
          </p>
          <p>
            <strong>Loại hóa đơn:</strong>{" "}
            <span className="badge bg-info">{invoice.type}</span>
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span
              className={`badge ${
                invoice.status === "PAID"
                  ? "bg-success"
                  : invoice.status === "UNPAID"
                  ? "bg-danger"
                  : "bg-secondary"
              }`}
            >
              {invoice.status}
            </span>
          </p>
          
          {/* Tính tổng tiền phụ tùng */}
          {(() => {
            const sparePartTotal = invoice.details
              ?.filter(item => item.type === 'SPAREPART')
              .reduce((sum, item) => sum + item.lineTotal, 0) || 0;
            const rentalTotal = invoice.totalAmount - sparePartTotal;
            
            return (
              <div className="border-start border-primary border-4 ps-3 py-2 bg-light">
                {rentalTotal > 0 && (
                  <p className="mb-2">
                    <strong>Tiền thuê xe:</strong>{" "}
                    <span className="text-dark fw-bold fs-5">
                      {rentalTotal.toLocaleString("vi-VN")} VND
                    </span>
                  </p>
                )}
                {sparePartTotal > 0 && (
                  <p className="mb-2">
                    <strong>Tiền phụ tùng:</strong>{" "}
                    <span className="text-danger fw-bold fs-5">
                      {sparePartTotal.toLocaleString("vi-VN")} VND
                    </span>
                  </p>
                )}
                <p className="mb-2">
                  <strong>Tổng tiền:</strong>{" "}
                  <span className="text-success fw-bold fs-4">
                    {invoice.totalAmount.toLocaleString("vi-VN")} VND
                  </span>
                </p>
                {invoice.depositAmount > 0 && (
                  <p className="mb-2">
                    <strong>Tiền cọc:</strong>{" "}
                    <span className="text-info fw-bold fs-5">
                      {invoice.depositAmount.toLocaleString("vi-VN")} VND
                    </span>
                    {booking?.depositStatus === "PAID" && (
                      <span className="badge bg-success ms-2">Đã thanh toán</span>
                    )}
                  </p>
                )}
                {(invoice.totalAmount - invoice.depositAmount) > 0 && (
                  <p className="mb-2">
                    <strong>Số tiền còn lại phải thanh toán:</strong>{" "}
                    <span className="text-info fw-bold fs-5">
                      {(invoice.totalAmount - invoice.depositAmount).toLocaleString("vi-VN")} VND
                    </span>
                  </p>  
                )}
                {invoice.refundAmount > 0 && (
                  <p className="mb-0">
                    <strong>Số tiền hoàn lại:</strong>{" "}
                    <span className="text-primary fw-bold fs-5">
                      {invoice.refundAmount.toLocaleString("vi-VN")} VND
                    </span>
                  </p>
                )}
              </div>
            );
          })()}
          <p>
            <strong>Ghi chú:</strong> {invoice.notes || "Không có ghi chú"}
          </p>
          
          {/* Nút hoàn tiền hoặc thanh toán */}
          {invoice.refundAmount > 0 && invoice.status !== 'PAID' && (
            <div className="mt-3">
              <Button 
                variant="success" 
                size="lg" 
                className="w-100"
                onClick={() => setShowRefundModal(true)}
              >
                Hoàn tiền {invoice.refundAmount.toLocaleString("vi-VN")} VND
              </Button>
            </div>
          )}
          
          {(invoice.totalAmount - invoice.depositAmount) > 0 && invoice.status !== 'PAID' && (
            <div className="mt-3">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                onClick={() => navigate(`/staff/payment/${invoice.invoiceId}`, {
                  state: { amountToPay: invoice.totalAmount - invoice.depositAmount }
                })}
              >
                Thanh toán tiền mặt {(invoice.totalAmount - invoice.depositAmount).toLocaleString("vi-VN")} VND
              </Button>
            </div>
          )}
          <p className="text-muted small">
            <strong>Ngày tạo:</strong>{" "}
            {new Date(invoice.createdAt).toLocaleString("vi-VN")}
          </p>
          {invoice.completedAt && (
            <p className="text-muted small">
              <strong>Ngày hoàn tất:</strong>{" "}
              {new Date(invoice.completedAt).toLocaleString("vi-VN")}
            </p>
          )}
        </div>

        <h5 className="fw-bold mt-4">Chi tiết hóa đơn</h5>
        {invoice.details && invoice.details.length > 0 ? (
          <Table bordered hover responsive className="mt-2">
            <thead className="table-light">
              <tr>
                <th>Tên hạng mục</th>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Đơn giá (VND)</th>
                <th>Thành tiền (VND)</th>
                <th style={{ width: '100px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {invoice.details.map((item) => (
                <tr key={item.invoiceDetailId}>
                  <td>{item.itemName}</td>
                  <td>{item.description || "-"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice.toLocaleString("vi-VN")}</td>
                  <td>{item.lineTotal.toLocaleString("vi-VN")}</td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteDetailClick(item.invoiceDetailId)}
                      disabled={deletingDetailId === item.invoiceDetailId}
                    >
                      {deletingDetailId === item.invoiceDetailId ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        'Xóa'
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted fst-italic">Không có chi tiết hóa đơn.</p>
        )}
          </Card>
        </Col>

        {/* Cột phải - Form thêm spare parts */}
        <Col md={4}>
          <Card className="shadow-sm p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-3">Thêm phụ tùng</h5>
            
            {spareParts.length === 0 ? (
              <Alert variant="warning">
                Không có phụ tùng nào trong hệ thống.
              </Alert>
            ) : (
              <Form>
                {/* Dropdown chọn tên phụ tùng */}
                <Form.Group className="mb-3">
                  <Form.Label>Tên phụ tùng</Form.Label>
                  <Form.Select
                    value={selectedPartId || 0}
                    onChange={(e) => setSelectedPartId(Number(e.target.value))}
                    disabled={adding}
                  >
                    <option value={0}>-- Chọn phụ tùng --</option>
                    {spareParts.map((part) => (
                      <option key={part.priceId} value={part.priceId}>
                        {part.itemName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Ô hiển thị giá (readonly) */}
                <Form.Group className="mb-3">
                  <Form.Label>Đơn giá</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPart ? `${selectedPart.unitPrice.toLocaleString("vi-VN")} VND` : ''}
                    readOnly
                    disabled
                    placeholder="Chọn phụ tùng để xem giá"
                  />
                </Form.Group>

                {/* Ô nhập số lượng */}
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={selectedPart?.stockQuantity || 999}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={adding || !selectedPart}
                    placeholder="Nhập số lượng"
                  />
                  {selectedPart && (
                    <Form.Text className="text-muted">
                      Còn lại: {selectedPart.stockQuantity} cái
                    </Form.Text>
                  )}
                </Form.Group>

              {selectedPart && quantity > 0 && (
                <Alert variant="success" className="small">
                  <strong>Thành tiền:</strong>{" "}
                  {(selectedPart.unitPrice * quantity).toLocaleString("vi-VN")} VND
                </Alert>
              )}

                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleAddSparePart}
                  disabled={selectedPartId === 0 || quantity <= 0 || adding}
                >
                  {adding ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm vào hóa đơn"
                  )}
                </Button>
              </Form>
            )}
            
            {/* Nút Complete Booking - hiện khi invoice đã thanh toán */}
            {invoice.status === 'PAID' && (
              <div className="mt-4">
                <hr />
                <Alert variant="info" className="small mb-3">
                  Hóa đơn đã thanh toán. Bấm nút bên dưới để hoàn thành booking.
                </Alert>
                <Button
                  variant="success"
                  size="lg"
                  className="w-100"
                  onClick={() => setShowCompleteModal(true)}
                  disabled={completing}
                >
                  Hoàn thành Booking
                </Button>
              </div>
            )}

            {/* Hiển thị ảnh DAMAGE nếu có */}
            {booking?.bookingImages && booking.bookingImages.filter(img => img.imageType === 'DAMAGE').length > 0 && (
              <div className="mt-4">
                <hr />
                <Alert variant="warning" className="mb-3">
                  <strong>Phát hiện hư hỏng!</strong>
                  <p className="mb-0 small mt-1">
                    Có {booking.bookingImages.filter(img => img.imageType === 'DAMAGE').length} ảnh hư hỏng được ghi nhận. 
                    Vui lòng kiểm tra và thêm phụ tùng cần thiết.
                  </p>
                </Alert>
                
                <h6 className="fw-bold mb-3">Ảnh hư hỏng</h6>
                <div className="damage-images-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {booking.bookingImages
                    .filter(img => img.imageType === 'DAMAGE')
                    .map((img) => (
                      <Card key={img.imageId} className="mb-3">
                        <Card.Img 
                          variant="top" 
                          src={img.imageUrl} 
                          alt={img.vehicleComponent}
                          style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => window.open(img.imageUrl, '_blank')}
                        />
                        <Card.Body className="p-2">
                          <p className="mb-1 small">
                            <strong>Bộ phận:</strong>{" "}
                            <span className="badge bg-danger">{img.vehicleComponent}</span>
                          </p>
                          <p className="mb-1 small">
                            <strong>Mô tả:</strong> {img.description || "Không có mô tả"}
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(img.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </Card.Body>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal chọn phương thức hoàn tiền */}
      <Modal 
        show={showRefundModal} 
        onHide={() => !refunding && setShowRefundModal(false)}
        centered
        backdrop={refunding ? "static" : true}
      >
        <Modal.Header closeButton={!refunding} className="bg-success text-white">
          <Modal.Title>Hoàn tiền cho khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Số tiền hoàn lại:</strong>{" "}
            <span className="fs-5 fw-bold">
              {invoice?.refundAmount.toLocaleString("vi-VN")} VND
            </span>
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label>Lý do hoàn tiền <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập lý do hoàn tiền..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              disabled={refunding}
            />
          </Form.Group>

          <p className="text-muted mb-3">Chọn phương thức hoàn tiền:</p>
          
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleRefund('WALLET')}
              disabled={refunding || !refundReason.trim()}
            >
              {refunding ? (
                <><Spinner animation="border" size="sm" className="me-2" />Đang xử lý...</>
              ) : (
                <>Hoàn vào Ví điện tử</>
              )}
            </Button>
            
            <Button
              variant="success"
              size="lg"
              onClick={() => handleRefund('CASH')}
              disabled={refunding || !refundReason.trim()}
            >
              {refunding ? (
                <><Spinner animation="border" size="sm" className="me-2" />Đang xử lý...</>
              ) : (
                <>Hoàn bằng Tiền mặt</>
              )}
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowRefundModal(false)}
            disabled={refunding}
          >
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận hoàn thành booking */}
      <Modal
        show={showCompleteModal}
        onHide={() => !completing && setShowCompleteModal(false)}
        centered
        backdrop={completing ? "static" : true}
        size="lg"
      >
        <Modal.Header closeButton={!completing} className="bg-warning">
          <Modal.Title className="fs-4 fw-bold">Xác nhận hoàn thành Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Alert variant="warning" className="mb-4">
            <div className="d-flex align-items-center">
              <span className="fs-3 me-2">!</span>
              <div>
                <strong className="fs-5">Cảnh báo:</strong>
                <p className="mb-0 mt-1">Hành động này không thể hoàn tác!</p>
              </div>
            </div>
          </Alert>
          <p className="fs-5 mb-3">
            Bạn có chắc chắn muốn đánh dấu <strong className="text-primary">Booking #{invoice?.bookingId}</strong> là hoàn thành không?
          </p>
          <p className="text-muted mb-0 fs-6">
            Sau khi hoàn thành, trạng thái booking sẽ được chuyển sang <span className="badge bg-success fs-6">COMPLETED</span> và bạn sẽ được chuyển về trang danh sách booking.
          </p>
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setShowCompleteModal(false)}
            disabled={completing}
          >
            Hủy
          </Button>
          <Button
            variant="success"
            size="lg"
            onClick={handleCompleteBooking}
            disabled={completing}
          >
            {completing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận hoàn thành"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa detail */}
      <Modal
        show={showDeleteDetailModal}
        onHide={() => setShowDeleteDetailModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Bạn có chắc chắn muốn xóa chi tiết hóa đơn này?</p>
          <p className="text-muted small mt-2 mb-0">Hành động này không thể hoàn tác!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteDetailModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDeleteDetail}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoiceDetailPage;
