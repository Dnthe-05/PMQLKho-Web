import React, { useState, useEffect } from 'react';
import styles from '../../css/Product/AddProductForm.module.css'; 
import { createProduct, getCategories, getBrands, getUnits } from '../../services/Product/productService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductForm({ isOpen, onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    Sku: '', 
    Name: '', 
    Location: '',
    ImportPrice: 0, 
    ExportPrice: 0, 
    StockQuantity: 0,
    CategoryId: '', 
    BrandId: '', 
    UnitId: '', 
    Image: '' 
  });

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [c, b, u]: any = await Promise.all([
            getCategories(), 
            getBrands(), 
            getUnits()
          ]);
          setCategories(c.data || c);
          setBrands(b.data || b);
          setUnits(u.data || u);
        } catch (err) {
          console.error("Lỗi load dữ liệu:", err);
        }
      };
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatNumber = (value: number | string) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      let finalImageUrl = formData.Image?.trim();
      if (!finalImageUrl) {
        finalImageUrl = '/logo.png';
      }

      const finalData = { 
        ...formData, 
        Image: finalImageUrl,
        ImportPrice: Number(formData.ImportPrice),
        ExportPrice: Number(formData.ExportPrice),
        StockQuantity: Number(formData.StockQuantity),
        CategoryId: Number(formData.CategoryId),
        BrandId: Number(formData.BrandId),
        UnitId: Number(formData.UnitId)
      };

      const res: any = await createProduct(finalData);
      
      if (res) {
        alert("Thêm sản phẩm thành công!");
        onSuccess();
        onClose();
        setFormData({ 
          Sku: '', Name: '', Location: '', 
          ImportPrice: 0, ExportPrice: 0, StockQuantity: 0, 
          CategoryId: '', BrandId: '', UnitId: '', Image: '' 
        });
      }
    } catch (error: any) {
      const serverData = error.response?.data;
      if (serverData?.errors) setFieldErrors(serverData.errors);
      else alert("Lỗi: " + (serverData?.message || "Không thể lưu sản phẩm"));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Thêm mới Sản phẩm</h2>
            <p className={styles.modalSubtitle}>Thông tin chi tiết giúp quản lý kho chính xác hơn</p>
          </div>
          <button onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PHẦN 1: Tên & SKU */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên sản phẩm <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.Name ? styles.inputError : ''}
                type="text" required value={formData.Name} 
                onChange={e => setFormData({...formData, Name: e.target.value})} 
                placeholder="Nhập tên sản phẩm..."
              />
              {fieldErrors.Name && <span className={styles.errorText}>{fieldErrors.Name}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Mã SKU <span className={styles.required}>*</span></label>
              <input 
                className={fieldErrors.Sku ? styles.inputError : ''}
                type="text" required value={formData.Sku} 
                onChange={e => setFormData({...formData, Sku: e.target.value})} 
                placeholder="Ví dụ: SP-001"
              />
              {fieldErrors.Sku && <span className={styles.errorText}>{fieldErrors.Sku}</span>}
            </div>
          </div>

          {/* PHẦN 2: Phân loại */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Danh mục *</label>
              <select required value={formData.CategoryId} onChange={e => setFormData({...formData, CategoryId: e.target.value})}>
                <option value="">-- Chọn danh mục --</option>
                {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Thương hiệu *</label>
              <select required value={formData.BrandId} onChange={e => setFormData({...formData, BrandId: e.target.value})}>
                <option value="">-- Chọn thương hiệu --</option>
                {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          {/* PHẦN 3: Kho & Đơn vị */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Đơn vị tính *</label>
              <select required value={formData.UnitId} onChange={e => setFormData({...formData, UnitId: e.target.value})}>
                <option value="">-- Chọn đơn vị --</option>
                {units?.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Vị trí kho</label>
              <input type="text" value={formData.Location} onChange={e => setFormData({...formData, Location: e.target.value})} placeholder="Kệ A1..." />
            </div>
            <div className={styles.formGroup}>
            <label>Số lượng tồn</label>
            <input 
              type="text"
              placeholder="0"
              value={formData.StockQuantity === 0 ? "" : formatNumber(formData.StockQuantity)} 
              
              onChange={e => {
                // 1. Lấy giá trị thô và xóa sạch các ký tự không phải số (ngăn chặn dấu -)
                const rawValue = e.target.value.replace(/\D/g, ""); 
                
                const numValue = rawValue === "" ? 0 : Number(rawValue);
                
                setFormData({...formData, StockQuantity: numValue});
              }} 
            />
          </div>
          </div>

          {/* PHẦN 4: Giá cả */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Giá nhập (VNĐ) <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                required 
                value={formatNumber(formData.ImportPrice)} 
                onChange={e => {
                  const raw = e.target.value.replace(/\./g, "");
                  if (/^\d*$/.test(raw)) setFormData({...formData, ImportPrice: parseNumber(e.target.value)});
                }} 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Giá bán (VNĐ) <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                required 
                value={formatNumber(formData.ExportPrice)} 
                onChange={e => {
                  const raw = e.target.value.replace(/\./g, "");
                  if (/^\d*$/.test(raw)) setFormData({...formData, ExportPrice: parseNumber(e.target.value)});
                }} 
              />
            </div>
          </div>

          {/* PHẦN 5: Hình ảnh (Link URL) */}
          <div className={styles.formGroup}>
            <label>Link ảnh sản phẩm (URL)</label>
            <input 
              type="text" 
              placeholder="Dán link ảnh từ Google/Web vào đây..."
              value={formData.Image}
              onChange={(e) => setFormData({...formData, Image: e.target.value})}
              className={styles.urlInput}
            />
            
            <div className={styles.previewContainer} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <img 
                src={formData.Image?.trim() || '/logo.png'} 
                alt="Preview" 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Loi+Link+Anh'; }}
              />
              <span style={{ fontSize: '12px', color: '#888' }}>
                {formData.Image?.trim() ? "Xem trước ảnh từ Link" : "Sẽ dùng logo mặc định nếu để trống"}
              </span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="submit" className={styles.btnSubmit}>+ Lưu sản phẩm</button>
          </div>
        </form>
      </div>
    </div>
  );
}