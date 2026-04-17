import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // Import thư viện mới
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
        const pageSize = 1000;
        const [catRes, brandRes, unitRes]: any = await Promise.all([
          getCategories({ pageNumber: 1, pageSize }),
          getBrands({ pageNumber: 1, pageSize }),
          getUnits({ pageNumber: 1, pageSize })
        ]);

        const formatData = (res: any) => {
          const items = res?.items || res?.data?.items || res || [];
          // React-select yêu cầu định dạng { value, label }
          return items.map((item: any) => ({
            value: item.id,
            label: item.name
          }));
        };

        setCategories(formatData(catRes));
        setBrands(formatData(brandRes));
        setUnits(formatData(unitRes));

      } catch (error) {
        console.error("Lỗi lấy dữ liệu gợi ý:", error);
      }
    };
    loadOptions();
  }, []);

  // Hàm xử lý khi chọn item từ React-Select
  const handleSelectChange = (selectedOption: any, name: string) => {
    onFilterChange({
      ...filters,
      [name]: selectedOption ? selectedOption.value : undefined
    });
  };

  // Style tùy chỉnh cho react-select để tiệp màu với CSS của bạn
  const customStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '38px',
      borderRadius: '8px',
      borderColor: '#e0e0e0',
      boxShadow: 'none',
      '&:hover': { borderColor: '#007bff' }
    })
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.stickyWrapper}>
        <h2 className={styles.title}>Bộ lọc thông minh</h2>

        {/* Danh mục */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Danh mục</label>
          <Select
            placeholder="Tìm hoặc chọn danh mục..."
            isClearable
            options={categories}
            value={categories.find(c => c.value === filters.categoryId) || null}
            onChange={(opt) => handleSelectChange(opt, 'categoryId')}
            styles={customStyles}
          />
        </div>

        {/* Nhãn hàng */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Nhãn hàng</label>
          <Select
            placeholder="Tìm hoặc chọn nhãn hàng..."
            isClearable
            options={brands}
            value={brands.find(b => b.value === filters.brandId) || null}
            onChange={(opt) => handleSelectChange(opt, 'brandId')}
            styles={customStyles}
          />
        </div>

        {/* Đơn vị tính */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Đơn vị tính</label>
          <Select
            placeholder="Tìm hoặc chọn đơn vị..."
            isClearable
            options={units}
            value={units.find(u => u.value === filters.unitId) || null}
            onChange={(opt) => handleSelectChange(opt, 'unitId')}
            styles={customStyles}
          />
        </div>

        {/* Trạng thái - Giữ nguyên select truyền thống vì ít option, hoặc dùng Select nếu muốn đồng bộ */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Trạng thái</label>
          <select
            name="isDeleted"
            className={styles.inputField}
            value={filters.isDeleted === true ? "true" : filters.isDeleted === false ? "false" : ""}
            onChange={(e) => {
              const val = e.target.value;
              const finalValue = val === "true" ? true : val === "false" ? false : undefined;
              onFilterChange({ ...filters, isDeleted: finalValue });
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