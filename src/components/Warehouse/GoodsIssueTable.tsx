import { useNavigate } from "react-router-dom";
import styles from "../../css/SharedLayout.module.css";

interface Props {
  data: any[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function GoodsIssueTable({ data, onDelete, onEdit }: Props) {
  const navigate = useNavigate();
  const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN");

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.thRow}>
            <th className={styles.th}>Mã Phiếu Xuất</th>
            <th className={styles.th}>Khách Hàng</th>
            <th className={styles.th}>Ngày Xuất</th>
            <th className={styles.th}>Tổng Tiền</th>
            <th className={styles.th}>Trạng Thái</th>
            <th className={styles.th} style={{ textAlign: "center" }}>
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className={styles.tr}>
              <td className={styles.td}>
                <strong>{item.code}</strong>
              </td>
              <td className={styles.td}>
                {item.customerName || `ID: ${item.customerId}`}
              </td>
              <td className={styles.td}>{formatDate(item.issueDate)}</td>
              <td
                className={styles.td}
                style={{ color: "#F23A3A", fontWeight: "bold" }}
              >
                {item.totalPrice?.toLocaleString()} ₫
              </td>
              <td className={styles.td}>
                <span
                  style={{
                    background: item.deletedAt ? "#fee2e2" : "#dcfce7",
                    color: item.deletedAt ? "#dc2626" : "#16a34a",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {item.deletedAt ? "Đã hủy" : "Hoàn thành"}
                </span>
              </td>
              <td className={styles.td}>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => navigate(`/xuat-kho/chi-tiet/${item.id}`)}
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
                    disabled={!!item.deletedAt}
                    onClick={() =>
                      window.confirm("Xác nhận hủy phiếu xuất?") &&
                      onDelete(item.id)
                    }
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
