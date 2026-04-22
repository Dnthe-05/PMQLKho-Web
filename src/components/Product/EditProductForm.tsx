import React, { useState, useEffect, useCallback } from "react";
import styles from "../../css/Product/EditProductForm.module.css";
import {
  updateProduct,
  getCategories,
  getBrands,
  getUnits,
  getAttributes,
  getProductAttributes,
  updateProductAttributes,
  createCategory,
  createBrand,
  createUnit,  
  createAttribute
} from "../../services/Product/productService";
import ConfirmModal from "../ConfirmModal";
import { type UpdateProductDto } from "../../types/Product/updateProductDto";
import type { Product } from "../../types/Product/product";
import Select from 'react-select'; 
import AttributeModal from "./AttributeModal";

interface EditableAttribute {
  attributeId: number;
  name: string;
  value: string;
  unit?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

interface AttributeDefinition {
  id: number;
  name: string;
  unit: string;
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5200';

export default function EditProductForm({ isOpen, onClose, onSuccess, product }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [productAttributes, setProductAttributes] = useState<EditableAttribute[]>([]);
  const [attributeDefinitions, setAttributeDefinitions] = useState<AttributeDefinition[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Quản lý AttributeModal
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [attrModalType, setAttrModalType] = useState<'category' | 'brand' | 'unit' | 'attribute'>('category');
  const [attrModalTitle, setAttrModalTitle] = useState('');

  const [formData, setFormData] = useState<UpdateProductDto>({
    Name: "", SKU: "", Image: "", Location: "",
    ImportPrice: 0, ExportPrice: 0, StockQuantity: 0,
    CategoryId: 0, BrandId: 0, UnitId: 0,
  });

    const fetchData = useCallback(async () => {
    if (!product?.id || !isOpen) return;
    try {
      const params = { pageNumber: 1, pageSize: 1000 };
      const [catRes, brandRes, unitRes, attrRes, prodAttrRes]: any = await Promise.all([
        getCategories(params).catch(() => ({ items: [] })),
        getBrands(params).catch(() => ({ items: [] })),
        getUnits(params).catch(() => ({ items: [] })),
        getAttributes(params).catch(() => ({ items: [] })),
        getProductAttributes(Number(product.id)).catch(() => ({ data: { attributes: [] } }))
      ]);

      const cats = catRes?.items || catRes?.data?.items || [];
      const brds = brandRes?.items || brandRes?.data?.items || [];
      const unts = unitRes?.items || unitRes?.data?.items || [];
      const defs = attrRes?.items || attrRes?.data?.items || [];
      const pAttrs = prodAttrRes?.data?.attributes || prodAttrRes?.attributes || [];

      setCategories(cats);
      setBrands(brds);
      setUnits(unts);
      setAttributeDefinitions(defs);

      setProductAttributes(pAttrs.map((a: any) => {
        const found = defs.find((d: any) => d.name.toLowerCase() === a.name.toLowerCase());
        return { attributeId: found ? Number(found.id) : 0, name: a.name, value: String(a.value), unit: a.unit };
      }));

      setFormData({
        Name: product.name || "",
        SKU: product.sku || "",
        Image: product.image || "",
        Location: product.location || "",
        ImportPrice: product.importPrice || 0,
        ExportPrice: product.exportPrice || 0,
        StockQuantity: product.stockQuantity || 0,
        CategoryId: cats.find((c: any) => c.name === product.categoryName)?.id || 0,
        BrandId: brds.find((b: any) => b.name === product.brandName)?.id || 0,
        UnitId: unts.find((u: any) => u.name === product.unitName)?.id || 0,
      });

      setImagePreview(product.image ? (product.image.startsWith('http') ? product.image : `${baseURL}/${product.image}`) : '/logo.png');
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  }, [product, isOpen]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Hàm mở Modal thêm nhanh
  const openAddModal = (type: 'category' | 'brand' | 'unit', title: string) => {
    setAttrModalType(type);
    setAttrModalTitle(title);
    setIsAttrModalOpen(true);
  };
  
  const [activeAttributeIndex, setActiveAttributeIndex] = useState<number | null>(null);
  const openAddAttributeModal = (index: number) => {
    setActiveAttributeIndex(index);
    setAttrModalType('attribute');
    setAttrModalTitle('Thuộc tính');
    setIsAttrModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addAttributeRow = () => setProductAttributes(p => [...p, { attributeId: 0, name: "", value: "", unit: "" }]);
  const removeAttributeRow = (index: number) => setProductAttributes(p => p.filter((_, idx) => idx !== index));

  const handleAttributeSelect = (index: number, attributeId: number) => {
    setProductAttributes(p => p.map((attr, idx) => {
      if (idx !== index) return attr;
      const selected = attributeDefinitions.find(d => Number(d.id) === attributeId);
      return { ...attr, attributeId, name: selected?.name || "", unit: selected?.unit || "" };
    }));
  };

  const handleAttributeValueChange = (index: number, value: string) => {
    setProductAttributes(p => p.map((attr, idx) => idx === index ? { ...attr, value } : attr));
  };

  const handleConfirmSave = async () => {
  setShowConfirm(false);
  try {
    const data = new FormData();

    // Duyệt qua formData và đảm bảo lấy đúng ID mới nhất
    Object.entries(formData).forEach(([key, value]) => {
      // Đảm bảo không append giá trị null hoặc undefined
      if (value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });

    if (imageFile) data.append('image', imageFile);

    // 1. Gọi API update sản phẩm
    await updateProduct(Number(product!.id), data);

    // 2. Cập nhật thuộc tính sản phẩm (nếu có)
    const attrs = productAttributes
      .filter(a => a.attributeId > 0 && a.value.trim())
      .map(a => ({ attributeId: a.attributeId, value: a.value.trim() }));
    
    await updateProductAttributes(Number(product!.id), attrs);

    alert("Cập nhật thành công!");
    
    // 3. Quan trọng: onSuccess() phải load lại bảng dữ liệu ở trang ngoài
    if (onSuccess) await onSuccess(); 
    onClose();
  } catch (error) {
    console.error("Lỗi lưu sản phẩm:", error);
    alert("Lỗi khi lưu thay đổi!");
  }
};


  if (!isOpen || !product) return null;

  const refreshDefinitions = async () => {
  try {
    const params = { pageNumber: 1, pageSize: 1000 };
    const [catRes, brandRes, unitRes, attrRes]: any = await Promise.all([
      getCategories(params).catch(() => ({ items: [] })),
      getBrands(params).catch(() => ({ items: [] })),
      getUnits(params).catch(() => ({ items: [] })),
      getAttributes(params).catch(() => ({ items: [] })),
    ]);

    // Lấy dữ liệu items từ response
    const defs = attrRes?.items || attrRes?.data?.items || [];
    
    // Cập nhật state để Select có dữ liệu mới
    setAttributeDefinitions(defs);
    setCategories(catRes?.items || catRes?.data?.items || []);
    setBrands(brandRes?.items || brandRes?.data?.items || []);
    setUnits(unitRes?.items || unitRes?.data?.items || []);

    return defs; // Trả về để dùng ngay trong onSave
  } catch (error) {
    console.error("Lỗi refresh:", error);
    return [];
  }
};

  const categoryOptions = categories.map(c => ({ value: Number(c.id), label: c.name }));
  const brandOptions = brands.map(b => ({ value: Number(b.id), label: b.name }));
  const unitOptions = units.map(u => ({ value: Number(u.id), label: u.name }));
  const attrDefOptions = attributeDefinitions.map(a => ({ 
    value: Number(a.id || a.id), 
    label: a.name || a.name,
    unit: a.unit || a.unit 
  }));

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

        <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className={styles.form}>
          {/* Tên & SKU */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên sản phẩm *</label>
              <input type="text" value={formData.Name} onChange={e => setFormData({ ...formData, Name: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label>Mã SKU *</label>
              <input type="text" value={formData.SKU} onChange={e => setFormData({ ...formData, SKU: e.target.value })} required />
            </div>
          </div>

          {/* Ảnh */}
          <div className={styles.formGroup}>
            <label>Chọn ảnh sản phẩm</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
              <span style={{ fontSize: '12px', color: '#888' }}>{imageFile ? "Ảnh mới chọn" : "Ảnh hiện tại"}</span>
            </div>
          </div>

          {/* Giá & Kho */}
          <div className={styles.row}>
            <div className={styles.formGroup}><label>Giá nhập</label><input type="number" value={formData.ImportPrice} onChange={e => setFormData({...formData, ImportPrice: Number(e.target.value)})} /></div>
            <div className={styles.formGroup}><label>Giá bán</label><input type="number" value={formData.ExportPrice} onChange={e => setFormData({...formData, ExportPrice: Number(e.target.value)})} /></div>
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}><label>Số lượng tồn</label><input type="number" value={formData.StockQuantity} onChange={e => setFormData({...formData, StockQuantity: Number(e.target.value)})} /></div>
            <div className={styles.formGroup}><label>Vị trí kho</label><input type="text" value={formData.Location} onChange={e => setFormData({...formData, Location: e.target.value})} /></div>
          </div>

          {/* Dropdowns với nút Thêm mới ở Label */}
          <div className={styles.row}>
            {/* Danh mục */}
            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Danh mục *</label>
                <button type="button" onClick={() => openAddModal('category', 'Danh mục')} className={styles.btnQuickAdd}>+ Thêm mới</button>
              </div>
              <Select options={categoryOptions} value={categoryOptions.find(o => o.value === formData.CategoryId) || null} onChange={(opt: any) => setFormData({...formData, CategoryId: opt?.value || 0})} />
            </div>

            {/* Thương hiệu */}
            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Thương hiệu *</label>
                <button type="button" onClick={() => openAddModal('brand', 'Thương hiệu')} className={styles.btnQuickAdd}>+ Thêm mới</button>
              </div>
              <Select options={brandOptions} value={brandOptions.find(o => o.value === formData.BrandId) || null} onChange={(opt: any) => setFormData({...formData, BrandId: opt?.value || 0})} />
            </div>

            {/* Đơn vị */}
            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Đơn vị *</label>
                <button type="button" onClick={() => openAddModal('unit', 'Đơn vị')} className={styles.btnQuickAdd}>+ Thêm mới</button>
              </div>
              <Select options={unitOptions} value={unitOptions.find(o => o.value === formData.UnitId) || null} onChange={(opt: any) => setFormData({...formData, UnitId: opt?.value || 0})} />
            </div>
          </div>

    {/* Thuộc tính kỹ thuật */}
        <div className={styles.attributesSection}>
          <div className={styles.attributesHeader} style={{ marginBottom: '15px' }}>
          <h3 className={styles.attributesTitle}>Thông số sản phẩm</h3>
          <button type="button" className={styles.btnAddAttribute} onClick={addAttributeRow}>
            + Thêm dòng
          </button>
        </div>

        {productAttributes.length > 0 && (
            <div className={styles.attributeLabelRow} style={{ display: 'flex', gap: '8px', marginBottom: '4px', padding: '0 5px' }}>
              <div style={{ flex: 2, fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Thuộc tính</div>
              <div style={{ flex: 2, fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Giá trị</div>
              <div style={{ flex: 1, fontSize: '13px', fontWeight: 'bold', color: '#666' }}>Đơn vị</div>
              <div style={{ width: '50px' }}></div> {/* Khoảng trống cho nút Xóa */}
            </div>
          )}

      {productAttributes.map((attr, index) => (
    <div key={index} className={styles.attributeRow} 
      style={{ 
        display: 'flex', 
        gap: '8px',            
        alignItems: 'center', 
        marginBottom: '-5px' // Chỉnh các dòng sát nhau theo ý bạn
      }}
    >
      {/* Cột Thuộc tính */}
      <div style={{ flex: 2, position: 'relative' }}>
        <Select 
          placeholder="-- Chọn --"
          options={attrDefOptions} 
          value={attrDefOptions.find(o => o.value === attr.attributeId) || null} 
          onChange={(opt: any) => handleAttributeSelect(index, opt?.value || 0)}
          isSearchable={true}
          isClearable={true}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '38px',
              height: '38px',
            }),
            valueContainer: (base) => ({ ...base, height: '38px', padding: '0 6px' }),
            indicatorsContainer: (base) => ({ ...base, height: '38px' }),
          }}
        />
        {/* Nút Thêm mới nhỏ gọn hiện đè lên Select khi chưa chọn giá trị */}
        {!attr.attributeId && (
          <button 
            type="button" 
            onClick={() => openAddAttributeModal(index)} 
            className={styles.btnQuickAddSmall}
            style={{ position: 'absolute', right: '35px', top: '7px', zIndex: 10 }}
          >
            + Thêm mới
          </button>
        )}
      </div>

      {/* Cột Giá trị */}
      <div style={{ flex: 2 }}>
        <input 
          type="text" 
          value={attr.value} 
          onChange={e => handleAttributeValueChange(index, e.target.value)} 
          placeholder="Nhập giá trị..." 
          style={{ width: '100%', height: '38px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      {/* Cột Đơn vị */}
      <div style={{ flex: 1 }}>
        <input 
          type="text" 
          value={attr.unit || ''} 
          readOnly 
          placeholder="đv" 
          style={{ width: '100%', height: '38px', padding: '0 10px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f9f9f9' }} 
        />
      </div>

      {/* Nút Xóa */}
      <button 
        type="button" 
        className={styles.btnRemoveAttribute} 
        onClick={() => removeAttributeRow(index)}
        style={{ 
          width: '50px', 
          height: '38px', 
          fontSize: '13px'
        }}
      >
        Xóa
      </button>
    </div>
  ))}
</div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="submit" className={styles.btnSubmit}>Lưu thay đổi</button>
          </div>
        </form>

        <ConfirmModal isOpen={showConfirm} onConfirm={handleConfirmSave} onCancel={() => setShowConfirm(false)} title="Xác nhận" message={`Lưu thay đổi cho ${product.name}?`} />
        
      <AttributeModal 
        isOpen={isAttrModalOpen} 
        onClose={() => setIsAttrModalOpen(false)} 
          onSave={async (payload) => {
  try {
    const data: any = { name: payload.name };
    if (attrModalType === 'attribute') data.unit = payload.unit;

    const res = await createAttribute(attrModalType, data); 
    const newItemId = res?.data?.id || res?.data?.Id || res?.id || res?.Id;

    if (res && newItemId) {
      alert("Thêm mới thành công!");

      const freshDefs = await refreshDefinitions(); 

      if (attrModalType === 'attribute') {
        if (activeAttributeIndex !== null) {
          const newAttr = freshDefs.find((d: any) => Number(d.id) === Number(newItemId));
          
          // Cập nhật state productAttributes mà không gọi lại API GetProductAttributes
          setProductAttributes(prev => prev.map((attr, idx) => {
            if (idx !== activeAttributeIndex) return attr;
            return { 
              ...attr, 
              attributeId: Number(newItemId), 
              name: newAttr?.name || payload.name,
              unit: newAttr?.unit || payload.unit 
            };
          }));
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [attrModalType === 'category' ? 'CategoryId' : 
           attrModalType === 'brand' ? 'BrandId' : 'UnitId']: Number(newItemId)
        }));
      }
      setIsAttrModalOpen(false);
    }
  } catch (error) {
    alert("Lỗi!");
  }
}}
        title={attrModalTitle} 
        parentOptions={categories.map(c => ({ id: c.id || c.Id, name: c.name || c.Name }))} 
      />
      </div>
    </div>
  );
}