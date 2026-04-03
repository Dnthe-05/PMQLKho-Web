import React from 'react';
import { type Product } from '../../types/Product/product';
import styles from '../../css/Supplier/SupplierTable.module.css'; 

interface ProductTableProps {
  products: Product[]; // Đã sửa tên từ data thành products
  onEdit: (item: Product) => void;
  onDelete: (item: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.thRow}>
            <th className={styles.th}>STT</th>
            <th className={styles.th}>Hình ảnh</th>
            <th className={styles.th}>SKU</th>
            <th className={styles.th}>Tên sản phẩm</th>
            <th className={styles.th}>Giá nhập</th>
            <th className={styles.th}>Giá xuất</th>
            <th className={styles.th}>Tồn kho</th>
            <th className={styles.th}>Danh mục</th>
            <th className={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item, index) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}><div>{index + 1}</div></td>
                <td className={styles.td}>
                  <img 
                    src={item.image || 'https://via.placeholder.com/45'} 
                    alt={item.name} 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td className={styles.td} style={{ fontWeight: 'bold' }}>{item.sku}</td>
                <td className={styles.td} style={{ textAlign: 'left' }}>{item.name}</td>
                <td className={styles.td}>{item.importPrice.toLocaleString('vi-VN')} đ</td>
                <td className={styles.td} style={{ color: '#F23A3A', fontWeight: 'bold' }}>
                    {item.exportPrice.toLocaleString('vi-VN')} đ
                </td>
                <td className={styles.td}>{item.stockQuantity}</td>
                <td className={styles.td}>{item.categoryName}</td>
                <td className={styles.td}>
                  <div className={styles.actionWrapper}>
                    <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={() => onEdit(item)}>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => onDelete(item)}>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={9} style={{textAlign: 'center', padding: '20px'}}>Không có sản phẩm nào.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;