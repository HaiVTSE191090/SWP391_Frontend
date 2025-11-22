import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAdminStation } from '../../hooks/useAdminStation';
import { Button, Spinner } from 'react-bootstrap';
import { MapPin, Plus } from 'lucide-react';

const AdminStation = () => {
    const { stations, error, isLoading, loadAllStations } = useAdminStation();

    const navigate = useNavigate();

    useEffect(() => {
        loadAllStations();
    }, [loadAllStations]);
    const handleViewDetails = (stationId: number) => { 
        navigate(`detail/${stationId}`); 
    };

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: 200 }}
            >
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải danh sách trạm xe...</span>
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
                    <MapPin size={28} className="me-2" /> {/* <-- Thay đổi icon/title */}
                    Quản lý Trạm xe
                </h2>
                <Button variant="outline-primary" onClick={handleCreateNew}>
                    <Plus size={18} /> Thêm mới
                </Button>
            </div>

            <table className="policy-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên trạm</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {stations.map((station) => ( 
                        <tr
                            key={station.stationId}
                            onClick={() => handleViewDetails(station.stationId)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{station.stationId}</td>
                            <td>
                                <strong>{station.name}</strong>
                            </td>
                            <td>{station.location}</td>
                            <td>{station.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminStation
