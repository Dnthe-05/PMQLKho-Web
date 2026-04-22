import React, { useState, useEffect } from 'react';
import styles from '../../css/Product/AddProductForm.module.css'; 
import { 
  createProduct, 
  createCategory, 
  createBrand, 
  createUnit, 
  createAttribute, 
  getCategories, 
  getBrands, 
  getUnits, 
  getAttributes, 
  updateProductAttributes 
} from '../../services/Product/productService';
import Select from 'react-select';
import AttributeModal from "./AttributeModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AttributeRow {
  attributeId: string | number;
  value: string;
  unit: string;
}

const emptyAttributeRow = (): AttributeRow => ({ attributeId: '', value: '', unit: '' });

const extractItems = (result: any) => {
  return result?.data?.data?.items || result?.data?.items || result?.items || result?.data || result || [];
};

export default function AddProductForm({ isOpen, onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<any[]>([]);
  const [attributeRows, setAttributeRows] = useState<AttributeRow[]>([emptyAttributeRow()]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('/logo.png');


  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [attrModalType, setAttrModalType] = useState<'category' | 'brand' | 'unit' | 'attribute'>('category');
  const [attrModalTitle, setAttrModalTitle] = useState('');
  const [activeAttributeIndex, setActiveAttributeIndex] = useState<number | null>(null);

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
  });


  const refreshAllData = async () => {
    try {
      const params = { pageNumber: 1, pageSize: 1000 };
      const [catRes, brandRes, unitRes, attrRes]: any = await Promise.all([
        getCategories(params).catch(() => ({ items: [] })),
        getBrands(params).catch(() => ({ items: [] })),
        getUnits(params).catch(() => ({ items: [] })),
        getAttributes(params).catch(() => ({ items: [] })),
      ]);
      setCategories(extractItems(catRes));
      setBrands(extractItems(brandRes));
      setUnits(extractItems(unitRes));
      setAttributeOptions(extractItems(attrRes));
    } catch (error) {
      console.error("Lỗi load data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) refreshAllData();
  }, [isOpen]);


  const openQuickAdd = (type: 'category' | 'brand' | 'unit', title: string) => {
    setAttrModalType(type);
    setAttrModalTitle(title);
    setIsAttrModalOpen(true);
  };

const openAddAttributeModal = (index: number) => {
  setActiveAttributeIndex(index);
  setAttrModalType('attribute'); 
  setAttrModalTitle('Thuộc tính'); 
  setIsAttrModalOpen(true);
};

  const handleQuickAddSave = async (payload: any) => {
    try {
      let res: any;
      if (attrModalType === 'category') res = await createCategory(payload);
      else if (attrModalType === 'brand') res = await createBrand(payload);
      else if (attrModalType === 'unit') res = await createUnit('unit', payload);
      else if (attrModalType === 'attribute') res = await createAttribute('attribute', payload);

      const newId = res?.id || res?.data?.id;
      if (newId) {
        await refreshAllData(); 
        
        if (attrModalType === 'attribute' && activeAttributeIndex !== null) {
          handleAttributeChange(activeAttributeIndex, 'attributeId', String(newId));
        } else {
          const fieldMap = { category: 'CategoryId', brand: 'BrandId', unit: 'UnitId' };
          setFormData(prev => ({ ...prev, [fieldMap[attrModalType as keyof typeof fieldMap]]: String(newId) }));
        }
        alert("Thêm mới thành công!");
      }
      setIsAttrModalOpen(false);
    } catch (error) {
      alert("Lỗi khi thêm nhanh!");
    }
  };

  const addAttributeRow = () => setAttributeRows([...attributeRows, emptyAttributeRow()]);
  const removeAttributeRow = (index: number) => setAttributeRows(prev => prev.filter((_, idx) => idx !== index));

  const handleAttributeChange = (index: number, field: keyof AttributeRow, value: string) => {
    setAttributeRows((prev) => prev.map((row, idx) => {
      if (idx !== index) return row;
      const nextRow = { ...row, [field]: value };
      if (field === 'attributeId') {
        const selected = attributeOptions.find((item) => String(item.id) === String(value));
        nextRow.unit = selected?.unit || '';
      }
      return nextRow;
    }));
  };

  // Format số tiền
  const formatNumber = (val: number) => val === 0 ? "" : val.toLocaleString('vi-VN');
  const parseNumber = (val: string) => Number(val.replace(/\D/g, ""));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      const data = new FormData();
      data.append('Sku', formData.Sku);
      data.append('Name', formData.Name);
      data.append('Location', formData.Location);
      data.append('ImportPrice', String(formData.ImportPrice));
      data.append('ExportPrice', String(formData.ExportPrice));
      data.append('StockQuantity', String(formData.StockQuantity));
      data.append('CategoryId', formData.CategoryId);
      data.append('BrandId', formData.BrandId);
      data.append('UnitId', formData.UnitId);
      if (imageFile) data.append('image', imageFile);

      const res: any = await createProduct(data);
      const productId = res?.id || res?.data?.id;

      if (productId) {
        const attrs = attributeRows
          .filter(r => r.attributeId && r.value.trim())
          .map(r => ({ attributeId: Number(r.attributeId), value: r.value.trim() }));
        if (attrs.length > 0) await updateProductAttributes(productId, attrs);
        
        alert('Thêm sản phẩm thành công!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      const serverData = error.response?.data;
      if (serverData?.errors) setFieldErrors(serverData.errors);
      else alert('Lỗi hệ thống');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Thêm mới Sản phẩm</h2>
          <button onClick={onClose} className={styles.btnCloseHeader}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tên & SKU */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên sản phẩm *</label>
              <input type="text" required value={formData.Name} onChange={e => setFormData({...formData, Name: e.target.value})} placeholder="Nhập tên..." />
            </div>
            <div className={styles.formGroup}>
              <label>Mã SKU *</label>
              <input type="text" required value={formData.Sku} onChange={e => setFormData({...formData, Sku: e.target.value})} placeholder="SP-001" />
            </div>
          </div>

          {/* Category & Brand */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <div className={styles.labelWithBtn}>
                <label>Danh mục *</label>
                <button type="button" onClick={() => openQuickAdd('category', 'Danh mục')} className={styles.btnQuickAddRed}>+ Thêm mới</button>
              </div>
              <Select
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                value={categories.map(c => ({ value: c.id, label: c.name })).find(o => String(o.value) === formData.CategoryId) || null}
                onChange={(opt: any) => setFormData({...formData, CategoryId: String(opt?.value || '')})}
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.labelWithBtn}>
                <label>Thương hiệu *</label>
                <button type="button" onClick={() => openQuickAdd('brand', 'Thương hiệu')} className={styles.btnQuickAddRed}>+ Thêm mới</button>
              </div>
              <Select
                options={brands.map(b => ({ value: b.id, label: b.name }))}
                value={brands.map(b => ({ value: b.id, label: b.name })).find(o => String(o.value) === formData.BrandId) || null}
                onChange={(opt: any) => setFormData({...formData, BrandId: String(opt?.value || '')})}
              />
            </div>
          </div>

          {/* Unit & Location & Stock */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <div className={styles.labelWithBtn}>
                <label>Đơn vị tính *</label>
                <button type="button" onClick={() => openQuickAdd('unit', 'Đơn vị')} className={styles.btnQuickAddRed}>+ Thêm mới</button>
              </div>
              <Select
                options={units.map(u => ({ value: u.id, label: u.name }))}
                value={units.map(u => ({ value: u.id, label: u.name })).find(o => String(o.value) === formData.UnitId) || null}
                onChange={(opt: any) => setFormData({...formData, UnitId: String(opt?.value || '')})}
              />
            </div>
            <div className={styles.formGroup}><label>Vị trí</label><input type="text" value={formData.Location} onChange={e => setFormData({...formData, Location: e.target.value})} placeholder="Kệ A..." /></div>
            <div className={styles.formGroup}><label>Tồn kho</label><input type="text" value={formatNumber(formData.StockQuantity)} onChange={e => setFormData({...formData, StockQuantity: parseNumber(e.target.value)})} /></div>
          </div>

          {/* Giá Nhập & Giá Bán */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Giá nhập (VNĐ) *</label>
              <input type="text" required value={formatNumber(formData.ImportPrice)} onChange={e => setFormData({...formData, ImportPrice: parseNumber(e.target.value)})} />
            </div>
            <div className={styles.formGroup}>
              <label>Giá bán (VNĐ) *</label>
              <input type="text" required value={formatNumber(formData.ExportPrice)} onChange={e => setFormData({...formData, ExportPrice: parseNumber(e.target.value)})} />
            </div>
          </div>

          {/* Hình ảnh */}
          <div className={styles.formGroup}>
            <label>Hình ảnh sản phẩm</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
              <span style={{ fontSize: '12px', color: '#888' }}>{imageFile ? "Ảnh đã chọn" : "Ảnh mặc định"}</span>
            </div>
          </div>

          {/* Thông số sản phẩm */}
          <div className={styles.attributesSection} style={{ marginTop: '20px' }}>
            <div className={styles.attributesHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Thông số sản phẩm</h3>
              <button type="button" className={styles.btnAddAttribute} onClick={addAttributeRow}>+ Thêm dòng</button>
            </div>

            {attributeRows.map((row, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ flex: 2, position: 'relative' }}>
                  <Select
                    placeholder="-- Thuộc tính --"
                    options={attributeOptions.map(a => ({ value: String(a.id), label: a.name }))}
                    value={attributeOptions.map(a => ({ value: String(a.id), label: a.name })).find(o => o.value === String(row.attributeId)) || null}
                    onChange={(opt: any) => handleAttributeChange(index, 'attributeId', opt?.value || '')}
                    styles={{ control: (b) => ({ ...b, minHeight: '38px' }) }}
                  />
                  {!row.attributeId && (
                    <button 
                      type="button" 
                      onClick={() => openAddAttributeModal(index)} 
                      style={{ position: 'absolute', right: '35px', top: '8px', zIndex: 10, padding: '2px 6px', fontSize: '10px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      + Thêm mới
                    </button>
                  )}
                </div>
                <input style={{ flex: 2, height: '38px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Giá trị..." value={row.value} onChange={e => handleAttributeChange(index, 'value', e.target.value)} />
                <input style={{ flex: 1, height: '38px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }} placeholder="đv" value={row.unit} onChange={e => handleAttributeChange(index, 'unit', e.target.value)} />
                
                <button 
                  type="button" 
                  onClick={() => removeAttributeRow(index)}
                  style={{ 
                    width: '55px', height: '38px', border: '1px solid #ffccc7', backgroundColor: '#fff2f0', color: '#ff4d4f', borderRadius: '4px', cursor: 'pointer', transition: '0.2s' 
                  }}
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = '#ff4d4f'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff2f0'; e.currentTarget.style.color = '#ff4d4f'; }}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className={styles.formActions} style={{ marginTop: '20px' }}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Hủy bỏ</button>
            <button type="submit" className={styles.btnSubmit}>Lưu sản phẩm</button>
          </div>
        </form>

        <AttributeModal
          isOpen={isAttrModalOpen}
          title={attrModalTitle} 
          onClose={() => setIsAttrModalOpen(false)}
          onSave={handleQuickAddSave}
          parentOptions={categories} 
        />
      </div>
    </div>
  );
}