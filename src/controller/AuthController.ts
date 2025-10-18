import { jwtDecode } from "jwt-decode";
import * as authServiceModule from "../services/authService";
import * as model from "../models/AuthModel";
export interface IAuthService {
  loginApi: typeof authServiceModule.loginApi;
  loginWithGoogle: typeof authServiceModule.loginWithGoogle;
  signUpApi: typeof authServiceModule.signUpApi;
  verifyOTP: typeof authServiceModule.verifyOTP;
  sendOTP: typeof authServiceModule.sendOTP;
  getProfile: typeof authServiceModule.getProfile;
  verifyKyc: typeof authServiceModule.verifyKyc;
}

export class AuthController {
  constructor(private authService: IAuthService = authServiceModule) {}

  async login(data: model.LoginRequest) {
    /**
     * @param data nhập vào email với password
     * @returns Kết quả đăng nhập, bao gồm success(boolean), token, user, message, error, fieldErrors
     */
    try {
      const res = await this.authService.loginApi(data);
      const successData = res.data;
      const token = successData.data.token;

      const userRes = await this.authService.getProfile(token);

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

      if (errorData?.data && typeof errorData.data === "object") {
        return {
          success: false,
          fieldErrors: errorData.data,
          error: null,
        };
      }
      return {
        success: false,
        error: errorData?.data || "Đăng nhập thất bại, vui lòng thử lại.",
        fieldErrors: {},
      };
    }
  }

  /**
   * @param credential Chuỗi credential JWT từ Google
   * @returns Kết quả đăng nhập Google, bao gồm success(boolean), token, user, message nếu đúng, error nếu sai
   */
  async loginWithGoogle(credential: string) {
    try {
      let decodedGoogle: any = {};
      try {
        decodedGoogle = jwtDecode<any>(credential);
      } catch (decodeErr) {
        console.error("Failed to decode Google credential:", decodeErr);
      }

      const email = decodedGoogle?.email || decodedGoogle?.sub || undefined;
      const fullName =
        decodedGoogle?.name || decodedGoogle?.fullName || undefined;

      const res = await this.authService.loginWithGoogle({
        token: credential,
        email,
        fullName,
        phoneNumber: "",
      });

      if (res.status === 200) {
        const successData = res.data as model.LoginSuccessData;
        const newToken = successData.token;

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
   * @param data nhập vào
   *  fullName: string;
   *  email: string;
   *  password: string;
   *  phoneNumber: string;
   *  confirmPassword: string;
   * @returns Kết quả đăng ký, bao gồm success(boolean), message nếu đúng, error và fieldErrors nếu sai
   */
  async signUp(data: model.SignUpRequest) {
    try {
      const res = await this.authService.signUpApi(data);

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
   * @param email email người dùng
   * @param otpCode mã OTP
   * @returns Kết quả xác thực OTP, bao gồm success(boolean), message nếu đúng, error nếu sai
   */
  async verifyOTP(email: string, otpCode: string) {
    try {
      console.log("Verifying OTP for email:", email, "with code:", otpCode);
      const response = await this.authService.verifyOTP(email, otpCode);

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
   * @param email email người dùng
   * @returns Kết quả gửi OTP, bao gồm success(boolean), message nếu đúng, error nếu sai
   */
  async sendOTP(email: string) {
    try {
      const response = await this.authService.sendOTP(email);

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
   * đợi API của ae xác thực KYC
   */
  async verifyKyc(payload: any) {
    try {
      const response = await this.authService.verifyKyc(payload);

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: "Xác thực KYC thành công!",
        };
      }

      return {
        success: false,
        error: "Xác thực KYC thất bại",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Có lỗi xảy ra khi xác thực KYC",
      };
    }
  }

  /**
   * Lấy profile người dùng
   * @param token JWT token
   * @returns User profile data
   */
  async getProfile(token: string) {
    try {
      return await this.authService.getProfile(token);
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * @param token token authentication
   * @param user thông tin user
   * Lưu thông tin authentication vào localStorage
   */
  saveAuthData(token: string, user: any) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("userLogin"));
  }

  /**
   * @returns Xóa thông tin authentication khỏi localStorage
   */
  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * @returns Lấy thông tin authentication từ localStorage
   */
  getStoredAuth() {
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


export const authController = new AuthController();


