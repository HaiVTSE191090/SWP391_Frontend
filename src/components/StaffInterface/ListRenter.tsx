import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import UserDetail from './UserDetail';
import OTPModal from './OTPModal';
import { getListRenter } from '../StaffInterface/services/authServices'; // 👈 SỬ DỤNG HÀM API ĐÃ SỬA

// Cập nhật Interface Renter để khớp với API data
interface Renter {
	renter_id: string | number; // Sử dụng tên cột DB
	full_name: string;
	phone_number: string;
	status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'BLACKLISTED'; // Sử dụng giá trị ENUM DB
}

const ListRenter: React.FC = () => {
	const [renters, setRenters] = useState<Renter[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const [selectedRenterId, setSelectedRenterId] = useState<string | number | null>(null);

	// Fetch data từ API
	useEffect(() => {
		// 👈 KIỂM TRA TRƯỚC KHI GỌI FETCH
		if (localStorage.getItem('staffToken')) {
			fetchRenters();
		} else {
			// Xử lý khi không có token (chưa đăng nhập)
			setError('Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập. Vui lòng thử lại.');
			setLoading(false);
		}
	}, []);

	const fetchRenters = async () => {
		try {
			setLoading(true);
			setError('');

			// Gọi hàm API thực tế đã có Token trong Header
			const responseData = await getListRenter();

			// Giả sử API trả về mảng người thuê
			setRenters(responseData);

			setLoading(false);
		} catch (err: any) {
			// Bắt lỗi từ API (có thể là Token hết hạn, 401, hoặc lỗi Back-end)
			setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
			setLoading(false);
		}
	};

	// Render badge theo trạng thái
	const renderStatusBadge = (status?: string) => {
		switch (status) {
			case 'VERIFIED':
				return <Badge bg="success">Đã xác minh</Badge>;
			case 'PENDING_VERIFICATION':
				return <Badge bg="warning">Chờ xác minh</Badge>;
			case 'BLACKLISTED':
				return <Badge bg="danger">Blacklisted</Badge>;
			default:
				return <Badge bg="secondary">Chưa rõ</Badge>;
		}
	};

	// Handler cho nút Verification Status
	const handleVerificationStatus = async (renterId: string | number) => {
		// TODO: Thêm logic gọi API kiểm tra trạng thái xác minh
		console.log('Check verification status for renter:', renterId);
		alert(`Kiểm tra trạng thái xác minh cho Renter ID: ${renterId}`);
	};

	// State cho OTP Modal
	const [showOTPModal, setShowOTPModal] = useState(false);
	const [otpRenterId, setOtpRenterId] = useState<string | number | null>(null);

	// Handler cho nút Verify OTP link
	const handleVerifyOTP = (renterId: string | number) => {
		setOtpRenterId(renterId);
		setShowOTPModal(true);
	};

	// Xử lý submit OTP
	const handleSubmitOTP = (otp: string) => {
		// TODO: Gọi API xác thực OTP với otpRenterId và otp
		setShowOTPModal(false);
		setOtpRenterId(null);
		alert(`OTP xác thực thành công cho Renter ID: ${otpRenterId}, mã OTP: ${otp}`);
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
								// key phải là ID duy nhất của người thuê
								<tr key={renter.renter_id}>
									{/* 1. Renter ID */}
									<td>{renter.renter_id}</td>
									{/* 2. Tên đầy đủ */}
									<td>{renter.full_name}</td>
									{/* 3. Số điện thoại */}
									<td>{renter.phone_number}</td>
									{/* 4. Trạng thái xác minh */}
									<td>
										{/* Nút kiểm tra trạng thái */}
										<Button
											variant="info"
											size="sm"
											onClick={() => handleVerificationStatus(renter.renter_id)}
											className="me-2"
										>
											Kiểm tra
										</Button>
										{/* Badge hiển thị trạng thái đã xác minh/chờ */}
										{renderStatusBadge(renter.status)}
									</td>
									{/* 5. Nút Xác thực OTP */}
									<td>
										<Button
											variant="warning"
											size="sm"
											onClick={() => handleVerifyOTP(renter.renter_id)}
										>
											Xác thực OTP
										</Button>
									</td>
									{/* 6. Nút Xem chi tiết */}
									<td>
										<Button
											variant="primary"
											size="sm"
											onClick={() => handleViewDetails(renter.renter_id)}
										>
											Xem chi tiết
										</Button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className="text-center text-muted">
									Không có dữ liệu người thuê
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
			{/* Popup OTP nhập mã OTP */}
			<OTPModal
				show={showOTPModal}
				onSubmit={handleSubmitOTP}
				onCancel={() => { setShowOTPModal(false); setOtpRenterId(null); }}
			/>
		</Container>
	);
};

export default ListRenter;
