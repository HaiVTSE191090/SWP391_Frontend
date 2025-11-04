import React, { useState } from 'react';

/* Bạn có thể đặt CSS này trong file .css riêng
  .star-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 1.8rem;
    color: #e0e0e0; // Màu sao rỗng
    transition: color 0.1s;
  }
  .star-button.filled {
    color: #ffc107; // Màu sao đã chọn (màu vàng)
  }
  .star-button:hover {
    transform: scale(1.1);
  }
*/

interface StarRatingProps {
  rating: number; 
  onRatingChange: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= (hover || rating);
        return (
          <button
            type="button"
            key={starValue}

            className={`star-button ${isFilled ? 'filled' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              padding: '0 2px',
              cursor: 'pointer',
              fontSize: '1.8rem',
              color: isFilled ? '#ffc107' : '#e0e0e0',
              transition: 'color 0.1s',
            }}
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            {/*(U+2605) */}
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;