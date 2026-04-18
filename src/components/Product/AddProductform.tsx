import React, { useState, useEffect } from 'react';
import styles from '../../css/Product/AddProductForm.module.css'; 
import { createProduct, createCategory, createBrand, createUnit, getCategories, getBrands, getUnits, getAttributes, updateProductAttributes } from '../../services/Product/productService';

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
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');

  const [formData, setFormData] = useState({
    Sku: '', 
    Name: '', 
    Location: '',
    ImportPrice: 0, 
    ExportPrice: 0, 
    StockQuantity: 0,
    CategoryId: '', 
    CategoryName: '',
    BrandId: '', 
    BrandName: '',
    UnitId: '', 
    UnitName: '',
    Image: '' 
  });

  const loadOptionData = async (search: string, getFn: (params?: any) => Promise<any>, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const params: any = { pageNumber: 1, pageSize: 20 };
      if (search) {
        params.searchTerm = search;
        params.search = search;
      }
      const response: any = await getFn(params);
      setter(extractItems(response));
    } catch (err) {
      console.error('Lỗi load option:', err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        await Promise.all([
          loadOptionData(categorySearch, getCategories, setCategories),
          loadOptionData(brandSearch, getBrands, setBrands),
          loadOptionData(unitSearch, getUnits, setUnits),
        ]);

        const attrRes: any = await getAttributes();
        setAttributeOptions(extractItems(attrRes));
        setAttributeRows([emptyAttributeRow()]);
      } catch (err) {
        console.error('Lỗi load dữ liệu:', err);
      }
    };

    loadData();
  }, [isOpen, categorySearch, brandSearch, unitSearch]);

  if (!isOpen) return null;

  const formatNumber = (value: number | string) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  const handleAttributeChange = (index: number, field: keyof AttributeRow, value: string) => {
    setAttributeRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== index) return row;
        const nextRow = { ...row, [field]: value };
        if (field === 'attributeId') {
          const selected = attributeOptions.find((item) => Number(item.id) === Number(value));
          nextRow.unit = selected?.unit || '';
        }
        return nextRow;
      })
    );
  };

  const addAttributeRow = () => {
    setAttributeRows((prev) => [...prev, emptyAttributeRow()]);
  };

  const removeAttributeRow = (index: number) => {
    setAttributeRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const findOptionByName = (items: any[], name: string) => {
    return items.find((item) => item.name?.trim().toLowerCase() === name?.trim().toLowerCase());
  };

  const handleEntityInputChange = (field: 'CategoryName' | 'BrandName' | 'UnitName', value: string) => {
    const updated: any = { ...formData, [field]: value };
    if (field === 'CategoryName') {
      const matched = findOptionByName(categories, value);
      updated.CategoryId = matched ? String(matched.id) : '';
      setCategorySearch(value);
    }
    if (field === 'BrandName') {
      const matched = findOptionByName(brands, value);
      updated.BrandId = matched ? String(matched.id) : '';
      setBrandSearch(value);
    }
    if (field === 'UnitName') {
      const matched = findOptionByName(units, value);
      updated.UnitId = matched ? String(matched.id) : '';
      setUnitSearch(value);
    }
    setFormData(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const resolveOrCreateEntity = async (
    name: string,
    idValue: string,
    options: any[],
    getFn: (params?: any) => Promise<any>,
    createFn: (data: { name: string }) => Promise<any>
  ) => {
    const trimmedName = name?.trim();
    if (!trimmedName) return 0;

    const existing = findOptionByName(options, trimmedName);
    if (existing) return Number(existing.id);

    if (idValue && Number(idValue) > 0) {
      return Number(idValue);
    }

    try {
      const response: any = await getFn({ pageNumber: 1, pageSize: 20, searchTerm: trimmedName, search: trimmedName });
      const foundItems = extractItems(response);
      const found = findOptionByName(foundItems, trimmedName);
      if (found) return Number(found.id);
    } catch (err) {
      console.warn('Không tìm thấy thực thể theo tên, sẽ tạo mới nếu cần:', err);
    }

    const created = await createFn({ name: trimmedName });
    return Number(created?.id || created?.data?.id || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const formDataToSend = new FormData();
      const resolvedCategoryId = await resolveOrCreateEntity(
        formData.CategoryName,
        formData.CategoryId,
        categories,
        getCategories,
        createCategory
      );
      const resolvedBrandId = await resolveOrCreateEntity(
        formData.BrandName,
        formData.BrandId,
        brands,
        getBrands,
        createBrand
      );
      const resolvedUnitId = await resolveOrCreateEntity(
        formData.UnitName,
        formData.UnitId,
        units,
        getUnits,
        (payload) => createUnit('unit', payload)
      );

      if (!resolvedCategoryId || !resolvedBrandId || !resolvedUnitId) {
        alert('Vui lòng chọn hoặc nhập đầy đủ danh mục, thương hiệu và đơn vị.');
        return;
      }

      formDataToSend.append('Sku', formData.Sku);
      formDataToSend.append('Name', formData.Name);
      formDataToSend.append('Location', formData.Location);
      formDataToSend.append('ImportPrice', String(formData.ImportPrice));
      formDataToSend.append('ExportPrice', String(formData.ExportPrice));
      formDataToSend.append('StockQuantity', String(formData.StockQuantity));
      formDataToSend.append('CategoryId', String(resolvedCategoryId));
      formDataToSend.append('BrandId', String(resolvedBrandId));
      formDataToSend.append('UnitId', String(resolvedUnitId));
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const res: any = await createProduct(formDataToSend);
      const productId = Number(res?.id || res?.data?.id || res?.product?.id);

      if (!productId) {
        throw new Error('Không lấy được ID sản phẩm sau khi tạo');
      }

      const attributePayload = attributeRows
        .filter((row) => row.attributeId && row.value.trim())
        .map((row) => ({
          attributeId: Number(row.attributeId),
          value: row.value.trim(),
        }));

      if (attributePayload.length > 0) {
        await updateProductAttributes(productId, attributePayload);
      }

      alert('Thêm sản phẩm thành công!');
      onSuccess();
      onClose();
      setFormData({ 
        Sku: '', Name: '', Location: '', 
        ImportPrice: 0, ExportPrice: 0, StockQuantity: 0, 
        CategoryId: '', CategoryName: '', BrandId: '', BrandName: '', UnitId: '', UnitName: '', Image: '' 
      });
      setAttributeRows([emptyAttributeRow()]);
      setImageFile(null);
      setImagePreview('/logo.png');
    } catch (error: any) {
      const serverData = error.response?.data;
      if (serverData?.errors) setFieldErrors(serverData.errors);
      else alert('Lỗi: ' + (serverData?.message || 'Không thể lưu sản phẩm'));
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

        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              <input
                list="categoryOptions"
                required
                value={formData.CategoryName}
                onChange={(e) => handleEntityInputChange('CategoryName', e.target.value)}
                placeholder="Chọn hoặc nhập danh mục"
              />
              <datalist id="categoryOptions">
                {categories?.map((c: any) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
            <div className={styles.formGroup}>
              <label>Thương hiệu *</label>
              <input
                list="brandOptions"
                required
                value={formData.BrandName}
                onChange={(e) => handleEntityInputChange('BrandName', e.target.value)}
                placeholder="Chọn hoặc nhập thương hiệu"
              />
              <datalist id="brandOptions">
                {brands?.map((b: any) => (
                  <option key={b.id} value={b.name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* PHẦN 3: Kho & Đơn vị */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Đơn vị tính *</label>
              <input
                list="unitOptions"
                required
                value={formData.UnitName}
                onChange={(e) => handleEntityInputChange('UnitName', e.target.value)}
                placeholder="Chọn hoặc nhập đơn vị"
              />
              <datalist id="unitOptions">
                {units?.map((u: any) => (
                  <option key={u.id} value={u.name} />
                ))}
              </datalist>
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

          {/* PHẦN 5: Hình ảnh */ }
          <div className={styles.formGroup}>
            <label>Chọn ảnh sản phẩm</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
            />
            
            <div className={styles.previewContainer} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
              <span style={{ fontSize: '12px', color: '#888' }}>
                {imageFile ? "Xem trước ảnh đã chọn" : "Sẽ dùng logo mặc định nếu không chọn ảnh"}
              </span>
            </div>
          </div>

          <div className={styles.attributesSection}>
            <div className={styles.attributesHeader}>
              <h3>Thuộc tính thêm</h3>
              <button type="button" className={styles.btnAddAttribute} onClick={addAttributeRow}>
                + Thêm thuộc tính
              </button>
            </div>
            {attributeRows.map((row, index) => (
              <div key={index} className={styles.attributeRow}>
                <div className={styles.formGroup}>
                  <label>Tên thuộc tính</label>
                  <select
                    value={row.attributeId}
                    onChange={(e) => handleAttributeChange(index, 'attributeId', e.target.value)}
                  >
                    <option value="">-- Chọn thuộc tính --</option>
                    {attributeOptions.map((attr: any) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Giá trị</label>
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    placeholder="Nhập giá trị..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Đơn vị</label>
                  <input
                    type="text"
                    value={row.unit}
                    onChange={(e) => handleAttributeChange(index, 'unit', e.target.value)}
                    placeholder="Ví dụ: cm, kg..."
                  />
                </div>
                <button type="button" className={styles.btnRemoveAttribute} onClick={() => removeAttributeRow(index)}>
                  Xóa
                </button>
              </div>
            ))}
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