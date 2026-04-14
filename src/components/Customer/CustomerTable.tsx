import React from 'react';
import { type Customer } from '../../types/Customer/Customer';
import styles from '../../css/Product/ProductTable.module.css'; 

interface CustomerTableProps {
  data: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  currentPage: number; 
  pageSize: number;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ data, loading, onEdit, onDelete, onView, currentPage, pageSize }) => {
  const safeData = data || [];

  if (loading) return <div className="text-center p-5">Đang tải dữ liệu...</div>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} style={{ width: '10px', textAlign: 'center' }}>STT</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Thông tin khách hàng</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Địa chỉ giao hàng</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Trạng thái</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu khách hàng</td>
            </tr>
          ) : (
            safeData.map((item: Customer, index: number) => {
              const isDeleted = item.deletedAt !== null && item.deletedAt !== undefined;

              return (
                <tr 
                  key={item.id} 
                  className={`${styles.tr} ${isDeleted ? styles.rowDeleted : ''}`}
                >
                  {/* Số thứ tự (STT) */}
                  <td className={styles.td} style={{ textAlign: 'center', fontWeight: 'bold', color: isDeleted ? '#bfbfbf' : 'inherit' }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  {/* Thông tin khách hàng*/}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontWeight: 600, 
                      color: isDeleted ? '#bfbfbf' : '#262626',
                      textDecoration: isDeleted ? 'line-through' : 'none' 
                    }}>
                      {item.fullName}
                      {isDeleted && <span className={styles.deleteBadge}>Đã xóa</span>}
                    </div>
                    <div style={{ fontSize: '13px', color: '#8c8c8c', marginTop: '4px' }}>
                      📞 {item.phone} {item.email ? ` | ✉️ ${item.email}` : ''}
                    </div>
                  </td>

                  {/* Địa chỉ giao hàng */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <div style={{ color: isDeleted ? '#bfbfbf' : '#595959', fontSize: '14px' }}>
                      {item.shippingAddress || <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Chưa cập nhật</span>}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    {isDeleted ? (
                      <span style={{ color: '#bfbfbf', fontSize: '13px' }}>Ngừng hoạt động</span>
                    ) : (
                      <span style={{ color: '#1890ff', fontSize: '13px' }}>Đang hoạt động</span>
                    )}
                  </td>

                  {/* Hoạt động */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <div className="flex justify-center gap-2">
                      
                      {/* 2. THÊM NÚT XEM CHI TIẾT */}
                      <button 
                        className={styles.actionBtn} 
                        style={{ color: '#0284c7' }}
                        onClick={() => onView(item.id)}
                      >
                        Xem
                      </button>

                      {!isDeleted && (
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => onEdit(item)}
                      >
                        Sửa
                      </button>
                      )}

                      {!isDeleted && (
                        <button 
                          className={styles.actionBtn} 
                          style={{ color: '#ff4d4f' }} 
                          onClick={() => onDelete(item.id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;