import React, { useState, useEffect } from "react";
import styles from "../../css/SharedForm.module.css";
import {
  getGoodsIssueById,
  updateGoodsIssue,
} from "../../services/Warehouse/GoodsIssueService";
import { scanSerialNumber } from "../../services/SerialNumber/SerialNumberService";

interface EditGoodsIssueFormProps {
  isOpen: boolean;
  issueId: number | null;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

export default function EditGoodsIssueForm({
  isOpen,
  issueId,
  onClose,
  onSuccess,
}: EditGoodsIssueFormProps) {
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [serialInput, setSerialInput] = useState("");
  const [details, setDetails] = useState<any[]>([]);
  const [scannedSerials, setScannedSerials] = useState<string[]>([]);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 1. Load dữ liệu phiếu cũ
  useEffect(() => {
    // Kiểm tra issueId phải có giá trị thực
    if (isOpen && issueId) {
      console.log("Đang gọi API cho ID:", issueId); // Kiểm tra log này có chạy không
      setIsLoadingData(true);

      getGoodsIssueById(issueId) // Không cần .toString() nếu API nhận số
        .then((res: any) => {
          // Lấy data an toàn
          const data = res.data?.data || res.data || res;

          if (!data || !data.code) {
            console.error("Dữ liệu API trả về rỗng hoặc sai cấu trúc:", data);
            return;
          }

          console.log("Dữ liệu nhận được từ API:", data);

          setCode(data.code);
          setNote(data.note || "");
          setCustomerName(
            data.customerName || data.guestFullName || "Khách lẻ",
          );
          setEmployeeName(data.employeeName || "N/A");

          const allSerials: string[] = [];
          const rawDetails = data.details || data.Details || [];

          const formattedDetails = rawDetails.map((d: any) => {
            // Lấy đúng trường SerialNumbers bạn đã định nghĩa trong DTO C#
            const serialsInDetail = d.serialNumbers || d.SerialNumbers || [];
            allSerials.push(...serialsInDetail);

            return {
              productId: d.productId,
              productName: d.productName,
              serials: serialsInDetail,
              price: d.exportPrice || d.importPrice || 0,
              quantity: d.quantity || serialsInDetail.length,
            };
          });

          setDetails(formattedDetails);
          setScannedSerials(allSerials);
        })
        .catch((err) => {
          console.error("Lỗi tải chi tiết phiếu xuất:", err);
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [isOpen, issueId]); // Chú ý dependency

  if (!isOpen) return null;

  // 2. Xử lý quét thêm Serial (Backend sẽ trừ kho những mã mới này)
  const handleAddSerial = async () => {
    const sTrim = serialInput.trim();
    if (!sTrim) return;

    if (scannedSerials.includes(sTrim)) {
      alert("Mã Serial này đã có trong danh sách!");
      setSerialInput("");
      return;
    }

    try {
      const response = await scanSerialNumber(sTrim);
      const product = (response as any).data?.data || response.data;

      setScannedSerials((prev) => [...prev, sTrim]);
      setDetails((prevDetails) => {
        const idx = prevDetails.findIndex(
          (item) => item.productId === product.productId,
        );
        if (idx !== -1) {
          const updated = [...prevDetails];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + 1,
            serials: [...updated[idx].serials, sTrim],
          };
          return updated;
        }
        return [
          {
            ...product,
            quantity: 1,
            serials: [sTrim],
            price: product.importPrice,
          },
          ...prevDetails,
        ];
      });
      setActiveProductId(product.productId);
      setSerialInput("");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Serial không hợp lệ hoặc đã xuất!",
      );
      setSerialInput("");
    }
  };

  // 3. Xử lý xóa Serial/Sản phẩm (Backend sẽ cộng lại kho những mã bị mất đi)
  const removeProduct = (productId: number) => {
    if (
      !window.confirm(
        "Xác nhận xóa sản phẩm này? Hệ thống sẽ hoàn lại tồn kho khi lưu.",
      )
    )
      return;
    const prod = details.find((d) => d.productId === productId);
    if (prod) {
      setScannedSerials((prev) =>
        prev.filter((s) => !prod.serials.includes(s)),
      );
      setDetails((prev) => prev.filter((d) => d.productId !== productId));
      if (activeProductId === productId) setActiveProductId(null);
    }
  };

  // 4. Gửi dữ liệu cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedSerials.length === 0)
      return alert("Phiếu xuất phải có ít nhất 1 sản phẩm!");

    setIsSubmitting(true);
    try {
      const payload = {
        note: note.trim(),
        serialNumbers: scannedSerials, // Backend so khớp danh sách này với Database
      };

      await updateGoodsIssue(issueId!, payload);
      alert("Cập nhật phiếu xuất thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        style={{
          width: "85vw",
          maxWidth: "1300px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "95vh",
        }}
      >
        <div
          className={styles.modalHeader}
          style={{ borderBottom: "1px solid #eee", padding: "15px 20px" }}
        >
          <h2 className={styles.modalTitle}>
            Chỉnh sửa phiếu: <span style={{ color: "#F23A3A" }}>{code}</span>
          </h2>
          <button
            type="button"
            className={styles.btnCloseHeader}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {isLoadingData ? (
          <div style={{ padding: "100px", textAlign: "center", color: "#666" }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flex: 1, overflow: "hidden" }}
          >
            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
            <div
              style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                borderRight: "1px solid #eee",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  marginBottom: "15px",
                  color: "#666",
                  fontWeight: "bold",
                }}
              >
                Sản phẩm trong phiếu
              </h3>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead
                    style={{
                      background: "#f8f9fa",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontSize: "13px",
                        }}
                      >
                        Sản phẩm/SKU
                      </th>
                      <th style={{ textAlign: "center", fontSize: "13px" }}>
                        Giá xuất
                      </th>
                      <th style={{ textAlign: "center", fontSize: "13px" }}>
                        SL
                      </th>
                      <th style={{ textAlign: "center", fontSize: "13px" }}>
                        Xóa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((item) => (
                      <tr
                        key={item.productId}
                        onClick={() => setActiveProductId(item.productId)}
                        style={{
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                          backgroundColor:
                            activeProductId === item.productId
                              ? "#fff5f5"
                              : "transparent",
                        }}
                      >
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "14px",
                              color:
                                activeProductId === item.productId
                                  ? "#F23A3A"
                                  : "#333",
                            }}
                          >
                            {item.productName}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                              marginTop: "6px",
                            }}
                          >
                            {item.serials.map((s: string) => (
                              <span
                                key={s}
                                style={{
                                  background: "#f0f0f0",
                                  border: "1px solid #ddd",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  fontSize: "10px",
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ textAlign: "center", fontSize: "14px" }}>
                          {item.price?.toLocaleString()} ₫
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <b
                            style={{
                              background: "#F23A3A",
                              color: "white",
                              padding: "2px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                            }}
                          >
                            {item.quantity}
                          </b>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProduct(item.productId);
                            }}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN PHIẾU */}
            <div
              style={{
                width: "380px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "15px",
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    border: "1px solid #eee",
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                    <strong>Khách hàng:</strong> {customerName}
                  </p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                    <strong>Nhân viên:</strong> {employeeName}
                  </p>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    <strong>Mã phiếu:</strong> {code}
                  </p>
                </div>

                <div
                  className={styles.formGroup}
                  style={{ marginBottom: "20px" }}
                >
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>
                    Ghi chú điều chỉnh
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Lý do thay đổi..."
                    style={{
                      width: "100%",
                      height: "80px",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      fontSize: "13px",
                    }}
                  />
                </div>

                <div
                  style={{
                    background: "#fff5f5",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #F23A3A",
                  }}
                >
                  <label
                    style={{
                      color: "#F23A3A",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    QUÉT THÊM SERIAL MỚI
                  </label>
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                  >
                    <input
                      type="text"
                      value={serialInput}
                      placeholder="Quét mã..."
                      onChange={(e) => setSerialInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSerial())
                      }
                      style={{
                        flex: 1,
                        border: "2px solid #F23A3A",
                        padding: "8px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSerial}
                      style={{
                        background: "#F23A3A",
                        color: "white",
                        padding: "0 15px",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "11px",
                      marginTop: "10px",
                      lineHeight: "1.4",
                    }}
                  >
                    * Việc <b>Xóa</b> sản phẩm ở bảng bên trái sẽ khiến mã
                    Serial đó được giải phóng và cộng lại vào tồn kho khi bạn
                    nhấn <b>Cập nhật</b>.
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: "15px 20px",
                  borderTop: "1px solid #eee",
                  backgroundColor: "#fff",
                }}
              >
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#F23A3A",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {isSubmitting ? "ĐANG LƯU..." : "XÁC NHẬN CẬP NHẬT"}
                </button>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={onClose}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "none",
                    color: "#666",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
