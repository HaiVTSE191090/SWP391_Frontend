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
