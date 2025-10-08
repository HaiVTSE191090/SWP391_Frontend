import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

interface ErrorPopupProps {
  errors: string[];
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ errors, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>⚠️ Lỗi Validation</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant="danger" className="mb-0">
          <ul className="mb-0 ps-3">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Đã hiểu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorPopup;