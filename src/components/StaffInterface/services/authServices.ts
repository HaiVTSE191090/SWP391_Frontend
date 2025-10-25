import axios from 'axios';

const baseURL = 'http://localhost:8080'; // Thay đổi URL cơ sở theo API thực tế

// Hàm đăng nhập nhân viên và lưu Token
export const staffLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/login/staff`, {
            email,
            password
        });

        // LƯU Token sau khi đăng nhập thành công
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error : any) {
        // Trích xuất thông báo lỗi từ Back-end
        throw new Error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    }
}

// Hàm lấy danh sách người thuê, gửi Token để xác thực
export const getListRenter = async () => {
    try{
        const token = localStorage.getItem('authToken');
        
        // KIỂM TRA QUAN TRỌNG: Nếu chưa có Token, ném lỗi để Front-end bắt
        if (!token) {
            throw new Error('Chưa đăng nhập. Token nhân viên không tồn tại.'); 
        }

        const response = await axios.get(`${baseURL}/api/staff/renters`, {
            headers: {
                Authorization: `Bearer ${token}` // Gửi Token
            }
        });
        // Giả sử Back-end trả về mảng người thuê
        return response.data; 
    } catch(error : any) {
        // Ném lỗi với thông báo từ Back-end nếu có
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người thuê.');
    }
}
