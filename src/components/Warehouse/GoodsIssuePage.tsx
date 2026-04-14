import { useState } from "react"; // Đã mở comment
import styles from "../../css/SharedLayout.module.css";
import { useGoodsIssues } from "../../hooks/useGoodsIssues";
import GoodsIssueTable from "./GoodsIssueTable";
import Pagination from "../Pagination";
import { deleteGoodsIssue } from "../../services/Warehouse/GoodsIssueService";
import AddGoodsIssueForm from "./AddGoodsIssueFrom"; // Import Modal thêm mới
import EditGoodsIssueForm from "./EditGoodsIssueForm"; // Thêm dòng này

export default function GoodsIssuePage({ user }: { user: any }) {
  const {
    issues,
    loading,
    query,
    setQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    refresh,
  } = useGoodsIssues();

  // State quản lý việc đóng/mở Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const handleDelete = async (id: number) => {
    //if (!window.confirm("Bạn có chắc chắn muốn hủy phiếu xuất này?")) return;

    try {
      await deleteGoodsIssue(id);
      alert("Hủy phiếu xuất thành công!");
      refresh();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi hủy phiếu");
    }
  };

  // Xử lý dữ liệu an toàn từ API (hỗ trợ cả PageDTO và Array)
  const safeIssues = Array.isArray(issues)
    ? issues
    : (issues as any)?.items || [];

  // Logic phân trang tại Client (nếu API chưa phân trang ở Server)
  const currentData = safeIssues.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  // Trong GoodsIssuePage.tsx
  const handleEdit = (id: number) => {
    console.log("ID được chọn để sửa:", id); // Kiểm tra xem ID có phải là số hợp lệ không
    setSelectedIssueId(id);
    setIsEditModalOpen(true);
  };
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Quản Lý Xuất Kho</h2>

      <div className={styles.topActions}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm mã phiếu, khách hàng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button
          className={styles.btnCreate}
          onClick={() => setIsModalOpen(true)}
        >
          + Tạo phiếu xuất
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <GoodsIssueTable
            data={currentData}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={safeIssues.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </>
      )}

      {/* Modal thêm mới phiếu xuất kho */}
      <AddGoodsIssueForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refresh();
          setIsModalOpen(false);
        }}
        user={user} // THÊM DÒNG NÀY ĐỂ TRUYỀN USER VÀO
      />
      <EditGoodsIssueForm
        isOpen={isEditModalOpen}
        issueId={selectedIssueId}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedIssueId(null);
        }}
        onSuccess={() => {
          refresh();
          setIsEditModalOpen(false);
        }}
        user={user}
      />
    </div>
  );
}
