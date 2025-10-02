import { useState } from 'react';
import type { Rental } from '../types/Vehicle';
import './CostConfirmationModal.css';

interface CostConfirmationModalProps {
  rental: Rental;
  onConfirm: (agreed: boolean) => void;
  onCancel: () => void;
}

export default function CostConfirmationModal({ rental, onConfirm, onCancel }: CostConfirmationModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'agree' | 'disagree'>('agree');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleConfirmClick = (type: 'agree' | 'disagree') => {
    setConfirmationType(type);
    setShowConfirmDialog(true);
  };

  const handleFinalConfirm = () => {
    onConfirm(confirmationType === 'agree');
    setShowConfirmDialog(false);
  };

  const getFeeTypeText = (type: string) => {
    switch (type) {
      case 'damage': return 'Hư hỏng';
      case 'cleaning': return 'Vệ sinh';
      case 'fuel': return 'Nhiên liệu';
      default: return 'Khác';
    }
  };

  return (
    <div className="cost-confirmation-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Chi tiết chi phí thuê xe</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body">
          {/* Thông tin xe */}
          <div className="section">
            <h3>Thông tin xe thuê</h3>
            <div className="vehicle-summary">
              <img 
                src={rental.vehicle.handoverInfo.images[0]} 
                alt="Xe thuê"
                className="vehicle-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/vite.svg';
                }}
              />
              <div className="vehicle-details">
                <h4>{rental.vehicle.licensePlate}</h4>
                <p>{rental.vehicle.brand} {rental.vehicle.model}</p>
                <div className="rental-period">
                  <div><strong>Từ:</strong> {formatDate(rental.rentalInfo.startDate)}</div>
                  <div><strong>Đến:</strong> {formatDate(rental.rentalInfo.endDate)}</div>
                  <div><strong>Thời gian:</strong> {rental.rentalInfo.totalDays} ngày</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng tính chi phí */}
          <div className="section">
            <h3>Chi tiết chi phí</h3>
            <div className="cost-table">
              <div className="cost-row">
                <span className="cost-label">Chi phí thuê gốc ({rental.rentalInfo.totalDays} ngày × {formatCurrency(rental.rentalInfo.dailyRate)}):</span>
                <span className="cost-value positive">{formatCurrency(rental.costBreakdown!.baseCost)}</span>
              </div>

              {rental.costBreakdown!.additionalFees.length > 0 && (
                <>
                  <div className="cost-section-header">Chi phí phát sinh:</div>
                  {rental.costBreakdown!.additionalFees.map(fee => (
                    <div key={fee.id} className="cost-row fee-row">
                      <span className="cost-label">
                        <span className="fee-type">[{getFeeTypeText(fee.type)}]</span>
                        {fee.description}
                      </span>
                      <span className="cost-value positive">{formatCurrency(fee.amount)}</span>
                    </div>
                  ))}
                  <div className="cost-row subtotal">
                    <span className="cost-label">Tổng chi phí phát sinh:</span>
                    <span className="cost-value positive">{formatCurrency(rental.costBreakdown!.totalAdditionalFees)}</span>
                  </div>
                </>
              )}

              <div className="cost-row">
                <span className="cost-label">Tiền cọc đã đặt:</span>
                <span className="cost-value negative">-{formatCurrency(rental.costBreakdown!.deposit)}</span>
              </div>

              <div className="cost-divider"></div>
              
              <div className={`cost-row final ${rental.costBreakdown!.finalAmount < 0 ? 'refund' : 'payment'}`}>
                <span className="cost-label final-label">
                  {rental.costBreakdown!.finalAmount < 0 ? 'Số tiền được hoàn lại:' : 'Số tiền cần thanh toán thêm:'}
                </span>
                <span className="cost-value final-value">
                  {formatCurrency(Math.abs(rental.costBreakdown!.finalAmount))}
                </span>
              </div>
            </div>
          </div>

          {/* Hình ảnh so sánh */}
          {rental.vehicle.returnInfo && (
            <div className="section">
              <h3>Hình ảnh so sánh</h3>
              <div className="image-comparison">
                <div className="image-item">
                  <img src={rental.vehicle.handoverInfo.images[0]} alt="Bàn giao" />
                  <span>Khi bàn giao</span>
                </div>
                <div className="image-item">
                  <img src={rental.vehicle.returnInfo.images[0]} alt="Trả xe" />
                  <span>Khi trả xe</span>
                </div>
              </div>
              {rental.vehicle.returnInfo.notes && (
                <div className="staff-notes">
                  <strong>Ghi chú từ nhân viên:</strong>
                  <p>{rental.vehicle.returnInfo.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            className="disagree-btn"
            onClick={() => handleConfirmClick('disagree')}
          >
            Không đồng ý
          </button>
          <button 
            className="agree-btn"
            onClick={() => handleConfirmClick('agree')}
          >
            Đồng ý thanh toán
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h3>Xác nhận quyết định</h3>
            <p>
              {confirmationType === 'agree' 
                ? 'Bạn có chắc chắn đồng ý với chi phí bồi thường này không?' 
                : 'Bạn có chắc chắn không đồng ý với chi phí bồi thường này không?'
              }
            </p>
            <div className="dialog-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmDialog(false)}
              >
                Hủy
              </button>
              <button 
                className={confirmationType === 'agree' ? 'confirm-btn' : 'decline-btn'}
                onClick={handleFinalConfirm}
              >
                {confirmationType === 'agree' ? 'Xác nhận đồng ý' : 'Xác nhận không đồng ý'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}