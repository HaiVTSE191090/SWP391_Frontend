import React, { useEffect, useState, FormEvent } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Spinner,
    Alert,
    ListGroup,
    Badge,
} from "react-bootstrap";
import { useAdmin } from "../../hooks/useAdmin"; // <-- Sửa đường dẫn nếu cần
import { UpdateAdminRequest } from "../../models/AdminModel"; // <-- Sửa đường dẫn nếu cần
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
    const { profile, isLoading, error, loadAdminProfile, updateAdminProfile } =
        useAdmin();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [formData, setFormData] = useState<UpdateAdminRequest>({
        fullName: "",
        email: "",
        phoneNumber: "",
    });

    // --- START: THÊM VALIDATION ---
    // State để lưu lỗi của từng ô
    const [formErrors, setFormErrors] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
    });

    const handleLogout = () => {
        logout(); // Gọi hàm logout từ context
        navigate("/admin/login"); // Điều hướng về trang login
        // (Optional: có thể thêm reload nếu cần)
        // window.location.reload(); 
    };
    // Hàm kiểm tra logic
    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { fullName: "", email: "", phoneNumber: "" };

        // Regex (Biểu thức chính quy)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        // 1. Kiểm tra Full Name
        if (!formData.fullName || formData.fullName.length > 100) {
            newErrors.fullName = "Họ tên không được trống và phải ít hơn 100 ký tự.";
            isValid = false;
        }

        // 2. Kiểm tra Email
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Email không hợp lệ.";
            isValid = false;
        }

        // 3. Kiểm tra Phone Number
        if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại phải là 10 số.";
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };
    // --- END: THÊM VALIDATION ---

    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");

    useEffect(() => {
        loadAdminProfile();
    }, [loadAdminProfile]);

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName,
                email: profile.email,
                phoneNumber: profile.phoneNumber,
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Xóa lỗi của ô đang gõ
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors({
                ...formErrors,
                [name]: "",
            });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdateError("");
        setUpdateSuccess("");

        // --- SỬA: Chạy validation trước khi submit ---
        if (!validateForm()) {
            return; // Dừng lại nếu form không hợp lệ
        }
        // --- HẾT SỬA ---

        setIsUpdating(true);
        const result = await updateAdminProfile(formData);

        if (result?.success) {
            setUpdateSuccess("Cập nhật hồ sơ thành công!");
            // Code reload của bạn
            setTimeout(() => {
                window.location.reload();
            });
        } else {
            setUpdateError(result?.err || "Có lỗi xảy ra khi cập nhật.");
        }
        setIsUpdating(false);
    };

    // --- Render (giữ nguyên, chỉ thêm props vào Form) ---

    if (isLoading && !profile) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container className="my-4">
                <Alert variant="warning">Không tìm thấy thông tin admin.</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="my-4">
            <div className="d-flex justify-content-between">
                <h2 >Hồ sơ của tôi</h2>
                <div >
                    <Button
                        variant="danger" 
                        className="w-100"
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>
            <hr />
            <Row>
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">Chỉnh sửa thông tin cá nhân</Card.Header>
                        <Card.Body>
                            {/* SỬA: Thêm 'noValidate' để dùng validation của React */}
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formFullName">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        isInvalid={!!formErrors.fullName} // <-- Thêm prop này
                                    />
                                    {/* Thêm khối này để hiển thị lỗi */}
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.fullName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                        isInvalid={!!formErrors.email} // <-- Thêm prop này
                                    />
                                    {/* Thêm khối này để hiển thị lỗi */}
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPhoneNumber">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        isInvalid={!!formErrors.phoneNumber} // <-- Thêm prop này
                                    />
                                    {/* Thêm khối này để hiển thị lỗi */}
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.phoneNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Thông báo cập nhật */}
                                {updateSuccess && (
                                    <Alert variant="success">{updateSuccess}</Alert>
                                )}
                                {updateError && <Alert variant="danger">{updateError}</Alert>}

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <>
                                            <Spinner size="sm" as="span" className="me-2" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        "Lưu thay đổi"
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* === CỘT THÔNG TIN THỐNG KÊ (Giữ nguyên) === */}
                <Col md={4}>
                    <Card>
                        <Card.Header as="h5">Thông tin Thống kê</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Trạng thái:</strong>
                                <Badge
                                    bg={profile.status === "ACTIVE" ? "success" : "danger"}
                                    className="ms-2"
                                >
                                    {profile.status}
                                </Badge>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Tổng số hợp đồng:</strong>
                                <span className="fw-bold ms-2">{profile.totalContracts}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Ngày tạo:</strong>
                                <span className="ms-2">
                                    {profile.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                                        : "Không có dữ liệu"}
                                </span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminProfile;