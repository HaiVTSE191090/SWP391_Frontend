import { useCallback } from 'react';

interface UseModalReturn {
  closeModalAndReload: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  reloadPage: () => void;
}

/**
 * Custom hook để quản lý modal và reload trang
 * Tái sử dụng logic đóng modal và reload cho các form đăng nhập/đăng ký
 */
export const useModal = (): UseModalReturn => {
  
  /**
   * Đóng modal và reload trang
   * @param modalId - ID của modal cần đóng
   */
  const closeModalAndReload = useCallback((modalId: string) => {
    // Đóng modal
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
    
    // Reload trang sau khi đóng modal
    setTimeout(() => {
      window.location.reload();
    }, 300); // Delay nhỏ để modal đóng hoàn toàn
  }, []);

  /**
   * Chỉ đóng modal mà không reload
   * @param modalId - ID của modal cần đóng
   */
  const closeModal = useCallback((modalId: string) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  }, []);

  /**
   * Chỉ reload trang
   */
  const reloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    closeModalAndReload,
    closeModal,
    reloadPage
  };
};
