import React, { useEffect, useState } from 'react';
import { type ProductFilter } from '../../types/Product/productFilter';
import { getCategories, getBrands, getUnits } from '../../services/Product/productService';
import styles from '../../css/Product/ProductSidebar.module.css'; 

interface ProductSidebarProps {
  filters: ProductFilter;
  onFilterChange: (newFilters: ProductFilter) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [catData, brandData, unitData] = await Promise.all([
          getCategories(),
          getBrands(),
          getUnits()
        ]);
        setCategories(catData || []);
        setBrands(brandData || []);
        setUnits(unitData || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu gợi ý:", error);
      }
    };
    loadOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    onFilterChange({
      ...filters,
      [name]: val === "" ? undefined : val
    });
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.stickyWrapper}>
        <h2 className={styles.title}>
          <span style={{ marginRight: '8px' }}></span> Bộ lọc thông minh
        </h2>

        {/* 2. Danh mục */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Danh mục</label>
          <input
            list="cat-list"
            name="categoryName"
            placeholder="Chọn/Gõ danh mục..."
            className={styles.inputField}
            value={filters.categoryName || ''}
            onChange={handleChange}
          />
          <datalist id="cat-list">
            {categories.map((c, i) => <option key={i} value={c} />)}
          </datalist>
        </div>

        {/* 3. Nhãn hàng */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Nhãn hàng</label>
          <input
            list="brand-list"
            name="brandName"
            placeholder="Chọn/Gõ nhãn hàng..."
            className={styles.inputField}
            value={filters.brandName || ''}
            onChange={handleChange}
          />
          <datalist id="brand-list">
            {brands.map((b, i) => <option key={i} value={b} />)}
          </datalist>
        </div>

        {/* 4. Đơn vị tính */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Đơn vị tính</label>
          <input
            list="unit-list"
            name="unitName"
            placeholder="Chọn/Gõ đơn vị..."
            className={styles.inputField}
            value={filters.unitName || ''}
            onChange={handleChange}
          />
          <datalist id="unit-list">
            {units.map((u, i) => <option key={i} value={u} />)}
          </datalist>
        </div>

        {/* 5. Trạng thái */}
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            name="isDeleted"
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            checked={filters.isDeleted || false}
            onChange={handleChange}
          />
          <span style={{ marginLeft: '12px', fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            Xem hàng đã xóa
          </span>
        </label>

        {/* Nút Reset */}
        <button
          onClick={() => onFilterChange({})}
          className={styles.btnReset}
        >
          🔄 LÀM MỚI BỘ LỌC
        </button>
      </div>
    </aside>
  );
};

export default ProductSidebar;