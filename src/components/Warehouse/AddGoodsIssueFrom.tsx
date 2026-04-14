import React, { useState, useEffect } from "react";
import styles from "../../css/SharedForm.module.css";
import { createGoodsIssue } from "../../services/Warehouse/GoodsIssueService";
import {
  scanSerialNumber,
  type ScanSerialResponseDto,
} from "../../services/SerialNumber/SerialNumberService";
import { getCustomers } from "../../services/Customer/CustomerService";

interface AddGoodsIssueFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: any; // Nhận thông tin user đăng nhập để lấy ID nhân viên
}

interface DetailWithInfo extends ScanSerialResponseDto {
  quantity: number;
  serials: string[];
}

export default function AddGoodsIssueForm({
  isOpen,
  onClose,
  onSuccess,
  user,
}: AddGoodsIssueFormProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [customerId, setCustomerId] = useState<string>("0"); // Mặc định là Khách lẻ (0)
  const [note, setNote] = useState("");

  // Thông tin khách lẻ
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState(""); // Thêm trường Email
  const [guestAddress, setGuestAddress] = useState("");

  const [serialInput, setSerialInput] = useState("");
  const [details, setDetails] = useState<DetailWithInfo[]>([]);
  const [scannedSerials, setScannedSerials] = useState<string[]>([]);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load danh sách khách hàng từ Service
  useEffect(() => {
    if (isOpen) {
      getCustomers({ page: 1, limit: 100, isActive: true })
        .then((res: any) => {
          const data = res.items || res.data?.items || res;
          setCustomers(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Lỗi lấy danh sách khách hàng:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        return [{ ...product, quantity: 1, serials: [sTrim] }, ...prevDetails];
      });
      setActiveProductId(product.productId);
      setSerialInput("");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Serial không hợp lệ hoặc đã xuất kho!",
      );
      setSerialInput("");
    }
  };

  const removeProduct = (productId: number) => {
    const prod = details.find((d) => d.productId === productId);
    if (prod) {
      setScannedSerials((prev) =>
        prev.filter((s) => !prod.serials.includes(s)),
      );
      setDetails((prev) => prev.filter((d) => d.productId !== productId));
      if (activeProductId === productId) setActiveProductId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedSerials.length === 0)
      return alert("Vui lòng quét Serial sản phẩm!");
    if (customerId === "0" && (!guestName || !guestPhone)) {
      return alert("Vui lòng nhập ít nhất Tên và SĐT khách lẻ!");
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        code: code.trim(),
        customerId: customerId === "0" ? null : parseInt(customerId),
        guestFullName: customerId === "0" ? guestName : null,
        guestPhone: customerId === "0" ? guestPhone : null,
        guestEmail: customerId === "0" ? guestEmail : null,
        guestAddress: customerId === "0" ? guestAddress : null,
        employeeId: user?.id || 1, // Lấy ID từ user đăng nhập
        note: note.trim(),
        issueDate: new Date().toISOString(),
        serialNumbers: scannedSerials,
      };

      await createGoodsIssue(payload);
      alert("Xuất kho thành công!");
      onSuccess();
      onClose();
      // Reset State
      setDetails([]);
      setScannedSerials([]);
      setCode("");
      setNote("");
      setGuestName("");
      setGuestPhone("");
      setGuestEmail("");
      setGuestAddress("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi tạo phiếu xuất kho");
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
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "95vh",
        }}
      >
        <div
          className={styles.modalHeader}
          style={{ padding: "15px 20px", borderBottom: "1px solid #eee" }}
        >
          <h2 className={styles.modalTitle}>Tạo Phiếu Xuất Kho</h2>
          <button
            type="button"
            className={styles.btnCloseHeader}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flex: 1, overflow: "hidden" }}
        >
          {/* CỘT TRÁI: TABLE SẢN PHẨM */}
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
                fontSize: "15px",
                marginBottom: "15px",
                color: "#666",
                fontWeight: "600",
              }}
            >
              Sản phẩm đã quét
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
                        <small style={{ color: "#888" }}>SKU: {item.sku}</small>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                            marginTop: "6px",
                          }}
                        >
                          {item.serials.map((s) => (
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
                        {item.importPrice?.toLocaleString()} ₫
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
              {details.length === 0 && (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  Vui lòng quét Serial sản phẩm...
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: FORM NHẬP LIỆU */}
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
                className={styles.formGroup}
                style={{ marginBottom: "15px" }}
              >
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="0">-- Khách hàng lẻ (Nhập tay) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              {customerId === "0" && (
                <div
                  style={{
                    padding: "15px",
                    background: "#fffbe6",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: "1px solid #ffe58f",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: "#856404",
                    }}
                  >
                    THÔNG TIN KHÁCH MỚI
                  </p>
                  <input
                    type="text"
                    placeholder="Tên khách hàng *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ marginBottom: "8px", padding: "8px" }}
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại *"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{ marginBottom: "8px", padding: "8px" }}
                  />
                  <input
                    type="email"
                    placeholder="Email khách hàng"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    style={{ marginBottom: "8px", padding: "8px" }}
                  />
                  <input
                    type="text"
                    placeholder="Địa chỉ giao hàng"
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    style={{ padding: "8px" }}
                  />
                </div>
              )}

              <div
                className={styles.formGroup}
                style={{ marginBottom: "15px" }}
              >
                <label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú xuất kho..."
                  style={{
                    width: "100%",
                    height: "60px",
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
                  MÁY QUÉT SERIAL XUẤT
                </label>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <input
                    type="text"
                    value={serialInput}
                    placeholder="Quét mã và Enter..."
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
              </div>
            </div>

            <div
              style={{
                padding: "15px 20px",
                borderTop: "1px solid #eee",
                backgroundColor: "#fff",
                flexShrink: 0,
              }}
            >
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={isSubmitting || scannedSerials.length === 0}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  background: "#F23A3A",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                }}
              >
                {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN XUẤT KHO"}
              </button>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={onClose}
                style={{
                  width: "100%",
                  background: "none",
                  border: "1px solid #ddd",
                  color: "#666",
                  padding: "8px",
                }}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
