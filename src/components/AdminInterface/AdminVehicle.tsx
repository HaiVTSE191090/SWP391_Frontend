import React, { useEffect } from 'react';
import { useVehicleAdmin } from '../../hooks/useVehicleAdmin';
import { Button, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AdminVehicle.css'; 

const AdminVehicle = () => {
    const { vehicles, error, isLoading, getAllVehicles } = useVehicleAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        getAllVehicles();
    }, [getAllVehicles]);

    const handleViewDetails = (vehicleId: number) => {
        navigate(`details/${vehicleId}`);
    };

    const handleCreateNew = () => {
        navigate('details');
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải dữ liệu xe...</span>
            </div>
        );
    }

    if (error) {
        return <div className='d-flex justify-content-center align-items-center'>Không thể tải được danh sách xe</div>;
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return <Badge bg="success">Sẵn sàng</Badge>;
            case 'IN_USE':
                return <Badge bg="info">Đang dùng</Badge>;
            case 'MAINTENANCE':
                return <Badge bg="warning" text="dark">Bảo trì</Badge>;
            case 'IN_REPAIR':
                return <Badge bg="danger">Đang sửa</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="vehicle-container"> 
            <div className='vehicle-header d-flex justify-content-between align-items-center mb-3'>
                <h2>Quản lý Xe</h2>
                <Button variant="outline-primary" onClick={handleCreateNew}>
                    + Thêm xe mới
                </Button>
            </div>

            <table className="vehicle-table"> 
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Xe</th>
                        <th>Biển số</th>
                        <th>Model</th>
                        <th>Trạm</th>
                        <th>Pin</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map(vehicle => (
                        <tr
                            key={vehicle.vehicleId}
                            onClick={() => handleViewDetails(vehicle.vehicleId)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{vehicle.vehicleId}</td>
                            <td>{vehicle.vehicleName}</td>
                            <td><code>{vehicle.plateNumber}</code></td>
                            <td>{vehicle.modelName}</td>
                            <td>{vehicle.stationName}</td>
                            <td>{vehicle.batteryLevel}%</td>
                            <td>    
                                {getStatusBadge(vehicle.status)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminVehicle;