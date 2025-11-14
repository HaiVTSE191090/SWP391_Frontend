import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useReportService } from "../../hooks/useReportService";
import { DashboardReportDto } from "../../models/ReportModel";
import AdminRevenueReport from "./AdminRevenueReport";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
} from "chart.js";
import AdminBookingReport from "./AdminBookingReport";
import AdminVehicleReport from "./AdminVehicleReport";
import AdminStationReport from "./AdminStationReport";
Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement, 
    ArcElement,
);

const KpiCard = ({ title, value, bg, isLoading }: any) => (
    <Card bg={bg} text="white" className="mb-3">
        <Card.Body>
            <Card.Title as="h5">{title}</Card.Title>
            <Card.Text as="h3">
                {isLoading ? <Spinner size="sm" /> : value}
            </Card.Text>
        </Card.Body>
    </Card>
);

const AdminDashBoard = () => {
    const { getDashboardReport, isLoading } = useReportService();
    const [kpi, setKpi] = useState<DashboardReportDto | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await getDashboardReport();
            if (data) setKpi(data);
        };
        loadData();
    }, [getDashboardReport]);

    return (
        <Container fluid className="my-4">
            <h2>Tổng quan</h2>

            {/* CÁC THẺ KPI GIỐNG HÌNH MẪU */}
            <Row>
                <Col md={3}>
                    <KpiCard
                        title="Doanh thu tháng này"
                        value={kpi?.revenueThisMonth.toLocaleString() + " VND"}
                        bg="primary" // Xanh dương
                        isLoading={isLoading}
                    />
                </Col>
                <Col md={3}>
                    <KpiCard
                        title="Booking tháng này"
                        value={kpi?.bookingsThisMonth}
                        bg="warning" // Vàng
                        isLoading={isLoading}
                    />
                </Col>
                <Col md={3}>
                    <KpiCard
                        title="Tổng số xe"
                        value={kpi?.totalVehicles}
                        bg="success" // Xanh lá
                        isLoading={isLoading}
                    />
                </Col>
                <Col md={3}>
                    <KpiCard
                        title="Thành viên"
                        value={kpi?.activeRenters}
                        bg="danger" // Đỏ
                        isLoading={isLoading}
                    />
                </Col>
            </Row>

            <hr />

            <Row className="mt-4">
                <Col md={12}>
                    <AdminRevenueReport />
                </Col>
                {/* Cột phụ cho Pie chart */}
                <Col md={12} className="mt-4">
                    <AdminBookingReport />
                </Col>
                <Col md={12} className="mt-4">
                    <AdminVehicleReport />
                </Col>
                <Col md={12} className="mt-4">
                    <AdminStationReport />
                </Col>
            </Row>

            

        </Container>
    );
};

export default AdminDashBoard;