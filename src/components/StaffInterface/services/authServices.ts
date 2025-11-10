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
    localStorage.removeItem('token');
    localStorage.removeItem('name');
};

// Hàm lấy tên ra khỏi localStorage 
export const getUserName = () => {
    return localStorage.getItem('name') || '';
};

// Hàm lấy danh sách người thuê, gửi Token để xác thực
export const getListRenter = async () => {
    try {
        const token = localStorage.getItem('token');

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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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

//Hàm lấy thông báo cho nhân viên
export const getStaffNotifications = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Không tìm thấy token. Không thể lấy thông báo.');
            // Trả về một mảng rỗng nếu không có token (chưa đăng nhập)
            return { data: { data: [] } }; 
        }

        const resp = await axios.get(`${baseURL}/api/notifications/my`, {
            headers: {
                Authorization: `Bearer ${token}` // Gửi Token
            }
        });
        // Trả về trực tiếp response để lấy data sau này
        return resp; 
    } catch (error) {
        console.error('Lỗi khi lấy thông báo nhân viên:', error);
        // Ném lỗi hoặc trả về cấu trúc lỗi nếu cần xử lý sâu hơn
        throw error;
    }
}

// --- BỔ SUNG HÀM API PATCH MỚI ---
export const markNotificationAsRead = async (notificationId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Không tìm thấy Auth Token.");
    }
    try {
        const response = await axios.patch(`${baseURL}/api/notifications/${notificationId}/read`, {}, // Body rỗng vì PATCH này chỉ cần URL và header
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Thêm các header cần thiết khác (ví dụ: 'Content-Type': 'application/json')
                }
            }
        );
        return response;
    } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
        throw error;
    }
};

// Lấy danh sách loại ảnh
export const getImageTypes = async () => {
    try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${baseURL}/api/bookings/image-types`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách image types:', error);
    }
};

// Lấy danh sách hạng mục xe
export const getVehicleComponents = async () => {
    try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${baseURL}/api/bookings/vehicle-components`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách vehicle components:', error);
    }
};

// Lấy danh sách ảnh bắt buộc
export const getImageChecklist = async (bookingId: number, imageType: string) => {
    try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${baseURL}/api/bookings/${bookingId}/images/checklist`, {
            params: { imageType },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error('Lỗi khi lấy image checklist:', error);
    }
};

// Upload ảnh xe
export const uploadCarImage = async (bookingId: number, imageType: string, vehicleComponent: string, description: string, file: File) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        
        const resp = await axios.post(
            `${baseURL}/api/bookings/${bookingId}/images`,
            formData,
            {
                params: { imageType, vehicleComponent, description },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return resp;
    } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
    }
};

// Hàm xóa ảnh booking
export const deleteBookingImage = async (bookingId: number, imageId: number) => {
    try {
        const token = localStorage.getItem('token');
        const resp = await axios.delete(
            `${baseURL}/api/bookings/${bookingId}/images/${imageId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return resp;
    } catch (error) {
        console.error('Lỗi khi xóa ảnh:', error);
        throw error;
    }
};

// Lấy danh sách ảnh đã upload theo bookingId và imageType
export const getBookingImages = async (bookingId: number, imageType?: string) => {
    try {
        const token = localStorage.getItem('token');
        const params = imageType ? { imageType } : {};
        
        const resp = await axios.get(`${baseURL}/api/bookings/${bookingId}/images`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách ảnh:', error);
    }
};

// Lấy thông tin chi tiết booking theo bookingId (bao gồm cả ảnh)
export const getBookingDetail = async (bookingId: number) => {
    try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${baseURL}/api/bookings/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return resp;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết booking:', error);
    }
};
