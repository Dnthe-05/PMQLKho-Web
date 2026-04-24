import React from 'react';
import { type Product } from '../../types/Product/product';
import styles from '../../css/Product/ProductTable.module.css';
import { useNavigate } from 'react-router-dom';


const getFullImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return '/logo.png';
  if (imagePath.startsWith('http')) return imagePath;


  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  if (cleanPath.startsWith('/uploads')) {
    return cleanPath; 
  }

  return `/uploads/products${cleanPath}`;
};
interface ProductTableProps {
  data: Product[];
  loading: boolean;
  onEdit: (product: any) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  isDeleted?: boolean; 
}

const ProductTable: React.FC<ProductTableProps> = ({ data, loading, onEdit, onDelete, onRestore }) => {
  const safeData = data || [];
  const navigate = useNavigate();
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
            const isItemDeleted = item.deletedAt !== null;

            return (
              <tr 
                key={item.id} 
                className={`${styles.tr} ${isItemDeleted ? styles.rowDeleted : ''}`}
              >
                {/* Cột Ảnh - Mờ đi nếu đã xóa */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <img 
                    src={getFullImageUrl(item?.image || '')} 
                    className={styles.productImg} 
                    style={isItemDeleted ? { filter: 'grayscale(100%)', opacity: 0.5 } : {}}
                    alt={item?.name || 'product'} 
                    onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                  />
                </td>
                
                {/* trung */}
                <td className={styles.td}>
                  <div 
                    style={{ 
                      fontWeight: 600, 
                      color: isItemDeleted ? '#bfbfbf' : '#1890ff', 
                      textDecoration: isItemDeleted ? 'line-through' : 'none',
                      cursor: isItemDeleted ? 'default' : 'pointer' 
                    }}
                  
                     onClick={(e) => { e.stopPropagation(); !isItemDeleted && navigate(`/product/detail/${item.id}`); }}
                  >
                    {item.name}
                    {isItemDeleted && <span className={styles.deleteBadge}>Đã xóa</span>}
                  </div>

                  {/* SKU thì để màu xám bình thường, không cần nổi bật */}
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {item.sku}
                  </div>
                </td>
                {/* trung */}

                {/* Cột Danh mục & Nhãn hàng */}
                <td className={styles.td} style={{ textAlign: 'center', color: isItemDeleted ? '#bfbfbf' : 'inherit' }}>
                  <div style={{ fontWeight: 500 }}>{item.categoryName}</div>
                  <div style={{ fontSize: '12px', color: '#bfbfbf' }}>{item.brandName || '---'}</div>
                </td>

                {/* Cột GIÁ */}
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: isItemDeleted ? '#bfbfbf' : '#f5222d' }}>
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
                    style={isItemDeleted ? { background: '#f5f5f5', color: '#bfbfbf' } : { background: '#E6F7FF', color: '#1890FF' }}
                  >
                    {item.stockQuantity}
                  </span>
                </td>

                {/* Cột Đơn vị & Vị trí */}
                <td className={styles.td} style={{ textAlign: 'center', color: isItemDeleted ? '#bfbfbf' : 'inherit' }}>
                  <div style={{ fontWeight: 500 }}>{item.unitName}</div>
                  <div style={{ fontSize: '11px', color: '#bfbfbf' }}>{item.location || '---'}</div>
                </td>

                {/* Cột Hoạt động - Chuyển đổi giữa nút Xóa và Khôi phục */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <div className="flex justify-center gap-2">
                    {!isItemDeleted && (
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => onEdit(item)}
                      >
                        Sửa
                      </button>
                    )}

                    {isItemDeleted ? (
                      <button 
                        className={styles.actionBtn} 
                        style={{ color: '#52c41a', fontWeight: 'bold' }} 
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