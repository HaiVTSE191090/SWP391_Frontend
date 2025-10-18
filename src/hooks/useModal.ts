import { useCallback } from 'react';
import { useAuth } from './useAuth';

interface UseModalReturn {
  closeModalAndReload: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  openModal: (modalId: string) => void;
  switchModal: (fromModalId: string, toModalId: string) => void;
  reloadPage: () => void;
}

export const useModal = (): UseModalReturn => {
  const { clearError } = useAuth();
  
  const closeModalAndReload = useCallback((modalId: string) => {
    clearError(); // Clear message/error trước khi đóng modal
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 300); 
  }, [clearError]);

  const closeModal = useCallback((modalId: string) => {
    clearError(); // Clear message/error trước khi đóng modal
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  }, [clearError]);

  const openModal = useCallback((modalId: string) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bsModal = new (window as any).bootstrap.Modal(modalElement);
      bsModal.show();
    }
  }, []);

  const switchModal = useCallback((fromModalId: string, toModalId: string) => {
    clearError(); // Clear message/error trước khi chuyển modal
    const fromModal = document.getElementById(fromModalId);
    const bsFromModal = (window as any).bootstrap?.Modal?.getInstance(fromModal);
    
    if (bsFromModal) {
      bsFromModal.hide();
    }
    
    setTimeout(() => {
      const toModal = document.getElementById(toModalId);
      if (toModal) {
        const bsToModal = new (window as any).bootstrap.Modal(toModal);
        bsToModal.show();
      }
    }, 300); 
  }, [clearError]);

  const reloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    closeModalAndReload,
    closeModal,
    openModal,
    switchModal,
    reloadPage
  };
};