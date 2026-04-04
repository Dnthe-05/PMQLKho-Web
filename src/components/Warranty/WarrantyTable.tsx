import React from 'react';
import styles from '../../css/SharedLayout.module.css';
import { type WarrantyList } from '../../types/Warranty/Warranty';

interface WarrantyTableProps {
  data: WarrantyList[];
}

const WarrantyTable: React.FC<WarrantyTableProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  const renderStatus = (status: number) => {
    const badgeStyle: React.CSSProperties = {
      padding: '4px 12px', 
      borderRadius: '4px', 
      fontSize: '12px', 
      display: 'inline-block', 
      minWidth: '85px', 
      textAlign: 'center'
    };

    switch (status) {
      case 1:
        return <span style={{ ...badgeStyle, background: '#e0f2fe', color: '#0284c7' }}>Tiếp nhận</span>;
      case 2:
        return <span style={{ ...badgeStyle, background: '#ffedd5', color: '#c2410c' }}>Đang xử lý</span>;
      case 3:
        return <span style={{ ...badgeStyle, background: '#dcfce7', color: '#16a34a' }}>Hoàn thành</span>;
      default:
        return <span style={{ ...badgeStyle, background: '#fee2e2', color: '#dc2626' }}>Đã hủy</span>;
    }
  };

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.thRow}>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Mã Phiếu</th>
            <th className={styles.th}>Khách hàng</th>
            <th className={styles.th}>Ngày nhận</th>
            <th className={styles.th}>Hẹn trả</th>
            <th className={styles.th}>Tổng chi phí</th>
            <th className={styles.th}>Trạng thái</th>
            <th className={styles.th}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>{index + 1}</td>
                
                <td className={styles.td}>
                  <strong>{item.code}</strong>
                </td>
                
                <td className={styles.td}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{item.customerName}</span>
                    <span style={{ fontSize: '13px', color: '#6c757d' }}>{item.phone}</span>
                  </div>
                </td>
                
                <td className={styles.td}>{formatDate(item.receiveDate)}</td>
                <td className={styles.td}>{formatDate(item.returnDate)}</td>
                
                <td className={styles.td}>
                  <strong style={{ color: '#F23A3A' }}>{formatCurrency(item.totalCost)}</strong>
                </td>
                
                <td className={styles.td}>{renderStatus(item.status)}</td>
                <td className={styles.td}>
                  <div className={styles.actionWrapper}>
                    
                    <button className={`${styles.btnAction} ${styles.btnEdit}`} title="Xem/Cập nhật">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    
                    <button className={`${styles.btnAction} ${styles.btnDelete}`} title="Xóa">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>

                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className={styles.tr}>
              <td colSpan={8} className={styles.td} style={{ color: '#888' }}>
                Không có phiếu bảo hành nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WarrantyTable;