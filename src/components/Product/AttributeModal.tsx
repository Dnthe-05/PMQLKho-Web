import React, { useState, useEffect } from 'react';
import styles from '../../css/Product/AttributeModal.module.css'; 

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  title: string;
  initialData?: { name: string } | null;
}

export default function AttributeModal({ isOpen, onClose, onSave, title, initialData }: AttributeModalProps) {
  const [name, setName] = useState('');

  // Mỗi khi mở modal hoặc đổi dữ liệu ban đầu, cập nhật lại ô input
  useEffect(() => {
    if (initialData) setName(initialData.name);
    else setName('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{initialData ? 'Cập nhật' : 'Thêm mới'} {title}</h3>
        <div className={styles.formGroup}>
          <label>Tên {title.toLowerCase()}:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder={`Nhập tên ${title.toLowerCase()}...`}
            autoFocus
          />
        </div>
        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
          <button 
            className={styles.btnSave} 
            onClick={() => {
              if(!name.trim()) return alert("Vui lòng nhập tên!");
              onSave(name);
            }}
          >
            Lưu lại
          </button>
        </div>
      </div>
    </div>
  );
}