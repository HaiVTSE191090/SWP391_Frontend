import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
// Import API services
import { getVehicleComponents, getImageTypes, getImageChecklist, uploadCarImage } from './services/authServices'; 

// Interface cho một dòng chi tiết
interface DamageDetail {
    tempId: number;
    itemId: string;
    photoUrl: string;
    photoFile?: File | null;
    description: string;
    isUploading: boolean;
    isRequired?: boolean; // Đánh dấu item bắt buộc
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

                        // Tạo danh sách required từ API
                        if (data.requiredComponents) {
                            const items = data.requiredComponents.map((name: string) => 
                                createRequiredDetail(name)
                            );
                            setRequiredList(items);
                        }
                    }
                } catch (error) {
                    // Nếu API checklist fail, dùng mock data tạm
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

    // Thêm một hạng mục tùy chọn mới
    const handleAddOptionalDetail = () => {
        setOptionalList(prev => [...prev, createNewDamageDetail(false)]);
    };

    // Xóa một hạng mục tùy chọn
    const handleRemoveOptionalDetail = (tempId: number) => {
        setOptionalList(prev => prev.filter(item => item.tempId !== tempId));
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
            alert('Vui lòng chọn Hạng mục trước khi upload ảnh!');
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
            currentItem.description || 'Chưa có mô tả',
            file
        );

        if (response?.data?.data?.imageUrl) {
            // Upload thành công
            setList(prev => prev.map(item =>
                item.tempId === tempId ? { ...item, isUploading: false, photoUrl: response.data.data.imageUrl, photoFile: file } : item
            ));
        } else {
            // Upload thất bại
            alert('Upload ảnh thất bại. Vui lòng thử lại.');
            setList(prev => prev.map(item =>
                item.tempId === tempId ? { ...item, isUploading: false, photoFile: null } : item
            ));
        }
    };

    // Kiểm tra trạng thái form để enable/disable nút Lưu
    const formStatus = useMemo(() => {
        // Required: phải có đủ ảnh (mô tả không bắt buộc)
        const hasInvalidRequired = requiredList.some(item => !item.photoUrl);
        
        // Optional: nếu đã chọn hạng mục thì phải có ảnh (mô tả không bắt buộc)
        const hasInvalidOptional = optionalList.some(item => item.itemId && !item.photoUrl);
        
        // Có item nào đang upload không
        const isStillUploading = [...requiredList, ...optionalList].some(item => item.isUploading);

        return { hasInvalidRequired, hasInvalidOptional, isStillUploading };
    }, [requiredList, optionalList]);


    // Xác nhận và quay về trang booking detail
    const handleSubmit = () => {
        // Validate: Required items phải có ảnh
        if (requiredList.length > 0 && formStatus.hasInvalidRequired) {
            alert("Vui lòng upload ảnh cho TẤT CẢ các hạng mục BẮT BUỘC.");
            return;
        }

        // Validate: Optional items đã chọn phải có ảnh
        if (formStatus.hasInvalidOptional) {
            alert("Vui lòng upload ảnh cho các hạng mục tùy chọn đã chọn.");
            return;
        }

        // Validate: Đợi upload xong
        if (formStatus.isStillUploading) {
            alert("Vui lòng đợi quá trình upload ảnh hoàn tất.");
            return;
        }

        // Phải có ít nhất 1 item
        const validOptional = optionalList.filter(item => item.itemId && item.photoUrl);
        if (requiredList.length === 0 && validOptional.length === 0) {
            alert("Vui lòng thêm ít nhất một hạng mục để lưu.");
            return;
        }

        // Tất cả ảnh đã được upload lên server rồi
        const totalUploaded = requiredList.length + validOptional.length;
        alert(`Đã upload thành công ${totalUploaded} ảnh!`);
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
                            ✅ Upload xong: 
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
                    placeholder="Mô tả tình trạng"
                    value={detail.description}
                    onChange={(e) => handleDetailChange(detail.tempId, 'description', e.target.value, isRequired)}
                    disabled={loading || detail.isUploading}
                />
            </td>
            
            {/* Cột Hành động */}
            <td className="text-center">
                {!isRequired && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveOptionalDetail(detail.tempId)}
                        disabled={loading || detail.isUploading}
                    >
                        Xóa
                    </Button>
                )}
            </td>
        </tr>
    );

    return (
        <Container className="py-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center fw-bold text-primary">Ghi Nhận Chi Tiết Xe {pageTitle}</h2>
                    <p className="text-center text-muted">Booking ID: {bookingId} | Image Type: <strong>{type}</strong></p>
                    {checklist && (
                        <div className="text-center">
                            <Badge bg={checklist.isComplete ? "success" : "warning"} className="fs-6">
                                Tiến độ: {checklist.completionPercentage}% ({checklist.capturedComponents.length}/{checklist.requiredComponents.length})
                            </Badge>
                        </div>
                    )}
                </Col>
            </Row>

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
                    {requiredList.length > 0 && (
                        <Alert variant={formStatus.hasInvalidRequired ? "danger" : "success"} className="mb-3">
                            {formStatus.hasInvalidRequired 
                                ? "Vui lòng upload ảnh cho TẤT CẢ hạng mục BẮT BUỘC trước khi lưu!"
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
                            formStatus.isStillUploading ||
                            (requiredList.length > 0 && formStatus.hasInvalidRequired) ||
                            formStatus.hasInvalidOptional
                        }
                    >
                        {loading && <Spinner animation="border" size="sm" className="me-2" />}
                        LƯU DỮ LIỆU 
                        {requiredList.length > 0 && ` (${requiredList.length} bắt buộc + ${optionalList.filter(item => item.itemId).length} tùy chọn)`}
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PhotoCapturePage;