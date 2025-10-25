import { getProfile } from '../services/renterService';

export interface AuthCheckResult {
  isAuthenticated: boolean;
  isKycApproved: boolean;
  message?: string;
  action: 'LOGIN' | 'VERIFY_EMAIL_OTP' | 'UPLOAD_KYC' | 'WAIT_APPROVAL' | 'PROCEED';
  email?: string; 
}

export interface UserData {
  token?: string; 
  email: string;
  kycStatus: 'NO_DOCUMENT' | 'NEED_UPLOAD' | 'UNKNOWN' | 'REJECTED' | 'WAITING_APPROVAL' | 'VERIFIED'; 
  nextStep: 'EMAIL_OTP' | 'KYC_UPLOAD' | 'DASHBOARD' | null; 
  fullName?: string;
  renterId?: number;
  status?: string;
  otpStatus?: string | null;
}

export const checkAuthAndKyc = (): AuthCheckResult => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  let user: UserData | null = null;
  
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("AuthHelper.ts:", error);
  }
  
  if (!token || !user) {
    return {
      isAuthenticated: false,
      isKycApproved: false,
      message: "Vui lòng đăng nhập để tiếp tục",
      action: 'LOGIN'
    };
  }
  

  if (user.nextStep === "EMAIL_OTP") {
    return {
      isAuthenticated: true,
      isKycApproved: false,
      message: "Vui lòng xác thực email OTP",
      action: 'VERIFY_EMAIL_OTP',
      email: user.email
    };
  }
  
  if (user.nextStep === "KYC_UPLOAD") {
    return {
      isAuthenticated: true,
      isKycApproved: false,
      message: "Vui lòng upload tài liệu KYC (CCCD + GPLX)",
      action: 'UPLOAD_KYC'
    };
  }
  
  if (user.nextStep === "DASHBOARD" || user.nextStep === null) {
    if (
      user.kycStatus === "VERIFIED" ||
      user.kycStatus === "WAITING_APPROVAL"
    ) {
      return {
        isAuthenticated: true,
        isKycApproved: true,
        action: "PROCEED",
      };
    }

    
    if (user.kycStatus === "NO_DOCUMENT") {
      return {
        isAuthenticated: true,
        isKycApproved: false,
        message: "Vui lòng upload tài liệu KYC (CCCD + GPLX)",
        action: 'UPLOAD_KYC'
      };
    }
    
    return {
      isAuthenticated: true,
      isKycApproved: false,
      message: `KYC status: ${user.kycStatus}. Vui lòng kiểm tra lại hoặc upload lại tài liệu.`,
      action: 'WAIT_APPROVAL'
    };
  }
  
  return {
    isAuthenticated: true,
    isKycApproved: false,
    message: "Trạng thái tài khoản không hợp lệ. Vui lòng liên hệ admin.",
    action: 'WAIT_APPROVAL'
  };
};

export const refreshUserFromBackend = async (): Promise<void> => {
  try {
    const response = await getProfile();
    
    if (response.data?.status === "success" && response.data?.data) {
      const backendData = response.data.data;
      
      // Map backend data sang UserData format
      const updatedUser: UserData = {
        email: backendData.email,
        fullName: backendData.fullName,
        renterId: backendData.renterId,
        status: backendData.status,
        kycStatus: backendData.kycStatus,
        nextStep: backendData.nextStep,
        otpStatus: backendData.otpStatus
      };
      
      // Cập nhật localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log(' User data refreshed from backend:', updatedUser);
    }
  } catch (error) {
    console.error(' Failed to refresh user data:', error);
  }
};

export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem("user");
  
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};


export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getCurrentUser();
};
