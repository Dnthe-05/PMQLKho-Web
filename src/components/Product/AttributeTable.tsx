import React, { useState } from 'react';
import styles from '../../css/Product/AttributeTable.module.css';
import { type BaseAttribute } from '../../services/Product/productService';

interface AttributeTableProps {
  title: string; // Truyền vào "Danh mục", "Thương hiệu",...
  data: BaseAttribute[];
  onAdd: () => void;
  onEdit: (item: BaseAttribute) => void;
  onDelete: (id: number) => void;
}

export default function AttributeTable({ title, data, onAdd, onEdit, onDelete }: AttributeTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Bộ lọc tìm kiếm
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.toString().includes(searchTerm)
  );

  return (
    <div className={styles.tableContainer}>
      {/* Header chứa Search và Button Thêm */}
      <div className={styles.tableHeader}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>✕</button>
          )}
        </div>

        <button onClick={onAdd} className={styles.btnAddMain}>
          + Thêm {title} mới
        </button>
      </div>

      {/* Bảng hiển thị */}
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} style={{ width: '150px', textAlign: 'center' }}>Mã ID</th>
            <th className={styles.th} style={{ textAlign: 'left' }}>Tên {title}</th>
            <th className={styles.th} style={{ width: '220px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <span className={styles.idBadge}>#{item.id}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.nameText}>{item.name}</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionGroup}>
                    <button 
                      className={`${styles.actionBtn} ${styles.btnEdit}`} 
                      onClick={() => onEdit(item)}
                    >
                      Sửa
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.btnDelete}`} 
                      onClick={() => onDelete(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className={styles.emptyCell}>
                {searchTerm 
                  ? `Không tìm thấy ${title.toLowerCase()} nào khớp với "${searchTerm}"` 
                  : `Trống! Chưa có dữ liệu ${title.toLowerCase()}`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}