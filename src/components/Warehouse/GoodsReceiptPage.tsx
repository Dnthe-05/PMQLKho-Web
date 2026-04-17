import { useState } from "react";
import styles from "../../css/SharedLayout.module.css";
import { useGoodsReceipts } from "../../hooks/useGoodsReceipts";
import GoodsReceiptTable from "./GoodsReceiptTable";
import Pagination from "../Pagination";
import AddGoodsReceiptForm from "./AddGoodsReceiptForm";
import { deleteGoodsReceipt } from "../../services/Warehouse/GoodsReceiptService";
import EditGoodsReceiptForm from "./EditGoodsReceiptForm";

export default function GoodsReceiptPage({ user }: { user: any }) {
  // --- TẤT CẢ STATE PHẢI ĐƯA VÀO TRONG NÀY ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    receipts,
    loading,
    query,
    setQuery,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    refresh,
  } = useGoodsReceipts();

  // Logic phân trang tại Client
  const safeReceipts = Array.isArray(receipts) ? receipts : [];
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = safeReceipts.slice(indexOfFirstItem, indexOfLastItem);

  // Logic XỬ LÝ XÓA
  const handleDelete = async (id: number) => {
    try {
      await deleteGoodsReceipt(id);
      alert("Xóa phiếu nhập thành công!");
      refresh();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể xóa phiếu này";
      alert(msg);
    }
  };

  // Logic XỬ LÝ SỬA
  const handleEdit = (id: number) => {
    setSelectedReceiptId(id);
    setIsEditModalOpen(true);
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Quản Lý Nhập Kho</h2>
      <div className={styles.topActions}>
        <div className={styles.leftActions}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Tìm mã phiếu, nhà cung cấp..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            className={styles.statusFilter}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Hàng mới</option>
            <option value="2">Hàng cũ</option>
            <option value="3">Hàng lỗi</option>
            <option value="0">Đã hủy</option>
          </select>
        </div>

        <button
          className={styles.btnCreate}
          onClick={() => setIsModalOpen(true)}
        >
          + Tạo phiếu nhập
        </button>
      </div>

      <AddGoodsReceiptForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refresh();
          setIsModalOpen(false);
        }}
        user={user} // 'user' này lấy từ props của GoodsReceiptPage hoặc localStorage
      />
      {/* Hiển thị dữ liệu */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          Đang tải dữ liệu nhập kho...
        </div>
      ) : (
        <>
          <GoodsReceiptTable
            data={currentData}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          {/* Modal Sửa */}
          <EditGoodsReceiptForm
            isOpen={isEditModalOpen}
            receiptId={selectedReceiptId}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedReceiptId(null);
            }}
            onSuccess={refresh}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={safeReceipts.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </>
      )}
    </div>
  );
}
