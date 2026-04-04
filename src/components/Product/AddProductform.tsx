import React, { useState, useEffect } from 'react';
import styles from '../../css/SharedForm.module.css'; 
import { createProduct, getCategories, getBrands, getUnits } from '../../services/Product/productService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductForm({ isOpen, onClose, onSuccess }: Props) {
  // 1. Khai báo State cho các danh sách chọn (Sửa lỗi "Cannot find name 'units'")
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    Sku: '', Name: '', Location: '',
    ImportPrice: 0, ExportPrice: 0, StockQuantity: 0,
    CategoryId: '', BrandId: '', UnitId: '', Image: '' 
  });

  // 2. Fetch dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
    try {
        const [c, b, u] = await Promise.all([
            getCategories() as any, 
            getBrands() as any, 
            getUnits() as any
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      let imageUrl = formData.Image;

      // Bước xử lý ảnh (Tạm thời dán link hoặc logic upload)
      if (selectedFile) {
        // Sau này con thêm logic upload API ở đây
        imageUrl = selectedFile.name; // Tạm thời lấy tên file để test
      }

      const finalData = { 
        ...formData, 
        Image: imageUrl,
        // Ép kiểu chuẩn cho Backend
        ImportPrice: Number(formData.ImportPrice),
        ExportPrice: Number(formData.ExportPrice),
        StockQuantity: Number(formData.StockQuantity),
        CategoryId: Number(formData.CategoryId),
        BrandId: Number(formData.BrandId),
        UnitId: Number(formData.UnitId)
      };

      const res: any = await createProduct(finalData); // Ép kiểu any để tránh lỗi .success
      if (res && res.success) {
        alert("Thêm sản phẩm thành công!");
        onSuccess();
        onClose();
        // Reset form
        setFormData({ Sku: '', Name: '', Location: '', ImportPrice: 0, ExportPrice: 0, StockQuantity: 0, CategoryId: '', BrandId: '', UnitId: '', Image: '' });
        setPreviewUrl('');
        setSelectedFile(null);
      }
    } catch (error: any) {
      const serverData = error.response?.data;
      if (serverData?.errors) setFieldErrors(serverData.errors);
      else alert("Có lỗi xảy ra khi lưu!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Thêm mới Sản phẩm</h2>
            <p className={styles.modalSubtitle}>Vui lòng nhập đầy đủ thông tin sản phẩm</p>
          </div>
          <button onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hàng 1: Tên & SKU */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên sản phẩm <span className={styles.required}>*</span></label>
              <input type="text" required value={formData.Name} onChange={e => setFormData({...formData, Name: e.target.value})} />
              {fieldErrors.Name && <span className={styles.errorText}>{fieldErrors.Name}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Mã SKU <span className={styles.required}>*</span></label>
              <input type="text" required value={formData.Sku} onChange={e => setFormData({...formData, Sku: e.target.value})} />
              {fieldErrors.Sku && <span className={styles.errorText}>{fieldErrors.Sku}</span>}
            </div>
          </div>

          {/* Hàng 2: Ảnh & Vị trí */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Ảnh sản phẩm</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {previewUrl && <img src={previewUrl} alt="Preview" className={styles.imagePreview} style={{width: '60px', borderRadius: '8px', marginTop: '8px'}} />}
            </div>
            <div className={styles.formGroup}>
              <label>Vị trí kho</label>
              <input type="text" value={formData.Location} onChange={e => setFormData({...formData, Location: e.target.value})} placeholder="VD: Kệ A1" />
            </div>
          </div>

          {/* Hàng 3: Dropdowns */}
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
                <option value="">-- Chọn nhãn hiệu --</option>
                {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Đơn vị tính *</label>
              <select required value={formData.UnitId} onChange={e => setFormData({...formData, UnitId: e.target.value})}>
                <option value="">-- Chọn đơn vị --</option>
                {units?.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          {/* Hàng 4: Giá & Tồn kho */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Giá nhập *</label>
              <input type="number" required value={formData.ImportPrice} onChange={e => setFormData({...formData, ImportPrice: Number(e.target.value)})} />
            </div>
            <div className={styles.formGroup}>
              <label>Giá bán *</label>
              <input type="number" required value={formData.ExportPrice} onChange={e => setFormData({...formData, ExportPrice: Number(e.target.value)})} />
            </div>
            <div className={styles.formGroup}>
              <label>Số lượng tồn</label>
              <input type="number" value={formData.StockQuantity} onChange={e => setFormData({...formData, StockQuantity: Number(e.target.value)})} />
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