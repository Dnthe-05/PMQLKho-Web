import React from 'react';
import { type Employee } from '../../types/Employee/Employee';
// Giả sử bạn tái sử dụng CSS module của Product hoặc tạo mới một file tương tự cho Employee
import styles from '../../css/Product/ProductTable.module.css'; 

interface EmployeeTableProps {
  data: Employee[];
  loading: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, loading }) => {
  const safeData = data || [];

  // Hàm phụ trợ để hiển thị Vai trò (Role) từ số sang chữ
  const getRoleName = (role?: number) => {
    switch (role) {
      case 1: return "Quản trị viên";
      case 2: return "Nhân viên kho";
      case 3: return "Nhân viên bán hàng";
      default: return "Chưa xác định";
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} style={{ width: '80px', textAlign: 'center' }}>ID</th>
            <th className={styles.th}>Tài khoản (Username)</th>
            <th className={styles.th}>Họ và tên</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Vai trò</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Trạng thái</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td>
            </tr>
          ) : safeData.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu nhân viên</td>
            </tr>
          ) : (
            safeData.map((item: Employee) => (
              <tr key={item.id} className={styles.tr}>
                {/* ID */}
                <td className={styles.td} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {item.id}
                </td>

                {/* Tài khoản */}
                <td className={styles.td}>
                  <div style={{ fontWeight: 600, color: '#262626' }}>{item.username}</div>
                </td>

                {/* Họ và tên */}
                <td className={styles.td}>
                  <div style={{ color: '#595959' }}>{item.fullName}</div>
                </td>

                {/* Vai trò */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <span className={styles.stockBadge} style={{ background: '#F6FFED', color: '#389E0D', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {getRoleName(item.role)}
                  </span>
                </td>

                {/* Trạng thái (dựa vào DeletedAt) */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  {item.deletedAt ? (
                    <span style={{ color: '#f5222d', fontSize: '13px' }}>Đã nghỉ việc</span>
                  ) : (
                    <span style={{ color: '#1890ff', fontSize: '13px' }}>Đang làm việc</span>
                  )}
                </td>

                {/* Hoạt động */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <div className="flex justify-center gap-2">
                    <button className={styles.actionBtn}>Sửa</button>
                    {!item.deletedAt && (
                      <button className={styles.actionBtn} style={{ color: '#ff4d4f' }}>Xóa</button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;