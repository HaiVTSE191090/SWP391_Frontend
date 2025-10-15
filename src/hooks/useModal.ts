import { useCallback } from 'react';

interface UseModalReturn {
  closeModalAndReload: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  openModal: (modalId: string) => void;
  switchModal: (fromModalId: string, toModalId: string) => void;
  reloadPage: () => void;
}

export const useModal = (): UseModalReturn => {
  
  const closeModalAndReload = useCallback((modalId: string) => {
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
  }, []);

  const closeModal = useCallback((modalId: string) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  }, []);

  const openModal = useCallback((modalId: string) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bsModal = new (window as any).bootstrap.Modal(modalElement);
      bsModal.show();
    }
  }, []);

  const switchModal = useCallback((fromModalId: string, toModalId: string) => {
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
  }, []);

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