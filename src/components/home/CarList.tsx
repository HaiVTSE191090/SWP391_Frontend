import React, { useEffect, useState } from "react";
import { useVehicle } from "../../hooks/useVehicle";
import VehicleCard from "../vehicle/VehicleCard";

export const CarList: React.FC = () => {
  const { vehicles, loading, error, loadAllVehicles } = useVehicle();

  const [visibleCount, setVisibleCount] = useState(6);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllVehicles();
  }, [loadAllVehicles]);

  // Handle load more
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  useEffect(() => {
    setVisibleCount(6);
  }, [filterStatus, searchQuery]);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const statusMatch = filterStatus === 'ALL' || vehicle.status === filterStatus;
    
    const searchMatch = searchQuery === '' || 
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.modelName && vehicle.modelName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">
          <i className="bi bi-car-front me-2"></i>
          Xe dành cho bạn
        </h2>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted fs-5">Đang tải danh sách xe...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">
          <i className="bi bi-car-front me-2"></i>
          Xe dành cho bạn
        </h2>
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
          <div>
            <h5 className="mb-1">Không thể tải danh sách xe</h5>
            <p className="mb-0">{error}</p>
          </div>
        </div>
        <div className="text-center mt-3">
          <button 
            className="btn btn-primary"
            onClick={() => loadAllVehicles()}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return (
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">
          <i className="bi bi-car-front me-2"></i>
          Xe dành cho bạn
        </h2>
        <div className="alert alert-info text-center py-5" role="alert">
          <i className="bi bi-info-circle fs-1 d-block mb-3"></i>
          <h5 className="mb-2">Chưa có xe nào</h5>
          <p className="mb-0 text-muted">Hiện tại chưa có xe nào trong hệ thống. Vui lòng quay lại sau.</p>
        </div>
      </section>
    );
  }

  const displayVehicles = filteredVehicles.slice(0, visibleCount);
  const remainingCount = filteredVehicles.length - visibleCount;
  const hasMore = visibleCount < filteredVehicles.length;

  const availableCount = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const inUseCount = vehicles.filter(v => v.status === 'IN_USE').length;

  return (
    <section className="container py-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-car-front-fill text-primary me-2"></i>
          Xe dành cho bạn
        </h2>
        <p className="text-muted mb-0">
          Tổng cộng <strong className="text-primary">{vehicles.length}</strong> xe từ tất cả các trạm
        </p>
      </div>

      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className="input-group input-group-lg">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo biển số hoặc tên xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              className={`btn ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterStatus('ALL')}
            >
              Tất cả ({vehicles.length})
            </button>
            <button
              className={`btn ${filterStatus === 'AVAILABLE' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterStatus('AVAILABLE')}
            >
              Có sẵn ({availableCount})
            </button>
            <button
              className={`btn ${filterStatus === 'IN_USE' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilterStatus('IN_USE')}
            >
              Đang sử dụng ({inUseCount})
            </button>
          </div>
        </div>
      </div>

      {(filterStatus !== 'ALL' || searchQuery) && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-funnel me-2"></i>
            Đang hiển thị <strong>{displayVehicles.length}</strong> / {filteredVehicles.length} xe
            {searchQuery && ` với từ khóa "${searchQuery}"`}
          </span>
          {(filterStatus !== 'ALL' || searchQuery) && (
            <button
              className="btn btn-sm btn-outline-info"
              onClick={() => {
                setFilterStatus('ALL');
                setSearchQuery('');
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {filteredVehicles.length === 0 ? (
        <div className="alert alert-warning text-center py-5">
          <i className="bi bi-inbox fs-1 d-block mb-3"></i>
          <h5>Không tìm thấy xe nào</h5>
          <p className="mb-0">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="row g-4">
          {displayVehicles.map((vehicle) => (
            <div key={vehicle.vehicleId} className="col-12 col-sm-6 col-lg-4">
              <VehicleCard vehicle={vehicle} showStation={true} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-5">
          <button
            className="btn btn-primary btn-lg px-5"
            onClick={handleLoadMore}
          >
            Xem thêm {Math.min(6, remainingCount)} xe khác
            {remainingCount > 6 && ` (còn ${remainingCount} xe)`}
          </button>
        </div>
      )}
    </section>
  );
};
