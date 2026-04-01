import React from 'react';
import {type Supplier } from '../../types/Supplier/supplier';
import styles from '../../css/Supplier/SupplierTable.module.css';

interface SupplierTableProps {
  data: Supplier[];
}

const SupplierTable: React.FC<SupplierTableProps> = ({ data }) => {
  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.thRow}>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Mã NCC</th>
            <th className={styles.th}>Tên nhà cung cấp</th>
            <th className={styles.th}>Số điện thoại</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Địa chỉ</th>
            <th className={styles.th}>Tổng giá trị</th>
            <th className={styles.th}>Trạng thái</th>
            <th className={styles.th}>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item,index) => (
              <tr key={item.idNcc} className={styles.tr}>
                <td className={styles.td}><div>{index + 1}</div></td>
                <td className={styles.td} style={{ fontWeight: 'bold' }}>{item.maNcc}</td>
                <td className={styles.td} style={{ textAlign: 'left' }}>{item.nameNcc}</td>
                <td className={styles.td}>{item.phoneNcc}</td>
                <td className={styles.td}>{item.emailNcc}</td>
                <td className={styles.td} style={{ textAlign: 'left', fontSize: '13px' }}>{item.addressNcc}</td>
                <td className={styles.td} style={{ color: '#F23A3A', fontWeight: 'bold' }}>
                  {(item.totalValue ?? 0).toLocaleString('vi-VN')} đ
                </td>
                <td className={styles.td}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: item.isActive ? '#e6f4ea' : '#fce8e6',
                    color: item.isActive ? '#1e7e34' : '#d93025'
                  }}>
                    {item.isActive ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </td>
                <td className={styles.td}>
                    <div className={styles.actionWrapper}>
                      <button className={`${styles.btnAction} ${styles.btnEdit}`} title="Cập nhật">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>

                      <button className={`${styles.btnAction} ${styles.btnDelete}`} title="Xóa tạm thời">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                </td>
              </tr>
              
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                Không tìm thấy dữ liệu nhà cung cấp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default SupplierTable;