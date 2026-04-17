import React, { useState, useEffect } from "react";
import styles from "../../css/Product/EditProductForm.module.css";
import {
  updateProduct,
  getCategories,
  getBrands,
  getUnits,
  getAttributes,
  getProductAttributes,
  updateProductAttributes,
} from "../../services/Product/productService";
import ConfirmModal from "../ConfirmModal";
import { type UpdateProductDto } from "../../types/Product/updateProductDto";
import type { Product } from "../../types/Product/product";
import Select from 'react-select'; 


interface EditableAttribute {
  attributeId: number;
  name: string;
  value: string;
  unit?: string;
  missingId?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getFullImageUrl = (imagePath: string) => {
  if (!imagePath) return '/logo.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const normalizedBase = baseURL.replace(/\/+$/g, '');
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function EditProductForm({
  isOpen,
  onClose,
  onSuccess,
  product,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [productAttributes, setProductAttributes] = useState<EditableAttribute[]>([]);
  const [initialAttributeCount, setInitialAttributeCount] = useState<number>(0);
  const [attributeDefinitions, setAttributeDefinitions] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState<UpdateProductDto>({
    Name: "",
    SKU: "",
    Image: "",
    Location: "",
    ImportPrice: 0,
    ExportPrice: 0,
    StockQuantity: 0,
    CategoryId: 0,
    BrandId: 0,
    UnitId: 0,
  });


    useEffect(() => {
    const fetchSelectData = async () => {
      if (!product) return;
      try {
        const params = { pageNumber: 1, pageSize: 1000 }; 

        const [catRes, brandRes, unitRes, attributesRes, productAttrRes]: any = await Promise.all([
          getCategories(params),
          getBrands(params),
          getUnits(params),
          getAttributes(params),
          getProductAttributes(Number(product.id)),
        ]);

        const extractItems = (res: any) => res?.items || res?.data?.items || res || [];

        const cats = extractItems(catRes);
        const brds = extractItems(brandRes);
        const unts = extractItems(unitRes);
        const attrDefs = extractItems(attributesRes);

        setCategories(cats);
        setBrands(brds);
        setUnits(unts);
        setAttributeDefinitions(attrDefs);

        const productAttrList = productAttrRes?.attributes || productAttrRes?.data?.attributes || productAttrRes || [];
        
      } catch (error) {
        console.error("Lỗi lấy danh sách dropdown:", error);
      }
    };

    if (isOpen) fetchSelectData();
  }, [isOpen, product]);

  useEffect(() => {
    const isDataReady =
      categories.length > 0 && brands.length > 0 && units.length > 0;

    if (product && isOpen && isDataReady) {
      const cId =
        (product as any).categoryId || (product as any).category?.id || 0;
      const bId = (product as any).brandId || (product as any).brand?.id || 0;
      const uId = (product as any).unitId || (product as any).unit?.id || 0;

      setFormData({
        Name: product.name || "",
        SKU: product.sku || "",
        Image: product.image || "",
        Location: product.location || "",
        ImportPrice: product.importPrice || 0,
        ExportPrice: product.exportPrice || 0,
        StockQuantity: product.stockQuantity || 0,
        CategoryId: Number(cId),
        BrandId: Number(bId),
        UnitId: Number(uId),
      });
      setImagePreview(product.image ? getFullImageUrl(product.image) : '/logo.png');
      setImageFile(null);
    }
  }, [product, isOpen, categories, brands, units]);

  

  if (!isOpen || !product) return null;

  const handleAttributeSelect = (index: number, attributeId: number) => {
    setProductAttributes((prev) =>
      prev.map((attr, idx) => {
        if (idx !== index) return attr;
        const selected = attributeDefinitions.find((def) => Number(def.id) === Number(attributeId));
        return {
          ...attr,
          attributeId: Number(attributeId),
          name: selected?.name || "",
          unit: selected?.unit || "",
          missingId: !selected,
        };
      })
    );
  };

  const handleAttributeValueChange = (index: number, value: string) => {
    setProductAttributes((prev) =>
      prev.map((attr, idx) =>
        idx === index ? { ...attr, value } : attr
      )
    );
  };

  const addAttributeRow = () => {
    setProductAttributes((prev) => [...prev, { attributeId: 0, name: "", value: "", unit: "", missingId: false }]);
  };

  const removeAttributeRow = (index: number) => {
    setProductAttributes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.CategoryId === 0 ||
      formData.BrandId === 0 ||
      formData.UnitId === 0
    ) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    const invalidRows = productAttributes.filter(
      (attr) =>
        (!attr.attributeId && attr.value.trim()) ||
        (attr.attributeId > 0 && !attr.value.trim())
    );
    if (invalidRows.length > 0) {
      alert("Vui lòng chọn tên thuộc tính và nhập giá trị cho tất cả các hàng.");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.Name);
      formDataToSend.append('SKU', formData.SKU);
      formDataToSend.append('Location', formData.Location);
      formDataToSend.append('ImportPrice', String(formData.ImportPrice));
      formDataToSend.append('ExportPrice', String(formData.ExportPrice));
      formDataToSend.append('StockQuantity', String(formData.StockQuantity));
      formDataToSend.append('CategoryId', String(formData.CategoryId));
      formDataToSend.append('BrandId', String(formData.BrandId));
      formDataToSend.append('UnitId', String(formData.UnitId));
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await updateProduct(Number(product.id), formDataToSend);

      const attributeUpdates = productAttributes
        .filter((attr) => attr.attributeId > 0 && attr.value.trim())
        .map((attr) => ({
          attributeId: Number(attr.attributeId),
          value: attr.value.trim(),
        }));

      const shouldUpdateAttributes =
        attributeUpdates.length > 0 || initialAttributeCount > 0;

      if (shouldUpdateAttributes) {
        await updateProductAttributes(Number(product.id), attributeUpdates);
      }

      alert("Cập nhật thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi cập nhật sản phẩm!");
    }
  };


    const categoryOptions = categories.map(c => ({ value: Number(c.id), label: c.name }));
    const brandOptions = brands.map(b => ({ value: Number(b.id), label: b.name }));
    const unitOptions = units.map(u => ({ value: Number(u.id), label: u.name }));
    const attrDefOptions = attributeDefinitions.map(a => ({ value: Number(a.id), label: a.name }));


    const customSelectStyles = {
      control: (base: any) => ({
        ...base,
        minHeight: '42px',
        borderRadius: '6px',
        borderColor: '#ddd'
      })
    };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Cập nhật Sản phẩm</h2>
            <p className={styles.modalSubtitle}>Đang sửa: {product.name}</p>
          </div>
          <button onClick={onClose} className={styles.btnCloseHeader}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Tên sản phẩm *</label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) =>
                  setFormData({ ...formData, Name: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mã SKU *</label>
              <input
                type="text"
                value={formData.SKU}
                onChange={(e) =>
                  setFormData({ ...formData, SKU: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Chọn ảnh sản phẩm</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
              <span style={{ fontSize: '12px', color: '#888' }}>
                {imageFile ? "Xem trước ảnh mới đã chọn" : "Hiển thị ảnh hiện tại"}
              </span>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Giá nhập</label>
              <input
                type="number"
                value={formData.ImportPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ImportPrice: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Giá xuất</label>
              <input
                type="number"
                value={formData.ExportPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ExportPrice: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Số lượng tồn</label>
              <input
                type="number"
                value={formData.StockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    StockQuantity: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vị trí kho</label>
              <input
                type="text"
                value={formData.Location}
                onChange={(e) =>
                  setFormData({ ...formData, Location: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.row}>
              {/* Danh mục */}
            <div className={styles.formGroup}>
              <label style={{ fontWeight: 'bold' }}>Danh mục *</label>
              <Select
                placeholder="-- Chọn danh mục --"
                options={categoryOptions}
                // Tìm object tương ứng từ value trong formData để hiển thị
                value={categoryOptions.find(opt => opt.value === formData.CategoryId) || null}
                onChange={(opt) => setFormData({ 
                  ...formData, 
                  CategoryId: opt ? opt.value : 0 
                })}
                isSearchable={true} // Cho phép nhập để tìm
                isClearable={true}
                classNamePrefix="react-select" // Giúp dễ dàng custom CSS nếu cần
              />
            </div>

            {/* Thương hiệu */}
            <div className={styles.formGroup}>
              <label style={{ fontWeight: 'bold' }}>Thương hiệu *</label>
              <Select
                placeholder="-- Chọn thương hiệu --"
                options={brandOptions}
                value={brandOptions.find(opt => opt.value === formData.BrandId) || null}
                onChange={(opt) => setFormData({ 
                  ...formData, 
                  BrandId: opt ? opt.value : 0 
                })}
                isSearchable={true}
                isClearable={true}
              />
            </div>

            {/* Đơn vị */}
            <div className={styles.formGroup}>
              <label style={{ fontWeight: 'bold' }}>Đơn vị *</label>
              <Select
                placeholder="-- Chọn đơn vị --"
                options={unitOptions}
                value={unitOptions.find(opt => opt.value === formData.UnitId) || null}
                onChange={(opt) => setFormData({ 
                  ...formData, 
                  UnitId: opt ? opt.value : 0 
                })}
                isSearchable={true}
                isClearable={true}
              />
            </div>
          </div>

          <div className={styles.attributesSection}>
            <div className={styles.attributesHeader}>
              <h3 className={styles.attributesTitle}>Thông số sản phẩm</h3>
              <button type="button" className={styles.btnAddAttribute} onClick={addAttributeRow}>
                + Thêm thuộc tính
              </button>
            </div>
            {productAttributes.map((attr, index) => (
              <div key={index} className={styles.attributeRow}>
                <div className={styles.formGroup}>
                  <label>Thuộc tính</label>
                  <select
                    value={attr.attributeId || ''}
                    onChange={(e) => handleAttributeSelect(index, Number(e.target.value))}
                  >
                    <option value="">-- Chọn thuộc tính --</option>
                    {attributeDefinitions.map((def) => (
                      <option key={def.id} value={def.id}>
                        {def.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Giá trị</label>
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => handleAttributeValueChange(index, e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Đơn vị</label>
                  <input type="text" value={attr.unit || ''} readOnly />
                </div>
                <button type="button" className={styles.btnRemoveAttribute} onClick={() => removeAttributeRow(index)}>
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnCancel}
            >
              Hủy bỏ
            </button>
            <button type="submit" className={styles.btnSubmit}>
              Lưu thay đổi
            </button>
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
