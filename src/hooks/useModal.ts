import { useCallback } from 'react';
import { useForm } from './useForm';

interface UseModalReturn {
  closeModalAndReload: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  openModal: (modalId: string) => void;
  switchModal: (fromModalId: string, toModalId: string) => void;
  reloadPage: () => void;
}

export const useModal = (): UseModalReturn => {

  const { clearErrors } = useForm();


  const closeModalAndReload = useCallback((modalId: string) => {
    clearErrors();
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
  }, [clearErrors]);

  const closeModal = useCallback((modalId: string) => {
    clearErrors(); // Clear message/error trước khi đóng modal
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  }, [clearErrors]);

  const openModal = useCallback((modalId: string) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bsModal = new (window as any).bootstrap.Modal(modalElement);
      bsModal.show();
    }
  }, []);

  const switchModal = useCallback((fromModalId: string, toModalId: string) => {
    clearErrors(); // Clear message/error trước khi chuyển modal
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
  }, [clearErrors]);

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