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
      const token = successData.data.user.token;

      const userRes = await this.authService.getProfile(token);

      const userObj = {
        email: successData.data.user.email,
        fullName: userRes.data.data.fullName,
        kycStatus: successData.data.user.kycStatus,
        nextStep: successData.data.nextStep, 
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


  async loginWithGoogle(credential: string) {
    try {
      let decodedGoogle: any = {};
      try {
        decodedGoogle = jwtDecode<any>(credential);
      } catch (decodeErr) {
        console.error(" Failed to decode Google credential:", decodeErr);
        return {
          success: false,
          error: "Google credential không hợp lệ",
        };
      }

      const sub = decodedGoogle?.sub;
      const email = decodedGoogle?.email;
      const name = decodedGoogle?.name;
      const picture = decodedGoogle?.picture;

      if (!sub || !email || !name) {
        console.error("Missing required fields from Google credential");
        return {
          success: false,
          error: "Thông tin từ Google không đầy đủ",
        };
      }


      const res = await this.authService.loginWithGoogle({
        sub,
        email,
        name,
        picture,
      });

      const successData = res.data;
      const token = successData.data.token;

      const userRes = await this.authService.getProfile(token);

      console.log(" đây:", userRes);
      const userObj = {
        email: successData.data.email,
        fullName: userRes.data.data.fullName,
        kycStatus: successData.data.kycStatus,
        nextStep: successData.data.nextStep, 
        renterId: userRes.data.data.renterId,
        status: userRes.data.data.status,
      };

      console.log(" và đây:", userObj);

      return {
        success: true,
        token,
        user: userObj,
        message: "Đăng nhập Google thành công!",
      };
    } catch (err: any) {
      console.error(" Google login error:", err?.response?.data || err?.message);
      
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
        error: errorData?.message || errorData?.data || err?.message || "Đăng nhập Google thất bại",
        fieldErrors: {},
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


