import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";
import { toast } from "react-toastify";

interface PaymentItem {
  id: number;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PaymentItem[]>([
    { id: 1, itemName: "", description: "", quantity: 1, unitPrice: 0, lineTotal: 0 }
  ]);

  // Thêm hạng mục mới
  const handleAddItem = () => {
    const newItem: PaymentItem = {
      id: Date.now(),
      itemName: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0
    };
    setItems([...items, newItem]);
  };

  // Xóa hạng mục
  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Cập nhật thông tin hạng mục
  const handleItemChange = (id: number, field: keyof PaymentItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Tự động tính lineTotal khi thay đổi quantity hoặc unitPrice
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.lineTotal = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.lineTotal, 0);
  };

  // Xử lý thanh toán
  const handlePayment = () => {
    if (!customerName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng!");
      return;
    }

    const hasEmptyItem = items.some(item => !item.itemName.trim() || item.unitPrice === 0);
    if (hasEmptyItem) {
      toast.error("Vui lòng điền đầy đủ thông tin các hạng mục!");
      return;
    }

    const total = calculateTotal();
    if (total === 0) {
      toast.error("Tổng tiền phải lớn hơn 0!");
      return;
    }

    if (!window.confirm(`Xác nhận thanh toán ${total.toLocaleString("vi-VN")} VND bằng ${paymentMethod}?`)) {
      return;
    }

    toast.success("✅ Ghi nhận thanh toán thành công!");
  };

  // Xử lý in hóa đơn
  const handlePrint = () => {
    if (!customerName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng trước khi in!");
      return;
    }

    const hasEmptyItem = items.some(item => !item.itemName.trim());
    if (hasEmptyItem) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi in!");
      return;
    }

    window.print();
    toast.success("✅ In hóa đơn thành công!");
  };

  const total = calculateTotal();

  return (
    <div className="container py-4">
      {/* Phần hiển thị hóa đơn */}
      <Card className="shadow-sm p-4 mb-4">
        <h4 className="fw-bold text-center mb-4">
          🧾 HÓA ĐƠN THANH TOÁN TIỀN MẶT
        </h4>

        <Row className="mb-4">
          <Col md={6}>
            <h6 className="fw-bold border-bottom pb-2 mb-3">Thông tin khách hàng</h6>
            <Form.Group className="mb-3">
              <Form.Label>Tên khách hàng <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên khách hàng"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <h6 className="fw-bold border-bottom pb-2 mb-3">Thông tin thanh toán</h6>
            <p className="mb-2">
              <strong>Ngày:</strong> {new Date().toLocaleDateString("vi-VN")}
            </p>
            <p className="mb-2">
              <strong>Phương thức thanh toán:</strong>{" "}
              <span className="badge bg-success">{paymentMethod}</span>
            </p>
          </Col>
        </Row>

        <h5 className="fw-bold mt-4 mb-3 border-bottom pb-2">📦 Chi tiết hóa đơn</h5>
        
        <Table bordered hover responsive className="mt-2">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "5%" }}>STT</th>
              <th style={{ width: "25%" }}>Tên hạng mục *</th>
              <th style={{ width: "25%" }}>Mô tả</th>
              <th style={{ width: "10%" }}>Số lượng</th>
              <th style={{ width: "15%" }}>Đơn giá (VND) *</th>
              <th style={{ width: "15%" }}>Thành tiền (VND)</th>
              <th style={{ width: "5%" }} className="no-print">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Tên hạng mục"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                    size="sm"
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Mô tả"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    size="sm"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    size="sm"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                    size="sm"
                  />
                </td>
                <td className="text-end fw-bold">
                  {item.lineTotal.toLocaleString("vi-VN")}
                </td>
                <td className="text-center no-print">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={items.length === 1}
                  >
                    ✕
                  </Button>
                </td>
              </tr>
            ))}
            <tr className="table-secondary">
              <td colSpan={5} className="text-end fw-bold">TỔNG CỘNG:</td>
              <td className="text-end fw-bold text-danger fs-5">
                {total.toLocaleString("vi-VN")} VND
              </td>
              <td className="no-print"></td>
            </tr>
          </tbody>
        </Table>

        <div className="text-center mb-3 no-print">
          <Button variant="outline-primary" onClick={handleAddItem}>
            + Thêm hạng mục
          </Button>
        </div>

        <div className="mt-4 text-center text-muted small">
          <p className="mb-0">Cảm ơn quý khách đã sử dụng dịch vụ!</p>
          <p className="mb-0">📞 Hotline: 1900-xxxx | 📧 Email: support@example.com</p>
        </div>
      </Card>

      {/* Phần form thanh toán (không in) */}
      <Card className="shadow-sm p-4 no-print">
        <h5 className="fw-bold mb-3">💳 Xử lý thanh toán</h5>
        
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phương thức thanh toán</Form.Label>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH">Tiền mặt</option>
                  <option value="BANK_TRANSFER">Chuyển khoản</option>
                  <option value="E_WALLET">Ví điện tử</option>
                  <option value="CREDIT_CARD">Thẻ tín dụng</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập ghi chú (tùy chọn)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-3 justify-content-center mt-4">
            <Button
              variant="success"
              size="lg"
              onClick={handlePayment}
              className="px-5"
            >
              💰 Thanh toán ({total.toLocaleString("vi-VN")} VND)
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handlePrint}
              className="px-5"
            >
              🖨️ Xuất hóa đơn
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(-1)}
              className="px-5"
            >
              ⬅️ Quay lại
            </Button>
          </div>
        </Form>
      </Card>

      {/* CSS cho in */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .table td, .table th {
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
