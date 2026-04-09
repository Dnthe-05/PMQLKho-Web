import React, { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css';
import { getWarrantyById, updateWarranty } from '../../services/Warranty/warrantyService';
import { getProductBySerial } from '../../services/Product/productService';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && warrantyId) {
      loadWarrantyData(warrantyId);
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

    const serials = items.map(i => i.serialNumberId.trim());
    if (serials.some((s, idx) => serials.indexOf(s) !== idx)) {
      setErrors({ serialList: "Mã Serial không được trùng nhau!" });
      return;
    }

    // kiểm tra ngày
    for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (item.sentToVendorDate && item.receivedFromVendorDate) {
      const sentDate = new Date(item.sentToVendorDate);
      const receivedDate = new Date(item.receivedFromVendorDate);

      if (receivedDate < sentDate) {
        const errorMsg = `Ngày gửi không thể lớn hơn ngày nhận từ hãng`;
        setErrors(prev => ({ ...prev, [`dateError_${i}`]: errorMsg }));
        alert(errorMsg);
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
      setBackendError(error.response?.data?.message || "Lỗi cập nhật dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const serialId = items[index].serialNumberId;
      if (!serialId) return;
      try {
        const response = await getProductBySerial(serialId);
        if (response.data) {
          const newItems = [...items];
          newItems[index].productName = response.data.data?.name || response.data.name;
          setItems(newItems);
          document.getElementById(`issue-edit-${index}`)?.focus();
        }
      } catch (err) { alert("Không tìm thấy Serial!"); }
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
                  <option value={4}>Đã trả khách</option>
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

            <div style={{ maxHeight: '350px', overflowY: 'auto', marginTop: '10px' }}>
              {items.map((item, index) => (
                <div key={index} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' }}>
                  <div className={styles.row} style={{ gap: '10px', marginBottom: '10px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px' }}>Serial (Bắn máy)</label>
                      <input type="text" value={item.serialNumberId} onKeyDown={(e) => handleKeyDown(e, index)} onChange={(e) => handleItemChange(index, 'serialNumberId', e.target.value)} />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1.5 }}>
                      <label style={{ fontSize: '11px' }}>Tên sản phẩm</label>
                      <input type="text" value={item.productName} readOnly style={{ background: '#eee' }} />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px' }}>Chi phí (VNĐ)</label>
                      <input type="number" value={item.warrantyCost} onChange={(e) => handleItemChange(index, 'warrantyCost', e.target.value)} />
                    </div>
                  </div>

                  <div className={styles.row} style={{ gap: '10px' }}>
                    <div className={styles.formGroup} style={{ flex: 2 }}>
                      <label style={{ fontSize: '11px' }}>Nội dung lỗi</label>
                      <input id={`issue-edit-${index}`} type="text" value={item.issueDescription} onChange={(e) => handleItemChange(index, 'issueDescription', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label style={{ fontSize: '11px' }}>Ngày gửi hãng</label>
                      <input type="date" value={item.sentToVendorDate} onChange={(e) => handleItemChange(index, 'sentToVendorDate', e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                      <label style={{ fontSize: '11px' }}>Ngày về từ hãng</label>
                      <input type="date" value={item.receivedFromVendorDate} onChange={(e) => handleItemChange(index, 'receivedFromVendorDate', e.target.value)} />
                    </div>
                    <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} style={{ alignSelf: 'flex-end', marginBottom: '8px', color: '#dc3545', background: 'none', border: 'none', fontSize: '20px' }}>&times;</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', padding: '15px', fontWeight: 'bold', fontSize: '16px', color: '#e31e24' }}>
              TỔNG CHI PHÍ: {items.reduce((sum, i) => sum + (Number(i.warrantyCost) || 0), 0).toLocaleString()} VNĐ
            </div>

            {backendError && <div className={styles.errorText} style={{ textAlign: 'center', background: '#fff1f0', padding: '10px', marginBottom: '10px' }}>{backendError}</div>}

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Hủy bỏ</button>
              <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>Xác nhận Cập nhật</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}