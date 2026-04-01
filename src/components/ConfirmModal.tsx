import React from 'react';
import styles from '../css/ConfirmModal.module.css'; 

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{title}</h3>
        </div>
        <div className={styles.body}>
          <p>{message}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onCancel}>Hủy bỏ</button>
          <button className={styles.btnConfirm} onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;