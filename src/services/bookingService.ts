import api from "./apiClient";


export const createBooking = async (vehicleId: number): Promise<any> => {
    try {
        const response = await api.post(`/api/bookings`, { vehicleId });
        return response.data;
    } catch (error) {
        throw error;
    }
};
