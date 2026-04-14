import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../css/SharedLayout.module.css";
import {
  getGoodsReceiptById,
  type GoodsReceiptResponse,
} from "../../services/Warehouse/GoodsReceiptService";

export default function GoodsReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState<GoodsReceiptResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getGoodsReceiptById(Number(id));
        // Đảm bảo lấy đúng data từ axios response
        const data = (response as any).data?.data || response.data;
        setReceipt(data);
      } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
        alert("Không tìm thấy dữ liệu phiếu nhập kho!");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div
        className={styles.td}
        style={{ padding: "100px", textAlign: "center" }}
      >
        Đang tải dữ liệu...
      </div>
    );
  if (!receipt)
    return (
      <div
        className={styles.td}
        style={{ padding: "100px", textAlign: "center" }}
      >
        Không tìm thấy dữ liệu!
      </div>
    );

  // Hàm format ngày giờ theo đúng DisplayFormat của C# {0:dd/MM/yyyy HH:mm}
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

  return (
    <div className={styles.pageContainer}>
      {/* HEADER SECTION */}
      <div className={styles.topActions}>
        <div className={styles.leftActions}>
          <button className={styles.btnCreate} onClick={() => navigate(-1)}>
            &#8592; Quay lại
          </button>
          <h2 className={styles.pageTitle} style={{ marginBottom: 0 }}>
            Phiếu nhập: <span style={{ color: "#F23A3A" }}>{receipt.code}</span>
          </h2>
        </div>
        <div
          style={{
            background: "#F23A3A",
            color: "#fff",
            padding: "6px 15px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Trạng thái: {receipt.status === 1 ? "Hoàn tất" : "Lưu tạm"}
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
            📦 Thông tin phiếu nhập
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
              <strong>Nhà cung cấp:</strong> {receipt.supplierName || "N/A"}
            </p>
            <p>
              <strong>Nhân viên:</strong> {receipt.employeeName || "N/A"}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {formatDateTime(receipt.createdAt)}
            </p>
            <p>
              <strong>Cập nhật cuối:</strong>{" "}
              {formatDateTime(receipt.updatedAt)}
            </p>
            <p>
              <strong>Số mặt hàng:</strong>{" "}
              <span
                className={styles.imgBox}
                style={{
                  display: "inline-block",
                  width: "auto",
                  padding: "2px 10px",
                }}
              >
                {receipt.totalItems}
              </span>
            </p>
          </div>
          <p style={{ marginTop: "10px" }}>
            <strong>Ghi chú:</strong> {receipt.note || "---"}
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
            Tổng thanh toán
          </span>
          <h1 style={{ fontSize: "36px", color: "#F23A3A", margin: "10px 0" }}>
            {receipt.totalPrice.toLocaleString("vi-VN")} ₫
          </h1>
          <div
            style={{ fontSize: "14px", color: "#999", fontStyle: "italic" }}
          ></div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div style={{ padding: "20px" }}>
          <h3 style={{ margin: 0 }}>📋 Danh sách chi tiết vật tư</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.thRow}>
              <th className={styles.th}>STT</th>
              <th className={styles.th}>Sản phẩm</th>
              <th className={styles.th}>Số Lượng</th>
              <th className={styles.th}>Đơn Giá</th>
              <th className={styles.th}>Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {/* Phần này bạn map từ receipt.details nếu có trả về */}
            {receipt.details && receipt.details.length > 0 ? (
              receipt.details.map((item, index) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>{index + 1}</td>
                  <td className={styles.td}>
                    <div>
                      <strong>{item.productName}</strong>
                    </div>
                    <small>ID Sản phẩm: {item.productId}</small>
                  </td>
                  <td className={styles.td}>{item.quantity}</td>
                  <td className={styles.td}>
                    {item.importPrice?.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className={styles.td}>
                    {item.totalPrice?.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className={styles.td}
                  style={{ padding: "30px", color: "#999" }}
                >
                  Dữ liệu chi tiết đang được đồng bộ...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
