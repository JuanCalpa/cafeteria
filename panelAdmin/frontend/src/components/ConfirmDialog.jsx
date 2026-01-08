import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Sí, Proceder', cancelText = 'Cancelar' }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="btn btn-primary" onClick={handleConfirm}>
          {confirmText}
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;