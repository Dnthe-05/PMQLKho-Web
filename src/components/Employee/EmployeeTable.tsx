import React from 'react';
import { type Employee } from '../../types/Employee/Employee';

import styles from '../../css/Product/ProductTable.module.css'; 

interface EmployeeTableProps {
  data: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  currentPage: number; 
  pageSize: number;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, loading, onEdit, onDelete, onView, currentPage, pageSize }) => {
  const safeData = data || [];


  const getRoleName = (role?: number) => {
    switch (role) {
      case 1: return "Quản trị viên";
      case 2: return "Nhân viên kho";
      
      default: return "Chưa xác định";
    }
  };

  if (loading) return <div className="text-center p-5">Đang tải dữ liệu...</div>;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>

            <th className={styles.th} style={{ width: '10px', textAlign: 'center' }}>STT</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Tài khoản (Username)</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Họ và tên</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Vai trò</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Trạng thái</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu nhân viên</td>
            </tr>
          ) : (
            safeData.map((item: Employee, index: number) => {
              const isDeleted = item.deletedAt !== null && item.deletedAt !== undefined;

              return (
                <tr 
                  key={item.id} 
                  className={`${styles.tr} ${isDeleted ? styles.rowDeleted : ''}`}
                >

                  <td className={styles.td} style={{ textAlign: 'center', fontWeight: 'bold', color: isDeleted ? '#bfbfbf' : 'inherit' }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  {/* Tài khoản */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontWeight: 600, 
                      color: isDeleted ? '#bfbfbf' : '#262626',
                      textDecoration: isDeleted ? 'line-through' : 'none' 
                    }}>
                      {item.username}
                      {isDeleted && <span className={styles.deleteBadge}>Đã nghỉ</span>}
                    </div>
                  </td>

                  {/* Họ và tên */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <div style={{ color: isDeleted ? '#bfbfbf' : '#595959' }}>{item.fullName}</div>
                  </td>

                  {/* Vai trò */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <span 
                      className={styles.stockBadge} 
                      style={isDeleted ? { background: '#f5f5f5', color: '#bfbfbf' } : { background: '#F6FFED', color: '#389E0D' }}
                    >
                      {getRoleName(item.role)}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    {isDeleted ? (
                      <span style={{ color: '#bfbfbf', fontSize: '13px' }}>Đã nghỉ việc</span>
                    ) : (
                      <span style={{ color: '#1890ff', fontSize: '13px' }}>Đang làm việc</span>
                    )}
                  </td>

                  {/* Hoạt động */}
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <div className="flex justify-center gap-2">

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

export default EmployeeTable;