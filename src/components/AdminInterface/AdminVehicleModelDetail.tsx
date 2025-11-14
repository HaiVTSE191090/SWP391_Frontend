import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Spinner,
    Container,
    Card,
    Form,
    Button,
    Row,
    Col,
    Modal,
    Alert,
} from "react-bootstrap";

import { Save, Trash2, ArrowLeft } from "lucide-react";
import { useVehicleModel } from '../../hooks/useVehicleModel';
import { toast } from 'react-toastify';
import { VehicleModelRequest } from '../../models/VehicleModalModel';


const AdminVehicleModelDetail = () => {
    const { modelId } = useParams<{ modelId: string }>();
    const isCreateMode = !modelId;

    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCloseModal = () => setShowConfirmModal(false);
    const handleShowModal = () => setShowConfirmModal(true);
    const { vehicleModel,
        error,
        isLoading,
        loadVehicleModelById,
        createVehicleModel,
        updateVehicleModel,
        deleteVehicleModel,
        setVehicleModel } = useVehicleModel();

    const handleConfirmDelete = async () => {
        handleCloseModal();
        if (!modelId) return;

        const toastId = toast.loading("Đang xóa mẫu xe...");

        const res = await deleteVehicleModel(Number(modelId));

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
        if (!isCreateMode && modelId) {
            loadVehicleModelById(Number(modelId));
        } else {
            setVehicleModel(undefined);
        }
    }, [isCreateMode, loadVehicleModelById, modelId, setVehicleModel]);



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const seatingCapacityStr = String(formData.get("seatingCapacity")).trim();
        const seatingCapacity = seatingCapacityStr
            ? parseInt(seatingCapacityStr, 10)
            : 0;

        const batteryStr = String(formData.get("batteryCapacity")).trim();
        const batteryCapacity = batteryStr ? parseFloat(batteryStr) : "null";

        const modelData = {
            modelName: String(formData.get("modelName")),
            manufacturer: String(formData.get("manufacturer")),
            batteryCapacity: batteryCapacity,
            seatingCapacity: isNaN(seatingCapacity) ? 0 : seatingCapacity,
        };

        if (
            !modelData.modelName ||
            !modelData.manufacturer ||
            modelData.seatingCapacity <= 0
        ) {
            toast.error("Vui lòng nhập Tên, Hãng và Số chỗ hợp lệ.");
            return;
        }

        const toastId = toast.loading(
            isCreateMode ? "Đang tạo mới..." : "Đang cập nhật..."
        );

        try {
            let res;
            if (isCreateMode) {
                res = await createVehicleModel(modelData as VehicleModelRequest);

            } else {
                if (!modelId) {
                    toast.update(toastId, {
                        render: "Không tìm thấy Id",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    })

                    navigate(-1);
                    return;
                };
                res = await updateVehicleModel(
                    Number(modelId),
                    modelData as Partial<VehicleModelRequest>
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

    if (isLoading && !vehicleModel && !isCreateMode) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: 200 }}
            >
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải chi tiết mẫu xe...</span>
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
                    <h2>{isCreateMode ? "Tạo mới Mẫu xe" : "Chi tiết Mẫu xe"}</h2>
                </Card.Header>
                <Card.Body>
                    <Form
                        // Quan trọng: Dùng key để reset form khi vehicleModel thay đổi
                        key={vehicleModel?.modelId || "create"}
                        onSubmit={handleSubmit}
                    >
                        {!isCreateMode && (
                            <Form.Group as={Row} className="mb-3" controlId="formModelId">
                                <Form.Label column sm={3}>
                                    Model ID
                                </Form.Label>
                                <Col sm={6}>
                                    <Form.Control
                                        type="text"
                                        defaultValue={vehicleModel?.modelId}
                                        readOnly
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        )}

                        <Form.Group as={Row} className="mb-3" controlId="formModelName">
                            <Form.Label column sm={3}>
                                Tên mẫu xe (modelName) <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="modelName"
                                    defaultValue={vehicleModel?.modelName ?? ""}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formManufacturer">
                            <Form.Label column sm={3}>
                                Hãng (manufacturer) <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="manufacturer"
                                    defaultValue={vehicleModel?.manufacturer ?? ""}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formBatteryCapacity"
                        >
                            <Form.Label column sm={3}>
                                Dung lượng Pin (kWh)
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    name="batteryCapacity"
                                    step="0.1"
                                    placeholder="Bỏ trống nếu không áp dụng"
                                    // Sửa: Dùng ?? "" để xử lý giá trị 0 hoặc null
                                    defaultValue={vehicleModel?.batteryCapacity ?? ""}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formSeatingCapacity"
                        >
                            <Form.Label column sm={3}>
                                Số chỗ (seatingCapacity) <span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="number"
                                    name="seatingCapacity"
                                    min="1"
                                    defaultValue={vehicleModel?.seatingCapacity ?? ""}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Row className="mt-4">
                            <Col sm={{ span: 9, offset: 3 }} className="d-flex">
                                {/* Nút Submit */}
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

                                {/* Nút Xóa (chỉ khi update) */}
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

                                {/* Nút Quay lại (đẩy sang phải) */}
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
                    Bạn có chắc chắn muốn xóa mẫu xe này không?
                    <br />
                    (Model: <strong>{vehicleModel?.modelName}</strong>)
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
    )

}

export default AdminVehicleModelDetail
