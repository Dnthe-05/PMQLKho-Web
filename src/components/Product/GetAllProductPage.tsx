import React, { useState, useEffect } from 'react';
import ProductSidebar from './ProductSidebar';
import ProductTable from './ProductTable';
import { getProducts } from '../../services/Product/productService';
import { type Product } from '../../types/Product/product';
import styles from '../../css/Supplier/SupplierTable.module.css'; 

const GetAllProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State quản lý bộ lọc
  const [filters, setFilters] = useState({
    search: "",
    category: "", 
    brand: ""     
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts(filters.search, filters.category, filters.brand);
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]); 

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      {/* 1. SIDEBAR BÊN TRÁI */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <ProductSidebar onFilterChange={handleFilterChange} />
      </div>

      {/* 2. BẢNG BÊN PHẢI */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Danh sách hàng hóa</h2>
            <button className={styles.btnAddNew}>+ Thêm sản phẩm</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>
        ) : (
          <ProductTable 
            products={products} 
            onEdit={(item) => console.log("Sửa", item)} 
            onDelete={(item) => console.log("Xóa", item)} 
          />
        )}
      </div>
    </div>
  );
};

export default GetAllProductPage;