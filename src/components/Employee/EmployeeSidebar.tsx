import React from 'react';
import { type EmployeeFilter } from '../../types/Employee/EmployeeFilter';
import styles from '../../css/Product/ProductSidebar.module.css'; 

interface EmployeeSidebarProps {
  filters: EmployeeFilter;
  onFilterChange: (newFilters: EmployeeFilter) => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ filters, onFilterChange }) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    // Đã xóa biến type ở đây cho hết báo vàng
    const { name, value } = e.target;
    let finalValue: any = value;

    if (name === 'role') {
      finalValue = value === "" ? undefined : Number(value);
    } 
    else if (value === "") {
      finalValue = undefined;
    }

    onFilterChange({
      ...filters,
      [name]: finalValue
    });
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.stickyWrapper}>
        <h2 className={styles.title}>
          <span style={{ marginRight: '8px' }}>👤</span> Bộ lọc nhân viên
        </h2>

        {/* 1. Vai trò */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Vai trò</label>
          <select
            name="role"
            className={styles.inputField}
            value={filters.role || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
          >
            <option value="">-- Tất cả vai trò --</option>
            <option value={1}>Quản trị viên</option>
            <option value={2}>Nhân viên kho</option>
            <option value={3}>Nhân viên bán hàng</option>
          </select>
        </div>

        {/* 2. Lọc nhân viên đã xóa (Logic đảo ngược cho khớp C#) */}
        <label className={styles.checkboxContainer} style={{ marginTop: '20px' }}>
          <input
            type="checkbox"
            // Nếu isActive là false (đã nghỉ) -> check ô này
            checked={filters.isActive === false} 
            onChange={(e) => onFilterChange({ 
              ...filters, 
              // Nếu người dùng tick ô -> gửi isActive = false. Nếu bỏ tick -> gửi isActive = true
              isActive: !e.target.checked 
            })}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span style={{ marginLeft: '12px', fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            Xem nhân viên đã nghỉ việc/xóa
          </span>
        </label>

        {/* Nút Reset */}
        <button
          onClick={() => onFilterChange({ isActive: true })} // Mặc định reset về người đang làm (isActive = true)
          className={styles.btnReset}
          style={{ marginTop: '30px' }}
        >
          🔄 LÀM MỚI BỘ LỌC
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;