import React, { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css';
import { 
    getWarrantyById, 
    updateWarranty, 
    getProductBySerial, 
    getAvailableSerials, 
    exchangeMachine,
    loanMachine,
    ReturnloanMachine 
} from '../../services/Warranty/warrantyService';
import { useWarrantyValidation } from '../../hooks/useWarrantyValidation'; 
import WarrantyItemTable from './WarrantyItemTable';
import {
        type EditWarrantyItem,
        type UpdateWarrantyDTO
} from '../../types/Warranty/UpdateWarranty';

interface EditWarrantyFormProps {
  isOpen: boolean;
  warrantyId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditWarrantyForm({ isOpen, warrantyId, onClose, onSuccess }: EditWarrantyFormProps) {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [returnLocation, setreturnLocation] = useState('');
  const [receiveLocation, setReceiveLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState(1);
  const [loanReturnDate, setLoanReturnDate] = useState("");
  
  const [items, setItems] = useState<EditWarrantyItem[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States chung cho kho máy
  const [rawAvailableList, setRawAvailableList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [exchangeTarget, setExchangeTarget] = useState({ detailId: 0, oldSerialCode: '' });

  // Exchange States (Đổi máy)
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeNote, setExchangeNote] = useState('');
  const [upgradeFee, setUpgradeFee] = useState(0);

  // Loan States (Mượn máy)
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanNote, setLoanNote] = useState('');

  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

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
      setreturnLocation(d.returnLocation || '');
      setReceiveLocation(d.receiveLocation || '');
      setReturnDate(d.returnDate ? d.returnDate.split('T')[0] : '');
      setStatus(d.status || 1);

      const mappedItems: EditWarrantyItem[] = d.details.map((item: any) => ({
        id: item.id,
        serialNumberId: item.serialCode,
        productId: item.productId,
        productName: item.productName || 'Sản phẩm hiện tại',
        issueDescription: item.issueDescription || '',
        warrantyCost: item.warrantyCost || 0,
        processingType: item.processingType,
        isLoan: item.isLoan || false,
        timelines: item.timelines || [],
        sentToVendorDate: item.sentToVendorDate ? item.sentToVendorDate.split('T')[0] : '',
        receivedFromVendorDate: item.receivedFromVendorDate ? item.receivedFromVendorDate.split('T')[0] : '',
      }));
      
      setItems(mappedItems);
    }
  } catch (error) {
    setBackendError("Không thể tải dữ liệu.");
  } finally {
    setIsLoading(false);
  }
};

  const handleOpenExchange = async (index: number, oldSerialCode: string, productId: number, detailId: number) => {
    try {
        const res = await getAvailableSerials();
        const rawList = res.data?.data || res.data || []; 
        setRawAvailableList(rawList); 
        setFilteredList(rawList);
        setExchangeTarget({ detailId, oldSerialCode });
        setUpgradeFee(0);
        setExchangeNote('');
        setIsExchangeModalOpen(true);
    } catch (error) {
        alert("Lỗi kết nối kho!");
    }
  };

  const confirmExchange = async (machine: any) => {
    if (!window.confirm(`Xác nhận đổi sang máy [${machine.serialcode}]?`)) return;
    setIsSubmitting(true);
    try {
        await exchangeMachine({ 
          detailId: exchangeTarget.detailId,
          newSerialId: machine.serialNumberId,
          additionalCost: upgradeFee,
          note: exchangeNote || "Đổi máy mới từ kho cho khách" 
        });
        alert("Đổi máy thành công!");
        setIsExchangeModalOpen(false);
        onSuccess();
        onClose();
    } catch (error: any) {
        alert(error.response?.data?.message || "Lỗi khi thực hiện đổi máy.");
    } finally { setIsSubmitting(false); }
  };

  const handleOpenLoan = async (detailId: number, oldSerialCode: string) => {
    try {
        const res = await getAvailableSerials();
        const rawList = res.data?.data || res.data || [];
        setRawAvailableList(rawList);
        setFilteredList(rawList);
        setExchangeTarget({ ...exchangeTarget, detailId: detailId, oldSerialCode: oldSerialCode });
        setLoanNote('');
        setLoanReturnDate('');
        setIsLoanModalOpen(true);
    } catch (error) {
        alert("Không lấy được danh sách máy kho!");
    }
  };

  const confirmLoan = async (machine: any) => {
    if (!window.confirm(`Cho khách mượn máy [${machine.serialcode}]?`)) return;
    try {
        await loanMachine({
            detailId: exchangeTarget.detailId,
            loanSerialId: machine.serialNumberId,
            note: loanNote || "Cho mượn máy dùng tạm trong lúc chờ sửa chữa.",
            returnDate: new Date(loanReturnDate)
        });
        alert("Đã lập phiếu mượn máy!");
        setItems((prevItems: any[]) => 
            prevItems.map((item) => 
                item.id === exchangeTarget.detailId 
                    ? { ...item, isLoan: true }
                    : item
            )
        );
        setIsLoanModalOpen(false);
        onSuccess();
        onClose();
    } catch (error: any) {
        alert(error.response?.data?.message || "Lỗi khi cho mượn máy.");
    }
};

  const handleConfirmSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!window.confirm("Xác nhận lưu thay đổi?")) return;

  setIsSubmitting(true);
  try {
    const payload: UpdateWarrantyDTO = {
      phone: phone.trim(),
      customerName: customerName.trim(),
      returnLocation: returnLocation.trim(),
      receiveLocation: receiveLocation.trim(),
      returnDate: returnDate ? new Date(returnDate).toISOString() : null,
      status: status,
      details: items.map(i => ({
        id: i.id,
        serialNumberId: Number(i.productId),
        issueDescription: i.issueDescription.trim(),
        processingType: i.processingType || "Tiếp nhận",
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
    setBackendError(error.response?.data?.message || "Lỗi cập nhật.");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleKeyDown = async (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const serialId = items[index].serialNumberId.trim();
      if (!serialId) return;
      try {
        const response = await getProductBySerial(serialId);
        const d = response.data?.data || response.data;
        if (d) {
          const newItems = [...items];
          newItems[index].productName = d.productName || d.name;
          newItems[index].productId = d.productId || d.id; 
          setItems(newItems);
          document.getElementById(`issue-edit-${index}`)?.focus();
        }
      } catch (err) { alert("Không tìm thấy Serial này!"); }
    }
  };

  const handleItemChange = (index: number, field: keyof EditWarrantyItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };


  const handleReturnLoan = async (detailId: number) => {
      if (!window.confirm("Bạn có chắc chắn muốn thu hồi máy mượn này không?")) {
          return;
      }
      try {
          const response = await ReturnloanMachine(detailId);
          
          setItems(prev => prev.map(item => 
            item.id === detailId ? { ...item, isLoan: false } : item
            ));
            alert("Thu hồi thành công");
            window.location.reload(); 
          
      } catch (error: any) {
          alert(error.response?.data?.message || "Lỗi khi thu hồi máy mượn");
      }
  };

  const addItem = () => setItems([...items, { serialNumberId: '', productName: '', issueDescription: '', warrantyCost: 0, sentToVendorDate: '', receivedFromVendorDate: '',processingType: 'Tiếp nhận',timelines: [] }]);
  const removeItem = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ width: '1000px' }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Cập Nhật Phiếu Bảo Hành {warrantyId}</h2>
          <button className={styles.btnCloseHeader} onClick={onClose}>&times;</button>
        </div>

        {isLoading ? <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div> : (
          <form onSubmit={handleConfirmSubmit}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Số điện thoại</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}/>
              </div>
              <div className={styles.formGroup}>
                <label>Tên khách hàng *</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Trạng thái phiếu</label>
                <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                  <option value={1}>1. Tiếp nhận</option>
                  <option value={2}>2. Đang xử lý</option>
                  <option value={3}>3. Hoàn thành</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup} style={{ flex: 1.5 }}><label>Địa chỉ</label><input type="text" value={returnLocation} onChange={(e) => setreturnLocation(e.target.value)} /></div>
              <div className={styles.formGroup}><label>Nơi nhận</label><input type="text" value={receiveLocation} onChange={(e) => setReceiveLocation(e.target.value)} /></div>
              <div className={styles.formGroup}><label>Hẹn trả ngày</label><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px' }}>Danh sách thiết bị</h3>
              <button type="button" onClick={addItem} className={styles.btnSubmit} style={{ padding: '4px 8px', background: '#28a745', fontSize: '11px' }}>+ Thêm dòng</button>
            </div>

            <WarrantyItemTable 
              items={items}
              handleItemChange={handleItemChange}
              handleKeyDown={handleKeyDown}
              removeItem={removeItem}
              onExchangeClick={handleOpenExchange} 
              onLoanClick={handleOpenLoan} 
              onReturnLoanClick={handleReturnLoan}
              onRowClick={(index: number) => setSelectedItemIndex(index)} selectedIndex={selectedItemIndex}
            />
            
            <div style={{ textAlign: 'right', padding: '15px', fontWeight: 'bold', fontSize: '16px', color: '#e31e24' }}>
              TỔNG CHI PHÍ: {items.reduce((sum, i) => sum + (Number(i.warrantyCost) || 0), 0).toLocaleString()} VNĐ
            </div>

            {backendError && <div style={{ color: '#e31e24', textAlign: 'center', marginBottom: '10px' }}>{backendError}</div>}

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Hủy bỏ</button>
              <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>Xác nhận Cập nhật</button>
            </div>
          </form>
        )}
      </div>

      {isExchangeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '550px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>Thực hiện đổi máy mới</h3>
                <button onClick={() => setIsExchangeModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '15px' }}>Đang xử lý cho máy lỗi: <strong style={{ color: '#e31e24' }}>{exchangeTarget.oldSerialCode}</strong></p>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Tìm mã Serial trong kho:</label>
                <input type="text" placeholder="Nhập mã Serial để lọc nhanh..." style={{ width: '100%', padding: '10px', border: '1px solid #0284c7', borderRadius: '6px' }}
                  onChange={(e) => {
                    const search = e.target.value.toLowerCase();
                    setFilteredList(rawAvailableList.filter(m => m.serialcode.toLowerCase().includes(search)));
                  }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Phí bù thêm / Hoàn trả (VNĐ):</label>
                <input type="text" value={upgradeFee.toLocaleString()} onChange={(e) => setUpgradeFee(Number(e.target.value.replace(/\D/g, "")))} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Ghi chú đổi trả:</label>
                <textarea value={exchangeNote} onChange={(e) => setExchangeNote(e.target.value)} placeholder="Lý do đổi..." style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', height: '60px', resize: 'none' }} />
            </div>

            <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '6px', background: '#f9f9f9' }}>
              {filteredList.map((m: any, idx: number) => (
                <div key={idx} onClick={() => confirmExchange(m)} style={{ padding: '12px', borderBottom: '1px solid #fff', cursor: 'pointer' }} onMouseOver={(e) => (e.currentTarget.style.background = '#e0f2fe')} onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ fontWeight: 'bold', color: '#0284c7' }}>{m.serialcode}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{m.productName} - {m.price?.toLocaleString()}đ</div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsExchangeModalOpen(false)} style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '6px' }}>Đóng cửa sổ</button>
          </div>
        </div>
      )}

      {isLoanModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '500px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#a855f7' }}> Cho mượn máy dùng tạm</h3>
              <button onClick={() => setIsLoanModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '15px' }}>Mượn máy cho dòng: <strong style={{ color: '#a855f7' }}>{exchangeTarget.oldSerialCode}</strong></p>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Tìm máy cho mượn:</label>
              <input type="text" placeholder="Nhập mã máy..." style={{ width: '100%', padding: '10px', border: '1px solid #a855f7', borderRadius: '6px' }}
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  setFilteredList(rawAvailableList.filter(m => m.serialcode.toLowerCase().includes(search)));
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Ngày hẹn trả máy mượn *:</label>
              <input 
                type="date" 
                required
                value={loanReturnDate}
                onChange={(e) => setLoanReturnDate(e.target.value)} 
                style={{ width: '100%', padding: '10px', border: '1px solid #a855f7', borderRadius: '6px', outline: 'none' }} 
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Ghi chú mượn:</label>
              <textarea placeholder="Tình trạng máy mượn..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', height: '80px', resize: 'none' }} onChange={(e) => setLoanNote(e.target.value)} required/>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#f8fafc', borderRadius: '6px', border: '1px solid #eee' }}>
              {filteredList.map((m: any, idx: number) => (
                <div key={idx} onClick={() => confirmLoan(m)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #fff' }} onMouseOver={(e) => (e.currentTarget.style.background = '#f3e8ff')} onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ fontWeight: 'bold', color: '#a855f7' }}>{m.serialcode}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{m.productName}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsLoanModalOpen(false)} style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '6px' }}>Hủy bỏ</button>
          </div>
        </div>
      )}
    </div>
  );
}