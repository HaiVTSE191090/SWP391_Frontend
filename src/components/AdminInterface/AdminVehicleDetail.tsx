import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleAdmin } from '../../hooks/useVehicleAdmin'; // <-- Hook của bạn
import {
    Spinner,
    Container,
    Card,
    Form,
    Button,
    Row,
    Col,
    Modal,
} from 'react-bootstrap';
import { CreateVehicleDTO, VehicleStatus } from '../../models/VehicleModel'; // <-- Model của bạn
import { toast } from 'react-toastify';
import { useStation } from '../../hooks/useStation';
import { useVehicleModel } from '../../hooks/useVehicleModel';

const AdminVehicleDetail = () => {
    const { vehicleId } = useParams<{ vehicleId: string }>();
    const isCreateMode = !vehicleId;
    const navigate = useNavigate();

    const {
        vehicle,
        error,
        isLoading,
        loadVehicleById,
        updateVehicle,
        createVehicle,
        deleteVehicle,
        uploadVehicleImage
    } = useVehicleAdmin();

    const {loadNameAndIdStations, getStationIdAndName} = useStation();
    const { getModelNameAndId, modelNameAndId } = useVehicleModel();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [uploadError, setUploadError] = useState<string>(""); // Biến này chưa được dùng

    // 2. Tải dữ liệu khi ở chế độ Edit
    // --- SỬA LẠI Ở ĐÂY ---
    useEffect(() => {
        if (!isCreateMode && vehicleId) {
            loadVehicleById(Number(vehicleId));
        }
        loadNameAndIdStations();
        getModelNameAndId();
    }, [getModelNameAndId, isCreateMode, loadNameAndIdStations, loadVehicleById, vehicleId]);
    // --- HẾT PHẦN SỬA ---

    // 3. Xử lý loading và error
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải dữ liệu xe...</span>
            </div>
        );
    }

    // Lỗi chỉ hiển thị khi ở chế độ Edit (vì Create Mode không load data)
    if (error && !isCreateMode) {
        return <div className='d-flex justify-content-center align-items-center'>Không thể tải được thông tin xe: {error}</div>;
    }

    // 4. Xử lý Submit (Tạo mới hoặc Cập nhật)
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // --- 1. Lấy và Chuẩn Hóa Dữ Liệu ---

        // Dùng .trim() cho các trường @NotBlank
        const vehicleName = String(formData.get('vehicleName') || '').trim();
        const plateNumber = String(formData.get('plateNumber') || '').trim();

        // Chuyển đổi số, dùng || 0 để Number() không bị lỗi với chuỗi rỗng
        const modelId = Number(formData.get('modelId') || 0);
        const stationId = Number(formData.get('stationId') || 0);

        // Dùng -1 làm giá trị mặc định để kiểm tra @DecimalMin("0.0")
        // (Vì 0 là giá trị hợp lệ)
        const pricePerHour = Number(formData.get('pricePerHour') || -1);
        const pricePerDay = Number(formData.get('pricePerDay') || -1);
        const mileage = Number(formData.get('mileage') || -1);

        // Xử lý BatteryLevel: Lấy từ form. Nếu không có thì mới dùng giá trị cũ (nếu là edit) hoặc mặc định
        const batteryLevelInput = formData.get('batteryLevel');
        // Nếu bạn CÓ một ô input cho batteryLevel
        const batteryLevel = Number(batteryLevelInput !== null ? batteryLevelInput : -1);
        // Nếu bạn KHÔNG CÓ ô input cho batteryLevel (ví dụ: form tạo mới)
        // const batteryLevel = vehicle?.batteryLevel || 100; // Dùng logic cũ của bạn

        const description = String(formData.get('description') || '');

        // --- 2. Kiểm Tra (Validation) ---

        // @NotBlank(message = "Vihicle name Not be blank")
        if (vehicleName === '') {
            toast.error("Tên xe không được để trống");
            return; // Dừng hàm
        }
        // @Size(max = 100, message = "Vehicle name must be less than 100 characters")
        if (vehicleName.length > 100) {
            toast.error("Tên xe không được vượt quá 100 ký tự");
            return;
        }

        // @NotBlank(message = "Plate number Not be blank")
        if (plateNumber === '') {
            toast.error("Biển số xe không được để trống");
            return;
        }
        // @Size(max = 20, message = "Plate number must be less than 20 characters")
        if (plateNumber.length > 20) {
            toast.error("Biển số xe không được vượt quá 20 ký tự");
            return;
        }

        // @NotNull & @Positive (modelId)
        if (modelId <= 0) {
            toast.error("Vui lòng chọn Model xe");
            return;
        }

        // @NotNull & @Positive (stationId)
        if (stationId <= 0) {
            toast.error("Vui lòng chọn Trạm");
            return;
        }

        // @NotNull & @DecimalMin(value = "0.0") (pricePerHour)
        if (pricePerHour < 0) {
            toast.error("Giá thuê theo giờ phải lớn hơn hoặc bằng 0");
            return;
        }

        // @NotNull & @DecimalMin(value = "0.0") (pricePerDay)
        if (pricePerDay < 0) {
            toast.error("Giá thuê theo ngày phải lớn hơn hoặc bằng 0");
            return;
        }

        // @NotNull & @DecimalMin(value = "0.0") (mileage)
        if (mileage < 0) {
            toast.error("Quãng đường phải lớn hơn hoặc bằng 0");
            return;
        }

        // @Size(max = 5000) (description)
        if (description.length > 5000) {
            toast.error("Mô tả không được vượt quá 5000 ký tự");
            return;
        }
        
        const dto = {
            vehicleName: String(formData.get('vehicleName')),
            plateNumber: String(formData.get('plateNumber')),
            modelId: Number(formData.get('modelId')),
            stationId: Number(formData.get('stationId')),
            pricePerHour: Number(formData.get('pricePerHour')),
            pricePerDay: Number(formData.get('pricePerDay')),
            batteryLevel: vehicle?.batteryLevel || 100, // Lấy pin cũ hoặc mặc định 100
            mileage: Number(formData.get('mileage')),
            description: String(formData.get('description')),
            status: String(formData.get('status')),
        };

        const toastId = toast.loading(isCreateMode ? "Đang tạo xe..." : "Đang cập nhật...", {
            position: "top-right",
        });

        try {
            let result;
            if (isCreateMode) {
                // Gửi CreateVehicleDTO (không có vehicleId)
                result = await createVehicle(dto as CreateVehicleDTO);
            } else {
                
                result = await updateVehicle(Number(vehicleId), dto);
            }

            if (result?.success) {
                toast.update(toastId, {
                    render: isCreateMode ? "Tạo xe thành công!" : "Cập nhật thành công!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });

                if (selectedFile) {
                    const newVehicleId = result.data?.vehicleId;
                    if(!newVehicleId) {
                        alert("Không tìm thấy Id xe")
                        return;
                    }
                    await handleImageUpload(newVehicleId);
                }

                setTimeout(() => navigate(-1), 1000); // Quay lại trang list
            } else {
                toast.update(toastId, {
                    render: result?.err || (isCreateMode ? "Tạo xe thất bại" : "Cập nhật thất bại"),
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        } catch (error: any) {
            toast.update(toastId, {
                render: `Lỗi: ${error.message || 'Lỗi không xác định'}`,
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    // 5. Xử lý Xóa
    const handleShowModal = () => setShowConfirmModal(true);
    const handleCloseModal = () => setShowConfirmModal(false);

    const handleConfirmDelete = async () => {
        handleCloseModal();
        const toastId = toast.loading("Đang xóa...");
        try {
            // Dùng vehicleId từ URL params
            const data = await deleteVehicle(Number(vehicleId));
            toast.update(toastId, {
                render: data?.message || "Xóa thành công",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            navigate(-1);
        } catch (error: any) {
            toast.update(toastId, {
                render: error.message || "Xóa thất bại",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    // 6. Xử lý Upload Ảnh
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleImageUpload = async (id: number) => {
        if (!selectedFile) return;

        const uploadToastId = toast.loading("Đang upload ảnh...");
        const result = await uploadVehicleImage(id, selectedFile);

        if (result.success) {
            toast.update(uploadToastId, {
                render: "Upload ảnh thành công!",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            if (loadVehicleById) {
                loadVehicleById(id);
            }
            setSelectedFile(null);
        } else {
            toast.update(uploadToastId, {
                render: `Upload ảnh thất bại: ${result.err}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    // 7. Render Form
    return (
        <Container className='my-4'>
            <Card>
                <Card.Header>
                    <h2>{isCreateMode ? 'Tạo mới Xe' : 'Chi tiết Xe'}</h2>
                </Card.Header>
                <Card.Body>
                    {/* Dùng 'key' để reset form khi chuyển từ edit sang create hoặc ngược lại */}
                    <Form key={vehicle?.vehicleId || 'create'} onSubmit={handleSubmit}>
                        <Row>
                            {/* Cột 1: Thông tin cơ bản */}
                            <Col md={6}>
                                <Form.Group as={Row} className="mb-3" controlId="formVehicleName">
                                    <Form.Label column sm={4}>Tên Xe</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="vehicleName"
                                            defaultValue={vehicle?.vehicleName || ''}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formPlateNumber">
                                    <Form.Label column sm={4}>Biển số xe</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="plateNumber"
                                            defaultValue={vehicle?.plateNumber || ''}
                                            required
                                            readOnly={!isCreateMode}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formModelId">
                                    <Form.Label column sm={4}>Model ID</Form.Label>
                                    <Col sm={8}>
                                        <Form.Select
                                            name="modelId" // Giữ nguyên name="modelId"
                                            defaultValue={vehicle?.modelId || ''} // Giữ nguyên logic này
                                            required
                                        >
                                            {/* Option mặc định */}
                                            <option value={""} disabled>-- Vui lòng chọn Model --</option>

                                            {modelNameAndId.map(model => (
                                                <option
                                                    key={vehicle?.modelId ||model.modelId }
                                                    value={vehicle?.modelId ||model.modelId} 
                                                >
                                                    {model.modalName} 
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formStationId">
                                    <Form.Label column sm={4}>Station ID</Form.Label>
                                    <Col sm={8}>
                                        <Form.Select
                                            name="stationId"
                                            defaultValue={vehicle?.stationId || ''}
                                            required
                                        >
                                            <option value="" disabled>-- Vui lòng chọn trạm --</option>

                                            {getStationIdAndName.map(station => (
                                                <option
                                                    key={station.stationId} 
                                                    value={station.stationId}
                                                >
                                                    {station.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formStatus">
                                    <Form.Label column sm={4}>Trạng thái</Form.Label>
                                    <Col sm={8}>
                                        <Form.Select
                                            name="status"
                                            defaultValue={vehicle?.status || 'MAINTENANCE'}
                                        >
                                            <option value={VehicleStatus.AVAILABLE}>Sẵn sàng (AVAILABLE)</option>
                                            <option value={VehicleStatus.MAINTENANCE}>Bảo trì (MAINTENANCE)</option>
                                            <option value={VehicleStatus.IN_REPAIR}>Đang sửa (IN_REPAIR)</option>
                                            {/* Thêm các status khác nếu cần */}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                            </Col>

                            {/* Cột 2: Giá và thông số */}
                            <Col md={6}>
                                <Form.Group as={Row} className="mb-3" controlId="formPricePerHour">
                                    <Form.Label column sm={4}>Giá / giờ (VND)</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="number"
                                            name="pricePerHour"
                                            defaultValue={vehicle?.pricePerHour || ''}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formPricePerDay">
                                    <Form.Label column sm={4}>Giá / ngày (VND)</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="number"
                                            name="pricePerDay"
                                            defaultValue={vehicle?.pricePerDay || ''}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formMileage">
                                    <Form.Label column sm={4}>Số Km (Mileage)</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="number"
                                            name="mileage"
                                            defaultValue={vehicle?.mileage || 0}
                                            readOnly={!isCreateMode}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formDescription">
                                    <Form.Label column sm={4}>Mô tả</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="description"
                                            defaultValue={vehicle?.description || ''}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>

                        <hr />

                        {/* Phần Upload Ảnh */}
                        <Row>
                            <Col md={12}>
                                <h5>Upload Ảnh</h5>
                                <Form.Group as={Row} className="mb-3" controlId="formFile">
                                    <Form.Label column sm={2}>Chọn ảnh mới</Form.Label>
                                    <Col sm={10}>
                                        <Form.Control
                                            type="file"
                                            name="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        {isCreateMode && <Form.Text muted>Bạn phải lưu xe trước, sau đó ảnh sẽ được upload.</Form.Text>}
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Nút bấm */}
                        <Row className="mt-4">
                            <Col md={{ span: 8, offset: 4 }}>
                                <Button variant="primary" type="submit">
                                    {isCreateMode ? 'Tạo mới' : 'Lưu thay đổi'}
                                </Button>

                                {!isCreateMode && (
                                    <Button
                                        variant="danger"
                                        className="ms-2"
                                        onClick={handleShowModal} // Nút Xóa
                                    >
                                        Xóa
                                    </Button>
                                )}

                                <Button
                                    variant="secondary"
                                    className="ms-2"
                                    onClick={() => navigate(-1)} // Nút Quay lại
                                >
                                    Quay lại
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Modal Xóa */}
            <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận Xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa xe này không?
                    <br />
                    (Xe: <strong>{vehicle?.vehicleName} - {vehicle?.plateNumber}</strong>)
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
}

export default AdminVehicleDetail;