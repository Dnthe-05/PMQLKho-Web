import React from 'react';
import { type EmployeeFilter } from '../../types/Employee/EmployeeFilter';
import styles from '../../css/Product/ProductSidebar.module.css'; 

interface EmployeeSidebarProps {
  filters: EmployeeFilter;
  onFilterChange: (newFilters: EmployeeFilter) => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ filters, onFilterChange }) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
          
          </select>
        </div>

        {/* 2. Trạng thái hoạt động */}
        <div className={styles.filterGroup} style={{ marginTop: '16px' }}>
          <label className={styles.label}>Trạng thái</label>
          <select
            name="isActive"
            className={styles.inputField}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
            value={filters.isActive === true ? "true" : filters.isActive === false ? "false" : ""}
            onChange={(e) => {
              const val = e.target.value;
              let finalValue: boolean | undefined;
              
              if (val === "true") finalValue = true;
              else if (val === "false") finalValue = false;
              else finalValue = undefined;

              onFilterChange({
                ...filters,
                isActive: finalValue
              });
            }}
          >
            <option value="">--- Tất cả ---</option>
            <option value="true">Đang làm việc</option>
            <option value="false">Đã nghỉ việc / Đã xóa</option>
          </select>
        </div>

        {/* Nút Reset */}
        <button
          onClick={() => onFilterChange({ isActive: true })} 
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