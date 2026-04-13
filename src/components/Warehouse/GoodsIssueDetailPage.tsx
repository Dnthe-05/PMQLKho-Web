import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../css/SharedLayout.module.css";
import { getGoodsIssueById } from "../../services/Warehouse/GoodsIssueService";

export default function GoodsIssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getGoodsIssueById(id!);
        // Đảm bảo lấy đúng data từ axios response tương tự phiếu nhập
        const data = (response as any).data?.data || response.data;
        setIssue(data);
      } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
        alert("Không tìm thấy dữ liệu phiếu xuất kho!");
        navigate("/xuat-kho");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, navigate]);

  // Hàm format ngày giờ đồng bộ
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "---";
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div
        className={styles.td}
        style={{ padding: "100px", textAlign: "center" }}
      >
        Đang tải dữ liệu...
      </div>
    );

  if (!issue)
    return (
      <div
        className={styles.td}
        style={{ padding: "100px", textAlign: "center" }}
      >
        Không tìm thấy dữ liệu!
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      {/* HEADER SECTION */}
      <div className={styles.topActions}>
        <div className={styles.leftActions}>
          <button className={styles.btnCreate} onClick={() => navigate(-1)}>
            &#8592; Quay lại
          </button>
          <h2 className={styles.pageTitle} style={{ marginBottom: 0 }}>
            Phiếu xuất: <span style={{ color: "#F23A3A" }}>{issue.code}</span>
          </h2>
        </div>
        <div
          style={{
            background: issue.status === 0 ? "#999" : "#F23A3A",
            color: "#fff",
            padding: "6px 15px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Trạng thái: {issue.status === 1 ? "Hoàn tất" : "Đã hủy"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {/* CARD 1: THÔNG TIN CHUNG */}
        <div className={styles.tableCard} style={{ padding: "20px" }}>
          <h3
            style={{
              marginTop: 0,
              color: "#333",
              borderBottom: "2px solid #F23A3A",
              width: "fit-content",
              paddingBottom: "5px",
            }}
          >
            📄 Thông tin phiếu xuất
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <p>
              <strong>Khách hàng:</strong> {issue.customerName || "Khách lẻ"}
            </p>
            <p>
              <strong>Nhân viên lập:</strong> {issue.employeeName || "N/A"}
            </p>
            <p>
              <strong>Ngày xuất:</strong>{" "}
              {formatDateTime(issue.issueDate || issue.createdAt)}
            </p>
            <p>
              <strong>SĐT:</strong> {issue.phone || "---"}
            </p>
          </div>
          <p style={{ marginTop: "10px" }}>
            <strong>Ghi chú:</strong> {issue.note || "---"}
          </p>
        </div>

        {/* CARD 2: TỔNG KẾT TÀI CHÍNH */}
        <div
          className={styles.tableCard}
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff9f9",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            TỔNG GIÁ TRỊ XUẤT
          </span>
          <h1 style={{ fontSize: "36px", color: "#F23A3A", margin: "10px 0" }}>
            {issue.totalPrice?.toLocaleString("vi-VN")} ₫
          </h1>
          {/* <div style={{ fontSize: "14px", color: "#999", fontStyle: "italic" }}>
            Bao gồm thuế và phí (nếu có)
          </div> */}
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className={styles.tableCard}>
        <div style={{ padding: "20px" }}>
          <h3 style={{ margin: 0 }}>📋 Danh sách chi tiết vật tư xuất kho</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.thRow}>
              <th className={styles.th}>STT</th>
              <th className={styles.th}>Sản phẩm</th>
              <th className={styles.th}>Số Lượng</th>
              <th className={styles.th}>Đơn Giá Xuất</th>
              <th className={styles.th}>Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {issue.details && issue.details.length > 0 ? (
              issue.details.map((item: any, index: number) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>{index + 1}</td>
                  <td className={styles.td}>
                    <div>
                      <strong>{item.productName}</strong>
                    </div>
                    <small style={{ color: "#888" }}>
                      Mã SP: {item.productId}
                    </small>
                  </td>
                  <td className={styles.td} style={{ textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td className={styles.td} style={{ textAlign: "center" }}>
                    {item.exportPrice?.toLocaleString("vi-VN")} ₫
                  </td>
                  <td
                    className={styles.td}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {item.totalPrice?.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className={styles.td}
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  Không có dữ liệu chi tiết sản phẩm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
