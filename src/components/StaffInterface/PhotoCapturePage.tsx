import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// Import API services
import { getVehicleComponents, getImageTypes, getImageChecklist, uploadCarImage, deleteBookingImage } from './services/authServices'; 

// Interface cho một dòng chi tiết
interface DamageDetail {
    tempId: number;
    itemId: string;
    photoUrl: string;
    photoFile?: File | null;
    description: string;
    isUploading: boolean;
    isRequired?: boolean; // Đánh dấu item bắt buộc
    imageId?: number; // ID của ảnh trên server
}

// Interface cho checklist response
interface ImageChecklist {
    missingComponents: string[];
    completionPercentage: number;
    capturedComponents: string[];
    requiredComponents: string[];
    isComplete: boolean;
}

const createNewDamageDetail = (isRequired: boolean = false): DamageDetail => ({
    tempId: Date.now() + Math.random(), // ID tạm thời duy nhất
    itemId: '',
    photoUrl: '',
    description: '',
    isUploading: false,
    isRequired,
});

const createRequiredDetail = (componentName: string): DamageDetail => ({
    tempId: Date.now() + Math.random(),
    itemId: componentName,
    photoUrl: '',
    description: '',
    isUploading: false,
    isRequired: true,
});

const PhotoCapturePage: React.FC = () => {
    const { bookingId, type } = useParams<{ bookingId: string, type: string }>();
    const navigate = useNavigate();

    const [requiredList, setRequiredList] = useState<DamageDetail[]>([]); // Danh sách bắt buộc
    const [optionalList, setOptionalList] = useState<DamageDetail[]>([]); // Danh sách tùy chọn
    const [loading, setLoading] = useState(false);
    const [vehicleComponents, setVehicleComponents] = useState<string[]>([]);
    const [imageTypes, setImageTypes] = useState<string[]>([]);
    const [checklist, setChecklist] = useState<ImageChecklist | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [errorLoadingData, setErrorLoadingData] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ tempId: number; isRequired: boolean } | null>(null);

    // Xác định tiêu đề trang dựa vào image type
    const getPageTitle = () => {
        if (type === 'BEFORE_RENTAL') return 'TRƯỚC KHI THUÊ (Check-in)';
        if (type === 'AFTER_RENTAL') return 'SAU KHI TRẢ (Check-out)';
        if (type === 'DAMAGE') return 'BÁO CÁO HƯ HỎNG (Damage Report)';
        return 'KHÔNG XÁC ĐỊNH';
    };

    const pageTitle = getPageTitle();
    const isValidType = ['BEFORE_RENTAL', 'AFTER_RENTAL', 'DAMAGE'].includes(type || '');

    useEffect(() => {
        document.title = `Ghi nhận chi tiết xe - ${pageTitle}`;
    }, [pageTitle]);

    // Load tất cả dữ liệu cần thiết khi trang mở
    useEffect(() => {
        const fetchData = async () => {
            if (!bookingId || !type) return;

            try {
                setLoadingData(true);
                setErrorLoadingData(false);

                // Gọi API lấy danh sách vehicle components
                const componentsRes = await getVehicleComponents();
                if (componentsRes?.data?.data) {
                    setVehicleComponents(componentsRes.data.data);
                }

                // Gọi API lấy danh sách image types
                const typesRes = await getImageTypes();
                if (typesRes?.data?.data) {
                    setImageTypes(typesRes.data.data);
                    // Kiểm tra type từ URL có hợp lệ không
                    if (!typesRes.data.data.includes(type)) {
                        setErrorLoadingData(true);
                        setLoadingData(false);
                        return;
                    }
                }

                // Gọi API lấy danh sách ảnh bắt buộc
                try {
                    const checklistRes = await getImageChecklist(parseInt(bookingId), type);
                    
                    if (checklistRes?.data?.data) {
                        const data = checklistRes.data.data;
                        setChecklist(data);

                        // Chỉ tạo danh sách required khi KHÔNG phải DAMAGE
                        if (type !== 'DAMAGE' && data.requiredComponents) {
                            const items = data.requiredComponents.map((name: string) => 
                                createRequiredDetail(name)
                            );
                            setRequiredList(items);
                        }
                    }
                } catch (error) {
                    // Nếu API checklist fail và KHÔNG phải DAMAGE, dùng mock data
                    if (type !== 'DAMAGE') {
                        const mockData: ImageChecklist = {
                            requiredComponents: ["EXTERIOR_FRONT", "EXTERIOR_BACK", "EXTERIOR_LEFT", "EXTERIOR_RIGHT", "DASHBOARD", "MILEAGE_METER", "BATTERY_INDICATOR"],
                            missingComponents: ["EXTERIOR_FRONT", "EXTERIOR_BACK", "EXTERIOR_LEFT", "EXTERIOR_RIGHT", "DASHBOARD", "MILEAGE_METER", "BATTERY_INDICATOR"],
                            capturedComponents: [],
                            completionPercentage: 0,
                            isComplete: false
                        };
                        setChecklist(mockData);
                        setRequiredList(mockData.requiredComponents.map(createRequiredDetail));
                    }
                }

            } catch (error) {
                setErrorLoadingData(true);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [type, bookingId]);

    // Thay đổi giá trị của một field (itemId, description, etc.)
    const handleDetailChange = (tempId: number, field: keyof DamageDetail, value: string, isRequired: boolean) => {
        const setList = isRequired ? setRequiredList : setOptionalList;
        setList(prev => prev.map(item => 
            item.tempId === tempId ? { ...item, [field]: value } : item
        ));
    };

    // Xử lý khi user rời khỏi ô description (blur) - tự động update nếu đã có ảnh
    const handleDescriptionBlur = async (tempId: number, isRequired: boolean) => {
        const allItems = [...requiredList, ...optionalList];
        const currentItem = allItems.find(item => item.tempId === tempId);
        
        // Nếu đã upload ảnh và có photoFile, re-upload với description mới
        if (currentItem && currentItem.photoUrl && currentItem.photoFile) {
            try {
                await uploadCarImage(
                    parseInt(bookingId!),
                    type!,
                    currentItem.itemId,
                    currentItem.description || 'Chưa có mô tả',
                    currentItem.photoFile
                );
                toast.info('Đã cập nhật mô tả!');
            } catch (error) {
                console.error('Lỗi khi cập nhật description:', error);
                toast.error('Không thể cập nhật mô tả. Vui lòng thử lại.');
            }
        }
    };

    


    // Thêm một hạng mục tùy chọn mới
    const handleAddOptionalDetail = () => {
        setOptionalList(prev => [...prev, createNewDamageDetail(false)]);
    };

    // Xóa một hạng mục tùy chọn
    const handleRemoveOptionalDetail = (tempId: number) => {
        setOptionalList(prev => prev.filter(item => item.tempId !== tempId));
    };

    // Hiển thị modal xác nhận xóa
    const handleRemovePhotoClick = (tempId: number, isRequired: boolean) => {
        const allItems = [...requiredList, ...optionalList];
        const currentItem = allItems.find(item => item.tempId === tempId);
        
        if (!currentItem?.imageId) return;
        
        setDeleteTarget({ tempId, isRequired });
        setShowDeleteModal(true);
    };

    // Xóa ảnh đã upload - gọi API xóa trên server
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        const { tempId, isRequired } = deleteTarget;
        const allItems = [...requiredList, ...optionalList];
        const currentItem = allItems.find(item => item.tempId === tempId);
        
        if (!currentItem?.imageId) return;

        setShowDeleteModal(false);

        try {
            await deleteBookingImage(parseInt(bookingId!), currentItem.imageId);
            
            const setList = isRequired ? setRequiredList : setOptionalList;
            setList(prev => prev.map(item =>
                item.tempId === tempId ? { ...item, photoUrl: '', photoFile: null, imageId: undefined } : item
            ));
            
            toast.success('Đã xóa ảnh thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa ảnh:', error);
            toast.error('Không thể xóa ảnh. Vui lòng thử lại.');
        } finally {
            setDeleteTarget(null);
        }
    };

    // Upload ảnh lên server
    const handleFileUpload = async (tempId: number, file: File, isRequired: boolean) => {
        const setList = isRequired ? setRequiredList : setOptionalList;
        
        // Tìm item hiện tại
        const allItems = [...requiredList, ...optionalList];
        const currentItem = allItems.find(item => item.tempId === tempId);
        
        if (!currentItem) return;

        // Kiểm tra phải chọn hạng mục trước (với optional)
        if (!isRequired && !currentItem.itemId) {
            toast.warning('Vui lòng chọn Hạng mục trước khi upload ảnh!');
            return;
        }

        // Kiểm tra phải nhập description trước khi upload
        if (!currentItem.description || currentItem.description.trim() === '') {
            toast.warning('Vui lòng nhập MÔ TẢ trước khi upload ảnh!');
            return;
        }

        // Đánh dấu đang upload
        setList(prev => prev.map(item =>
            item.tempId === tempId ? { ...item, photoFile: file, isUploading: true, photoUrl: '' } : item
        ));

        // Gọi API upload
        const response = await uploadCarImage(
            parseInt(bookingId!),
            type!,
            currentItem.itemId,
            currentItem.description.trim(),
            file
        );

        if (response?.data?.data?.imageUrl) {
            // Upload thành công - lưu cả imageId từ response
            setList(prev => prev.map(item =>
                item.tempId === tempId ? { 
                    ...item, 
                    isUploading: false, 
                    photoUrl: response.data.data.imageUrl, 
                    photoFile: file,
                    imageId: response.data.data.imageId // Lưu imageId từ server
                } : item
            ));
            toast.success('Upload ảnh thành công!');
        } else {
            // Upload thất bại
            toast.error('Upload ảnh thất bại. Vui lòng thử lại.');
            setList(prev => prev.map(item =>
                item.tempId === tempId ? { ...item, isUploading: false, photoFile: null } : item
            ));
        }
    };

    // Kiểm tra trạng thái form để enable/disable nút Lưu
    const checkFormValid = () => {
        // Required: phải có đủ ảnh VÀ mô tả
        const hasInvalidRequired = requiredList.some(item => !item.photoUrl || !item.description.trim());
        
        // Optional: nếu đã chọn hạng mục thì phải có ảnh VÀ mô tả
        const hasInvalidOptional = optionalList.some(item => item.itemId && (!item.photoUrl || !item.description.trim()));
        
        // Có item nào đang upload không
        const isStillUploading = [...requiredList, ...optionalList].some(item => item.isUploading);

        return { hasInvalidRequired, hasInvalidOptional, isStillUploading };
    };


    // Xác nhận và quay về trang booking detail
    const handleSubmit = () => {
        const formValid = checkFormValid();

        // Validate: Required items phải có ảnh VÀ mô tả
        if (requiredList.length > 0 && formValid.hasInvalidRequired) {
            toast.error("Vui lòng upload ảnh VÀ nhập mô tả cho TẤT CẢ các hạng mục BẮT BUỘC.");
            return;
        }

        // Validate: Optional items đã chọn phải có ảnh VÀ mô tả
        if (formValid.hasInvalidOptional) {
            toast.error("Vui lòng upload ảnh VÀ nhập mô tả cho các hạng mục tùy chọn đã chọn.");
            return;
        }

        // Validate: Đợi upload xong
        if (formValid.isStillUploading) {
            toast.warning("Vui lòng đợi quá trình upload ảnh hoàn tất.");
            return;
        }

        // Phải có ít nhất 1 item
        const validOptional = optionalList.filter(item => item.itemId && item.photoUrl && item.description.trim());
        if (requiredList.length === 0 && validOptional.length === 0) {
            toast.error("Vui lòng thêm ít nhất một hạng mục để lưu.");
            return;
        }

        // Tất cả ảnh đã được upload lên server rồi
        const totalUploaded = requiredList.length + validOptional.length;
        toast.success(`Đã upload thành công ${totalUploaded} ảnh!`);
        navigate(`/staff/booking/${bookingId}/detail`);
    };

    // Đang tải dữ liệu
    if (loadingData) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
                <p className="mt-3">Đang tải dữ liệu...</p>
            </Container>
        );
    }

    // Lỗi: image type không hợp lệ hoặc không load được data
    if (!isValidType || errorLoadingData) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Lỗi!</Alert.Heading>
                    <p>
                        {!isValidType 
                            ? `Image type "${type}" không hợp lệ. Các loại hợp lệ: ${imageTypes.join(', ')}`
                            : 'Không thể tải dữ liệu từ server. Vui lòng thử lại sau.'
                        }
                    </p>
                    <Button variant="outline-danger" onClick={() => navigate(-1)}>Quay lại</Button>
                </Alert>
            </Container>
        );
    }

    // Render một row trong table
    const renderDetailRow = (detail: DamageDetail, isRequired: boolean) => (
        <tr key={detail.tempId}>
            {/* Cột Hạng mục */}
            <td>
                {isRequired ? (
                    <div>
                        <Badge bg="danger" className="me-2">BẮT BUỘC</Badge>
                        <strong>{detail.itemId}</strong>
                    </div>
                ) : (
                    <Form.Select
                        value={detail.itemId}
                        onChange={(e) => handleDetailChange(detail.tempId, 'itemId', e.target.value, isRequired)}
                        disabled={loading || detail.isUploading}
                    >
                        <option value="">Chọn Hạng mục</option>
                        {vehicleComponents.map((component: string) => (
                            <option key={component} value={component}>{component}</option>
                        ))}
                    </Form.Select>
                )}
            </td>
            
            {/* Cột Upload Ảnh và Hiển thị URL */}
            <td>
                <div className="d-flex flex-column gap-1">
                    {detail.isUploading ? (
                        <div className="d-flex align-items-center text-info">
                            <Spinner animation="border" size="sm" className="me-2" /> Đang tải lên...
                        </div>
                    ) : detail.photoUrl ? (
                        <div className="text-success small">
                            Upload xong: 
                            <a href={detail.photoUrl} target="_blank" rel="noopener noreferrer" className="ms-1 text-truncate d-inline-block" style={{ maxWidth: '100px' }}>Link Ảnh</a>
                        </div>
                    ) : (
                        <Form.Label className="btn btn-sm btn-outline-secondary w-100 mb-0">
                            Tải ảnh lên...
                            <Form.Control 
                                type="file" 
                                accept="image/*" 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    e.target.files && handleFileUpload(detail.tempId, e.target.files[0], isRequired)
                                } 
                                className="d-none"
                                disabled={loading || detail.isUploading}
                            />
                        </Form.Label>
                    )}
                </div>
            </td>
            
            {/* Cột Mô tả */}
            <td>
                <Form.Control
                    as="textarea"
                    rows={1}
                    placeholder="Mô tả tình trạng (Bắt buộc)"
                    value={detail.description}
                    onChange={(e) => handleDetailChange(detail.tempId, 'description', e.target.value, isRequired)}
                    onBlur={() => handleDescriptionBlur(detail.tempId, isRequired)}
                    disabled={loading || detail.isUploading}
                    required
                    isInvalid={!!detail.photoUrl && !detail.description.trim()}
                />
                <Form.Control.Feedback type="invalid">
                    Vui lòng nhập mô tả
                </Form.Control.Feedback>
            </td>
            
            {/* Cột Hành động */}
            <td className="text-center">
                <div className="d-flex flex-column gap-2">
                    {/* Nút xóa ảnh (nếu đã upload) */}
                    {detail.photoUrl && (
                        <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleRemovePhotoClick(detail.tempId, isRequired)}
                            disabled={loading || detail.isUploading}
                        >
                            Xóa Ảnh
                        </Button>
                    )}
                    
                    {/* Nút xóa hạng mục (chỉ cho optional) */}
                    {!isRequired && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveOptionalDetail(detail.tempId)}
                            disabled={loading || detail.isUploading}
                        >
                            Xóa Mục
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <Container className="py-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center fw-bold text-primary">Ghi Nhận Chi Tiết Xe {pageTitle}</h2>
                    <p className="text-center text-muted">Booking ID: {bookingId} | Image Type: <strong>{type}</strong></p>
                    {checklist && type !== 'DAMAGE' && (
                        <div className="text-center">
                            <Badge bg={checklist.isComplete ? "success" : "warning"} className="fs-6">
                                Tiến độ: {checklist.completionPercentage}% ({checklist.capturedComponents.length}/{checklist.requiredComponents.length})
                            </Badge>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Modal xác nhận xóa ảnh */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-warning">
                    <Modal.Title>Xác nhận xóa ảnh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0">Bạn có chắc chắn muốn xóa ảnh này?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            {/* Phần 1: Hạng mục BẮT BUỘC */}
            {requiredList.length > 0 && (
                <Card className="shadow-lg mb-4">
                    <Card.Header className="fw-bold bg-danger text-white">
                        Hạng Mục BẮT BUỘC (Required Components)
                        <Badge bg="light" text="dark" className="ms-2">
                            {requiredList.filter(item => item.photoUrl).length}/{requiredList.length} hoàn thành
                        </Badge>
                    </Card.Header>
                    <Card.Body>
                        {requiredList.length === 0 ? (
                            <Alert variant="info">Không có hạng mục bắt buộc nào cho booking này.</Alert>
                        ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: '25%' }}>Hạng mục</th>
                                        <th style={{ width: '35%' }}>Ảnh (Upload File)</th>
                                        <th style={{ width: '30%' }}>Mô tả</th>
                                        <th style={{ width: '10%' }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requiredList.map((detail) => renderDetailRow(detail, true))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card.Body>
                </Card>
            )}

            {/* Phần 2: Hạng mục TÙY CHỌN */}
            <Card className="shadow-lg mb-4">
                <Card.Header className="fw-bold bg-info text-white">
                    Hạng Mục TÙY CHỌN (Optional Components)
                    <Badge bg="light" text="dark" className="ms-2">
                        {optionalList.filter(item => item.itemId).length} đã thêm
                    </Badge>
                </Card.Header>
                <Card.Body>
                    {optionalList.length === 0 ? (
                        <p className="text-muted text-center">Chưa có hạng mục tùy chọn nào. Bấm nút bên dưới để thêm.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '25%' }}>Hạng mục</th>
                                        <th style={{ width: '35%' }}>Ảnh (Upload File)</th>
                                        <th style={{ width: '30%' }}>Mô tả</th>
                                        <th style={{ width: '10%' }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {optionalList.map((detail) => renderDetailRow(detail, false))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* Nút thêm hạng mục */}
                    <div className="text-center">
                        <Button variant="outline-primary" onClick={handleAddOptionalDetail} disabled={loading}>
                            + Thêm Hạng Mục
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Nút lưu */}
            <Card className="shadow">
                <Card.Body>
                    {(() => {
                        const formValid = checkFormValid();
                        return (
                            <>
                                {requiredList.length > 0 && (
                                    <Alert variant={formValid.hasInvalidRequired ? "danger" : "success"} className="mb-3">
                                        {formValid.hasInvalidRequired 
                                            ? "Vui lòng upload ảnh VÀ nhập mô tả cho TẤT CẢ hạng mục BẮT BUỘC trước khi lưu!"
                                            : "Tất cả hạng mục bắt buộc đã upload xong. Bạn có thể lưu dữ liệu."
                                        }
                                    </Alert>
                                )}
                                
                                <Button
                                    variant="success"
                                    size="lg"
                                    className="w-100 d-flex align-items-center justify-content-center"
                                    onClick={handleSubmit}
                                    disabled={
                                        loading || 
                                        formValid.isStillUploading ||
                                        (requiredList.length > 0 && formValid.hasInvalidRequired) ||
                                        formValid.hasInvalidOptional
                                    }
                                >
                                    {loading && <Spinner animation="border" size="sm" className="me-2" />}
                                    LƯU DỮ LIỆU 
                                    {requiredList.length > 0 && ` (${requiredList.length} bắt buộc + ${optionalList.filter(item => item.itemId).length} tùy chọn)`}
                                </Button>
                            </>
                        );
                    })()}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PhotoCapturePage;