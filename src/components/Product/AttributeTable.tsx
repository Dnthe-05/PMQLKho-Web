import styles from '../../css/Product/AttributeTable.module.css';
import { type BaseAttribute } from '../../services/Product/productService';

interface AttributeTableProps {
  title: string;
  data: BaseAttribute[];
  onAdd: () => void;
  onEdit: (item: BaseAttribute) => void;
  onDelete: (id: number) => void;
  loading?: boolean;     
  searchTerm?: string;    
  onSearchChange?: (term: string) => void; 
}


export default function AttributeTable({ 
  title, data, onAdd, onEdit, onDelete, 
  loading, searchTerm, onSearchChange 
}: AttributeTableProps) {

  return (
    <div className={`${styles.tableContainer} ${loading ? 'opacity-50' : ''}`}>
      <div className={styles.tableHeader}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
            className={styles.searchInput}
            value={searchTerm || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <button onClick={onAdd} className={styles.btnAddMain}>+ Thêm {title} mới</button>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} style={{ width: '150px', textAlign: 'center' }}>Mã ID</th>
            <th className={styles.th} style={{ textAlign: 'left' }}>Tên {title}</th>
            <th className={styles.th} style={{ width: '220px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} className="text-center p-10">Đang tải dữ liệu...</td></tr>
          ) : data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <span className={styles.idBadge}>#{item.id}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.nameText}>{item.name}</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionGroup}>
                    <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={() => onEdit(item)}>Sửa</button>
                    <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => onDelete(item.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className={styles.emptyCell}>
                {searchTerm ? `Không tìm thấy kết quả nào` : `Trống! Chưa có dữ liệu ${title.toLowerCase()}`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}