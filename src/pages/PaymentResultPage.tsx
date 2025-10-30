import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spinner, Alert, Button } from "react-bootstrap";

export default function PaymentResultPage() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const sendIpnToBackend = async () => {
            try {
                const ipnData = {
                    partnerCode: searchParams.get("partnerCode"),
                    orderId: searchParams.get("orderId"),
                    requestId: searchParams.get("requestId"),
                    amount: Number(searchParams.get("amount")),
                    orderInfo: searchParams.get("orderInfo"),
                    orderType: searchParams.get("orderType"),
                    transId: Number(searchParams.get("transId")),
                    resultCode: Number(searchParams.get("resultCode")),
                    message: searchParams.get("message"),
                    payType: searchParams.get("payType"),
                    responseTime: Number(searchParams.get("responseTime")),
                    extraData: searchParams.get("extraData"),
                    signature: searchParams.get("signature"),
                };

                console.log("📩 Gửi IPN đến backend:", ipnData);

                const res = await axios.post(
                    "http://localhost:8080/api/payments/momo/ipn",
                    ipnData
                );

                console.log("✅ Backend phản hồi:", res.data);
                setSuccess(ipnData.resultCode === 0);
                setMessage(ipnData.resultCode === 0
                    ? "Thanh toán thành công!"
                    : "Thanh toán thất bại!"
                );
            } catch (err: any) {
                console.error("❌ Lỗi khi gửi IPN:", err);
                setSuccess(false);
                setMessage("Không thể xác nhận thanh toán. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        sendIpnToBackend();
    }, [searchParams]);

    return (
        <div className="container text-center mt-5">
            {loading ? (
                <div>
                    <Spinner animation="border" />
                    <p>Đang xác nhận thanh toán...</p>
                </div>
            ) : (
                <>
                    {success ? (
                        <Alert variant="success">
                            <h4>🎉 Thanh toán thành công!</h4>
                            <p>{message}</p>
                        </Alert>
                    ) : (
                        <Alert variant="danger">
                            <h4>❌ Thanh toán thất bại</h4>
                            <p>{message}</p>
                        </Alert>
                    )}

                    <Button variant="primary" onClick={() => navigate("/")}>
                        Về trang chủ
                    </Button>
                </>
            )}
        </div>
    );
}
