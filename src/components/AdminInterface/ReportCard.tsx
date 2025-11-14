import React from "react";
import { Card } from "react-bootstrap";
import { Bar, Line, Pie } from "react-chartjs-2";
import { ReportCardProps } from "../../models/ReportModel";

export const ReportCard = ({
    key,
    title,
    filters,
    chartData,
    chartType = "bar",
    isLoading,
}: ReportCardProps) => {

    const renderChart = () => {
        const options = {
            responsive: true,
            maintainAspectRatio: false,
        };

        const chartProps = {
            key: Number(key),
            data: chartData,
            options: options,
        };

        if (chartType === "line") {
            return <Line {...chartProps} />;
        }
        if (chartType === "pie") {
            return <Pie {...chartProps} options={{ ...options, plugins: { legend: { position: 'right' as const } } }} />;
        }
        return <Bar {...chartProps} />;
    };

    return (
        <Card>
            <Card.Header>
                <h2>{title}</h2>
            </Card.Header>
            <Card.Body>
                {filters}
                <hr />
                {isLoading && <p>Đang tải dữ liệu...</p>}
                {!isLoading && chartData && (
                    <div style={{ height: "400px" }}>
                        {renderChart()}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};