// components/Admin/Reports/AdminVehicleReport.tsx
import React, { useMemo, useState } from "react";
import {
    useReportService,
} from "../../hooks/useReportService";
import { VehicleReportDto, VehicleReportRequest } from "../../models/ReportModel";
import {
    Button,
    Col,
    Form,
    Row,
    Spinner,
    Card,
    Table,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";

const AdminVehicleReport = () => {
    const { getVehicleReport, isLoading } = useReportService();
    const [reportData, setReportData] = useState<VehicleReportDto | null>(null);
    const [stationId, setStationId] = useState("");
    const [chartKey, setChartKey] = useState(0);

    const handleFetchReport = async () => {
        const params: VehicleReportRequest = {};
        if (stationId) {
            params.stationId = parseInt(stationId, 10);
        }

        const data = await getVehicleReport(params);
        if (data) {
            setReportData(data);
            setChartKey((prevKey) => prevKey + 1);
        }
    };

    // Chuẩn bị data cho biểu đồ cột "Xe theo Model"
    const chartData = useMemo(() => {
        if (!reportData || !reportData.vehiclesByModel) {
            return { labels: [], datasets: [] };
        }

        const labels = Object.keys(reportData.vehiclesByModel);
        const data = Object.values(reportData.vehiclesByModel);

        return {
            labels: labels,
            datasets: [
                {
                    label: "Số lượng xe theo Model",
                    data: data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        };
    }, [reportData]);

    const filters = (
        <Row className="mb-3 align-items-end">
            <Col md={3}>
                <Form.Group controlId="formStationId">
                    <Form.Label>Lọc theo ID Trạm (Bỏ trống để xem tất cả)</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Nhập Station ID"
                        value={stationId}
                        onChange={(e) => setStationId(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col md={3}>
                <Button
                    onClick={handleFetchReport}
                    disabled={isLoading}
                    className="w-100"
                >
                    {isLoading ? <Spinner as="span" size="sm" /> : "Xem Báo cáo"}
                </Button>
            </Col>
        </Row>
    );

    return (
        <Card>
            <Card.Header>
                <Card.Title as="h5">Báo cáo Xe</Card.Title>
            </Card.Header>
            <Card.Body>
                {filters}
                <hr />
                {isLoading && <p>Đang tải dữ liệu...</p>}
                {!isLoading && reportData && (
                    <>
                        {/* 1. Các chỉ số KPI */}
                        <Row className="mb-3 text-center">
                            <Col md={3}>
                                <Card bg="light">
                                    <Card.Body>
                                        <Card.Title>Tổng số xe</Card.Title>
                                        <Card.Text as="h4">{reportData.totalVehicles}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card bg="light">
                                    <Card.Body>
                                        <Card.Title>Sẵn sàng</Card.Title>
                                        <Card.Text as="h4">{reportData.availableVehicles}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card bg="light">
                                    <Card.Body>
                                        <Card.Title>Đang dùng</Card.Title>
                                        <Card.Text as="h4">{reportData.inUseVehicles}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card bg="light">
                                    <Card.Body>
                                        <Card.Title>Bảo trì/Sửa</Card.Title>
                                        <Card.Text as="h4">{reportData.maintenanceVehicles + reportData.inRepairVehicles}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* 2. Biểu đồ và Bảng */}
                        <Row>
                            {/* Biểu đồ cột */}
                            <Col md={6}>
                                <h6>Xe theo Model</h6>
                                <div style={{ height: "300px" }}>
                                    <Bar
                                        key={chartKey}
                                        data={chartData as ChartData<"bar", (number | null)[], string>}
                                        options={{ responsive: true, maintainAspectRatio: false }}
                                    />
                                </div>
                            </Col>
                            {/* Bảng Top xe */}
                            <Col md={6}>
                                <h6>Top xe (theo lượt đặt)</h6>
                                <Table striped bordered hover responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th>Tên xe</th>
                                            <th>Biển số</th>
                                            <th>Lượt đặt</th>
                                            <th>Doanh thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.topVehicles.map((v) => (
                                            <tr key={v.vehicleId}>
                                                <td>{v.vehicleName}</td>
                                                <td>{v.plateNumber}</td>
                                                <td>{v.bookingCount}</td>
                                                <td>{v.totalRevenue.toLocaleString()} VND</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        {/* 3. Bảng xe cần bảo trì */}
                        <Row className="mt-4">
                            <Col>
                                <h6>{`Xe cần bảo trì (Mileage > 10,000km)`}</h6>
                                <Table striped bordered hover responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tên xe</th>
                                            <th>Biển số</th>
                                            <th>Mileage (km)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.maintenanceNeeded.map((v) => (
                                            <tr key={v.vehicleId}>
                                                <td>{v.vehicleId}</td>
                                                <td>{v.vehicleName}</td>
                                                <td>{v.plateNumber}</td>
                                                <td>{v.mileage.toLocaleString()}</td>
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

export default AdminVehicleReport;