import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
    ListGroup,
    Image,
    Form,
    Button,
    Badge,
    Modal,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useBlacklist } from "../../hooks/useBlackList"; 
import { ReportImage } from "../../models/BlacklistModel";


const AdminReportDetail = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const {
        reportDetail,
        isLoading,
        error,
        loadReportDetail,
        sendWarning,
    } = useBlacklist();

    const [warningMessage, setWarningMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState("");
    const [sendSuccess, setSendSuccess] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ReportImage | null>(null);

    useEffect(() => {
        const id = Number(bookingId);
        if (id) {
            loadReportDetail(id);
        } else {
            navigate("/admin/customer");
        }
    }, [bookingId, loadReportDetail, navigate]);

    // Xử lý gửi cảnh báo
    const handleSendWarning = async () => {
        if (!warningMessage) {
            setSendError("Nội dung cảnh báo không được để trống.");
            return;
        }
        if (!reportDetail) return;

        setIsSending(true);
        setSendError("");
        setSendSuccess("");

        const warningData = {
            bookingId: Number(bookingId),
            note: warningMessage,
        };

        const result = await sendWarning(warningData);

        if (result?.success) {
            setSendSuccess("Đã gửi cảnh báo thành công!");
            setWarningMessage(""); 
        } else {
            setSendError(result?.err || "Gửi cảnh báo thất bại.");
        }
        setIsSending(false);
    };

    const handleImageClick = (image: ReportImage) => {
        setSelectedImage(image);
        setShowImageModal(true);
    };

    const handleCloseModal = () => {
        setShowImageModal(false);
        setSelectedImage(null); // Clear ảnh khi đóng
    };

    // --- Render Functions ---

    if (isLoading && !reportDetail) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!reportDetail) {
        return (
            <Container className="my-4">
                <Alert variant="warning">Không tìm thấy chi tiết báo cáo.</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="my-4">
            <Button variant="light" onClick={() => navigate(-1)} className="mb-3">
                &larr; Quay lại
            </Button>

            <h2>Chi tiết Báo cáo (Booking #{reportDetail.bookingId})</h2>
            <hr />

            <Row>
                {/* === CỘT BÊN TRÁI: THÔNG TIN === */}
                <Col md={5}>
                    {/* Thông tin Booking */}
                    <Card className="mb-4">
                        <Card.Header as="h5">Thông tin Booking</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                {/* SỬA: Thuộc tính tồn tại */}
                                <strong>Xe:</strong> {reportDetail.vehicleName} (
                                {reportDetail.vehiclePlateNumber})
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Trạng thái:</strong>
                                <Badge
                                    // SỬA: Thuộc tính tồn tại
                                    bg={
                                        reportDetail.status === "COMPLETED" ? "success" : "warning"
                                    }
                                    className="ms-2"
                                >
                                    {/* SỬA: Thuộc tính tồn tại */}
                                    {reportDetail.status}
                                </Badge>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Bắt đầu:</strong>{" "}
                                {/* SỬA: Thuộc tính tồn tại */}
                                {new Date(reportDetail.startDateTime).toLocaleString("vi-VN")}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Kết thúc:</strong>{" "}
                                {/* SỬA: Thuộc tính tồn tại */}
                                {new Date(reportDetail.endDateTime).toLocaleString("vi-VN")}
                            </ListGroup.Item>
                            {/* LƯU Ý: actualReturnTime không có trong JSON API mới.
                Nếu cần, bạn phải thêm nó vào Backend DTO và model BookingReportDetail
              <ListGroup.Item>
                <strong>Thực trả:</strong>{" "}
                {new Date(reportDetail.actualReturnTime).toLocaleString("vi-VN")}
              </ListGroup.Item> 
              */}
                            <ListGroup.Item>
                                <strong>Tổng tiền:</strong>{" "}
                                {/* SỬA: Thuộc tính tồn tại */}
                                {reportDetail.totalAmount.toLocaleString("vi-VN")} VND
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>

                    {/* Thông tin Người thuê */}
                    <Card className="mb-4">
                        <Card.Header as="h5">Thông tin Người thuê</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                {/* SỬA: Truy cập object lồng 'renter' */}
                                <strong>ID:</strong> {reportDetail.renter.renterId}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {/* SỬA: Truy cập object lồng 'renter' */}
                                <strong>Tên:</strong> {reportDetail.renter.fullName}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {/* SỬA: Truy cập object lồng 'renter' */}
                                <strong>Email:</strong> {reportDetail.renter.email}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>

                    {/* Gửi cảnh báo */}
                    <Card>
                        <Card.Header as="h5">Gửi cảnh báo</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nội dung cảnh báo</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={warningMessage}
                                        onChange={(e) => setWarningMessage(e.target.value)}
                                        placeholder={`Gửi cảnh báo cho ${reportDetail.renter.fullName} về vi phạm...`} // SỬA: Truy cập object lồng 'renter'
                                    />
                                </Form.Group>

                                {sendSuccess && <Alert variant="success">{sendSuccess}</Alert>}
                                {sendError && <Alert variant="danger">{sendError}</Alert>}

                                <Button
                                    variant="warning"
                                    onClick={handleSendWarning}
                                    disabled={isSending}
                                >
                                    {isSending ? (
                                        <>
                                            <Spinner size="sm" /> Đang gửi...
                                        </>
                                    ) : (
                                        "Gửi cảnh báo"
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* === CỘT BÊN PHẢI: HÌNH ẢNH HƯ HỎNG === */}
                <Col md={7}>
                    <Card>
                        <Card.Header as="h5">Hình ảnh Hư hỏng (Damage)</Card.Header>
                        <Card.Body>
                            <Row>
                                {reportDetail.images
                                    .filter((img) => img.imageType === "DAMAGE")
                                    .map((image) => (
                                        <Col md={6} lg={4} key={image.imageId} className="mb-3">
                                            {/* 5. THÊM onClick VÀ CURSOR */}
                                            <Card
                                                className="h-100"
                                                onClick={() => handleImageClick(image)} // <-- SỬA
                                                style={{ cursor: "pointer" }} // <-- SỬA
                                            >
                                                <Card.Img
                                                    variant="top"
                                                    as={Image}
                                                    src={image.imageUrl}
                                                    thumbnail
                                                    style={{
                                                        objectFit: "cover",
                                                        height: "150px",
                                                    }}
                                                />
                                                <Card.Body className="p-2">
                                                    <Card.Title as="h6">
                                                        {image.description || "Hình ảnh vi phạm"}
                                                    </Card.Title>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}

                                {/* ... (code báo không có ảnh giữ nguyên) ... */}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showImageModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedImage?.description || "Hình ảnh vi phạm"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Image src={selectedImage?.imageUrl} fluid />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminReportDetail;