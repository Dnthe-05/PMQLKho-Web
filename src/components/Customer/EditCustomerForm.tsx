import { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { updateCustomer } from '../../services/Customer/CustomerService';
import ConfirmModal from '../ConfirmModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: any; 
}

export default function EditCustomerForm({ isOpen, onClose, onSuccess, customer }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    FullName: '',
    Phone: '',
    Email: '',
    ShippingAddress: '',
    ReturnAddress: ''
  });

  useEffect(() => {
    if (customer && isOpen) {
      setFormData({
        FullName: customer.fullName || '',
        Phone: customer.phone || '',
        Email: customer.email || '',
        ShippingAddress: customer.shippingAddress || '',
        ReturnAddress: customer.returnAddress || ''
      });
      setFieldErrors({});
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

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

  const handleSubmit = () => {
    setFieldErrors({});

    if (!formData.FullName || !formData.Phone) {
      alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setFieldErrors({});

    try {
      const payload = {
        ...formData,
        Email: formData.Email.trim() === "" ? undefined : formData.Email,
        ShippingAddress: formData.ShippingAddress.trim() === "" ? undefined : formData.ShippingAddress,
        ReturnAddress: formData.ReturnAddress.trim() === "" ? undefined : formData.ReturnAddress,
      };

      const res: any = await updateCustomer(customer.id, payload);
      
      if (res && (res.success || res.id)) {
        alert("Cập nhật thông tin khách hàng thành công!");
        onSuccess();
        onClose();
      } else if (res.message) {
        mapErrorToFields(res.message);
      }
    } catch (error: any) {
      const serverData = error.response?.data;
      if (serverData?.errors) {
        setFieldErrors(serverData.errors);
      } else if (serverData?.message) {
        mapErrorToFields(serverData.message);
      } else {
        alert("Có lỗi xảy ra khi cập nhật khách hàng!");
      }
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={`${styles.modalContent} ${styles.modalEmployee}`}>
          <div className={styles.modalHeader}>
            <div>
              <h2 className={styles.modalTitle}>Cập nhật Khách hàng</h2>
              <p className={styles.modalSubtitle}>Chỉnh sửa thông tin khách hàng <strong>#{customer?.id}</strong></p>
            </div>
            <button type="button" onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
          </div>

          <div className={styles.form}>
            
            {/* Hàng 1: Họ tên */}
            <div className={styles.row}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label>Họ và tên <span className={styles.required}>*</span></label>
                <input 
                  className={fieldErrors.FullName ? styles.inputError : ''}
                  type="text" 
                  value={formData.FullName}
                  onChange={e => setFormData({...formData, FullName: e.target.value})} 
                  placeholder="VD: Nguyễn Văn A"
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
                  value={formData.Phone}
                  onChange={e => setFormData({...formData, Phone: e.target.value})} 
                  placeholder="VD: 0901234567"
                  autoComplete="off"
                />
                {fieldErrors.Phone && <span className={styles.errorText}>{fieldErrors.Phone}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input 
                  className={fieldErrors.Email ? styles.inputError : ''}
                  type="email" 
                  value={formData.Email} 
                  onChange={e => setFormData({...formData, Email: e.target.value})}
                  placeholder="VD: nguyenvana@gmail.com"
                  autoComplete="off"
                />
                {fieldErrors.Email && <span className={styles.errorText}>{fieldErrors.Email}</span>}
              </div>
            </div>
            
            {/* Hàng 3: Địa chỉ giao hàng */}
            <div className={styles.row}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label>Địa chỉ giao hàng</label>
                <input 
                  type="text" 
                  value={formData.ShippingAddress}
                  onChange={e => setFormData({...formData, ShippingAddress: e.target.value})} 
                  placeholder="Nhập địa chỉ nhận hàng của khách..."
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
                  value={formData.ReturnAddress}
                  onChange={e => setFormData({...formData, ReturnAddress: e.target.value})} 
                  placeholder="Nhập địa chỉ trả hàng (nếu khác địa chỉ giao hàng)..."
                  autoComplete="off"
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
              <button type="button" onClick={handleSubmit} className={styles.btnSubmit}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xác nhận */}
      <ConfirmModal 
        isOpen={showConfirm}
        title="Xác nhận thay đổi"
        message={`Bạn có chắc chắn muốn cập nhật thông tin cho khách hàng ${customer?.fullName || formData.FullName}?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}