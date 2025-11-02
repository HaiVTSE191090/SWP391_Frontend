import axios from "axios";

const baseURL = "http://localhost:8080";

export const adminLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/login/admin`, {
            email,
            password
        });

        // ✅ Lưu token sau khi đăng nhập thành công
        if (response.data?.data?.token) {
            localStorage.setItem("adminToken", response.data.data.token);
        }

        return response.data;
    } catch (error: any) {
        console.error("🔴 Lỗi đăng nhập Admin:", error);

        let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

        if (error.response) {
            const res = error.response.data;

            // ✅ Xử lý cả 3 dạng trả về từ backend
            if (res?.data) {
                if (typeof res.data === "string") {
                    // Dạng "Sai mật khẩu"
                    errorMessage = res.data;
                } else if (typeof res.data === "object") {
                    // Dạng { password: "Mật khẩu cần có ít nhất..." }
                    const fields = Object.values(res.data);
                    if (fields.length > 0) {
                        errorMessage = fields.join(", ");
                    }
                }
            } else if (res?.message) {
                // Dạng có trường message riêng
                errorMessage = res.message;
            } else if (error.response.statusText) {
                errorMessage = error.response.statusText;
            }
        }

        return {
            success: false,
            err: errorMessage
        }
    }
};
