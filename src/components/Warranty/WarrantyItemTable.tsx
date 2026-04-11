import React from 'react';
import styles from '../../css/SharedForm.module.css';

interface EditWarrantyItem {
  id?: number;
  serialNumberId: string;
  productName: string;
  issueDescription: string;
  warrantyCost: number;
  sentToVendorDate: string;
  receivedFromVendorDate: string;
}

interface Props {
  items: EditWarrantyItem[];
  handleItemChange: (index: number, field: keyof EditWarrantyItem, value: any) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  removeItem: (index: number) => void;
}

export default function WarrantyItemTable({ items, handleItemChange, handleKeyDown, removeItem }: Props) {
  return (
    <div style={{ maxHeight: '350px', overflowY: 'auto', marginTop: '10px' }}>
      {items.map((item, index) => (
        <div key={index} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' }}>
          {/* Dòng 1: Serial - Tên SP - Chi phí */}
          <div className={styles.row} style={{ gap: '10px', marginBottom: '10px' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '11px' }}>Serial (Bắn máy)</label>
              <input 
                type="text" 
                value={item.serialNumberId} 
                onKeyDown={(e) => handleKeyDown(e, index)} 
                onChange={(e) => handleItemChange(index, 'serialNumberId', e.target.value)} 
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1.5 }}>
              <label style={{ fontSize: '11px' }}>Tên sản phẩm</label>
              <input type="text" value={item.productName} readOnly style={{ background: '#eee' }} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '11px' }}>Chi phí (VNĐ)</label>
              <input 
                type="number" 
                value={item.warrantyCost} 
                onChange={(e) => handleItemChange(index, 'warrantyCost', e.target.value)} 
              />
            </div>
          </div>

          {/* Dòng 2: Nội dung lỗi - Ngày gửi - Ngày về */}
          <div className={styles.row} style={{ gap: '10px' }}>
            <div className={styles.formGroup} style={{ flex: 2 }}>
              <label style={{ fontSize: '11px' }}>Nội dung lỗi</label>
              <input 
                id={`issue-edit-${index}`} 
                type="text" 
                value={item.issueDescription} 
                onChange={(e) => handleItemChange(index, 'issueDescription', e.target.value)} 
              />
            </div>
            <div className={styles.formGroup}>
              <label style={{ fontSize: '11px' }}>Ngày gửi hãng</label>
              <input 
                type="date" 
                value={item.sentToVendorDate} 
                onChange={(e) => handleItemChange(index, 'sentToVendorDate', e.target.value)} 
              />
            </div>
            <div className={styles.formGroup}>
              <label style={{ fontSize: '11px' }}>Ngày về từ hãng</label>
              <input 
                type="date" 
                value={item.receivedFromVendorDate} 
                onChange={(e) => handleItemChange(index, 'receivedFromVendorDate', e.target.value)} 
              />
            </div>
            <button 
              type="button" 
              onClick={() => removeItem(index)} 
              disabled={items.length === 1} 
              style={{ alignSelf: 'flex-end', marginBottom: '8px', color: '#dc3545', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}