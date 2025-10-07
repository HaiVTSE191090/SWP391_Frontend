import { useState } from 'react';
import type { Vehicle } from '../types/Vehicle';
import './VehicleList.css';

interface VehicleListProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export default function VehicleList({ vehicles, onSelectVehicle }: VehicleListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.status === 'waiting_return' &&
    (vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="vehicle-list">
      <div className="header">
        <h1>Danh sách xe đang chờ trả</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo biển số, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="vehicle-grid">
        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">
            <p>Không có xe nào đang chờ trả</p>
          </div>
        ) : (
          filteredVehicles.map(vehicle => (
            <div 
              key={vehicle.id} 
              className="vehicle-card"
              onClick={() => onSelectVehicle(vehicle)}
            >
              <div className="vehicle-image">
                <img 
                  src={vehicle.handoverInfo.images[0]} 
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/vite.svg';
                  }}
                />
              </div>
              <div className="vehicle-info">
                <h3>{vehicle.licensePlate}</h3>
                <p>{vehicle.brand} {vehicle.model}</p>
                <div className="vehicle-stats">
                  <span className="battery">🔋 {vehicle.handoverInfo.battery}%</span>
                  <span className="mileage">� {vehicle.handoverInfo.mileage.toLocaleString()}km</span>
                </div>
                <div className="handover-date">
                  Bàn giao: {new Date(vehicle.handoverInfo.handoverDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div className="status-badge waiting">
                Đang chờ trả
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}