import React, { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { createWarranty, getProductBySerial } from '../../services/Warranty/warrantyService';
import { type CreateWarrantyDTO } from '../../types/Warranty/AddWarranty';
import { useWarrantyValidation } from '../../hooks/useWarrantyValidation';
interface WarrantyItem {
  serialCode: string;
  serialNumberId?: number;
  productName: string;
  issueDescription: string;
}

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { validateDuplicate } = useWarrantyValidation();
  
  const emptyItem: WarrantyItem = {
    serialCode: '',
    serialNumberId: undefined,
    productName: '',
    issueDescription: ''
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setServerError(null); // Reset lỗi khi mở lại modal
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const [items, setItems] = useState<WarrantyItem[]>([emptyItem]);

  const handleKeyDown = async (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      
      const codeToSearch = items[index].serialCode.trim();
      if (!codeToSearch) return;

      // SỬ DỤNG HOOK KIỂM TRA TRÙNG
      if (!validateDuplicate(items, index, codeToSearch, 'serialCode')) {
        const newItems = [...items];
        newItems[index].serialCode = '';
        setItems(newItems);
        return;
      }

      try {
        const response = await getProductBySerial(codeToSearch); 
        const d = response.data?.data || response.data;
        
        if (d && (d.serialNumberId)) {
          const newItems = [...items];
          newItems[index].productName = d.productName || d.name; 
          newItems[index].serialNumberId = d.serialNumberId; 
          
          if (index === items.length - 1) {
            newItems.push({ ...emptyItem });
          }

          setItems(newItems);
          setTimeout(() => {
            document.getElementById(`serial-${index + 1}`)?.focus();
          }, 100);

        } else {
          alert("Không tìm thấy sản phẩm với mã Serial này!");
          const newItems = [...items];
          newItems[index].productName = '';
          newItems[index].serialNumberId = undefined;
          setItems(newItems);
        }
      } catch (err) {
        console.error("Lỗi tìm sản phẩm:", err);
      }
    }
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof WarrantyItem, value: any) => {
    const newItems = [...items];
    (newItems[index][field] as any) = value;
    setItems(newItems);
  };

  const resetForm = () => {
    setPhone(''); setCustomerName(''); setAddress('');
    setReceiveLocation(''); setReturnDate(''); 
    setItems([{ ...emptyItem }]);
    setErrors({});
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    try {
      const payload: CreateWarrantyDTO = {
        phone: phone.trim(),
        customerName: customerName.trim(),
        address: address.trim(),
        receiveLocation: receiveLocation.trim(),
        returnDate: returnDate ? new Date(returnDate).toISOString() : null,
        status: 1,
        details: items
          .filter(item => item.serialNumberId !== undefined)
          .map(item => ({
            serialNumberId: item.serialNumberId as number,
            issueDescription: item.issueDescription.trim()
          }))
      };

      await createWarranty(payload);
      alert("Tạo phiếu bảo hành thành công!");
      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      // LẤY LỖI CHI TIẾT TỪ BACKEND
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi kết nối đến máy chủ.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ width: '850px' }}>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Tạo Phiếu Bảo Hành</h2>
          <button type="button" className={styles.btnCloseHeader} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Thông tin khách hàng */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Số điện thoại *</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
            </div>
            <div className={styles.formGroup}>
              <label>Tên khách hàng *</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required/>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label>Địa chỉ</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required/>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Nơi tiếp nhận</label>
              <input type="text" value={receiveLocation} onChange={(e) => setReceiveLocation(e.target.value)} required/>
            </div>
            <div className={styles.formGroup}>
              <label>Ngày hẹn trả</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required/>
            </div>
          </div>

          {/* Phần sản phẩm */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Sản phẩm bảo hành</h3>
            <button type="button" onClick={addItem} className={styles.btnSubmit} style={{ padding: '4px 10px', fontSize: '12px', background: '#28a745' }}>+ Thêm máy</button>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {items.map((item, index) => (
              <div key={index} className={styles.row} style={{ gap: '10px', marginBottom: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '6px', alignItems: 'flex-end' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px' }}>Mã Serial (Bắn máy) *</label>
                  <input 
                    type="text" 
                    id={`serial-${index}`}
                    value={item.serialCode} 
                    onChange={(e) => handleItemChange(index, 'serialCode', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    required
                  />
                </div>

                <div className={styles.formGroup} style={{ flex: 1.5 }}>
                  <label style={{ fontSize: '11px' }}>Tên sản phẩm</label>
                  <input type="text" value={item.productName} readOnly style={{ background: '#e9ecef' }} />
                </div>

                <div className={styles.formGroup} style={{ flex: 2 }}>
                  <label style={{ fontSize: '11px' }}>Nội dung lỗi</label>
                  <input type="text" value={item.issueDescription} onChange={(e) => handleItemChange(index, 'issueDescription', e.target.value)} />
                </div>

                <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} style={{ marginBottom: '8px', color: items.length === 1 ? '#ccc' : '#dc3545', background: 'none', border: 'none', fontSize: '22px' }}>&times;</button>
              </div>
            ))}
          </div>

          {serverError && (
            <div style={{ 
              backgroundColor: '#fff1f0', 
              border: '1px solid #ffa39e', 
              color: '#e31e24', 
              padding: '10px', 
              borderRadius: '4px', 
              margin: '15px 0',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {serverError}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Hủy</button>
            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Phiếu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}