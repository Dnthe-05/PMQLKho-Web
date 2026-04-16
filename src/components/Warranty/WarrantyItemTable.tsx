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
  productId?: number;
}

interface Props {
  items: EditWarrantyItem[];
  handleItemChange: (index: number, field: keyof EditWarrantyItem, value: any) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  removeItem: (index: number) => void;
  onExchangeClick: (index: number, currentSerial: string, productId: number, detailId: number) => void;
  // Giữ nguyên tham số onLoanClick để khớp với EditWarrantyForm
  onLoanClick: (detailId: number, oldSerialCode: string) => void;
}

export default function WarrantyItemTable({ 
  items, 
  handleItemChange, 
  handleKeyDown, 
  removeItem, 
  onExchangeClick,
  onLoanClick 
}: Props) {
  return (
    <div style={{ 
      maxHeight: '400px',
      overflowY: 'auto', 
      marginTop: '10px', 
      paddingRight: '5px',
      border: '1px solid #f0f0f0',
      padding: '10px',
      borderRadius: '8px'
    }}>
      <p style={{fontSize: '11px', color: '#999', marginBottom: '10px'}}>
        * Sử dụng nút "Đổi máy" hoặc "Cho mượn" để xử lý thiết bị bảo hành.
      </p>
      
      {items.map((item, index) => (
        <div key={index} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{fontWeight: 'bold', color: '#666'}}>Thiết bị #{index + 1}</span>
            
            {/* CỤM NÚT BẤM HÀNH ĐỘNG */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => onExchangeClick(index, item.serialNumberId, item.productId || 0, item.id || 0)}
                style={{ padding: '6px 14px', fontSize: '11px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🔄 Đổi máy mới
              </button>

              <button 
                type="button"
                onClick={() => onLoanClick(item.id || 0, item.serialNumberId)}
                style={{ padding: '6px 14px', fontSize: '11px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🤝 Cho mượn tạm
              </button>
            </div>
          </div>

          <div className={styles.row} style={{ gap: '10px', marginBottom: '10px' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '11px' }}>Mã Serial</label>
              <input 
                type="text" 
                placeholder="Nhấn Enter để tìm"
                value={item.serialNumberId} 
                onKeyDown={(e) => handleKeyDown(e, index)} 
                onChange={(e) => handleItemChange(index, 'serialNumberId', e.target.value)} 
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1.5 }}>
              <label style={{ fontSize: '11px' }}>Tên sản phẩm</label>
              <input type="text" value={item.productName} readOnly style={{ background: '#f8fafc', color: '#64748b' }} />
            </div>
          </div>

          <div className={styles.row} style={{ gap: '10px' }}>
            <div className={styles.formGroup} style={{ flex: 2 }}>
              <label style={{ fontSize: '11px' }}>Mô tả lỗi</label>
              <input 
                id={`issue-edit-${index}`}
                type="text" 
                value={item.issueDescription} 
                onChange={(e) => handleItemChange(index, 'issueDescription', e.target.value)} 
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label style={{ fontSize: '11px' }}>Phí bảo hành/dịch vụ</label>
              <input type="number" value={item.warrantyCost} onChange={(e) => handleItemChange(index, 'warrantyCost', e.target.value)} />
            </div>
            <button 
              type="button" 
              onClick={() => removeItem(index)} 
              disabled={items.length === 1} 
              style={{ alignSelf: 'flex-end', marginBottom: '8px', color: '#ff4d4f', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}