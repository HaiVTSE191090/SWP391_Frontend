import { useState, useCallback } from "react";
import {
  createBooking,
  CreateBookingRequest,
} from "../services/bookingService";

interface UseBookingReturn {
  bookingId: string | null;
  bookingData: any;
  loading: boolean;
  error: string | null;
  handleCreateBooking: (
    vehicleId: number,
    startDateTime: string,
    endDateTime: string
  ) => Promise<any>;
}

export const useBooking = (): UseBookingReturn => {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBooking = useCallback(
    async (vehicleId: number, startDateTime: string, endDateTime: string) => {
      try {
        setLoading(true);
        setError(null);

        const bookingRequest: CreateBookingRequest = {
          vehicleId,
          startDateTime,
          endDateTime,
        };

        const response = await createBooking(bookingRequest);

        if (response.code === 201) {
          setBookingId(response.data.bookingId);
          setBookingData(response.data);
          return {
            error: null,
            bookingId: response.data.bookingId,
            bookingData: response.data,
          };
        }
      } catch (error: any) {
        return {
          error: error.response?.data?.data,
          bookingId: null,
          bookingData: null,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    bookingId,
    bookingData,
    loading,
    error,
    handleCreateBooking,
  };
};
