import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
// Giả định bạn có service API để lấy chi tiết hạng mục (HM) và insert ảnh
// import { getAccessoryList, insertCarPhotoAPI } from './services/authServices'; 

// Interface cho hạng mục/phụ tùng (Accessories/Items)
interface Accessory {
    id: number;
    name: string;
}

// Interface cho một dòng chi tiết hư hỏng
interface DamageDetail {
    tempId: number;
    itemId: string;
    photoUrl: string;
    photoFile?: File | null;
    description: string;
    isUploading: boolean;
}

// Mock Data Hạng Mục 
const mockAccessories: Accessory[] = [
    { id: 1, name: 'Lốp xe' },
    { id: 2, name: 'Kính chắn gió' },
    { id: 3, name: 'Đèn pha/Đèn hậu' },
    { id: 4, name: 'Nội thất (Ghế, sàn)' },
    { id: 5, name: 'Thân xe (Cửa, cản)' },
];

const createNewDamageDetail = (): DamageDetail => ({
    tempId: Date.now(), // ID tạm thời duy nhất
    itemId: '',
    photoUrl: '',
    description: '',
    isUploading: false,
});

const PhotoCapturePage: React.FC = () => {
    const { bookingId, type } = useParams<{ bookingId: string, type: string }>();
    const navigate = useNavigate();

    const [damageList, setDamageList] = useState<DamageDetail[]>([createNewDamageDetail()]);
    const [loading, setLoading] = useState(false);
    const [accessories] = useState<Accessory[]>(mockAccessories); // Giữ accessories là constant

    const isBefore = type === 'before';
    const pageTitle = isBefore ? 'TRƯỚC KHI THUÊ (Check-in)' : 'SAU KHI TRẢ (Check-out)';

    useEffect(() => {
        document.title = `Ghi nhận chi tiết xe - ${pageTitle}`;
    }, [pageTitle]);

    // Tinh gọn: Sử dụng useCallback cho các hàm quản lý state
    const handleDetailChange = useCallback((tempId: number, field: keyof DamageDetail, value: string) => {
        setDamageList(prevList =>
            prevList.map(detail =>
                detail.tempId === tempId ? { ...detail, [field]: value } : detail
            )
        );
    }, []);

    const handleAddDetail = useCallback(() => {
        setDamageList(prevList => [...prevList, createNewDamageDetail()]);
    }, []);

    const handleRemoveDetail = useCallback((tempId: number) => {
        setDamageList(prevList => prevList.filter(detail => detail.tempId !== tempId));
    }, []);

    // --- LOGIC UPLOAD ẢNH & LẤY URL ---

    const handleFileUpload = (tempId: number, file: File) => {
        // Bắt đầu quá trình upload (mock)
        setDamageList(prevList =>
            prevList.map(detail =>
                detail.tempId === tempId ? { ...detail, photoFile: file, isUploading: true, photoUrl: '' } : detail
            )
        );

        // Giả lập quá trình upload lên server và nhận URL
        setTimeout(() => {
            // Thay thế bằng API upload thực tế của bạn
            const mockUrl = `https://cdn.example.com/booking-${bookingId}/${file.name.substring(0, 10)}-${tempId}.jpg`;

            setDamageList(prevList =>
                prevList.map(detail =>
                    detail.tempId === tempId ? { 
                        ...detail, 
                        isUploading: false, 
                        photoUrl: mockUrl, 
                        photoFile: file 
                    } : detail
                )
            );
            // alert(`Upload thành công! Đã nhận được URL.`); // Tắt alert để tránh làm gián đoạn
        }, 1500);
    };

    // Tinh gọn: Tính toán trạng thái form bằng useMemo
    const formStatus = useMemo(() => {
        const hasInvalidItems = damageList.some(d => !d.itemId || !d.photoUrl || !d.description);
        const isStillUploading = damageList.some(d => d.isUploading);
        const isEmpty = damageList.length === 0;

        return { hasInvalidItems, isStillUploading, isEmpty };
    }, [damageList]);


    // --- LOGIC LƯU DỮ LIỆU CUỐI CÙNG ---

    const handleSubmit = async () => {
        if (formStatus.isEmpty) {
            alert("Vui lòng thêm ít nhất một chi tiết để lưu.");
            return;
        }
        if (formStatus.hasInvalidItems) {
            alert("Vui lòng điền đầy đủ Hạng mục, Upload Ảnh và Mô tả cho tất cả các chi tiết đã thêm.");
            return;
        }
        if (formStatus.isStillUploading) {
            alert("Vui lòng đợi quá trình upload ảnh hoàn tất trước khi lưu.");
            return;
        }

        setLoading(true);

        try {
            // Dữ liệu gửi đi (chỉ cần itemId, photoUrl, description)
            const dataToSave = damageList.map(({ itemId, photoUrl, description }) => ({
                itemId,
                photoUrl,
                description,
            }));

            console.log(`Dữ liệu gửi lên API:`, dataToSave);

            // 2. Gọi API để Lưu
            // const response = await insertCarPhotoAPI(bookingId, type, dataToSave);

            await new Promise(resolve => setTimeout(resolve, 1500));

            alert(`Đã lưu ${damageList.length} chi tiết thành công.`);

            // 3. Quay về trang chi tiết booking sau khi lưu
            navigate(`/staff/booking/${bookingId}/detail`);
        } catch (error) {
            console.error("Lỗi khi lưu chi tiết xe:", error);
            alert("Lưu chi tiết xe thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center fw-bold text-primary">
                        Ghi Nhận Chi Tiết Xe {pageTitle} 
                    </h2>
                    <p className="text-center text-muted">
                        Booking ID: {bookingId} | Ghi nhận các chi tiết/hư hỏng hiện tại của xe.
                    </p>
                </Col>
            </Row>

            <Card className="shadow-lg p-4">
                <Card.Header className="fw-bold bg-light">
                    Ghi Chú Hư Hỏng Chi Tiết
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '25%' }}>Hạng mục (Select)</th>
                                    <th style={{ width: '35%' }}>Ảnh (Upload File)</th>
                                    <th style={{ width: '30%' }}>Mô tả</th>
                                    <th style={{ width: '10%' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {damageList.map((detail) => (
                                    <tr key={detail.tempId}>
                                        {/* Cột Hạng mục */}
                                        <td>
                                            <Form.Select
                                                value={detail.itemId}
                                                onChange={(e) => handleDetailChange(detail.tempId, 'itemId', e.target.value)}
                                                disabled={loading || detail.isUploading}
                                            >
                                                <option value="">Chọn Hạng mục</option>
                                                {accessories.map(acc => (
                                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                ))}
                                            </Form.Select>
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
                                                    // Nút Tải ảnh lên
                                                    <Form.Label className="btn btn-sm btn-outline-secondary w-100 mb-0">
                                                        Tải ảnh lên...
                                                        <Form.Control 
                                                            type="file" 
                                                            accept="image/*" 
                                                            // ĐÃ SỬA LỖI TYPESCRIPT Ở ĐÂY
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                                e.target.files && handleFileUpload(detail.tempId, e.target.files[0])
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
                                                placeholder="Mô tả hư hỏng (Hư/hỏng)"
                                                value={detail.description}
                                                onChange={(e) => handleDetailChange(detail.tempId, 'description', e.target.value)}
                                                disabled={loading || detail.isUploading}
                                            />
                                        </td>
                                        
                                        {/* Cột Hành động */}
                                        <td className="text-center">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveDetail(detail.tempId)}
                                                disabled={loading || detail.isUploading || damageList.length === 1}
                                            >
                                                Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Nút Thêm Hạng mục */}
                    <div className="text-center mb-4">
                        <Button variant="outline-primary" onClick={handleAddDetail} disabled={loading}>
                            + Thêm Hạng Mục
                        </Button>
                    </div>

                    {/* Nút Lưu */}
                    <Button
                        variant="success"
                        className="w-100 d-flex align-items-center justify-content-center"
                        onClick={handleSubmit}
                        disabled={loading || formStatus.hasInvalidItems || formStatus.isStillUploading || formStatus.isEmpty}
                    >
                        {loading && <Spinner animation="border" size="sm" className="me-2" />}
                        LƯU DỮ LIỆU
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PhotoCapturePage;