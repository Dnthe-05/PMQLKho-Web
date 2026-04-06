import React from 'react';
import { type Product } from '../../types/Product/product';
import styles from '../../css/Product/ProductTable.module.css';

interface ProductTableProps {
  data: Product[];
  loading: boolean;
  onEdit: (product: any) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ data, loading, onEdit, onDelete, onRestore }) => {
  const safeData = data || [];

  if (loading) return <div className="text-center p-5">Đang tải dữ liệu...</div>;

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
          {safeData.map((item: any) => {
            // Check trạng thái xóa dựa trên DeletedAt từ Backend
            const isDeleted = item.deletedAt !== null;

            return (
              <tr 
                key={item.id} 
                className={`${styles.tr} ${isDeleted ? styles.rowDeleted : ''}`}
              >
                {/* Cột Ảnh */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <img 
                    src={item.image || '/logo.png'} 
                    className={styles.productImg} 
                    style={isDeleted ? { filter: 'grayscale(100%)', opacity: 0.6 } : {}}
                    alt="product" 
                  />
                </td>

                {/* Cột Tên & SKU */}
                <td className={styles.td}>
                  <div style={{ 
                    fontWeight: 600, 
                    color: isDeleted ? '#bfbfbf' : '#262626',
                    textDecoration: isDeleted ? 'line-through' : 'none' 
                  }}>
                    {item.name}
                    {isDeleted && <span className={styles.deleteBadge}>Đã xóa</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.sku}</div>
                </td>

                {/* Cột Danh mục & Nhãn hàng */}
                <td className={styles.td} style={{ textAlign: 'center', color: isDeleted ? '#bfbfbf' : 'inherit' }}>
                  <div style={{ fontWeight: 500 }}>{item.categoryName}</div>
                  <div style={{ fontSize: '12px', color: '#bfbfbf' }}>{item.brandName || '---'}</div>
                </td>

                {/* Cột GIÁ */}
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: isDeleted ? '#bfbfbf' : '#f5222d' }}>
                    {item.exportPrice?.toLocaleString()}đ
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    Vốn: {item.importPrice?.toLocaleString()}đ
                  </div>
                </td>

                {/* Cột Tồn kho */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <span 
                    className={styles.stockBadge} 
                    style={isDeleted ? { background: '#f5f5f5', color: '#bfbfbf' } : { background: '#E6F7FF', color: '#1890FF' }}
                  >
                    {item.stockQuantity}
                  </span>
                </td>

                {/* Cột Đơn vị & Vị trí */}
                <td className={styles.td} style={{ textAlign: 'center', color: isDeleted ? '#bfbfbf' : 'inherit' }}>
                  <div style={{ fontWeight: 500 }}>{item.unitName}</div>
                  <div style={{ fontSize: '11px', color: '#bfbfbf' }}>{item.location || '---'}</div>
                </td>

                {/* Hoạt động - Sửa logic Nút bấm theo yêu cầu của con */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <div className="flex justify-center gap-2">
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => onEdit(item)}
                    >
                      Sửa
                    </button>

                    {isDeleted ? (
                      <button 
                        className={styles.actionBtn} 
                        style={{ color: '#52c41a' }} 
                        onClick={() => onRestore(item.id)}
                      >
                        Khôi phục
                      </button>
                    ) : (
                      <button 
                        className={styles.actionBtn} 
                        style={{ color: '#ff4d4f' }} 
                        onClick={() => onDelete(item.id)}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;