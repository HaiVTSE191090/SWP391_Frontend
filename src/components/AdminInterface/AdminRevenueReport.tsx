import React, { useMemo, useState } from "react";
import { useReportService } from "../../hooks/useReportService";
import {
    RevenueReportDto,
    RevenueReportRequest,
} from "../../models/ReportModel";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { ReportCard } from "./ReportCard";
import { ChartData } from "chart.js";

const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60000));
    return localDate.toISOString().split("T")[0];
};

const AdminRevenueReport = () => {
    const { getRevenueReport, isLoading } = useReportService();
    const [reportData, setReportData] = useState<RevenueReportDto | null>(null);

    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());
    const [groupBy, setGroupBy] = useState("DAY");
    const [chartKey, setChartKey] = useState(0);


    const handleFetchReport = async () => {
        const params: RevenueReportRequest = {
            startDate: startDate,
            endDate: endDate,
            groupBy: groupBy as "DAY" | "MONTH" | "YEAR",
        };

        const data = await getRevenueReport(params);
        if (data) {
            setReportData(data);
            setChartKey((prevKey) => prevKey + 1);
        }
    };

    const chartData = useMemo(() => {
        if (!reportData || !reportData.revenueByDate) {
            return { labels: [], datasets: [] };
        }
        const labels = reportData.revenueByDate.map((item) => item.date);
        const revenueData = reportData.revenueByDate.map((item) => item.revenue);
        // const bookingData = reportData.revenueByDate.map(
        //     (item) => item.bookingCount
        // );

        return {
            labels: labels,
            datasets: [
                {
                    label: "Doanh thu (VND)",
                    data: revenueData,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        };
    }, [reportData]);

    const filters = (
        <Row className="mb-3 align-items-end">
            <Col md={3}>
                <Form.Group controlId="formStartDate">
                    <Form.Label>Từ ngày</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col md={3}>
                <Form.Group controlId="formEndDate">
                    <Form.Label>Đến ngày</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col md={3}>
                <Form.Group controlId="formGroupBy">
                    <Form.Label>Nhóm theo</Form.Label>
                    <Form.Select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                    >
                        <option value="DAY">Ngày</option>
                        <option value="MONTH">Tháng</option>
                        <option value="YEAR">Năm</option>
                    </Form.Select>
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
        <ReportCard
            key={chartKey}
            title="Biểu đồ doanh thu"
            filters={filters}
            chartData={chartData as ChartData<"bar", (number | null)[], string>}
            isLoading={isLoading}
        />
    );
};

export default AdminRevenueReport;