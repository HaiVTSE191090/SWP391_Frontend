import React, { useState, useEffect } from 'react';
import './RentalModal.css';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RentalData {
  carImage: string;
  carName: string;
  endTime: Date;
}

const RentalModal: React.FC<RentalModalProps> = ({ isOpen, onClose }) => {
  // Dữ liệu giả định - có thể thay thế bằng dữ liệu từ database
  const [rentalData] = useState<RentalData>({
    carImage: '/Xe/download.png',
    carName: 'Xe VF7',
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000) // 2 giờ 30 phút từ hiện tại
  });

  const [timeLeft, setTimeLeft] = useState<string>('');

  // Bộ đếm thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = rentalData.endTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('00:00:00');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [rentalData.endTime]);

  const handleReturnCar = () => {
    alert('Xe đã được trả thành công!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Xe đang thuê</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="car-info">
            <img 
              src={rentalData.carImage} 
              alt={rentalData.carName}
              className="car-image"
            />
            <h3>{rentalData.carName}</h3>
          </div>
          
          <div className="time-info">
            <h4>Thời gian còn lại:</h4>
            <div className="countdown-timer">
              {timeLeft}
            </div>
            <p className="time-format">Giờ : Phút : Giây</p>
          </div>
          
          <button className="return-btn" onClick={handleReturnCar}>
            Trả xe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalModal;