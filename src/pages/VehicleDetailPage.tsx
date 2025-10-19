import React from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Trang chi tiết xe
 * TODO: Cần API từ BE để lấy chi tiết 1 xe theo vehicleId
 * Hiện tại chưa có API này nên tạm thời hiển thị thông báo
 */
const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Quay lại
      </button>

      <div className="alert alert-warning" role="alert">
        <h4 className="alert-heading">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Trang chi tiết xe đang phát triển
        </h4>
        <hr />
        <p className="mb-0">
          Hiện tại chưa có API <code>GET /api/vehicles/{id}</code> để lấy chi tiết xe.
          <br />
          <strong>Vehicle ID:</strong> {id}
        </p>
        <hr />
        <p className="mb-0">
          <strong>Cần BE cung cấp API:</strong>
          <br />
          <code>GET /api/vehicles/{id}</code> - Trả về thông tin chi tiết 1 xe
        </p>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
