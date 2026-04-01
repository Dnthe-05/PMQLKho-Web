import React, { useState } from 'react';
import styles from '../../css/Supplier/SupplierForm.module.css'; 
import { createSupplier } from '../../services/Supplier/supplierService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSupplierForm({ isOpen, onClose, onSuccess }: Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    NameNcc: '',
    PhoneNcc: '',
    EmailNcc: '',
    AddressNcc: '',
    IsActive: true
  });

  if (!isOpen) return null;
  const mapErrorToFields = (message: string) => {
    const msg = message.toLowerCase();
    const newErrors: Record<string, string> = {};

    if (msg.includes("tên") || msg.includes("name")) {
      newErrors.NameNcc = message;
    }
    
    if (msg.includes("số") || msg.includes("phone") || msg.includes("thoại")) {
      newErrors.PhoneNcc = message;
    }
    
    if (msg.includes("email")) {
      newErrors.EmailNcc = message;
    }

    if (msg.includes("địa chỉ") || msg.includes("address")) {
      newErrors.AddressNcc = message;
    }

    if (Object.keys(newErrors).length === 0) {
      alert(message);
    }

    setFieldErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const res = await createSupplier(formData);
      
      if (res.success) {
        alert("Thêm nhà cung cấp thành công!");
        onSuccess();
        onClose();
        setFormData({ NameNcc: '', PhoneNcc: '', EmailNcc: '', AddressNcc: '', IsActive: true });
      } else {
        mapErrorToFields(res.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      const serverData = error.response?.data;
      console.log("Data lỗi từ Server:", serverData);

      if (serverData) {
        if (serverData.errors) {
          setFieldErrors(serverErrorToField(serverData.errors));
        } 
        else if (serverData.message) {
          mapErrorToFields(serverData.message);
        }
      } else {
        alert("Lỗi kết nối máy chủ hoặc lỗi không xác định!");
      }
    }
  };

  const serverErrorToField = (errors: any) => {
    const result: Record<string, string> = {};
    for (const key in errors) {
      result[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
    }
    return result;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Thêm mới Nhà cung cấp</h2>
            <p className={styles.modalSubtitle}>Vui lòng nhập đầy đủ thông tin bên dưới</p>
          </div>
          <button onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            {/* Tên NCC */}
            <div className={styles.formGroup}>
              <label>Tên nhà cung cấp <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.NameNcc ? styles.inputError : ''}
                type="text" 
                value={formData.NameNcc}
                placeholder="VD: Công ty TNHH CAG PRO" 
                required
                onChange={e => setFormData({...formData, NameNcc: e.target.value})} 
              />
              {fieldErrors.NameNcc && <span className={styles.errorText}>{fieldErrors.NameNcc}</span>}
            </div>

            {/* Số điện thoại */}
            <div className={styles.formGroup}>
              <label>Số điện thoại <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.PhoneNcc ? styles.inputError : ''}
                type="text" 
                value={formData.PhoneNcc}
                placeholder="VD: 0987654321" 
                required
                onChange={e => setFormData({...formData, PhoneNcc: e.target.value})} 
              />
              {fieldErrors.PhoneNcc && <span className={styles.errorText}>{fieldErrors.PhoneNcc}</span>}
            </div>
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label>Email liên hệ <span className={styles.required}>*</span></label>
            <input 
              className={fieldErrors.EmailNcc ? styles.inputError : ''}
              type="email" 
              value={formData.EmailNcc}
              placeholder="VD: contact@cagpro.com" 
              required
              onChange={e => setFormData({...formData, EmailNcc: e.target.value})} 
            />
            {fieldErrors.EmailNcc && <span className={styles.errorText}>{fieldErrors.EmailNcc}</span>}
          </div>

          {/* Địa chỉ */}
          <div className={styles.formGroup}>
            <label>Địa chỉ <span className={styles.required}>*</span></label>
            <textarea 
              className={fieldErrors.AddressNcc ? styles.inputError : ''}
              rows={2}
              value={formData.AddressNcc}
              placeholder="Nhập địa chỉ chi tiết..." 
              required
              onChange={e => setFormData({...formData, AddressNcc: e.target.value})} 
            />
            {fieldErrors.AddressNcc && <span className={styles.errorText}>{fieldErrors.AddressNcc}</span>}
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="submit" className={styles.btnSubmit}>+ Lưu thông tin</button>
          </div>
        </form>
      </div>
    </div>
  );
}