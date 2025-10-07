import { useState } from 'react';
import type { Vehicle, VehicleCondition, AdditionalFee } from '../types/Vehicle';
import './VehicleReturnForm.css';

interface VehicleReturnFormProps {
  vehicle: Vehicle;
  onReturn: (returnData: any) => void;
  onCancel: () => void;
}

export default function VehicleReturnForm({ vehicle, onReturn, onCancel }: VehicleReturnFormProps) {
  const [returnImages, setReturnImages] = useState<string[]>([]);
  const [currentBattery, setCurrentBattery] = useState(vehicle.handoverInfo.battery);
  const [currentMileage, setCurrentMileage] = useState(vehicle.handoverInfo.mileage);
  const [condition, setCondition] = useState<VehicleCondition>({
    exterior: 'good',
    battery: 'good',
    mileage: 'normal',
    overall: 'good'
  });
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
  const [notes, setNotes] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setReturnImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setReturnImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFee = () => {
    const newFee: AdditionalFee = {
      id: Date.now().toString(),
      type: 'other',
      amount: 0,
      description: ''
    };
    setAdditionalFees(prev => [...prev, newFee]);
  };

  const updateFee = (id: string, field: keyof AdditionalFee, value: any) => {
    setAdditionalFees(prev => 
      prev.map(fee => fee.id === id ? { ...fee, [field]: value } : fee)
    );
  };

  const removeFee = (id: string) => {
    setAdditionalFees(prev => prev.filter(fee => fee.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const returnData = {
      images: returnImages,
      battery: currentBattery,
      mileage: currentMileage,
      returnDate: new Date().toISOString(),
      condition,
      additionalFees,
      notes,
      staffId: 'STAFF_001' // In real app, get from auth
    };
    onReturn(returnData);
  };

  const totalFees = additionalFees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="vehicle-return-form">
      <div className="form-header">
        <h2>Xác nhận trả xe: {vehicle.licensePlate}</h2>
        <button className="close-btn" onClick={onCancel}>✕</button>
      </div>

      <div className="form-content">
        {/* Thông tin bàn giao trước đó */}
        <div className="section">
          <h3>Thông tin bàn giao trước đó</h3>
          <div className="handover-info">
            <div className="handover-image">
              <div className="image-item">
                <img src={vehicle.handoverInfo.images[0]} alt="Ảnh bàn giao xe" />
                <span>Ảnh bàn giao xe</span>
              </div>
            </div>
            <div className="info-stats">
              <div className="stat">
                <span className="label">Pin:</span>
                <span className="value">{vehicle.handoverInfo.battery}%</span>
              </div>
              <div className="stat">
                <span className="label">Km:</span>
                <span className="value">{vehicle.handoverInfo.mileage.toLocaleString()} km</span>
              </div>
              <div className="stat">
                <span className="label">Ngày bàn giao:</span>
                <span className="value">
                  {new Date(vehicle.handoverInfo.handoverDate).toLocaleString('vi-VN')}
                </span>
              </div>
              {vehicle.handoverInfo.notes && (
                <div className="stat">
                  <span className="label">Ghi chú:</span>
                  <span className="value">{vehicle.handoverInfo.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Ảnh tình trạng hiện tại */}
          <div className="section">
            <h3>Ảnh tình trạng khi trả</h3>
            <div className="image-upload">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-btn">
                📷 Chụp/Tải ảnh
              </label>
            </div>
            <div className="images-grid">
              {returnImages.map((img, index) => (
                <div key={index} className="image-item">
                  <img src={img} alt={`Return ${index + 1}`} />
                  <button 
                    type="button" 
                    className="remove-img-btn"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Thông số hiện tại */}
          <div className="section">
            <h3>Thông số hiện tại</h3>
            <div className="current-stats">
              <div className="input-group">
                <label>Pin hiện tại (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={currentBattery}
                  onChange={(e) => setCurrentBattery(Number(e.target.value))}
                  required
                />
              </div>
              <div className="input-group">
                <label>Số km hiện tại</label>
                <input
                  type="number"
                  min={vehicle.handoverInfo.mileage}
                  value={currentMileage}
                  onChange={(e) => setCurrentMileage(Number(e.target.value))}
                  required
                />
                <small>Tăng: {currentMileage - vehicle.handoverInfo.mileage} km</small>
              </div>
            </div>
          </div>

          {/* Checklist tình trạng */}
          <div className="section">
            <h3>Đánh giá tình trạng xe</h3>
            <div className="condition-checklist">
              <div className="condition-item">
                <label>Ngoại hình:</label>
                <select
                  value={condition.exterior}
                  onChange={(e) => setCondition(prev => ({ ...prev, exterior: e.target.value as any }))}
                >
                  <option value="good">Tốt</option>
                  <option value="minor_damage">Hỏng nhẹ</option>
                  <option value="major_damage">Hỏng nặng</option>
                </select>
              </div>
              <div className="condition-item">
                <label>Tình trạng pin:</label>
                <select
                  value={condition.battery}
                  onChange={(e) => setCondition(prev => ({ ...prev, battery: e.target.value as any }))}
                >
                  <option value="good">Tốt</option>
                  <option value="low">Thấp</option>
                  <option value="very_low">Rất thấp</option>
                </select>
              </div>
              <div className="condition-item">
                <label>Số km:</label>
                <select
                  value={condition.mileage}
                  onChange={(e) => setCondition(prev => ({ ...prev, mileage: e.target.value as any }))}
                >
                  <option value="normal">Bình thường</option>
                  <option value="high">Cao</option>
                </select>
              </div>
              <div className="condition-item">
                <label>Đánh giá tổng thể:</label>
                <select
                  value={condition.overall}
                  onChange={(e) => setCondition(prev => ({ ...prev, overall: e.target.value as any }))}
                >
                  <option value="good">Tốt</option>
                  <option value="needs_maintenance">Cần bảo dưỡng</option>
                  <option value="damaged">Hư hỏng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Phụ phí */}
          <div className="section">
            <h3>Phụ phí (nếu có)</h3>
            <button type="button" onClick={addFee} className="add-fee-btn">
              + Thêm phụ phí
            </button>
            {additionalFees.map(fee => (
              <div key={fee.id} className="fee-item">
                <select
                  value={fee.type}
                  onChange={(e) => updateFee(fee.id, 'type', e.target.value)}
                >
                  <option value="damage">Hư hỏng</option>
                  <option value="cleaning">Vệ sinh</option>
                  <option value="fuel">Nhiên liệu</option>
                  <option value="other">Khác</option>
                </select>
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={fee.description}
                  onChange={(e) => updateFee(fee.id, 'description', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Số tiền"
                  value={fee.amount}
                  onChange={(e) => updateFee(fee.id, 'amount', Number(e.target.value))}
                />
                <button type="button" onClick={() => removeFee(fee.id)} className="remove-fee-btn">
                  ✕
                </button>
              </div>
            ))}
            {totalFees > 0 && (
              <div className="total-fees">
                <strong>Tổng phụ phí: {totalFees.toLocaleString()} VND</strong>
              </div>
            )}
          </div>

          {/* Ghi chú */}
          <div className="section">
            <h3>Ghi chú</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm về tình trạng xe..."
              rows={4}
            />
          </div>

          {/* Nút hành động */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Hủy
            </button>
            <button type="submit" className="confirm-btn">
              Xác nhận trả xe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}