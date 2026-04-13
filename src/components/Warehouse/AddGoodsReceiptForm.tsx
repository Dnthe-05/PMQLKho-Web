import React, { useState, useEffect } from "react";
import styles from "../../css/SharedForm.module.css";
import {
  createGoodsReceipt,
  type GoodsReceiptCreateDto,
} from "../../services/Warehouse/GoodsReceiptService";
import { useSuppliers } from "../../hooks/useSuppliers";
import { getProducts } from "../../services/Product/productService";

interface AddGoodsReceiptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

interface SelectedProductDetail {
  productId: number;
  productName: string;
  sku: string;
  importPrice: number;
  quantity: number;
  serials: string[];
}

export default function AddGoodsReceiptForm({
  isOpen,
  onClose,
  onSuccess,
  user,
}: AddGoodsReceiptFormProps) {
  const { suppliers: rawData, loading: loadingSuppliers } = (
    useSuppliers as any
  )("", true, 1, 0);
  const suppliers = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.items || [];

  const [productList, setProductList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [code, setCode] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [note, setNote] = useState("");
  const [details, setDetails] = useState<SelectedProductDetail[]>([]);
  const [serialInput, setSerialInput] = useState("");
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getProducts({}).then((res) => {
        const data = res.items || res.data || res;
        setProductList(Array.isArray(data) ? data : []);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectProduct = (product: any) => {
    if (details.some((d) => d.productId === product.id)) {
      setActiveProductId(product.id);
    } else {
      const newDetail: SelectedProductDetail = {
        productId: product.id,
        productName: product.name,
        sku: product.sku || "N/A",
        importPrice: product.importPrice || 0,
        quantity: 0,
        serials: [],
      };
      setDetails([newDetail, ...details]);
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
    if (!supplierId) return alert("Vui lòng chọn nhà cung cấp!");
    if (details.length === 0) return alert("Vui lòng chọn sản phẩm!");
    if (details.some((d) => d.serials.length === 0))
      return alert("Vui lòng nhập Serial cho tất cả sản phẩm!");
    setIsSubmitting(true);
    try {
      const payload: GoodsReceiptCreateDto = {
        code: code.trim(),
        supplierId: parseInt(supplierId),
        employeeId: user?.id,
        note: note.trim(),
        createdAt: new Date().toISOString(),
        productGroups: details.map((d) => ({
          productId: d.productId,
          serials: d.serials,
        })),
      };
      await createGoodsReceipt(payload);
      alert("Nhập kho thành công!");
      onSuccess();
      onClose();
      setDetails([]);
      setCode("");
      setNote("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi nhập kho");
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
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Header cố định */}
        <div
          className={styles.modalHeader}
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #eee",
            flexShrink: 0,
          }}
        >
          <h2 className={styles.modalTitle}>Tạo Phiếu Nhập Kho</h2>
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
          {/* CỘT TRÁI: Danh sách sản phẩm (Chiếm 65%) */}
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
              Danh sách sản phẩm nhập
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
                    <React.Fragment key={item.productId}>
                      <tr
                        onClick={() => setActiveProductId(item.productId)}
                        style={{
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                          backgroundColor:
                            activeProductId === item.productId
                              ? "#fff0f0"
                              : "transparent",
                        }}
                      >
                        <td style={{ padding: "12px" }}>
                          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                            {item.productName}
                          </div>
                          <small style={{ color: "#888" }}>
                            SKU: {item.sku}
                          </small>
                          {/* Tags Serial */}
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
                                    marginLeft: "4px",
                                    color: "#ff4d4f",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                  }}
                                >
                                  &times;
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
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CỘT PHẢI: Form nhập liệu (Chiếm 35%) */}
          <div
            style={{
              width: "380px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              borderLeft: "1px solid #eee",
            }}
          >
            {/* Vùng nhập liệu có thể cuộn */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <div
                className={styles.formGroup}
                style={{ marginBottom: "15px" }}
              >
                <label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Nhà cung cấp
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  required
                  disabled={loadingSuppliers}
                >
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {suppliers.map((s: any) => (
                    <option key={s.idNcc} value={s.idNcc}>
                      {s.nameNcc}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={styles.formGroup}
                style={{ marginBottom: "20px" }}
              >
                <label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú..."
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
                style={{ position: "relative", marginBottom: "20px" }}
              >
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: "13px",
                  }}
                >
                  1. Thêm sản phẩm
                </label>
                <input
                  type="text"
                  placeholder="Tìm tên hoặc SKU..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  style={{ border: "2px solid #eee", padding: "10px" }}
                />
                {showDropdown && searchTerm && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 100,
                      width: "100%",
                      background: "#fff",
                      border: "1px solid #ddd",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      maxHeight: "150px",
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
                          style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                            fontSize: "13px",
                          }}
                        >
                          <strong>{p.sku}</strong> - {p.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div
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
                    fontSize: "12px",
                  }}
                >
                  2. Quét mã Serial
                </label>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <input
                    type="text"
                    disabled={!activeProductId}
                    value={serialInput}
                    placeholder="Quét..."
                    onChange={(e) => setSerialInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddSerial())
                    }
                    style={{ flex: 1, padding: "8px" }}
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
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Footer cột phải: Nút bấm cố định */}
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
                  fontWeight: "bold",
                }}
              >
                {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN NHẬP KHO"}
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
