// components/Admin/Reports/AdminStationReport.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useReportService } from "../../hooks/useReportService";
import { StationReportDto } from "../../models/ReportModel";
import {
    Button,
    Col,
    Row,
    Spinner,
    Card,
    Table,
} from "react-bootstrap";

const AdminStationReport = () => {
    const { getStationReport, isLoading } = useReportService();
    const [reportData, setReportData] = useState<StationReportDto | null>(null);

    const handleFetchReport = useCallback(async () => {
        const data = await getStationReport();
        if (data) {
            setReportData(data);
        }
    }, [getStationReport]);

    useEffect(() => {
        handleFetchReport();
    }, [handleFetchReport]); 

    return (
        <Card>
            <Card.Header>
                <Card.Title as="h5">Báo cáo Trạm</Card.Title>
            </Card.Header>
            <Card.Body>
                <Row className="mb-3 align-items-end">
                    <Col md={3}>
                        <Button
                            onClick={handleFetchReport}
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner as="span" size="sm" /> : "Làm mới"}
                        </Button>
                    </Col>
                </Row>
                <hr />
                {isLoading && <p>Đang tải dữ liệu...</p>}
                {!isLoading && reportData && (
                    <>
                        {/* 1. Các chỉ số KPI */}
                        <Row className="mb-3 text-center">
                            <Col md={4}>
                                <Card bg="light">
                                    <Card.Body>
                                        <Card.Title>Tổng số trạm</Card.Title>
                                        <Card.Text as="h4">{reportData.totalStations}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card bg="light">
                                    <Card.Body>
                                        <Card.Title>Đang hoạt động</Card.Title>
                                        <Card.Text as="h4">{reportData.activeStations}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card bg="light">
                                    <Card.Body>
                                        <Card.Title>Không hoạt động</Card.Title>
                                        <Card.Text as="h4">{reportData.inactiveStations}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* 2. Bảng Top Trạm (Doanh thu) */}
                        <Row>
                            <Col>
                                <h6>Top 5 trạm (theo doanh thu)</h6>
                                <Table striped bordered hover responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th>Tên trạm</th>
                                            <th>Lượt đặt</th>
                                            <th>Doanh thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.topStations.map((s) => (
                                            <tr key={s.stationId}>
                                                <td>{s.name}</td>
                                                <td>{s.bookingCount}</td>
                                                <td>{s.revenue.toLocaleString()} VND</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        {/* 3. Bảng chi tiết tất cả trạm */}
                        <Row className="mt-4">
                            <Col>
                                <h6>Chi tiết các trạm</h6>
                                <Table striped bordered hover responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th>Tên trạm</th>
                                            <th>Trạng thái</th>
                                            <th>Địa chỉ</th>
                                            <th>Tổng xe</th>
                                            <th>Xe sẵn sàng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.stations.map((s) => (
                                            <tr key={s.stationId}>
                                                <td>{s.name}</td>
                                                <td>{s.status}</td>
                                                <td>{s.location}</td>
                                                <td>{s.totalVehicles}</td>
                                                <td>{s.availableVehicles}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default AdminStationReport;