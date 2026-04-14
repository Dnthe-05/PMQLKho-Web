import React, { useEffect, useState } from 'react';
import { type ProductFilter } from '../../types/Product/productFilter';
import { getCategories, getBrands, getUnits } from '../../services/Product/productService';
import styles from '../../css/Product/ProductSidebar.module.css'; 

interface ProductSidebarProps {
  filters: ProductFilter;
  onFilterChange: (newFilters: ProductFilter) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [catRes, brandRes, unitRes]: any = await Promise.all([
          getCategories(),
          getBrands(),
          getUnits()
        ]);
        
        setCategories(catRes?.items || catRes?.data?.items || catRes || []);
        setBrands(brandRes?.items || brandRes?.data?.items || brandRes || []);
        setUnits(unitRes?.items || unitRes?.data?.items || unitRes || []);
        
      } catch (error) {
        console.error("Lỗi lấy dữ liệu gợi ý:", error);
      }
    };
    loadOptions();
  }, []);

  // Hàm xử lý chung cho cả select và checkbox
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue: any;

    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else {
      // Ép kiểu về Number vì Backend cần int cho các trường ID
      finalValue = value === "" ? undefined : Number(value);
    }

    onFilterChange({
      ...filters,
      [name]: finalValue
    });
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.stickyWrapper}>
        <h2 className={styles.title}>Bộ lọc thông minh</h2>

        {/* Danh mục */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Danh mục</label>
          <select
            name="categoryId"
            className={styles.inputField}
            value={filters.categoryId || ''}
            onChange={handleChange}
          >
            <option value="">-- Tất cả danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Nhãn hàng */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Nhãn hàng</label>
          <select
            name="brandId"
            className={styles.inputField}
            value={filters.brandId || ''}
            onChange={handleChange}
          >
            <option value="">-- Tất cả nhãn hàng --</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Đơn vị tính */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Đơn vị tính</label>
          <select
            name="unitId"
            className={styles.inputField}
            value={filters.unitId || ''}
            onChange={handleChange}
          >
            <option value="">-- Tất cả đơn vị --</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>


      <div className={styles.filterGroup}>
        <label className={styles.label}>Trạng thái</label>
        <select
          name="isDeleted"
          className={styles.inputField}
          // Chuyển đổi từ boolean sang string để select hiển thị được
          value={filters.isDeleted === true ? "true" : filters.isDeleted === false ? "false" : ""}
          onChange={(e) => {
            const val = e.target.value;
            let finalValue: boolean | undefined;
            
            if (val === "true") finalValue = true;
            else if (val === "false") finalValue = false;
            else finalValue = undefined; // Trường hợp "Tất cả"

            onFilterChange({
              ...filters,
              isDeleted: finalValue
            });
          }}
        >
          <option value="">--- Tất cả ---</option>
          <option value="false">Đang kinh doanh</option>
          <option value="true">Đã xóa (Thùng rác)</option>
        </select>
      </div>

        <button onClick={() => onFilterChange({})} className={styles.btnReset}>
          🔄 LÀM MỚI BỘ LỌC
        </button>
      </div>
    </aside>
  );
};

export default ProductSidebar;