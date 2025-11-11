// components/Admin/Reports/AdminBookingReport.tsx
import React, { useMemo, useState } from "react";
import { useReportService } from "../../hooks/useReportService";
import { BookingReportDto, BookingReportRequest } from "../../models/ReportModel";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { ReportCard } from "./ReportCard";

const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60000));
    return localDate.toISOString().split("T")[0];
};

const AdminBookingReport = () => {
    const { getBookingReport, isLoading } = useReportService();
    const [reportData, setReportData] = useState<BookingReportDto | null>(null);

    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());
    const [status, setStatus] = useState("");
    const [chartKey, setChartKey] = useState(0);


    const handleFetchReport = async () => {
        const params: BookingReportRequest = {
            startDate: startDate,
            endDate: endDate,
        };
        if (status) params.status = status;

        const data = await getBookingReport(params);
        if (data) {
            setReportData(data);
            setChartKey((prevKey) => prevKey + 1);
        }
    };

    const chartData = useMemo(() => {
        if (!reportData) {
            return { labels: [], datasets: [] };
        }

        const labels = ['Pending', 'Reserved', 'In Use', 'Completed', 'Cancelled', 'Expired'];
        const data = [
            reportData.pendingBookings,
            reportData.reservedBookings,
            reportData.inUseBookings,
            reportData.completedBookings,
            reportData.cancelledBookings,
            reportData.expiredBookings,
        ];

        return {
            labels: labels,
            datasets: [
                {
                    label: "Trạng thái Booking",
                    data: data,
                    backgroundColor: [
                        '#FFC107', // Pending (Yellow)
                        '#0D6EFD', // Reserved (Blue)
                        '#0DCAF0', // In Use (Cyan)
                        '#198754', // Completed (Green)
                        '#DC3545', // Cancelled (Red)
                        '#6C757D', // Expired (Gray)
                    ],
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
                <Form.Group controlId="formStatus">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="PENDING">Pending</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="IN_USE">In Use</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
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
            title="Trạng thái Booking"
            filters={filters}
            chartData={chartData}
            chartType="pie"
            isLoading={isLoading}
        />
    );
};

export default AdminBookingReport;