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

  const [code, setCode] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [note, setNote] = useState("");

  const [details, setDetails] = useState<SelectedProductDetail[]>([]);
  const [serialInput, setSerialInput] = useState("");
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getProducts({ PageSize: 1000 })
        .then((res: any) => {
          const data =
            res.items || res.data?.items || res.data?.data || res.data || res;
          setProductList(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Lỗi tải danh sách sản phẩm:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && receiptId) {
      setIsLoadingData(true);
      getGoodsReceiptById(receiptId)
        .then((res: any) => {
          const data = res.data?.data || res.data || res;
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
                serials: Array.isArray(d.serialNumbers)
                  ? d.serialNumbers
                  : Array.isArray(d.serials)
                    ? d.serials
                    : [],
              }),
            );
            setDetails(mappedDetails);
          }
        })
        .catch((err) => console.error("Lỗi load chi tiết:", err))
        .finally(() => setIsLoadingData(false));
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
    if (details.some((d) => d.serials.includes(sTrim)))
      return alert("Mã Serial này đã tồn tại!");

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
    if (!window.confirm("Xóa dòng này?")) return;
    setDetails(details.filter((d) => d.productId !== productId));
    if (activeProductId === productId) setActiveProductId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (details.length === 0) return alert("Sản phẩm rỗng!");
    setIsSubmitting(true);
    try {
      const payload: GoodsReceiptUpdateDto = {
        note: note.trim(),
        productGroups: details.map((d) => ({
          productId: d.productId,
          serials: d.serials,
        })),
      };
      await updateGoodsReceipt(receiptId!, payload);
      alert("Cập nhật thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        style={{
          width: "80vw",
          maxWidth: "1300px",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          className={styles.modalHeader}
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #eee",
            flexShrink: 0,
          }}
        >
          <h2 className={styles.modalTitle}>
            Chỉnh Sửa Phiếu Nhập:{" "}
            <span style={{ color: "#F23A3A" }}>{code}</span>
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
          <div style={{ padding: "50px", textAlign: "center" }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flex: 1, overflow: "hidden" }}
          >
            {/* CỘT TRÁI (75%) */}
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
                Chi tiết vật tư trong phiếu
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
                        Giá nhập
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
                          <small style={{ color: "#888" }}>
                            SKU: {item.sku}
                          </small>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                              marginTop: "6px",
                            }}
                          >
                            {item.serials.map((sn, idx) => (
                              <span
                                key={idx}
                                style={{
                                  background: "#f0f0f0",
                                  border: "1px solid #ddd",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {sn}{" "}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSingleSerial(item.productId, sn);
                                  }}
                                  style={{
                                    marginLeft: "5px",
                                    color: "#ff4d4f",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ×
                                </span>
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
                              removeRow(item.productId);
                            }}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: "#999",
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

            {/* CỘT PHẢI (25%) */}
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
                    <strong>Nhà cung cấp:</strong> {supplierName}
                  </p>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    <strong>Mã phiếu:</strong> {code}
                  </p>
                </div>

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
                    placeholder="Nhập ghi chú điều chỉnh..."
                    style={{
                      width: "100%",
                      height: "70px",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      fontSize: "13px",
                    }}
                  />
                </div>

                <div
                  className={styles.formGroup}
                  style={{ position: "relative", marginBottom: "15px" }}
                >
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>
                    1. Thêm SP mới
                  </label>
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc SKU..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                  />
                  {showDropdown && searchTerm && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 5px)", // Đẩy xuống dưới input 5px để không bị dính
                        left: 0,
                        zIndex: 1000, // Đảm bảo nổi lên trên cùng
                        width: "100%",
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "6px", // Bo góc cho đồng bộ
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)", // Đổ bóng đậm hơn để phân biệt với nền
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {productList
                        .filter((p) =>
                          (p.name + p.sku)
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                        )
                        .map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            className={styles.dropdownItem} // Sử dụng class CSS nếu có hoặc inline style bên dưới
                            style={{
                              padding: "10px 15px",
                              cursor: "pointer",
                              borderBottom: "1px solid #f0f0f0",
                              fontSize: "13px",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#fff5f5")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "#fff")
                            }
                          >
                            <strong style={{ color: "#F23A3A" }}>
                              {p.sku}
                            </strong>{" "}
                            - {p.name}
                          </div>
                        ))}
                      {/* Trường hợp không tìm thấy */}
                      {productList.filter((p) =>
                        (p.name + p.sku)
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      ).length === 0 && (
                        <div
                          style={{
                            padding: "15px",
                            textAlign: "center",
                            color: "#999",
                            fontSize: "13px",
                          }}
                        >
                          Không tìm thấy sản phẩm nào
                        </div>
                      )}
                    </div>
                  )}
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
                    2. QUÉT THÊM SERIAL
                  </label>
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                  >
                    <input
                      type="text"
                      disabled={!activeProductId}
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
                      disabled={!activeProductId}
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
                  disabled={isSubmitting || details.length === 0}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                    background: "#F23A3A",
                    fontWeight: "bold",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
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
        )}
      </div>
    </div>
  );
}
