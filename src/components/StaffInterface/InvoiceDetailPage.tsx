import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spinner, Table, Alert } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

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
  amountRemaining: number;
  status: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  completedAt: string | null;
  details: InvoiceDetail[];
}

const InvoiceDetailPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:8080/api/invoices/invoices/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setInvoice(res.data.data);
      } catch (error: any) {
        console.error("❌ Lỗi khi tải hóa đơn:", error);
        toast.error(
          error.response?.data?.message || "Không thể tải thông tin hóa đơn!",
          { position: "top-right", autoClose: 3000 }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetail();
  }, [invoiceId]);

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
        ❌ Không tìm thấy hóa đơn #{invoiceId}.
      </Alert>
    );
  }

  return (
    <div className="container py-4">
      <Card className="shadow-sm p-4">
        <h4 className="fw-bold text-center mb-3">
          🧾 Chi tiết hóa đơn #{invoice.invoiceId}
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
          <p>
            <strong>Phương thức thanh toán:</strong> {invoice.paymentMethod}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {invoice.totalAmount.toLocaleString("vi-VN")} VND
          </p>
          <p>
            <strong>Còn lại phải thanh toán:</strong>{" "}
            {invoice.amountRemaining.toLocaleString("vi-VN")} VND
          </p>
          {invoice.depositAmount > 0 && (
            <p>
              <strong>Tiền cọc:</strong>{" "}
              {invoice.depositAmount.toLocaleString("vi-VN")} VND
            </p>
          )}
          <p>
            <strong>Ghi chú:</strong> {invoice.notes || "Không có ghi chú"}
          </p>
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

        <h5 className="fw-bold mt-4">📦 Chi tiết hóa đơn</h5>
        {invoice.details && invoice.details.length > 0 ? (
          <Table bordered hover responsive className="mt-2">
            <thead className="table-light">
              <tr>
                <th>Tên hạng mục</th>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Đơn giá (VND)</th>
                <th>Thành tiền (VND)</th>
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
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted fst-italic">Không có chi tiết hóa đơn.</p>
        )}
      </Card>
    </div>
  );
};

export default InvoiceDetailPage;
