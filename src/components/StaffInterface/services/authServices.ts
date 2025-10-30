import axios from 'axios';

const baseURL = 'http://localhost:8080';

// Hàm đăng nhập nhân viên và lưu Token
export const staffLogin = async (email: string, password: string) => {
    try {
        const resp = await axios.post(`${baseURL}/api/auth/login/staff`, {
            email,
            password
        });
        return resp.data;
    } catch (error) {
        console.error('Lỗi đăng nhập nhân viên:', error);
    }
}

// Hàm đăng xuất nhân viên, xóa Token khỏi localStorage
export const staffLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
};

// Hàm lấy tên ra khỏi localStorage 
export const getUserName = () => {
    return localStorage.getItem('name') || '';
};

// Hàm lấy danh sách người thuê, gửi Token để xác thực
export const getListRenter = async () => {
    try {
        const token = localStorage.getItem('authToken');

        const resp = await axios.get(`${baseURL}/api/staff/renters`, {
            headers: {
                Authorization: `Bearer ${token}` // Gửi Token
            }
        });
        return resp;
    } catch (error) {
        console.error(error)
    }
}

// Hàm kiểm tra nhân viên thuộc trạm nào
export const getStaffStation = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const resp = await axios.get(`${baseURL}/api/staff/my-station`, {
            headers: {
                Authorization: `Bearer ${token}` // Gửi Token
            }
        });
        return resp;
    } catch (error) {
        console.error(error)
    }
}


// Hàm lấy CarDetails theo vehicleId
export const getCarDetails = async (vehicleId: number) => {
    try {
        const resp = await axios.get(`${baseURL}/api/vehicle/detail/${vehicleId}`)
        return resp;
    } catch (error) {
        console.error(error)
    }
}

// Hàm lấy thông tin người thuê theo renterId
export const getRenterDetails = async (renterId: number) => {
    try {
        const token = localStorage.getItem('authToken');
        const resp = await axios.get(`${baseURL}/api/staff/renter/${renterId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Gửi Token
            }
        });
        return resp;
    } catch (error) {
        console.error(error)
    }
}

// Hàm xác minh người thuê
export const verifyRenter = async (renterId: number) => {
    try {
        const token = localStorage.getItem('authToken');
        const resp = await axios.put(`${baseURL}/api/staff/renter/${renterId}/verify`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error(error)
    }
}

// Hàm xóa người thuê
export const deleteRenter = async (renterId: number) => {
    try {
        const token = localStorage.getItem('authToken');
        const resp = await axios.delete(`${baseURL}/api/staff/renter/${renterId}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error(error)
    }
}

// Hàm lấy danh sách booking tại trạm của nhân viên
export const getStaffStationBookings = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const resp = await axios.get(`${baseURL}/api/bookings/station/contracts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error(error)
    }
}

export const getContractTermsTemplate = async () => { 
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${baseURL}/api/staff/contracts/template`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi lấy điều khoản hợp đồng mẫu:", error);
        throw error;
    }
};


// Lấy thông tin chi tiết Booking để tạo Hợp đồng.

export const getBookingInfoForContract = async (bookingId: number) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${baseURL}/api/staff/contracts/booking-info/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin booking ID ${bookingId}:`, error);
        throw error;
    }
};


//  * Tạo Hợp đồng mới từ Booking.
export const createContract = async (payload: any) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${baseURL}/api/staff/contracts/create`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi tạo hợp đồng:", error);
        throw error;
    }
};

export const sendContractToAdmin = async (contractId: number) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${baseURL}/api/staff/contracts/${contractId}/send-to-admin`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error(`Lỗi khi gửi hợp đồng ${contractId} cho Admin:`, error);
        throw error;
    }
};