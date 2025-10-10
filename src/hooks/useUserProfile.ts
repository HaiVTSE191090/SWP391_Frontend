import { useState, useEffect } from 'react';
import { api } from '../services/apiClient';

// Kiểu dữ liệu user từ API
interface UserProfile {
  renterId?: number;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  status?: string;
  blacklisted?: boolean;
  kycStatus?: 'VERIFIED' | 'PENDING_VERIFICATION' | 'NEED_UPLOAD'
}

interface UseUserProfileReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook để lấy thông tin user từ API
 * Tự động gọi API khi component mount và có token
 */
export const useUserProfile = (): UseUserProfileReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setUser(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/renter/profile");
      
      if (response && response.data) {
        
        const localUserData = localStorage.getItem("user");
        let mergedData = response.data;
        
        if (localUserData) {
          try {
            const localData = JSON.parse(localUserData);
            mergedData = {
              ...response.data,
              kycStatus: response.data.kycStatus || localData.kycStatus || 'NEED_UPLOAD'
            };
          } catch (e) {
            // Ignore
            console.error(e);
          }
        }
        
        setUser(mergedData);
      } else {
        setError("Không thể lấy thông tin người dùng");
      }
    } catch (err: any) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
       
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setError("Phiên đăng nhập đã hết hạn");
      } else {
        setError("Lỗi kết nối mạng");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tự động fetch khi component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Lắng nghe thay đổi token để refetch
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchUserProfile();
      } else {
        setUser(null);
      }
    };

    // Lắng nghe sự kiện storage change (khi login/logout)
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event để trigger refetch từ các component khác
    window.addEventListener('userLogin', handleStorageChange);
    window.addEventListener('userLogout', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
      window.removeEventListener('userLogout', handleStorageChange);
    };
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUserProfile
  };
};
