import { useState, useCallback } from 'react';
import { createBooking } from '../services/bookingService';

interface UseBookingReturn {
  bookingId: string | null;
  bookingData: any;
  loading: boolean;
  error: string | null;
  handleCreateBooking: (vehicleId: number) => Promise<any>;
}

export const useBooking = (): UseBookingReturn => {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBooking = useCallback(async (vehicleId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createBooking(vehicleId);
      
      if (response.data?.id) {
        setBookingId(response.data.id);
        setBookingData(response.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Lỗi khi tạo đặt xe');
      console.log('useBooking:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    bookingId, 
    bookingData, 
    loading, 
    error, 
    handleCreateBooking 
  };
};

