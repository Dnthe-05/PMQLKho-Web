  import React, { useState, useEffect } from 'react';
  import styles from '../../css/Product/EditProductForm.module.css'; 
  import { updateProduct, getCategories, getBrands, getUnits } from '../../services/Product/productService'; 
  import ConfirmModal from '../ConfirmModal';
  import { type UpdateProductDto } from '../../types/Product/updateProductDto';
  import type { Product } from '../../types/Product/product';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product: Product | null; 
  }

  export default function EditProductForm({ isOpen, onClose, onSuccess, product }: Props) {
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);

    const [formData, setFormData] = useState<UpdateProductDto>({
      Name: '',
      SKU: '',
      Image: '',
      Location: '',
      ImportPrice: 0,
      ExportPrice: 0,
      StockQuantity: 0,
      CategoryId: 0,
      BrandId: 0,
      UnitId: 0
    });

    // 1. Lấy dữ liệu Dropdown
    useEffect(() => {
      const fetchSelectData = async () => {
      try {
        const [catRes, brandRes, unitRes]: any = await Promise.all([
          getCategories(),
          getBrands(),
          getUnits()
        ]);
        
        // Bóc tách kỹ để chắc chắn lấy được mảng
        setCategories(catRes?.items || catRes?.data?.items || catRes || []);
        setBrands(brandRes?.items || brandRes?.data?.items || brandRes || []);
        setUnits(unitRes?.items || unitRes?.data?.items || unitRes || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách dropdown:", error);
      }
    };
      if (isOpen) fetchSelectData();
    }, [isOpen]);

    useEffect(() => {
    const isDataReady = categories.length > 0 && brands.length > 0 && units.length > 0;

    if (product && isOpen && isDataReady) {
      const cId = (product as any).categoryId || (product as any).category?.id || 0;
      const bId = (product as any).brandId || (product as any).brand?.id || 0;
      const uId = (product as any).unitId || (product as any).unit?.id || 0;

      setFormData({
        Name: product.name || '',
        SKU: product.sku || '',
        Image: product.image || '',
        Location: product.location || '',
        ImportPrice: product.importPrice || 0,
        ExportPrice: product.exportPrice || 0,
        StockQuantity: product.stockQuantity || 0,
        CategoryId: Number(cId),
        BrandId: Number(bId),
        UnitId: Number(uId),
      });
    }
  }, [product, isOpen, categories, brands, units]); 

    if (!isOpen || !product) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.CategoryId === 0 || formData.BrandId === 0 || formData.UnitId === 0) {
          alert("Vui lòng chọn đầy đủ thông tin");
          return;
      }
      setShowConfirm(true);
    };

    const handleConfirmSave = async () => {
      setShowConfirm(false);
      try {
        await updateProduct(Number(product.id), formData);
        alert("Cập nhật thành công!");
        onSuccess();
        onClose();
      } catch (error: any) {
        alert(error.response?.data?.message || "Lỗi cập nhật sản phẩm!");
      }
    };

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div>
              <h2 className={styles.modalTitle}>Cập nhật Sản phẩm</h2>
              <p className={styles.modalSubtitle}>Đang sửa: {product.name}</p>
            </div>
            <button onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Tên sản phẩm *</label>
                <input type="text" value={formData.Name} onChange={e => setFormData({...formData, Name: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Mã SKU *</label>
                <input type="text" value={formData.SKU} onChange={e => setFormData({...formData, SKU: e.target.value})} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Link hình ảnh</label>
              <input type="text" value={formData.Image} onChange={e => setFormData({...formData, Image: e.target.value})} />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Giá nhập</label>
                <input type="number" value={formData.ImportPrice} onChange={e => setFormData({...formData, ImportPrice: Number(e.target.value)})} />
              </div>
              <div className={styles.formGroup}>
                <label>Giá xuất</label>
                <input type="number" value={formData.ExportPrice} onChange={e => setFormData({...formData, ExportPrice: Number(e.target.value)})} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Số lượng tồn</label>
                <input type="number" value={formData.StockQuantity} onChange={e => setFormData({...formData, StockQuantity: Number(e.target.value)})} />
              </div>
              <div className={styles.formGroup}>
                <label>Vị trí kho</label>
                <input type="text" value={formData.Location} onChange={e => setFormData({...formData, Location: e.target.value})} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Danh mục *</label>
                <select 
                  value={formData.CategoryId} 
                  onChange={e => setFormData({...formData, CategoryId: Number(e.target.value)})}
                  required
                >
                  <option value={0} disabled>-- Chọn danh mục --</option>
                  {categories.map((c) => (<option key={c.id} value={Number(c.id)}>{c.name}</option>))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Thương hiệu *</label>
                <select 
                  value={formData.BrandId} 
                  onChange={e => setFormData({...formData, BrandId: Number(e.target.value)})}
                  required
                >
                  <option value={0} disabled>-- Chọn thương hiệu --</option>
                  {brands.map((b) => (<option key={b.id} value={Number(b.id)}>{b.name}</option>))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Đơn vị *</label>
                <select 
                  value={formData.UnitId} 
                  onChange={e => setFormData({...formData, UnitId: Number(e.target.value)})}
                  required
                >
                  <option value={0} disabled>-- Chọn đơn vị --</option>
                  {units.map((u) => (<option key={u.id} value={Number(u.id)}>{u.name}</option>))}
                </select>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
              <button type="submit" className={styles.btnSubmit}>Lưu thay đổi</button>
            </div>
          </form>

          <ConfirmModal 
            isOpen={showConfirm} 
            onConfirm={handleConfirmSave} 
            onCancel={() => setShowConfirm(false)} 
            title="Xác nhận"
            message={`Lưu thay đổi cho ${product.name}?`}
          />
        </div>
      </div>
    );
  }