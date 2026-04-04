import React from 'react';
import { type Product } from '../../types/Product/product';
import styles from '../../css/Product/ProductTable.module.css';

interface ProductTableProps {
  data: Product[];
  loading: boolean;
}


const ProductTable: React.FC<ProductTableProps> = ({ data, loading }) => {
  const safeData = data || [];

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} style={{ width: '80px', textAlign: 'center' }}>Ảnh</th>
            <th className={styles.th}>Sản phẩm / SKU</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Danh mục / Nhãn</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>Giá Bán / Nhập</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Tồn kho</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Đơn vị / Vị trí</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {safeData.map((item: any) => (
            <tr key={item.id} className={styles.tr}>
              {/* Cột Ảnh */}
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <img src={item.image || 'https://via.placeholder.com/44'} className={styles.productImg} alt="product" />
              </td>

              {/* Cột Tên & SKU */}
              <td className={styles.td}>
                <div style={{ fontWeight: 600, color: '#262626' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.sku}</div>
              </td>

              {/* Cột Danh mục & Nhãn hàng */}
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 500 }}>{item.categoryName}</div>
                <div style={{ fontSize: '12px', color: '#bfbfbf' }}>{item.brandName || '---'}</div>
              </td>

              {/* Cột GIÁ (Vốn/Bán) - Chỗ con cần đây! */}
              <td className={styles.td} style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#f5222d' }}>
                   {item.exportPrice?.toLocaleString()}đ
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c', textDecoration: 'none' }}>
                   Vốn: {item.importPrice?.toLocaleString()}đ
                </div>
              </td>

              {/* Cột Tồn kho */}
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <span className={styles.stockBadge} style={{ background: '#E6F7FF', color: '#1890FF' }}>
                  {item.stockQuantity}
                </span>
              </td>

              {/* Cột Đơn vị & Vị trí */}
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 500 }}>{item.unitName}</div>
                <div style={{ fontSize: '11px', color: '#bfbfbf' }}>{item.location || 'Kho A'}</div>
              </td>

              {/* Hoạt động */}
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <div className="flex justify-center gap-2">
                  <button className={styles.actionBtn}>Sửa</button>
                  <button className={styles.actionBtn} style={{ color: '#ff4d4f' }}>Xóa</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;