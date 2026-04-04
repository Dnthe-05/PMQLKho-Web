import React, { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { updateSupplier } from '../../services/Supplier/supplierService';
import ConfirmModal from '../ConfirmModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier: any; 
}

export default function EditSupplierForm({ isOpen, onClose, onSuccess, supplier }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    NameNcc: '',
    PhoneNcc: '',
    EmailNcc: '',
    AddressNcc: '',
    IsActive: true
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        NameNcc: supplier.nameNcc || '',
        PhoneNcc: supplier.phoneNcc || '',
        EmailNcc: supplier.emailNcc || '',
        AddressNcc: supplier.addressNcc || '',
        IsActive: supplier.isActive ?? true
      });
      setFieldErrors({});
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const mapErrorToFields = (message: string) => {
    const msg = message.toLowerCase();
    const newErrors: Record<string, string> = {};
    if (msg.includes("tên") || msg.includes("name")) newErrors.NameNcc = message;
    if (msg.includes("số") || msg.includes("phone")) newErrors.PhoneNcc = message;
    if (msg.includes("email")) newErrors.EmailNcc = message;
    setFieldErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

 
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setFieldErrors({});
    try {
      const res = await updateSupplier(supplier.idNcc, formData);
      if (res && (res.idNcc || res.id)) {
        alert("Cập nhật thành công!");
        onSuccess();
        onClose();
      } else {
        mapErrorToFields(res.message);
      }
    } catch (error: any) {
      const serverData = error.response?.data;
      if (serverData?.errors) {
        setFieldErrors(serverData.errors);
      } else if (serverData?.message) {
        mapErrorToFields(serverData.message);
      }
    }
  };

  return (
    <>
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Cập nhật Nhà cung cấp</h2>
            <p className={styles.modalSubtitle}>Chỉnh sửa thông tin nhà cung cấp {supplier?.maNcc}</p>
          </div>
          <button onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên nhà cung cấp <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.NameNcc ? styles.inputError : ''}
                type="text" 
                value={formData.NameNcc}
                onChange={e => setFormData({...formData, NameNcc: e.target.value})} 
              />
              {fieldErrors.NameNcc && <span className={styles.errorText}>{fieldErrors.NameNcc}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Số điện thoại <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.PhoneNcc ? styles.inputError : ''}
                type="text" 
                value={formData.PhoneNcc}
                onChange={e => setFormData({...formData, PhoneNcc: e.target.value})} 
              />
              {fieldErrors.PhoneNcc && <span className={styles.errorText}>{fieldErrors.PhoneNcc}</span>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Email liên hệ <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.EmailNcc ? styles.inputError : ''}
                type="email" 
                value={formData.EmailNcc}
                onChange={e => setFormData({...formData, EmailNcc: e.target.value})} 
              />
              {fieldErrors.EmailNcc && <span className={styles.errorText}>{fieldErrors.EmailNcc}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Địa chỉ <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.AddressNcc ? styles.inputError : ''}
                type="text" 
                value={formData.AddressNcc}
                onChange={e => setFormData({...formData, AddressNcc: e.target.value})} 
              />
              {fieldErrors.AddressNcc && <span className={styles.errorText}>{fieldErrors.AddressNcc}</span>}
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="button" onClick={handleSubmit} className={styles.btnSubmit}>Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
    <ConfirmModal 
        isOpen={showConfirm}
        title="Xác nhận thay đổi"
        message={`Bạn có chắc chắn muốn cập nhật thông tin cho nhà cung cấp ${supplier?.nameNcc}?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}