import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../App.css";

export default function DepositPage() {
    const [method, setMethod] = useState(""); // momo | cash
    const [showPopup, setShowPopup] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
        if (!method) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }
        // chỉ hiển thị form thanh toán, KHÔNG mở popup
        // (popup chỉ mở sau khi bấm 'Thanh toán')
    };

    const handlePayment = async () => {
        try {
            setLoading(true); // bật loading

            // 🚀 sau này chỉ cần đổi URL BE là xong
            const response = await fetch("http://localhost:8080/api/bookings/deposit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookingId: 101,
                    paymentMethod: method,
                    amount: 100000,
                }),
            });

            const data = await response.json();

            setSuccess(data.status === "SUCCESS");
            setShowPopup(true);
        } catch (err) {
            console.error("❌ Lỗi khi thanh toán:", err);
            setSuccess(false);
            setShowPopup(true);
        } finally {
            setLoading(false); // tắt loading
        }
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center fw-bold">Xác nhận đặt xe</h2>

            {/* Thông tin thuê xe */}
            <div className="card p-4 shadow-sm mb-4">
                <h4 className="fw-bold mb-3">THÔNG TIN THUÊ XE</h4>
                <p>
                    <strong>Xe:</strong> VinFast Evo200
                </p>
                <p>
                    <strong>Thời gian thuê:</strong> 10:00 - 14:00 (30/09/2025)
                </p>
                <p>
                    <strong>Giá ước tính:</strong> 400.000 VND
                </p>
                <p>
                    <strong>Tiền cọc:</strong> 100.000 VND
                </p>
            </div>

            {/* Phương thức thanh toán */}
            <div className="card p-4 shadow-sm mb-4">
                <h5 className="fw-bold mb-3">Chọn phương thức thanh toán</h5>

                <div className="d-flex gap-3 flex-wrap justify-content-center">
                    {/* Momo */}
                    <label
                        className={`payment-option ${method === "momo" ? "active" : ""}`}
                        onClick={() => setMethod("momo")}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                            alt="Momo"
                            width="40"
                            height="40"
                            className="me-2"
                        />
                        <span>Thanh toán qua Momo</span>
                    </label>

                    {/* Tiền mặt */}
                    <label
                        className={`payment-option ${method === "cash" ? "active" : ""}`}
                        onClick={() => setMethod("cash")}
                    >
                        💵 <span>Thanh toán tiền mặt</span>
                    </label>
                </div>
            </div>

            {/* Hiển thị form thanh toán sau khi chọn */}
            {method && (
                <div className="card p-4 mt-4 shadow-sm">
                    <h5 className="fw-bold mb-3">Thông tin thanh toán</h5>

                    {method === "momo" && (
                        <div className="text-center mb-3">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                alt="Momo"
                                width={100}
                                className="mb-2"
                            />
                            <p>Quét mã QR để thanh toán</p>
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ThanhToanMomo"
                                alt="QR"
                            />
                        </div>
                    )}

                    {method === "cash" && (
                        <p className="text-center text-muted">
                            Vui lòng đến trạm thanh toán tiền cọc. Xe sẽ được giữ trong{" "}
                            <strong>1 tiếng</strong> kể từ thời gian thuê.
                        </p>
                    )}

                    <div className="text-center">
                        <Button variant="success" onClick={handlePayment} disabled={loading}>
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                "Thanh toán"
                            )}
                        </Button>

                    </div>
                </div>
            )}

            {/* Popup kết quả thanh toán */}
            <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Kết quả thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {success === null && <p>Đang chờ kết quả...</p>}
                    {success === true && (
                        <>
                            <h5 className="text-success">Thanh toán thành công!</h5>
                            <p>
                                Cảm ơn bạn đã đặt xe. Hệ thống sẽ gửi thông tin chi tiết qua
                                email/SMS.
                            </p>
                        </>
                    )}
                    {success === false && (
                        <>
                            <h5 className="text-danger">Thanh toán thất bại!</h5>
                            <p>Vui lòng thử lại hoặc chọn phương thức khác.</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPopup(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
