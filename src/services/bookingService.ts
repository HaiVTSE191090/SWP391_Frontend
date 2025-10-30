import api from "./apiClient";

export interface CreateBookingRequest {
  vehicleId: number;
  startDateTime: string;
  endDateTime: string;
}

export const createBooking = async (bookingData: CreateBookingRequest): Promise<any> => {
  const response = await api.post(`/api/bookings`, bookingData);
  return response.data;
};
