import React, { useState, useEffect } from 'react';
import styles from '../../css/Product/AttributeModal.module.css'; 

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; parentId?: number | null; unit?: string }) => void;
  title: string;
  initialData?: { name: string; parentId?: number | null; parentName?: string; unit?: string } | null;
  parentOptions?: Array<{ id: number; name: string }>;
}

export default function AttributeModal({ isOpen, onClose, onSave, title, initialData, parentOptions = [] }: AttributeModalProps) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [parentText, setParentText] = useState('');
  const [unit, setUnit] = useState('');

  // Mỗi khi mở modal hoặc đổi dữ liệu ban đầu, cập nhật lại ô input
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setParentId(initialData.parentId ?? null);
      setParentText(initialData.parentName || '');
      setUnit(initialData.unit || '');
    } else {
      setName('');
      setParentId(null);
      setParentText('');
      setUnit('');
    }
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

        {title === 'Danh mục' && (
          <div className={styles.formGroup}>
            <label>Danh mục cha (tùy chọn):</label>
            <input
              type="text"
              list="categoryParentOptions"
              value={parentText}
              onChange={(e) => {
                const value = e.target.value;
                setParentText(value);
                const match = parentOptions.find((opt) => opt.name === value);
                setParentId(match ? match.id : null);
              }}
              placeholder="Nhập hoặc chọn danh mục cha..."
            />
            <datalist id="categoryParentOptions">
              {parentOptions.map((category) => (
                <option key={category.id} value={category.name} />
              ))}
            </datalist>
            <p className={styles.helpText}>Nhập hoặc chọn danh mục cha; để trống nếu muốn danh mục gốc.</p>
          </div>
        )}

        {title === 'Thuộc tính' && (
          <div className={styles.formGroup}>
            <label>Đơn vị / Thuộc tính:</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Nhập đơn vị hoặc mô tả thuộc tính..."
            />
          </div>
        )}

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
          <button 
            className={styles.btnSave} 
            onClick={() => {
              if(!name.trim()) return alert("Vui lòng nhập tên!");
              if (parentText && !parentId) {
                const match = parentOptions.find((opt) => opt.name === parentText);
                if (match) setParentId(match.id);
              }
              onSave({ name: name.trim(), parentId, unit: unit.trim() });
            }}
          >
            Lưu lại
          </button>
        </div>
      </div>
    </div>
  );
}