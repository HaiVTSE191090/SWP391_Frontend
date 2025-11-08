import React, { useEffect } from 'react'
import { usePolicy } from '../../hooks/usePolicy';
import { Button, Spinner } from 'react-bootstrap';
import "./AdminConfig.css"
import { useNavigate } from 'react-router-dom';

const AdminConfig = () => {
    const { policies, error, isLoading, loadAllPolicies } = usePolicy();
    const navigate = useNavigate();
    useEffect(() => {
        loadAllPolicies();
    }, [loadAllPolicies]);

    const handleViewDetails = (policyId : number) => {
        navigate(`details/${policyId}`)
    }

    if (isLoading) {
        return (

            <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Đang tải dữ liệu...</span>
            </div>
        )
    }

    if (error) {
        return <div className='d-flex justify-content-center align-items-center'>Không thể tải được danh sách</div>;
    }

    const handleCreateNew = () => {
        navigate('/admin/config/details');
    };

    return (
        <div className="policy-container">
            <div className='policy-header d-flex justify-content-between align-items-center mb-3'>
                <h2>Quản lý Cấu hình (Policies)</h2>
                <Button variant="outline-primary"
                 onClick={handleCreateNew}>
                    + Thêm mới
                </Button>
            </div>
            <table className="policy-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên cấu hình (Key)</th>
                        <th>Mô tả</th>
                        <th>Giá trị</th>
                        <th>Phạm vi</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map(policy => (
                        <tr
                            key={policy.policyId}
                            onClick={() => handleViewDetails(policy.policyId)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{policy.policyId}</td>
                            <td><code>{policy.policyType}</code></td>
                            <td>{policy.description}</td>
                            <td>{policy.value}</td>
                            <td>{policy.appliedScope}</td>
                            <td>{policy.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminConfig
