import { useState } from 'react';
import type { Rental } from '../types/Vehicle';
import CostConfirmationModal from './CostConfirmationModal';
import './RenterDashboard.css';

interface RenterDashboardProps {
  rentals: Rental[];
  onConfirmPayment: (rentalId: string, agreed: boolean) => void;
}

export default function RenterDashboard({ rentals, onConfirmPayment }: RenterDashboardProps) {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const pendingRentals = rentals.filter(rental => rental.status === 'pending_payment');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="renter-dashboard">
      <div className="dashboard-header">
        <h1>Xác nhận chi phí thuê xe</h1>
        <p>Vui lòng xem lại và xác nhận các khoản chi phí sau khi trả xe</p>
      </div>

      {pendingRentals.length === 0 ? (
        <div className="no-rentals">
          <h3>Không có hóa đơn nào cần thanh toán</h3>
          <p>Tất cả các giao dịch của bạn đã được xử lý xong.</p>
        </div>
      ) : (
        <div className="rentals-grid">
          {pendingRentals.map(rental => (
            <div key={rental.id} className="rental-card">
              <div className="rental-header">
                <div className="vehicle-info">
                  <img 
                    src={rental.vehicle.handoverInfo.images[0]} 
                    alt={`${rental.vehicle.brand} ${rental.vehicle.model}`}
                    className="vehicle-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/vite.svg';
                    }}
                  />
                  <div>
                    <h3>{rental.vehicle.licensePlate}</h3>
                    <p>{rental.vehicle.brand} {rental.vehicle.model}</p>
                  </div>
                </div>
                <div className="rental-period">
                  <span className="label">Thời gian thuê:</span>
                  <span className="value">{rental.rentalInfo.totalDays} ngày</span>
                </div>
              </div>

              <div className="cost-summary">
                <div className="cost-item">
                  <span className="label">Chi phí thuê gốc:</span>
                  <span className="value">{formatCurrency(rental.costBreakdown!.baseCost)}</span>
                </div>
                
                {rental.costBreakdown!.additionalFees.length > 0 && (
                  <div className="additional-fees">
                    <span className="label">Chi phí phát sinh:</span>
                    {rental.costBreakdown!.additionalFees.map(fee => (
                      <div key={fee.id} className="fee-detail">
                        <span className="fee-desc">{fee.description}</span>
                        <span className="fee-amount">{formatCurrency(fee.amount)}</span>
                      </div>
                    ))}
                    <div className="total-additional">
                      <span className="label">Tổng phát sinh:</span>
                      <span className="value">{formatCurrency(rental.costBreakdown!.totalAdditionalFees)}</span>
                    </div>
                  </div>
                )}\n\n                <div className="cost-item deposit">
                  <span className="label">Tiền cọc đã đặt:</span>
                  <span className="value">-{formatCurrency(rental.costBreakdown!.deposit)}</span>
                </div>

                <div className={`final-amount ${rental.costBreakdown!.finalAmount < 0 ? 'refund' : 'payment'}`}>
                  <span className="label">
                    {rental.costBreakdown!.finalAmount < 0 ? 'Số tiền được hoàn lại:' : 'Số tiền cần thanh toán:'}
                  </span>
                  <span className="value">
                    {formatCurrency(Math.abs(rental.costBreakdown!.finalAmount))}
                  </span>
                </div>
              </div>

              <div className="rental-details">
                <div className="detail-row">
                  <span className="label">Ngày nhận xe:</span>
                  <span className="value">{formatDate(rental.rentalInfo.startDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Ngày trả xe:</span>
                  <span className="value">{formatDate(rental.rentalInfo.endDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Giá thuê/ngày:</span>
                  <span className="value">{formatCurrency(rental.rentalInfo.dailyRate)}</span>
                </div>
              </div>

              <button 
                className="view-details-btn"
                onClick={() => setSelectedRental(rental)}
              >
                Xem chi tiết và xác nhận
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRental && (
        <CostConfirmationModal
          rental={selectedRental}
          onConfirm={(agreed: boolean) => {
            onConfirmPayment(selectedRental.id, agreed);
            setSelectedRental(null);
          }}
          onCancel={() => setSelectedRental(null)}
        />
      )}
    </div>
  );
}