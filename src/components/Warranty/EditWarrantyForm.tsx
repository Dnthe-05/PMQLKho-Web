import React, { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css';
import { getWarrantyById, updateWarranty, getProductBySerial } from '../../services/Warranty/warrantyService';
import { useWarrantyValidation } from '../../hooks/useWarrantyValidation'; 
import WarrantyItemTable from './WarrantyItemTable';

interface EditWarrantyItem {
  id?: number;
  serialNumberId: string;
  productName: string;
  issueDescription: string;
  warrantyCost: number;
  sentToVendorDate: string;
  receivedFromVendorDate: string;
}

interface EditWarrantyFormProps {
  isOpen: boolean;
  warrantyId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditWarrantyForm({ isOpen, warrantyId, onClose, onSuccess }: EditWarrantyFormProps) {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [receiveLocation, setReceiveLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState(1);
  
  const [items, setItems] = useState<EditWarrantyItem[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { validateDuplicate } = useWarrantyValidation();

  useEffect(() => {
    if (isOpen && warrantyId) {
      loadWarrantyData(warrantyId);
      setBackendError(null);
    }
  }, [isOpen, warrantyId]);

  const loadWarrantyData = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await getWarrantyById(id);
      const d = response.data?.data || response.data;
      if (d) {  
        setPhone(d.phone || '');
        setCustomerName(d.customerName || '');
        setAddress(d.address || '');
        setReceiveLocation(d.receiveLocation || '');
        setReturnDate(d.returnDate ? d.returnDate.split('T')[0] : '');
        setStatus(d.status || 1);
        setItems(d.details.map((item: any) => ({
          id: item.id,
          serialNumberId: item.serialNumberId.toString(),
          productName: item.productName || 'Sản phẩm hiện tại',
          issueDescription: item.issueDescription || '',
          warrantyCost: item.warrantyCost || 0,
          sentToVendorDate: item.sentToVendorDate ? item.sentToVendorDate.split('T')[0] : '',
          receivedFromVendorDate: item.receivedFromVendorDate ? item.receivedFromVendorDate.split('T')[0] : ''
        })));
      }
    } catch (error) {
      setBackendError("Không thể tải dữ liệu phiếu bảo hành.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    const validItems = items.filter(item => 
      item.serialNumberId.trim() !== '' && 
      item.productName.trim() !== '' && 
      item.productName !== 'Không tìm thấy'
    );

    if (validItems.length === 0) {
      alert("Lỗi: Cần ít nhất 1 sản phẩm có mã Serial hợp lệ trong danh sách!");
      return;
    }

    if (status === 3 || status === 4) {
      const isMissingDate = validItems.some(item => !item.receivedFromVendorDate);
      if (isMissingDate) {
        alert(`Lỗi: Khi chuyển sang trạng thái ${status === 3 ? "Hoàn thành" : "Hủy"}, tất cả thiết bị phải có 'Ngày về từ hãng'!`);
        return;
      }
    }

    const serials = items.map(i => i.serialNumberId.trim().toUpperCase());
    if (serials.some((s, idx) => serials.indexOf(s) !== idx)) {
      alert("Lỗi: Có mã Serial bị trùng lặp trong danh sách!");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.sentToVendorDate && item.receivedFromVendorDate) {
        if (new Date(item.receivedFromVendorDate) < new Date(item.sentToVendorDate)) {
          alert(`Lỗi tại thiết bị ${i + 1}: Ngày nhận từ hãng không được nhỏ hơn ngày gửi đi!`);
          return;
        }
      }
    }

    if (!window.confirm("Xác nhận cập nhật thay đổi?")) return;

    setIsSubmitting(true);
    try {
      const payload = {
        phone: phone.trim(),
        customerName: customerName.trim(),
        address: address.trim(),
        receiveLocation: receiveLocation.trim(),
        returnDate: returnDate ? new Date(returnDate).toISOString() : null,
        status: status,
        details: items.map(i => ({
          id: i.id,
          serialNumberId: parseInt(i.serialNumberId),
          issueDescription: i.issueDescription.trim(),
          warrantyCost: Number(i.warrantyCost),
          sentToVendorDate: i.sentToVendorDate ? new Date(i.sentToVendorDate).toISOString() : null,
          receivedFromVendorDate: i.receivedFromVendorDate ? new Date(i.receivedFromVendorDate).toISOString() : null
        }))
      };

      await updateWarranty(warrantyId!, payload);
      alert("Cập nhật thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      setBackendError(error.response?.data?.message || "Lỗi cập nhật dữ liệu từ máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const serialId = items[index].serialNumberId.trim();
      if (!serialId) return;

      if (!validateDuplicate(items, index, serialId, 'serialNumberId')) {
        const newItems = [...items];
        newItems[index].serialNumberId = '';
        setItems(newItems);
        return;
      }

      try {
        const response = await getProductBySerial(serialId);
        const d = response.data?.data || response.data;
        if (d) {
          const newItems = [...items];
          newItems[index].productName = d.name || d.productName;
          setItems(newItems);
          document.getElementById(`issue-edit-${index}`)?.focus();
        }
      } catch (err) { 
        alert("Không tìm thấy Serial!"); 
        const newItems = [...items];
        newItems[index].productName = 'Không tìm thấy';
        setItems(newItems);
      }
    }
  };

  const handleItemChange = (index: number, field: keyof EditWarrantyItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { serialNumberId: '', productName: '', issueDescription: '', warrantyCost: 0, sentToVendorDate: '', receivedFromVendorDate: '' }]);
  const removeItem = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ width: '1000px' }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Cập Nhật Phiếu Bảo Hành #{warrantyId}</h2>
          <button className={styles.btnCloseHeader} onClick={onClose}>&times;</button>
        </div>

        {isLoading ? <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div> : (
          <form onSubmit={handleConfirmSubmit}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Số điện thoại *</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Tên khách hàng *</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                  <option value={1}>Tiếp nhận</option>
                  <option value={2}>Đang sửa chữa</option>
                  <option value={3}>Hoàn thành</option>
                  <option value={4}>Hủy</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup} style={{ flex: 1.5 }}>
                <label>Địa chỉ</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ..." />
              </div>
              <div className={styles.formGroup}>
                <label>Nơi nhận</label>
                <input type="text" value={receiveLocation} onChange={(e) => setReceiveLocation(e.target.value)} placeholder="Chi nhánh..." />
              </div>
              <div className={styles.formGroup}>
                <label>Hẹn trả ngày</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <h3 style={{ fontSize: '15px' }}>Chi tiết thiết bị & Quá trình xử lý</h3>
              <button type="button" onClick={addItem} className={styles.btnSubmit} style={{ padding: '4px 8px', background: '#28a745', fontSize: '12px' }}>+ Thêm dòng</button>
            </div>

            <WarrantyItemTable 
              items={items}
              handleItemChange={handleItemChange}
              handleKeyDown={handleKeyDown}
              removeItem={removeItem}
            />

            <div style={{ textAlign: 'right', padding: '15px', fontWeight: 'bold', fontSize: '16px', color: '#e31e24' }}>
              TỔNG CHI PHÍ: {items.reduce((sum, i) => sum + (Number(i.warrantyCost) || 0), 0).toLocaleString()} VNĐ
            </div>

            {backendError && (
              <div style={{ 
                backgroundColor: '#fff1f0', 
                border: '1px solid #ffa39e', 
                color: '#e31e24', 
                padding: '10px', 
                borderRadius: '4px', 
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {backendError}
              </div>
            )}

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Hủy bỏ</button>
              <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Đang cập nhật...' : 'Xác nhận Cập nhật'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}