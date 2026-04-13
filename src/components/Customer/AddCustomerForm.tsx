import { useState } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { createCustomer } from '../../services/Customer/CustomerService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCustomerForm({ isOpen, onClose, onSuccess }: Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    FullName: '',
    Phone: '',
    Email: '',
    ShippingAddress: '',
    ReturnAddress: ''
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData({ FullName: '', Phone: '', Email: '', ShippingAddress: '', ReturnAddress: '' });
    setFieldErrors({});
    onClose();
  };

  const mapErrorToFields = (message: string) => {
    const msg = message.toLowerCase();
    const newErrors: Record<string, string> = {};
    
    if (msg.includes("số điện thoại") || msg.includes("phone")) newErrors.Phone = message;
    if (msg.includes("email")) newErrors.Email = message;
    if (msg.includes("tên") || msg.includes("fullname")) newErrors.FullName = message;
    
    if (Object.keys(newErrors).length === 0) {
        alert(message);
    } else {
        setFieldErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    setFieldErrors({}); 

    if (!formData.FullName || !formData.Phone) {
      alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
      return;
    }

    try {
        const payload = {
        ...formData,
        Email: formData.Email.trim() === "" ? undefined : formData.Email,
        ShippingAddress: formData.ShippingAddress.trim() === "" ? undefined : formData.ShippingAddress,
        ReturnAddress: formData.ReturnAddress.trim() === "" ? undefined : formData.ReturnAddress,
        };

        const res: any = await createCustomer(payload);
        
        if (res && (res.success || res.id)) {
        alert("Thêm khách hàng thành công!");
        onSuccess(); 
        handleClose(); 
      } else if (res.message) {
         mapErrorToFields(res.message);
      }
    } catch (error: any) {
      console.error("Lỗi thêm khách hàng:", error);
      const serverData = error.response?.data;
      
      if (serverData?.errors) {
        setFieldErrors(serverData.errors);
      } else if (serverData?.message) {
         mapErrorToFields(serverData.message);
      } else {
        alert("Có lỗi xảy ra khi lưu khách hàng. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.modalEmployee}`}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Thêm mới Khách hàng</h2>
            <p className={styles.modalSubtitle}>Vui lòng nhập thông tin liên lạc của khách hàng</p>
          </div>
          <button onClick={handleClose} className={styles.btnCloseHeader}>&times;</button>
        </div>

        <div className={styles.form}>
          
          {/* Hàng 1: Họ và tên*/}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label>Họ và tên <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.FullName ? styles.inputError : ''}
                type="text" 
                placeholder="VD: Nguyễn Văn A"
                value={formData.FullName} 
                onChange={e => setFormData({...formData, FullName: e.target.value})} 
                autoComplete="off"
              />
              {fieldErrors.FullName && <span className={styles.errorText}>{fieldErrors.FullName}</span>}
            </div>
          </div>

          {/* Hàng 2: Số điện thoại & Email */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Số điện thoại <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.Phone ? styles.inputError : ''}
                type="text" 
                placeholder="VD: 0901234567"
                value={formData.Phone} 
                onChange={e => setFormData({...formData, Phone: e.target.value})} 
                autoComplete="off"
              />
              {fieldErrors.Phone && <span className={styles.errorText}>{fieldErrors.Phone}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Email</label>
              <input 
                className={fieldErrors.Email ? styles.inputError : ''}
                type="email"
                placeholder="VD: nguyenvana@gmail.com"
                value={formData.Email} 
                onChange={e => setFormData({...formData, Email: e.target.value})}
                autoComplete="off"
              />
              {fieldErrors.Email && <span className={styles.errorText}>{fieldErrors.Email}</span>}
            </div>
          </div>

          {/* Hàng 3: Địa chỉ giao hàng*/}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label>Địa chỉ giao hàng</label>
              <input 
                type="text" 
                placeholder="Nhập địa chỉ nhận hàng của khách..."
                value={formData.ShippingAddress} 
                onChange={e => setFormData({...formData, ShippingAddress: e.target.value})} 
                autoComplete="off"
              />
            </div>
          </div>

          {/* Hàng 4: Địa chỉ trả hàng*/}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label>Địa chỉ trả hàng</label>
              <input 
                type="text" 
                placeholder="Nhập địa chỉ trả hàng (nếu khác địa chỉ giao hàng)..."
                value={formData.ReturnAddress} 
                onChange={e => setFormData({...formData, ReturnAddress: e.target.value})} 
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={handleClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="button" onClick={handleSubmit} className={styles.btnSubmit}>
              + Lưu khách hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}