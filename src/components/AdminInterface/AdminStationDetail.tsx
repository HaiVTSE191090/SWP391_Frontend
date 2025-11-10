import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminStation } from "../../hooks/useAdminStation";
import { toast } from "react-toastify";
import { StationRequest } from "../../models/StationModel";
import { Container, Alert, Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const AdminStationDetail = () => {
    const { stationId } = useParams<{ stationId: string }>();
    const isCreateMode = !stationId;

    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCloseModal = () => setShowConfirmModal(false);
    const handleShowModal = () => setShowConfirmModal(true);

    const {
        station,
        error,
        isLoading,
        loadStationById,
        createStation,
        updateStation,
        deleteStation,
        setStation,
    } = useAdminStation();

    const handleConfirmDelete = async () => {
        handleCloseModal();
        if (!stationId) return;

        const toastId = toast.loading("Đang xóa trạm xe...");

        const res = await deleteStation(Number(stationId));

        if (res.success) {
            toast.update(toastId, {
                render: res.message,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            navigate(-1);
        } else {
            toast.update(toastId, {
                render: res.message,
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    useEffect(() => {
        if (!isCreateMode && stationId) {
            loadStationById(Number(stationId));
        } else {
            setStation(undefined);
        }
    }, [isCreateMode, loadStationById, stationId, setStation]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const stationData: StationRequest = {
            name: String(formData.get("name")),
            location: String(formData.get("location")),
            latitude: parseFloat(String(formData.get("latitude")) || "0"),
            longitude: parseFloat(String(formData.get("longitude")) || "0"),
            carNumber: parseInt(String(formData.get("carNumber")) || "0", 10),
            status: String(formData.get("status") || "ACTIVE"),
        };
        if (
            !stationData.name ||
            !stationData.location ||
            stationData.carNumber <= 0
        ) {
            toast.error("Vui lòng nhập Tên, Địa chỉ và Số lượng xe hợp lệ (> 0).");
            return;
        }

        const toastId = toast.loading(
            isCreateMode ? "Đang tạo mới..." : "Đang cập nhật..."
        );

        try {
            let res;
            if (isCreateMode) {
                res = await createStation(stationData);
            } else {
                if (!stationId) {
                    toast.update(toastId, {
                        render: "Không tìm thấy Id trạm xe",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    navigate(-1);
                    return;
                }
                res = await updateStation(
                    Number(stationId),
                    stationData as Partial<StationRequest>
                );
            }

            if (res.success) {
                toast.update(toastId, {
                    render: res.message,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                setTimeout(() => navigate(-1), 1000);
            } else {
                toast.update(toastId, {
                    render: res.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        } catch (error: any) {
            toast.update(toastId, {
                render: `Lỗi: ${error.response?.data?.message || "Lỗi không xác định"}`,
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    if (isLoading && !station && !isCreateMode) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: 200 }}
            >
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải chi tiết trạm xe...</span>
            </div>
        );
    }

    if (error && !isCreateMode) {
        return (
            <Container className="my-4">
                <Alert variant="danger">
                    <h4>Lỗi tải dữ liệu</h4>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} className="me-2" />
                        Quay lại
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Card>
                <Card.Header>
                    <h2>{isCreateMode ? "Tạo mới Trạm xe" : "Chi tiết Trạm xe"}</h2>
                </Card.Header>
                <Card.Body>
                    <Form
                        key={station?.stationId || "create"} 
                        onSubmit={handleSubmit}
                    >
                        {!isCreateMode && (
                            <Form.Group as={Row} className="mb-3" controlId="formStationId">
                                <Form.Label column sm={3}>
                                    Station ID
                                </Form.Label>
                                <Col sm={6}>
                                    <Form.Control
                                        type="text"
                                        defaultValue={station?.stationId}
                                        readOnly
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        )}

                        <Form.Group as={Row} className="mb-3" controlId="formName">
                            <Form.Label column sm={3}>
                                Tên trạm <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    defaultValue={station?.name ?? ""} // <-- Thay đổi
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formLocation">
                            <Form.Label column sm={3}>
                                Địa chỉ <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    defaultValue={station?.location ?? ""} // <-- Thay đổi
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formLatitude">
                            <Form.Label column sm={3}>
                                Vĩ độ (Latitude) <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    name="latitude"
                                    step="any"
                                    defaultValue={station?.latitude ?? ""} // <-- Thay đổi
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formLongitude">
                            <Form.Label column sm={3}>
                                Kinh độ (Longitude) <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    name="longitude"
                                    step="any"
                                    defaultValue={station?.longitude ?? ""} // <-- Thay đổi
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formCarNumber">
                            <Form.Label column sm={3}>
                                Số lượng xe (Tổng) <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    name="carNumber" // Gửi đi là carNumber
                                    min="1"
                                    defaultValue={station?.capacity ?? ""} // Lấy về là capacity
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formStatus">
                            <Form.Label column sm={3}>
                                Trạng thái
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Select
                                    name="status"
                                    defaultValue={station?.status ?? "ACTIVE"} // <-- Thay đổi
                                >
                                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                                    <option value="INACTIVE">Ngừng (INACTIVE)</option>
                                    <option value="MAINTENANCE">Bảo trì (MAINTENANCE)</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Row className="mt-4">
                            <Col sm={{ span: 9, offset: 3 }} className="d-flex">
                                <Button variant="primary" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <Spinner as="span" animation="border" size="sm" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    <span className="ms-2">
                                        {isCreateMode ? "Tạo mới" : "Lưu thay đổi"}
                                    </span>
                                </Button>

                                {!isCreateMode && (
                                    <Button
                                        variant="danger"
                                        className="ms-2"
                                        onClick={handleShowModal}
                                        disabled={isLoading}
                                    >
                                        <Trash2 size={18} />
                                        <span className="ms-2">Xóa</span>
                                    </Button>
                                )}

                                <Button
                                    variant="secondary"
                                    className="ms-auto"
                                    onClick={() => navigate(-1)}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft size={18} />
                                    <span className="ms-2">Quay lại</span>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Modal Xác nhận Xóa */}
            <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận Xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa trạm xe này không?
                    <br />
                    (Trạm: <strong>{station?.name}</strong>) {/* <-- Thay đổi */}
                    <br />
                    <small className="text-danger">Hành động này không thể hoàn tác.</small>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Xác nhận Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminStationDetail;