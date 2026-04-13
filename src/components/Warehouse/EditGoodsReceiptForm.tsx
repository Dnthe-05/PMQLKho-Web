import React, { useState, useEffect } from "react";
import styles from "../../css/SharedForm.module.css";
import {
  getGoodsReceiptById,
  updateGoodsReceipt,
  type GoodsReceiptUpdateDto,
} from "../../services/Warehouse/GoodsReceiptService";
import { getProducts } from "../../services/Product/productService";

interface Props {
  isOpen: boolean;
  receiptId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface SelectedProductDetail {
  productId: number;
  productName: string;
  sku: string;
  importPrice: number;
  quantity: number;
  serials: string[];
}

export default function EditGoodsReceiptForm({
  isOpen,
  receiptId,
  onClose,
  onSuccess,
}: Props) {
  const [productList, setProductList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [code, setCode] = useState(""); // Chỉ để hiển thị, không cho sửa
  const [supplierName, setSupplierName] = useState(""); // Chỉ hiển thị
  const [note, setNote] = useState("");

  const [details, setDetails] = useState<SelectedProductDetail[]>([]);
  const [serialInput, setSerialInput] = useState("");
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 1. Load danh sách sản phẩm để có thể thêm SP mới khi sửa
  useEffect(() => {
    if (isOpen) {
      getProducts({}).then((res) => {
        const data = res.items || res.data || res;
        setProductList(Array.isArray(data) ? data : []);
      });
    }
  }, [isOpen]);

  // Trong useEffect của EditGoodsReceiptForm.tsx
  useEffect(() => {
    if (isOpen && receiptId) {
      setIsLoadingData(true);
      getGoodsReceiptById(receiptId)
        .then((res: any) => {
          const data = res.data || res;
          setCode(data.code);
          setSupplierName(data.supplierName || data.supplier?.name);
          setNote(data.note || "");

          if (data.details && Array.isArray(data.details)) {
            const mappedDetails: SelectedProductDetail[] = data.details.map(
              (d: any) => ({
                productId: d.productId,
                productName: d.productName,
                sku: d.productSku || d.sku || "N/A",
                importPrice: d.importPrice || 0,
                quantity: d.quantity || 0,
                // SỬA TẠI ĐÂY: Kiểm tra mọi trường có thể chứa danh sách Serial
                serials: Array.isArray(d.serials)
                  ? d.serials
                  : Array.isArray(d.serialNumbers)
                    ? d.serialNumbers
                    : [],
              }),
            );
            setDetails(mappedDetails);
          }
          setIsLoadingData(false);
        })
        .catch((err) => {
          console.error("Lỗi load chi tiết:", err);
          setIsLoadingData(false);
        });
    }
  }, [isOpen, receiptId]);

  if (!isOpen) return null;

  const handleSelectProduct = (product: any) => {
    if (details.some((d) => d.productId === product.id)) {
      setActiveProductId(product.id);
    } else {
      setDetails([
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          importPrice: product.importPrice || 0,
          quantity: 0,
          serials: [],
        },
        ...details,
      ]);
      setActiveProductId(product.id);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleAddSerial = () => {
    const sTrim = serialInput.trim();
    if (!sTrim || activeProductId === null) return;
    if (details.some((d) => d.serials.includes(sTrim))) {
      alert("Mã Serial này đã tồn tại!");
      return;
    }
    setDetails((prev) =>
      prev.map((item) => {
        if (item.productId === activeProductId) {
          const updatedSerials = [...item.serials, sTrim];
          return {
            ...item,
            serials: updatedSerials,
            quantity: updatedSerials.length,
          };
        }
        return item;
      }),
    );
    setSerialInput("");
  };

  const removeSingleSerial = (productId: number, serialToDelete: string) => {
    setDetails((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const updatedSerials = item.serials.filter(
            (s) => s !== serialToDelete,
          );
          return {
            ...item,
            serials: updatedSerials,
            quantity: updatedSerials.length,
          };
        }
        return item;
      }),
    );
  };

  const removeRow = (productId: number) => {
    setDetails(details.filter((d) => d.productId !== productId));
    if (activeProductId === productId) setActiveProductId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptId) return;
    if (details.length === 0)
      return alert("Phiếu nhập không được để trống sản phẩm!");

    setIsSubmitting(true);
    try {
      const payload: GoodsReceiptUpdateDto = {
        note: note.trim(),
        // Map lại đúng ProductGroups cho logic Update Backend
        productGroups: details.map((d) => ({
          productId: d.productId,
          serials: d.serials,
        })),
      };

      await updateGoodsReceipt(receiptId, payload);
      alert("Cập nhật phiếu nhập thành công!");
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
      <div className={styles.modalContent} style={{ maxWidth: "850px" }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Chỉnh Sửa Phiếu Nhập: {code}</h2>
          <button
            type="button"
            className={styles.btnCloseHeader}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {isLoadingData ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Mã phiếu (Không được sửa)</label>
                <input
                  type="text"
                  value={code}
                  disabled
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nhà cung cấp</label>
                <input
                  type="text"
                  value={supplierName}
                  disabled
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label>Ghi chú</label>
                <input
                  type="text"
                  value={note}
                  placeholder="Nhập ghi chú..."
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            <hr
              style={{
                margin: "15px 0",
                border: "none",
                borderTop: "1px solid #eee",
              }}
            />

            {/* 1. TÌM KIẾM SẢN PHẨM MỚI (NẾU MUỐN THÊM VÀO PHIẾU CŨ) */}
            <div className={styles.formGroup} style={{ position: "relative" }}>
              <label style={{ fontWeight: "bold" }}>
                1. Thêm sản phẩm mới vào phiếu
              </label>
              <input
                type="text"
                placeholder="Nhập tên hoặc SKU SP mới..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                style={{ border: "2px solid #ccc" }}
              />
              {showDropdown && searchTerm && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    width: "100%",
                    background: "#fff",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {productList
                    .filter(
                      (p) =>
                        p.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <strong>{p.sku}</strong> - {p.name}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 2. NHẬP SERIAL */}
            <div
              className={styles.formGroup}
              style={{
                background: activeProductId ? "#fff5f5" : "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                border: activeProductId
                  ? "1px solid #F23A3A"
                  : "1px solid #ddd",
              }}
            >
              <label
                style={{
                  color: activeProductId ? "#F23A3A" : "#666",
                  fontWeight: "bold",
                }}
              >
                {activeProductId
                  ? `2. Đang nhập Serial cho: ${details.find((d) => d.productId === activeProductId)?.productName}`
                  : "Chọn sản phẩm bên dưới để nhập Serial"}
              </label>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <input
                  type="text"
                  disabled={!activeProductId}
                  value={serialInput}
                  placeholder="Nhập Serial mới..."
                  onChange={(e) => setSerialInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddSerial())
                  }
                  style={{
                    flex: 1,
                    border: activeProductId
                      ? "2px solid #F23A3A"
                      : "1px solid #ccc",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSerial}
                  disabled={!activeProductId}
                  style={{
                    background: "#F23A3A",
                    color: "white",
                    padding: "0 25px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* 3. BẢNG DANH SÁCH (HIỂN THỊ DẠNG TAG TRONG BẢNG) */}
            <div
              style={{
                marginTop: "20px",
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #eee",
                borderRadius: "8px",
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
                        padding: "12px 15px",
                        textAlign: "left",
                        fontSize: "14px",
                      }}
                    >
                      Sản phẩm/SKU
                    </th>
                    <th style={{ textAlign: "center", fontSize: "14px" }}>
                      Giá nhập
                    </th>
                    <th style={{ textAlign: "center", fontSize: "14px" }}>
                      SL
                    </th>
                    <th style={{ textAlign: "center", fontSize: "14px" }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item) => (
                    <React.Fragment key={item.productId}>
                      <tr
                        onClick={() => setActiveProductId(item.productId)}
                        style={{
                          borderTop: "1px solid #eee",
                          cursor: "pointer",
                          backgroundColor:
                            activeProductId === item.productId
                              ? "#fff5f5"
                              : "transparent",
                        }}
                      >
                        <td style={{ padding: "12px 15px" }}>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "15px",
                              color: "#333",
                            }}
                          >
                            {item.productName}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "2px",
                            }}
                          >
                            SKU: {item.sku}
                          </div>

                          {/* VÙNG HIỂN THỊ SERIAL DẠNG TAG NGAY DƯỚI TÊN SP */}
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                              marginTop: "8px",
                            }}
                          >
                            {item.serials.map((sn, idx) => (
                              <span
                                key={idx}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  color: "#444",
                                }}
                              >
                                {sn}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSingleSerial(item.productId, sn);
                                  }}
                                  style={{
                                    marginLeft: "6px",
                                    cursor: "pointer",
                                    color: "#ff4d4f",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    lineHeight: "1",
                                  }}
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>
                        </td>

                        <td style={{ textAlign: "center", color: "#444" }}>
                          {item.importPrice.toLocaleString()} ₫
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <span
                            style={{
                              background: "#F23A3A",
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "50%",
                              fontSize: "12px",
                              fontWeight: "bold",
                              display: "inline-block",
                              minWidth: "20px",
                            }}
                          >
                            {item.quantity}
                          </span>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRow(item.productId);
                            }}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              fontSize: "18px",
                              opacity: 0.6,
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.formActions} style={{ marginTop: "20px" }}>
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
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={isSubmitting || details.length === 0}
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
