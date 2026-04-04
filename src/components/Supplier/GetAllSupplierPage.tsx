import { useState } from 'react';
import AddSupplierForm from './AddSupplierForm';
import styles from '../../css/SharedLayout.module.css'; 
import SupplierTable from './SupplierTable';
import { useSuppliers } from '../../hooks/useSuppliers';
import { type Supplier } from '../../types/Supplier/supplier';
import EditSupplierForm from './EditSupplierForm';
import { deleteSupplier } from '../../services/Supplier/supplierService';
import ConfirmModal from '../ConfirmModal';
import Pagination from '../Pagination';
export default function SupplierPage() {
  const { suppliers, loading, query, setQuery,status,setStatus,currentPage, setCurrentPage, pageSize,refresh} = useSuppliers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [targetSupplier, setTargetSupplier] = useState<Supplier | null>(null);
  //dữ liệu
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const safesupplier = Array.isArray(suppliers) ? suppliers : [];
  const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
  const handleEdit = (supplier: Supplier) => {
  setSelectedSupplier(supplier);
  setIsEditOpen(true);
  }
  const handleDeleteClick = (supplier: Supplier) => {
    setTargetSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetSupplier) return;
    try {
      await deleteSupplier(targetSupplier.idNcc);
      alert(targetSupplier.isActive ? "Xóa thành công!" : "Khôi phục thành công!");
      refresh();
    } catch (error) {
      alert("Có lỗi xảy ra khi thực hiện thao tác này.");
    } finally {
      setIsDeleteModalOpen(false);
      setTargetSupplier(null);
    }
  };
  return (
    <>
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Quản Lý Nhà Cung Cấp</h2>

      <div className={styles.topActions}>
        <div className={styles.leftActions}>
        <div className={styles.searchBox}>
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
        </div>
        <button className={styles.btnCreate} onClick={() => setIsModalOpen(true)}>+ Thêm nhà cung cấp</button>
        <AddSupplierForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refresh} />
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#999', fontWeight: 'bold' }}>
          ĐANG TẢI DỮ LIỆU...
        </div>
      ) : (
        <SupplierTable data={currentItems} onEdit={handleEdit} onDelete={handleDeleteClick}/>
      )}
      <EditSupplierForm isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setSelectedSupplier(null);
        }} 
        onSuccess={refresh} 
        supplier={selectedSupplier} 
      />
    </div>
    <div className={styles.paginationFooter}>
        <Pagination 
          currentPage={currentPage}
          totalItems={safesupplier.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title={targetSupplier?.isActive ? "Xác nhận xóa" : "Xác nhận khôi phục"}
        message={
          targetSupplier?.isActive 
          ? `Bạn có chắc chắn muốn xóa nhà cung cấp ${targetSupplier?.nameNcc}?`
          : `Bạn có chắc chắn muốn khôi phục nhà cung cấp ${targetSupplier?.nameNcc}?`
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
  </>
  );
}