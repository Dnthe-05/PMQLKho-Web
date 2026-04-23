import React from 'react';
import styles from '../../css/SharedLayout.module.css';
import { type WarrantyList } from '../../types/Warranty/Warranty';
import { useNavigate } from 'react-router-dom';

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
      default:
        return <span style={{ ...badgeStyle, background: '#dcfce7', color: '#16a34a' }}>Hoàn thành</span>;
    }
  };

  const navigate = useNavigate();

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
                    <button 
                      className={`${styles.btnAction} ${styles.btnEdit}`}
                      title="Xem chi tiết"
                      onClick={() => navigate(`/bao-hanh/chi-tiet/${item.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
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