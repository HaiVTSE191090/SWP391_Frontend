import axios from 'axios';

const baseURL = 'http://localhost:8080'; // Thay đổi URL cơ sở theo API thực tế
export const adminLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/login/admin`, {
            email,
            password
        });

        // QUAN TRỌNG: Lưu token sau khi đăng nhập thành công
        if (response.data.token) {
            localStorage.setItem('adminToken', response.data.token);
        }
        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error : any) {
        throw new Error(error.response.data.message || 'Email hoặc mật khẩu không đúng.');
    }
}