import React from 'react';
import styles from '../css/Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const visiblePages = [];
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.paginationWrapper}>
      {/* Về đầu trang */}
      <button 
        className={styles.pageBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        title="Trang đầu"
      >
        &laquo;&laquo;
      </button>

      {/* Trước */}
      <button 
        className={styles.pageBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Trước
      </button>

      {visiblePages[0] > 1 && <span className={styles.dots}>...</span>}

      {visiblePages.map(p => (
        <button
          key={p}
          className={`${styles.pageBtn} ${currentPage === p ? styles.active : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && <span className={styles.dots}>...</span>}

      <button 
        className={styles.pageBtn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Sau
      </button>

      <button 
        className={styles.pageBtn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        title="Trang cuối"
      >
        &raquo;&raquo;
      </button>
    </div>
  );
};

export default Pagination;