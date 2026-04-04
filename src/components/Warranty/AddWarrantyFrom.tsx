import React, { useState } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { createWarranty } from '../../services/Warranty/warrantyService';
import { type  CreateWarrantyDTO} from '../../types/Warranty/AddWarranty';

interface AddWarrantyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddWarrantyForm({ isOpen, onClose, onSuccess }: AddWarrantyFormProps) {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [receiveLocation, setReceiveLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const [serialNumberId, setSerialNumberId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!customerName.trim()) newErrors.customerName = 'Vui lòng nhập tên khách hàng';
    if (!serialNumberId.trim()) newErrors.serialNumberId = 'Vui lòng nhập mã Serial';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateWarrantyDTO = {
        phone: phone.trim(),
        customerName: customerName.trim(),
        address: address.trim(),
        receiveLocation: receiveLocation.trim(),
        returnDate: returnDate ? new Date(returnDate).toISOString() : null,
        status: 1, // Trạng thái 1 = Tiếp nhận
        details: [
          {
            serialNumberId: parseInt(serialNumberId),
            issueDescription: issueDescription.trim()
          }
        ]
      };

      await createWarranty(payload);
      
      alert("Tạo phiếu bảo hành thành công!");
      
      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi tạo bảo hành:", error);
      alert('Có lỗi xảy ra khi tạo phiếu bảo hành. Vui lòng kiểm tra lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPhone(''); setCustomerName(''); setAddress('');
    setReceiveLocation(''); setReturnDate(''); 
    setSerialNumberId(''); setIssueDescription('');
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Tạo Phiếu Bảo Hành</h2>
            <p className={styles.modalSubtitle}>Nhập thông tin tiếp nhận thiết bị từ khách hàng</p>
          </div>
          <button type="button" className={styles.btnCloseHeader} onClick={handleCancel}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Số điện thoại <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Nhập SĐT..."
                className={errors.phone ? styles.inputError : ''}
              />
              {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label>Tên khách hàng <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                placeholder="Nhập tên khách hàng..."
                className={errors.customerName ? styles.inputError : ''}
              />
              {errors.customerName && <div className={styles.errorText}>{errors.customerName}</div>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label>Địa chỉ</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Nhập địa chỉ khách hàng..." 
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Nơi tiếp nhận</label>
              <input 
                type="text" 
                value={receiveLocation} 
                onChange={(e) => setReceiveLocation(e.target.value)} 
                placeholder="Chi nhánh / Cửa hàng..." 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Ngày hẹn trả</label>
              <input 
                type="date" 
                value={returnDate} 
                onChange={(e) => setReturnDate(e.target.value)} 
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Mã Serial Thiết bị (ID) <span className={styles.required}>*</span></label>
              <input 
                type="number" 
                value={serialNumberId} 
                onChange={(e) => setSerialNumberId(e.target.value)} 
                placeholder="ID Serial..."
                className={errors.serialNumberId ? styles.inputError : ''}
              />
              {errors.serialNumberId && <div className={styles.errorText}>{errors.serialNumberId}</div>}
            </div>

            <div className={styles.formGroup} style={{ flex: 1.5 }}>
              <label>Mô tả tình trạng lỗi</label>
              <input 
                type="text" 
                value={issueDescription} 
                onChange={(e) => setIssueDescription(e.target.value)} 
                placeholder="Mô tả lỗi (không lên nguồn, vỡ màn...)" 
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={handleCancel} disabled={isSubmitting}>
              Hủy bỏ
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Phiếu Bảo Hành'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}