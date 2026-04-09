import { useState } from 'react';
import styles from '../../css/SharedLayout.module.css'; 
import WarrantyTable from './WarrantyTable';
import Pagination from '../Pagination';
import { useWarranties } from '../../hooks/useWarranties';
import AddWarrantyForm from './AddWarrantyFrom';

export default function WarrantyPage() {
  const { 
    warranties, loading, query, setQuery, status, setStatus, 
    currentPage, setCurrentPage, pageSize, refresh 
  } = useWarranties();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const safeWarranties = Array.isArray(warranties) ? warranties : [];
  const currentData = safeWarranties.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
    <div className={styles.pageContainer}>
      
      <h2 className={styles.pageTitle}>Quản Lý Bảo Hành</h2>

      <div className={styles.topActions}>
        <div className={styles.leftActions}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Tìm theo mã, tên KH, SĐT, ..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Tiếp nhận</option>
            <option value="2">Đang xử lý</option>
            <option value="3">Hoàn thành</option>
            <option value="4">Hủy</option>
          </select>
        </div>

        <button className={styles.btnCreate} onClick={() => setIsModalOpen(true)}>
            + Tạo phiếu bảo hành
          </button>
          
          <AddWarrantyForm 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
           onSuccess={refresh}
          />
        </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>Đang tải...</div>
      ) : (
        <>
          <WarrantyTable data={currentData}/>
          <Pagination 
            currentPage={currentPage}
            totalItems={safeWarranties.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </>
        
      )}
    </div>
    </>
  );
}