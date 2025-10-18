import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import UserDetail from './UserDetail';

// Interface cho dữ liệu Renter
interface Renter {
  id: string | number;
  name: string;
  phoneNumber: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  // Thêm các field khác từ API nếu cần
}

const ListRenter: React.FC = () => {
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedRenterId, setSelectedRenterId] = useState<string | number | null>(null);

  // Fetch data từ API
  useEffect(() => {
    fetchRenters();
  }, []);

  const fetchRenters = async () => {
    setLoading(true);
    setError('');

    // TODO: Gọi API khi có backend
    // Mock data tạm
    setTimeout(() => {
      const mockData: Renter[] = [
        { id: 1, name: "Nguyễn Văn A", phoneNumber: "0912345678", verificationStatus: "pending" },
        { id: 2, name: "Trần Thị B", phoneNumber: "0987654321", verificationStatus: "verified" },
        { id: 3, name: "Lê Văn C", phoneNumber: "0901234567", verificationStatus: "rejected" },
      ];
      setRenters(mockData);
      setLoading(false);
    }, 500);
  };

  // Handler cho nút Verification Status
  const handleVerificationStatus = async (renterId: string | number) => {
    // TODO: Gọi API khi có backend
    alert(`Kiểm tra trạng thái cho Renter ID: ${renterId}\nTrạng thái: verified`);
  };

  // Handler cho nút Verify OTP link
  const handleVerifyOTP = async (renterId: string | number) => {
    const otpCode = prompt('Nhập mã OTP:');
    if (!otpCode) return;

    // TODO: Gọi API khi có backend
    alert(`Xác thực OTP thành công cho Renter ID: ${renterId}`);
    fetchRenters(); // Refresh lại danh sách
  };

  // Handler cho nút Details
  const handleViewDetails = (renterId: string | number) => {
    setSelectedRenterId(renterId);
  };

  // Handler để quay lại danh sách
  const handleBack = () => {
    setSelectedRenterId(null);
    fetchRenters(); // Refresh lại danh sách
  };

  // Nếu đang xem chi tiết, hiển thị UserDetail
  if (selectedRenterId !== null) {
    return <UserDetail renterId={selectedRenterId} onBack={handleBack} />;
  }

  // Render badge theo trạng thái
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <Badge bg="success">Đã xác minh</Badge>;
      case 'pending':
        return <Badge bg="warning">Chờ xác minh</Badge>;
      case 'rejected':
        return <Badge bg="danger">Từ chối</Badge>;
      default:
        return <Badge bg="secondary">Chưa rõ</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-2">Đang tải danh sách người thuê...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchRenters}>
            Thử lại
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh Sách Người Thuê</h2>
        <Button variant="primary" onClick={fetchRenters}>
          <i className="bi bi-arrow-clockwise"></i> Làm mới
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Verification Status</th>
              <th>Verify OTP Link</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {renters.length > 0 ? (
              renters.map((renter) => (
                <tr key={renter.id}>
                  <td>{renter.id}</td>
                  <td>{renter.name}</td>
                  <td>{renter.phoneNumber}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleVerificationStatus(renter.id)}
                      className="me-2"
                    >
                      Kiểm tra
                    </Button>
                    {renderStatusBadge(renter.verificationStatus)}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleVerifyOTP(renter.id)}
                    >
                      Xác thực OTP
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewDetails(renter.id)}
                    >
                      Xem chi tiết
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {renters.length > 0 && (
        <div className="text-muted">
          <small>Tổng số người thuê: {renters.length}</small>
        </div>
      )}
    </Container>
  );
};

export default ListRenter;
