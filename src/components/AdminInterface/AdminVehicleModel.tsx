import React, { useEffect } from 'react'
import { useVehicleModel } from '../../hooks/useVehicleModel';
import { Button, Spinner } from "react-bootstrap";
import { Package, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AdminVehicleModel = () => {

    const { vehicleModels, error, isLoading, loadAllVehicleModels } = useVehicleModel();
    const navigate = useNavigate();

    useEffect(() => {
        loadAllVehicleModels();
    }, [loadAllVehicleModels]);

    const handleViewDetails = (modelId: number) => {
        navigate(`detail/${modelId}`);
    };

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: 200 }}
            >
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải danh sách mẫu xe...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center text-danger">
                Lỗi: {error}
            </div>
        );
    }

    const handleCreateNew = () => {
        navigate(`detail`);
    };

    return (
        <div className="policy-container">
            <div className="policy-header d-flex justify-content-between align-items-center mb-3">
                <h2 className="d-flex align-items-center">
                    <Package size={28} className="me-2" />
                    Quản lý Mẫu xe
                </h2>
                <Button variant="outline-primary" onClick={handleCreateNew}>
                    <Plus size={18} /> Thêm mới
                </Button>
            </div>

            <table className="policy-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên mẫu xe (modelName)</th>
                        <th>Hãng (manufacturer)</th>
                        <th>Dung lượng Pin (batteryCapacity)</th>
                        <th>Số chỗ (seatingCapacity)</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicleModels.map((model) => (
                        <tr
                            key={model.modelId}
                            onClick={() => handleViewDetails(model.modelId)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{model.modelId}</td>
                            <td><strong>{model.modelName}</strong></td>
                            <td>{model.manufacturer}</td>
                            <td>{model.batteryCapacity ? `${model.batteryCapacity} kWh` : "N/A"}</td>
                            <td>{model.seatingCapacity}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminVehicleModel
