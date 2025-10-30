import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

// Định nghĩa trạng thái Contract
type ContractStatus = 'ADMIN_SIGNED' | 'CANCELLED' | 'FULLY_SIGNED' | 'PENDING_ADMIN_SIGNATURE';

// Interface chi tiết cho dữ liệu Contract
interface ContractDetailData {
    id: number; // contract_id
    bookingId: number; // booking_id
    renterName: string; 
    adminInfo: string; // Thông tin Admin ký
    contractDate: string; // contract_date
    contractType: string; // contract_type
    contractFileUrl: string; // contract_file_url
    status: ContractStatus; 
    renterSignedAt: string | null; // renter_signed_at
    adminSignedAt: string | null; // admin_signed_at
    // Giả định có thêm trường nội dung Hợp đồng hoặc được tạo từ API
    contractContent: string;
}

const ContractDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [contract, setContract] = useState<ContractDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Hàm tiện ích để hiển thị trạng thái
    const getStatusBadge = (status: ContractStatus) => {
        let variant: string;
        switch (status) {
            case 'PENDING_ADMIN_SIGNATURE':
                variant = 'warning';
                break;
            case 'FULLY_SIGNED':
                variant = 'success';
                break;
            case 'CANCELLED':
                variant = 'danger';
                break;
            case 'ADMIN_SIGNED':
                variant = 'primary';
                break;
            default:
                variant = 'secondary';
        }
        return <span className={`badge bg-${variant}`}>{status}</span>;
    };

    // Giả lập fetch API chi tiết Contract
    useEffect(() => {
        setLoading(true);
        setError('');
        // TODO: Thay bằng API thực tế: GET /api/admin/contracts/:id
        setTimeout(() => {
            const contractId = parseInt(id || '0');
            if (contractId === 101) {
                setContract({
                    id: 101,
                    bookingId: 1,
                    renterName: 'Nguyễn Văn A',
                    adminInfo: '1 - nguyentrung30@gmail.com', //
                    contractDate: '2025-10-31',
                    contractType: 'Rental',
                    contractFileUrl: '/contracts/101.pdf',
                    status: 'PENDING_ADMIN_SIGNATURE',
                    renterSignedAt: '2025-10-30 18:00:00',
                    adminSignedAt: null,
                    contractContent: `Hôm nay, ngày 31 tháng 10 năm 2025, tại Hà Nội, chúng tôi gồm:
BÊN CHO THUÊ: Ông/Bà [ADMIN NAME] (Đại diện Công ty ABC)
BÊN THUÊ: Ông Nguyễn Văn A, Sinh năm: 1990, CCCD: 001201000xxx
Hai bên đã thỏa thuận và thống nhất ký kết Hợp đồng thuê xe ô tô điện với những điều khoản cụ thể đã được trao đổi.
* Lưu ý: Nội dung này là mô phỏng theo mẫu.`,
                });
            } else if (contractId === 102) {
                setContract({
                    id: 102,
                    bookingId: 2,
                    renterName: 'Trần Thị B',
                    adminInfo: '1 - nguyentrung30@gmail.com',
                    contractDate: '2025-10-30',
                    contractType: 'Rental',
                    contractFileUrl: '/contracts/102.pdf',
                    status: 'FULLY_SIGNED',
                    renterSignedAt: '2025-10-30 09:00:00',
                    adminSignedAt: '2025-10-30 09:05:00',
                    contractContent: 'Hợp đồng này đã được ký kết đầy đủ bởi cả hai bên.',
                });
            } else {
                setError('Không tìm thấy Hợp đồng');
            }
            setLoading(false);
        }, 800);
    }, [id]);

    // Handler cho nút "Xác nhận" (Admin Ký)
    const handleConfirmSign = async () => {
        if (!contract || contract.status !== 'PENDING_ADMIN_SIGNATURE') return;
        setIsProcessing(true);
        setError('');
        try {
            // TODO: GỌI API THỰC TẾ: POST /api/admin/contracts/:id/sign
            // Cập nhật trường admin_signature và admin_signed_at
            
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            alert(`Admin đã ký Hợp đồng ID ${id} thành công! (Trạng thái chuyển sang ADMIN_SIGNED hoặc FULLY_SIGNED nếu Renter đã ký)`);
            navigate('/admin/contract'); // Quay lại danh sách Contract
        } catch (err: any) {
            setError(err.message || 'Lỗi khi ký Hợp đồng.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handler cho nút "Hủy" (Hủy Hợp đồng)
    const handleCancelContract = async () => {
        if (!contract || contract.status === 'FULLY_SIGNED' || contract.status === 'CANCELLED') return;
        if (!window.confirm('Bạn có chắc chắn muốn HỦY Hợp đồng này không?')) return;

        setIsProcessing(true);
        setError('');
        try {
            // TODO: GỌI API THỰC TẾ: POST /api/admin/contracts/:id/cancel
            // Cập nhật trường status thành CANCELLED

            await new Promise(resolve => setTimeout(resolve, 1500)); 
            alert(`Hủy Hợp đồng ID ${id} thành công!`);
            navigate('/admin/contract'); // Quay lại danh sách Contract
        } catch (err: any) {
            setError(err.message || 'Lỗi khi hủy Hợp đồng.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center"><Spinner animation="border" variant="primary" /></Container>
        );
    }

    if (error) {
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!contract) {
        return <Container className="mt-4"><Alert variant="info">Không tìm thấy thông tin Hợp đồng.</Alert></Container>;
    }

    // Chỉ cho phép Ký và Hủy khi đang chờ ký bởi Admin
    const canSign = contract.status === 'PENDING_ADMIN_SIGNATURE';
    
    return (
        <Container className="mt-4">
            <h2 className="mb-4">Chi tiết Hợp đồng #{contract.id}</h2>

            <Card className="shadow-sm mb-3">
                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                    Thông tin Hợp đồng
                    {getStatusBadge(contract.status)}
                </Card.Header>
                <Card.Body>
                    <div className="mb-2"><strong>Mã Booking (booking_id):</strong> {contract.bookingId}</div>
                    <div className="mb-2"><strong>Người Thuê:</strong> {contract.renterName}</div>
                    <div className="mb-2"><strong>Admin xử lý (admin_id):</strong> {contract.adminInfo}</div>
                    <div className="mb-2"><strong>Ngày Hợp đồng (contract_date):</strong> {contract.contractDate}</div>
                    <div className="mb-2"><strong>Renter ký lúc (renter_signed_at):</strong> {contract.renterSignedAt || 'Chưa ký'}</div>
                    <div className="mb-2"><strong>Admin ký lúc (admin_signed_at):</strong> {contract.adminSignedAt || 'Chưa ký'}</div>
                    {contract.contractFileUrl && (
                        <div className="mb-2">
                            <strong>File Hợp đồng (contract_file_url):</strong> 
                            <a href={contract.contractFileUrl} target="_blank" rel="noopener noreferrer"> Tải xuống</a>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4 border border-secondary">
                <Card.Body style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
                    {/* Mô phỏng giao diện Hợp đồng thuê xe */}
                    <div className="text-center mb-4">
                        <strong className="d-block">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
                        <em className="d-block">Độc Lập - Tự Do - Hạnh Phúc</em>
                        <h4 className="mt-2 text-decoration-underline">HỢP ĐỒNG THUÊ XE</h4>
                    </div>
                    
                    <p>{contract.contractContent}</p>

                    <div className="d-flex justify-content-around mt-5">
                        <div style={{ textAlign: 'center' }}>
                            <small>Bên Cho Thuê</small><br />
                            {/* Khu vực chữ ký Admin */}
                            {contract.adminSignedAt ? <div className="text-success mt-2">Đã Ký điện tử</div> : <div style={{ height: '50px' }}></div>}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <small>Bên Thuê</small><br />
                            {/* Khu vực chữ ký Renter */}
                            {contract.renterSignedAt ? <div className="text-success mt-2">Đã Ký điện tử</div> : <div style={{ height: '50px' }}></div>}
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    {canSign ? (
                        <div className="d-flex justify-content-center">
                            <Button 
                                variant="success" 
                                className="me-3" 
                                onClick={handleConfirmSign}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Xác nhận (Admin Ký HĐ)'}
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={handleCancelContract}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Hủy Hợp đồng'}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-muted">Hợp đồng này không ở trạng thái cần Admin ký.</div>
                    )}
                </Card.Footer>
            </Card>

            <Button variant="outline-secondary" className="mt-3" onClick={() => navigate('/admin/contract')}>
                &larr; Quay lại Danh sách Hợp đồng
            </Button>
        </Container>
    );
};

export default ContractDetail;