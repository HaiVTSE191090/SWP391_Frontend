import { jwtDecode } from "jwt-decode";
import * as authService from "../services/authService";
import * as model from "../models/AuthModel";

export class AuthController {

  static async login(data: model.LoginRequest) {
    try {
      const res = await authService.loginApi(data);
      const successData = res.data;
      const token = successData.data.token;

      // Lấy thông tin profile
      const userRes = await authService.getProfile(token);

      const userObj = {
        email: successData.data.email,
        fullName: userRes.data.data.fullName,
        kycStatus: successData.data.kycStatus,
        renterId: userRes.data.data.renterId,
        status: userRes.data.data.status,
      };

      return {
        success: true,
        token,
        user: userObj,
        message: "Đăng nhập thành công!",
      };
    } catch (err: any) {
      const errorData = err?.response?.data;

      // Xử lý lỗi validation từ backend
      if (errorData?.data && typeof errorData.data === "object") {
        return {
          success: false,
          fieldErrors: errorData.data,
          error: null,
        };
      }

      // Xử lý lỗi chung
      return {
        success: false,
        error: errorData?.data || "Đăng nhập thất bại, vui lòng thử lại.",
        fieldErrors: {},
      };
    }
  }

  /**
   * Xử lý đăng nhập bằng Google
   */
  static async loginWithGoogle(credential: string) {
    try {
      // Decode Google JWT để lấy thông tin
      let decodedGoogle: any = {};
      try {
        decodedGoogle = jwtDecode<any>(credential);
      } catch (decodeErr) {
        console.error("Failed to decode Google credential:", decodeErr);
      }

      const email = decodedGoogle?.email || decodedGoogle?.sub || undefined;
      const fullName = decodedGoogle?.name || decodedGoogle?.fullName || undefined;

      // Gọi API backend
      const res = await authService.loginWithGoogle({
        token: credential,
        email,
        fullName,
        phoneNumber: "",
      });

      if (res.status === 200) {
        const successData = res.data as model.LoginSuccessData;
        const newToken = successData.token;

        // Decode token từ backend
        let decoded: any = {};
        try {
          decoded = jwtDecode<any>(newToken);
        } catch {}

        const userObj = {
          email: decoded?.email || decoded?.sub || successData.email,
          fullName: decoded?.fullName || decoded?.name,
          kycStatus: successData.kycStatus,
        };

        return {
          success: true,
          token: newToken,
          user: userObj,
          message: "Đăng nhập Google thành công!",
        };
      }

      return {
        success: false,
        error: (res as any)?.data?.message || "Đăng nhập Google thất bại",
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Đăng nhập Google thất bại",
      };
    }
  }

  /**
   * Xử lý đăng ký
   */
  static async signUp(data: model.SignUpRequest) {
    try {
      const res = await authService.signUpApi(data);

      if (res.status === 201) {
        return {
          success: true,
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
        };
      }

      const errorData = res?.data;
      if (errorData?.data && typeof errorData.data === "object") {
        return {
          success: false,
          fieldErrors: errorData.data,
          error: null,
        };
      }

      return {
        success: false,
        error: errorData?.message || "Đăng ký thất bại",
        fieldErrors: {},
      };
    } catch (err: any) {
      const errorData = err?.response?.data || err?.data;

      if (errorData?.data && typeof errorData.data === "object") {
        return {
          success: false,
          fieldErrors: errorData.data,
          error: null,
        };
      }

      return {
        success: false,
        error: errorData?.data || err?.message || "Đăng ký thất bại",
        fieldErrors: {},
      };
    }
  }

  /**
   * Xác thực OTP
   */
  static async verifyOTP(email: string, otpCode: string) {
    try {
      console.log("Verifying OTP for email:", email, "with code:", otpCode);
      const response = await authService.verifyOTP(email, otpCode);

      if (response.status === 200) {
        return {
          success: true,
          message: "Xác thực OTP thành công!",
        };
      }

      return {
        success: false,
        error: "Xác thực OTP thất bại",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Có lỗi xảy ra khi xác thực OTP",
      };
    }
  }

  /**
   * Gửi OTP
   */
  static async sendOTP(email: string) {
    try {
      const response = await authService.sendOTP(email);

      if (response.status === 200) {
        return {
          success: true,
          message: "Đã gửi lại mã OTP!",
        };
      }

      return {
        success: false,
        error: response.data || "Gửi OTP thất bại",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Có lỗi xảy ra",
      };
    }
  }

  /**
   * Lưu thông tin user và token vào localStorage
   */
  static saveAuthData(token: string, user: any) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("userLogin"));
  }

  /**
   * Xóa thông tin authentication
   */
  static clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Lấy thông tin auth từ localStorage
   */
  static getStoredAuth() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) return null;

    try {
      const user = JSON.parse(userStr);
      return { token, user };
    } catch {
      return null;
    }
  }
}
