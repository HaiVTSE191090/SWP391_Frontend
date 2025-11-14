import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Card, Row, Col, Badge, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "./FinalPayment.css";

const FinalPayment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [invoice, setInvoice] = useState<any | null>(null);
  const [breakdown, setBreakdown] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMethod, setSelectedMethod] = useState<string>("MOMO");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/invoices/bookings/${bookingId}/invoices`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const invoices = res.data?.data || [];
        const finalInvoice = invoices.find((inv: any) => inv.type === "FINAL");

        if (finalInvoice) {
          setInvoice(finalInvoice);
        } else {
          toast.info("📄 Hiện chưa có hóa đơn tổng cho đơn này.", {
            position: "top-right",
            autoClose: 3000,
          });
        }

        const detailRes = await axios.get(
          `http://localhost:8080/api/invoices/invoices/${finalInvoice.invoiceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvoice(detailRes.data?.data);

        const breakdownRes = await axios.get(
          `http://localhost:8080/api/invoices/invoices/${finalInvoice.invoiceId}/amount-breakdown`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBreakdown(breakdownRes.data?.data);

      } catch (error) {
        console.error("❌ Lỗi khi tải hóa đơn:", error);
        toast.error("Không thể tải thông tin hóa đơn. Vui lòng thử lại sau.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchInvoice();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Đang tải thông tin hóa đơn...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-5 text-muted">
        <p>Không tìm thấy hóa đơn tổng cho đơn đặt xe này.</p>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "";

      if (selectedMethod === "MOMO") {
        url = `http://localhost:8080/api/payments/invoice/${invoice.invoiceId}/momo`;
      } else if (selectedMethod === "CASH") {
        url = `http://localhost:8080/api/notifications/booking/${bookingId}/cash-payment`;
      } else {
        url = `http://localhost:8080/api/payments/invoice/${invoice.invoiceId}/wallet`;
      }

      const res = await axios.post(
        url,
        { amount: breakdown?.amountToPay },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (selectedMethod === "MOMO" && res.data?.data?.payUrl) {
        toast.info("🔗 Đang chuyển hướng đến MoMo...", {
          position: "top-center",
        });
        window.location.href = res.data.data.payUrl;
      } else {
        toast.success("Đã thông báo đến nhân viên của trạm!, vui lòng chờ xác nhận.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi thanh toán:", error);
      toast.error("Không thể thực hiện thanh toán. Vui lòng thử lại sau.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="container py-5 final-invoice-page">
      <Card className="shadow-lg border-0 rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-primary">
            💳 Hóa đơn thanh toán cuối cùng
          </h3>
          <Badge
            bg={
              invoice.status === "PAID"
                ? "success"
                : invoice.status === "UNPAID"
                  ? "warning"
                  : "secondary"
            }
          >
            {invoice.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
          </Badge>
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <p><strong>Mã hóa đơn:</strong> #{invoice.invoiceId}</p>
            <p><strong>Mã đơn thuê:</strong> #{invoice.bookingId}</p>
            <p>
              <strong>Loại hóa đơn:</strong>{" "}
              {invoice.type === "FINAL"
                ? "Hóa đơn tổng (Final)"
                : invoice.type === "DEPOSIT"
                  ? "Hóa đơn đặt cọc"
                  : invoice.type}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong>Phương thức thanh toán:</strong>
            </p>

            {invoice.status === "PAID" ? (
              // ✅ Nếu đã thanh toán: chỉ hiển thị badge cố định
              <Badge
                bg={
                  invoice.paymentMethod === "MOMO"
                    ? "danger"
                    : invoice.paymentMethod === "CASH"
                      ? "success"
                      : "info"
                }
                className="px-3 py-2"
              >
                {invoice.paymentMethod === "MOMO"
                  ? "Ví MoMo"
                  : invoice.paymentMethod === "CASH"
                    ? "Tiền mặt"
                    : "Chuyển khoản ví điện tử"}
              </Badge>
            ) : (
              // 🟢 Nếu chưa thanh toán: cho phép chọn phương thức
              <Form.Select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="mb-3 shadow-sm"
                style={{ maxWidth: "300px" }}
              >
                <option value="MOMO">Ví MoMo</option>
                <option value="CASH">Tiền mặt</option>
                <option value="WALLET">Chuyển khoản ví điện tử</option>
              </Form.Select>
            )}


            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(invoice.createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Hoàn tất lúc:</strong>{" "}
              {invoice.completedAt
                ? new Date(invoice.completedAt).toLocaleString("vi-VN")
                : "Chưa hoàn tất"}
            </p>
          </Col>
        </Row>

        <hr />

        <h5 className="fw-bold text-secondary mb-3">📋 Chi tiết hóa đơn</h5>
        {invoice.details && invoice.details.length > 0 ? (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã chi tiết</th>
                <th>Loại</th>
                <th>ID bảng giá</th>
                <th>Tên hạng mục</th>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Đơn giá (VND)</th>
                <th>Thành tiền (VND)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.details.map((d: any, idx: number) => (
                <tr key={idx}>
                  <td>{d.invoiceDetailId}</td>
                  <td>
                    <Badge
                      bg={
                        d.type === "SPAREPART"
                          ? "info"
                          : d.type === "DAMAGE"
                            ? "danger"
                            : "secondary"
                      }
                    >
                      {d.type}
                    </Badge>
                  </td>
                  <td>{d.priceListId || "-"}</td>
                  <td>{d.itemName || "-"}</td>
                  <td>{d.description || "-"}</td>
                  <td>{d.quantity}</td>
                  <td>{d.unitPrice?.toLocaleString() || 0}</td>
                  <td className="fw-bold text-danger">{d.lineTotal?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted fst-italic">Không có chi tiết phát sinh trong hóa đơn này.</p>
        )}

        <hr />

        <div className="invoice-summary mt-3">
          <h5 className="fw-bold text-secondary mb-3">💰 Thông tin thanh toán</h5>
          <Row>
            <Col md={6}>
              <p><strong>Tiền thuê xe:</strong> {breakdown?.rentalAmount.toLocaleString()} VND</p>
              <p><strong>Tổng tiền của hóa đơn:</strong> {invoice.totalAmount.toLocaleString()} VND</p>
              <p><strong>Đã đặt cọc:</strong> {invoice.depositAmount.toLocaleString()} VND</p>
              <p><strong>Hoàn tiền:</strong> {breakdown.amountToRefund ? breakdown.amountToRefund.toLocaleString() + " VND" : "Không có"}</p>
            </Col>
            <Col md={6}>
              <p><strong>Số tiền còn lại:</strong> <span className="text-danger fw-bold">{breakdown?.amountToPay.toLocaleString()} VND</span></p>
              <p><strong>Ghi chú:</strong> {invoice.notes || "Không có ghi chú"}</p>
            </Col>
          </Row>
        </div>



        <div className="text-center mt-4">
          <Button
            variant={
              invoice.status === "PAID"
                ? "outline-success"
                : selectedMethod === "MOMO"
                  ? "outline-danger"
                  : selectedMethod === "CASH"
                    ? "outline-success"
                    : "outline-primary"
            }
            size="lg"
            disabled={invoice.status === "PAID" || !breakdown 
              || breakdown.amountToPay <= 0
            }
            onClick={handlePayment}
          >
            {invoice.status === "PAID"
              ? "✅ Đã thanh toán"
              : selectedMethod === "MOMO"
                ? "Thanh toán qua MoMo"
                : selectedMethod === "CASH"
                  ? "Xác nhận thanh toán tiền mặt"
                  : "Thanh toán chuyển khoản"}
          </Button>

          <div className="mt-3">
            <Button variant="outline-secondary" onClick={() => navigate("/rental-history")}>
              ← Quay lại lịch sử thuê xe
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinalPayment;
