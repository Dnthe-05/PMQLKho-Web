import { useNavigate } from "react-router-dom";
import styles from "../../css/SharedLayout.module.css";

interface Props {
  data: any[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}
export default function GoodsReceiptTable({ data, onDelete, onEdit }: Props) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "---";

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.thRow}>
            <th className={styles.th}>Mã Phiếu</th>
            <th className={styles.th}>Nhà Cung Cấp</th>
            <th className={styles.th}>Nhân viên</th>
            <th className={styles.th}>Ngày Nhập</th>
            <th className={styles.th}>Tổng Tiền</th>
            <th className={styles.th}>Trạng Thái</th>
            <th className={styles.th} style={{ textAlign: "center" }}>
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>
                  <strong>{item.code}</strong>
                </td>
                <td className={styles.td}>{item.supplierName}</td>
                <td className={styles.td}>{item.employeeName}</td>
                <td className={styles.td}>{formatDate(item.createdAt)}</td>
                <td
                  className={styles.td}
                  style={{ color: "#F23A3A", fontWeight: "bold" }}
                >
                  {item.totalPrice?.toLocaleString("vi-VN")} ₫
                </td>
                <td className={styles.td}>
                  <span
                    style={{
                      background: item.status === 1 ? "#dcfce7" : "#fee2e2",
                      color: item.status === 1 ? "#16a34a" : "#dc2626",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.status === 1 ? "Hoàn thành" : "Đã hủy"}
                  </span>
                </td>
                <td className={styles.td}>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={() => navigate(`/nhap-kho/chi-tiet/${item.id}`)}
                      title="Xem"
                    >
                      👁️
                    </button>
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={() => onEdit(item.id)}
                      title="Sửa"
                    >
                      📝
                    </button>
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={() =>
                        window.confirm(`Xóa phiếu ${item.code}?`) &&
                        onDelete(item.id)
                      }
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.td} style={{ padding: "30px" }}>
                Không tìm thấy phiếu nhập kho nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
