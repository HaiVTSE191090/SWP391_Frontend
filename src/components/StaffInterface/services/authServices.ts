import axios from 'axios';

const baseURL = 'http://localhost:8080'; // Thay đổi URL cơ sở theo API thực tế
export const staffLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/login/staff`, {
            email,
            password
        });

        // QUAN TRỌNG: Lưu token sau khi đăng nhập thành công
        if (response.data.token) {
            localStorage.setItem('staffToken', response.data.token);
        }
        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error : any) {
        throw new Error(error.response.data.message || 'Email hoặc mật khẩu không đúng.');
    }
}