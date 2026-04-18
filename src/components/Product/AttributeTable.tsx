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
            <th className={styles.th} style={{ width: '120px', textAlign: 'center' }}>Mã ID</th>
            <th className={styles.th} style={{ textAlign: 'left' }}>Tên {title}</th>
            {title === 'Thuộc tính' && (
              <th className={styles.th} style={{ width: '160px', textAlign: 'center' }}>Đơn vị</th>
            )}
            <th className={styles.th} style={{ width: '220px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={title === 'Thuộc tính' ? 4 : 3} className="text-center p-10">Đang tải dữ liệu...</td></tr>
          ) : data && data.length > 0 ? (
            data.map((item: any) => {
              // Kiểm tra xem mục này đã bị xóa mềm chưa
              const isDeleted = item.deletedAt !== null && item.deletedAt !== undefined;
              const itemId = item.id || item.Id;

              return (
                <tr key={itemId} className={`${styles.tr} ${isDeleted ? styles.rowDeleted : ''}`}>
                  <td className={styles.td} style={{ textAlign: 'center' }}>
                    <span className={styles.idBadge}>#{itemId}</span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.nameWrapper}>
                      {/* Tên chính */}
                      <div className={styles.mainNameRow}>
                        <span className={styles.nameText}>{item.name || item.Name}</span>
                        {isDeleted && <span className={styles.deletedTag}>Đã xóa</span>}
                      </div>
                      
                      {/* Hiển thị Parent Name nếu có, fallback về parentId nếu cần */}
                      {(item.parentName || item.parent?.name || item.parentId) && (
                        <div className={styles.parentText}>
                          {item.parentName || item.parent?.name || `#${item.parentId}`}
                        </div>
                      )}
                    </div>
                  </td>
                  {title === 'Thuộc tính' && (
                    <td className={`${styles.td} ${styles.unitCell}`}>
                      {item.unit || item.Unit || '-'}
                    </td>
                  )}
                  <td className={styles.td}>
                    <div className={styles.actionGroup}>
                      {!isDeleted ? (
                        <>
                          <button 
                            className={`${styles.actionBtn} ${styles.btnEdit}`} 
                            onClick={() => onEdit(item)}
                          >
                            Sửa
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.btnDelete}`} 
                            onClick={() => onDelete(itemId)}
                          >
                            Xóa
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={title === 'Thuộc tính' ? 4 : 3} className={styles.emptyCell}>
                {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : `Chưa có dữ liệu ${title.toLowerCase()}`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}