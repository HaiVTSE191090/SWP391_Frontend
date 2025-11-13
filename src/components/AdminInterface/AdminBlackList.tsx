import React, { useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
    Table,
    Button,
    Badge,
} from "react-bootstrap";
import { useBlacklist } from "../../hooks/useBlackList"; // <-- Sửa đường dẫn nếu cần
import { useNavigate } from "react-router-dom";

/**
 * Trang quản lý các báo cáo vi phạm (damage reports) và danh sách đen (blacklist).
 */
const AdminBlacklist = () => {
    const {
        reports,
        blacklist,
        isLoading,
        error,
        loadAdminReports,
        loadBlacklist,
    } = useBlacklist();

    const navigate = useNavigate();

    // Tải cả hai danh sách khi component được mount
    useEffect(() => {
        loadAdminReports();
        loadBlacklist();
    }, [loadAdminReports, loadBlacklist]);

    // Hàm điều hướng đến trang chi tiết báo cáo
    const handleViewReportDetail = (bookingId: number) => {
        // Bạn có thể thay đổi route này cho phù hợp
        navigate(`/admin/reports/${bookingId}`);
    };

    /**
     * Render nội dung cho một Card (table), xử lý các trạng thái loading, error, và no-data.
     * @param title Tiêu đề của Card
     * @param data Dữ liệu (reports hoặc blacklist)
     * @param renderTable Hàm render bảng dữ liệu
     * @param noDataMessage Thông báo khi không có dữ liệu
     */
    const renderCardSection = (
        title: string,
        data: any[],
        renderTable: () => React.ReactNode,
        noDataMessage: string
    ) => (
        <Card>
            <Card.Header as="h4">{title}</Card.Header>
            <Card.Body>
                {/*
          Sử dụng `isLoading` và `error` giống như trong `KpiCard`
          để hiển thị spinner/lỗi bên trong card.
        */}
                {isLoading ? (
                    <div className="text-center my-3">
                        <Spinner animation="border" size="sm" /> Đang tải...
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : data.length === 0 ? (
                    <div className="text-center text-muted">{noDataMessage}</div>
                ) : (
                    renderTable()
                )}
            </Card.Body>
        </Card>
    );

    /**
     * Render bảng cho danh sách Reports
     */
    const renderReportsTable = () => (
        <Table responsive hover striped>
            <thead>
                <tr>
                    <th>ID Booking</th>
                    <th>Người thuê</th>
                    <th>Tên xe</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((report) => (
                    <tr key={report.bookingId}>
                        <td>
                            <strong>#{report.bookingId}</strong>
                        </td>
                        <td>{report.renterName}</td>
                        <td>{report.vehicleName}</td>
                        <td>{new Date(report.createdAt).toLocaleDateString("vi-VN")}</td>
                        <td>
                            {/* Ví dụ: Dùng Badge cho status */}
                            <Badge
                                bg={
                                    report.status === "COMPLETED"
                                        ? "success"
                                        : report.status === "CANCELLED"
                                            ? "danger"
                                            : "warning"
                                }
                            >
                                {report.status}
                            </Badge>
                        </td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewReportDetail(report.bookingId)}
                            >
                                Xem chi tiết
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    /**
     * Render bảng cho danh sách Blacklist
     */
    const renderBlacklistTable = () => (
        <Table responsive hover striped>
            <thead>
                <tr>
                    <th>ID Người thuê</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                    <th>Blacklisted</th>
                </tr>
            </thead>
            <tbody>
                {blacklist.map((renter) => (
                    <tr key={renter.renterId}>
                        <td>
                            <strong>#{renter.renterId}</strong>
                        </td>
                        <td>{renter.fullName}</td>
                        <td>{renter.email}</td>
                        <td>{renter.phoneNumber}</td>
                        <td>
                            <Badge
                                bg={
                                    renter.status === "DELETED"
                                        ? "danger"
                                        : "secondary"
                                }
                            >
                                {renter.status}
                            </Badge>
                        </td>
                        <td>
                            {!renter.blacklisted ? (
                                <Badge bg="danger">Đã cấm</Badge>
                            ) : (
                                <Badge bg="success">Không</Badge>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    // MAIN RENDER
    return (
        <Container fluid className="my-4">
            <h2>Quản lý Vi phạm & Blacklist</h2>
            <hr />

            {/* === PHẦN 1: DANH SÁCH VI PHẠM === */}
            <Row>
                <Col>
                    {renderCardSection(
                        "Danh sách Báo cáo Vi phạm",
                        reports,
                        renderReportsTable,
                        "Không có báo cáo vi phạm nào."
                    )}
                </Col>
            </Row>

            <hr />

            {/* === PHẦN 2: DANH SÁCH BLACKLIST === */}
            <Row className="mt-4">
                <Col>
                    {renderCardSection(
                        "Danh sách Người dùng Blacklist",
                        blacklist,
                        renderBlacklistTable,
                        "Không có ai trong danh sách đen."
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminBlacklist;