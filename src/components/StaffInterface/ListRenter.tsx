import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import UserDetail from './UserDetail';
import OTPModal from './OTPModal';
import { getListRenter } from '../StaffInterface/services/authServices';
import { useNavigate } from 'react-router-dom';
// Cập nhật Interface Renter để khớp với API data
interface Renter {
	renterId: number;
	fullName: string;
	phoneNumber: string;
	status: 'VERIFIED' | 'PENDING_VERIFICATION' | string;
}

const ListRenter: React.FC = () => {
	const [renters, setRenters] = useState<Renter[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const [selectedRenterId, setSelectedRenterId] = useState<number | null>(null);
	const navigate = useNavigate();

	// Fetch data từ API
	useEffect(() => {
		fetchRenters()
	}, []);

	const fetchRenters = async () => {
		setLoading(true);
		setError('');

		try { // Thêm try-catch vào đây cũng là một ý hay
			const renterData = await getListRenter();

			// getListRenter() trả về Axios Response => renterData là { data: { status: 'success', data: [ { renterId: 1, ... } ] } }
			// cần truy cập 2 lần .data để lấy mảng người thuê
			setRenters(renterData?.data?.data || []);

		} catch (error) {
			console.error('Lỗi khi lấy danh sách người thuê:', error);
			setError('Không thể tải danh sách người thuê.');
			setRenters([]); // Đặt lại về mảng rỗng khi có lỗi
		} finally {
			setLoading(false); // Đảm bảo luôn tắt loading
		}
	};
	// Render badge theo trạng thái
	const renderStatusBadge = (status?: string) => {
		switch (status) {
			case 'VERIFIED':
				return <Badge bg="success">Đã xác minh</Badge>;
			case 'PENDING_VERIFICATION':
				return <Badge bg="warning">Chờ xác minh</Badge>;
			default:
				return <Badge bg="secondary">Chưa rõ</Badge>;
		}
	};

	// Handler cho nút Verification Status
	const handleVerificationStatus = async (renterId: number) => {
		// TODO: Thêm logic gọi API kiểm tra trạng thái xác minh
		console.log('Check verification status for renter:', renterId);
		alert(`Kiểm tra trạng thái xác minh cho Renter ID: ${renterId}`);
	};

	// State cho OTP Modal
	const [showOTPModal, setShowOTPModal] = useState(false);
	const [otpRenterId, setOtpRenterId] = useState<number | null>(null);

	// Handler cho nút Verify OTP link
	const handleVerifyOTP = (renterId:number) => {
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

	// Handler để quay lại danh sách
	const handleBack = () => {
		setSelectedRenterId(null);
		fetchRenters(); // Refresh lại danh sách
	};

	// Nếu đang xem chi tiết, hiển thị UserDetail
	if (selectedRenterId !== null) {
		return <UserDetail onBack={handleBack}/>;
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
							<th>Details</th>
						</tr>
					</thead>
					<tbody>
						{renters.length > 0 ? (
							renters.map((renter) => (

								<tr key={renter.renterId}>

									<td>{renter.renterId}</td>

									<td>{renter.fullName}</td>

									<td>{renter.phoneNumber}</td>

									<td>
										{/* Trạng thái trong BE là 'status' */}
										{renderStatusBadge(renter.status)}
									</td>

									{/* 5. Nút Xem chi tiết */}
									<td>
										<Button
											variant="primary"
											size="sm"
											// Dùng key chính xác là renterId, KHÔNG PHẢI renter_id
											onClick={() => navigate(`/staff/renter/${renter.renterId}`)}
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
