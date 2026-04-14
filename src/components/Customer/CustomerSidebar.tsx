import React from 'react';
import { type CustomerFilter } from '../../types/Customer/CustomerFilter';
import styles from '../../css/Product/ProductSidebar.module.css'; 

interface CustomerSidebarProps {
  filters: CustomerFilter;
  onFilterChange: (newFilters: CustomerFilter) => void;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ filters, onFilterChange }) => {

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.stickyWrapper}>
        <h2 className={styles.title}>
          <span style={{ marginRight: '8px' }}>👥</span> Bộ lọc khách hàng
        </h2>

        {/* Trạng thái hoạt động */}
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
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
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

export default CustomerSidebar;