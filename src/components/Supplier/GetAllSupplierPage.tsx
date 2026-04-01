import styles from '../../css/Supplier/SupplierTable.module.css';
import SupplierTable from './SupplierTable';
import { useSuppliers } from '../../hooks/useSuppliers';

export default function SupplierPage() {
  const { suppliers, loading, query, setQuery,status,setStatus } = useSuppliers();
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontWeight: 900, marginBottom: '20px' }}>Quản Lý Nhà Cung Cấp</h2>

      <div className={styles.topActions}>
        <div className={styles.searchBox}>
          <span style={{ color: '#4A90E2', marginRight: '10px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm theo mã, tên NCC, SĐT, ..." 
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
          <select
              className={styles.statusFilter} 
              value={status.toString()} 
              onChange={(e) => {
                setStatus(e.target.value === "true");
              }}
          >
            <option value="true">Hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>
        <button className={styles.btnCreate}>+ Thêm nhà cung cấp</button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#999', fontWeight: 'bold' }}>
          ĐANG TẢI DỮ LIỆU...
        </div>
      ) : (
        <SupplierTable data={suppliers} />
      )}
    </div>
  );
}