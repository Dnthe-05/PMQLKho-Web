import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type ProductAttributeGroup } from '../../types/ProductAttribute/productAttribute';
import { type Product } from '../../types/Product/product';
import { getProductById, getProductAttributes } from '../../services/Product/productService';
import EditProductForm from './EditProductForm';
import styles from '../../css/Product/ProductDetailPage.module.css';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const getFullImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return '/logo.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const normalizedBase = baseURL.replace(/\/+$/g, '');
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${normalizedBase}${normalizedPath}`;
};

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Khai báo 2 state cho 2 nguồn dữ liệu
    const [product, setProduct] = useState<Product | null>(null);
    const [attributes, setAttributes] = useState<ProductAttributeGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchAllData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const [productRes, attrRes] = await Promise.all([
                getProductById(parseInt(id)),
                getProductAttributes(parseInt(id)),
            ]);
            setProduct(productRes);
            setAttributes(attrRes);
        } catch (error) {
            console.error("Lỗi rồi đệ tử ơi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [id]);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (!product) return <div>Không tìm thấy sản phẩm!</div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>&larr; Quay lại</button>
                {/* <h2 className={styles.pageTitle}>Chi tiết sản phẩm</h2> */}
                <button className={styles.editBtn} onClick={() => setIsEditOpen(true)}>
                    Sửa sản phẩm
                </button>
            </div>

            <div className={styles.content}>
                {/* CỘT TRÁI: HIỂN THỊ TỪ INTERFACE PRODUCT */}
                <div className={styles.leftInfo}>
                    <div className={styles.productCard}>
                        <div className={styles.imageBox}>
                            <img src={getFullImageUrl(product.image)} alt={product.name} />
                        </div>
                        <div className={styles.mainDetails}>
                            <div className={styles.headerRow}>
                                <div>
                                  <h1>{product.name}</h1>
                                  <p className={styles.sku}>SKU: {product.sku}</p>
                                </div>
                                {product.deletedAt && <span className={styles.badge}>Đã xóa</span>}
                            </div>

                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Mã sản phẩm</span>
                                    <span>{product.id}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Danh mục</span>
                                    <span>{product.categoryName || '—'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Thương hiệu</span>
                                    <span>{product.brandName || '—'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Đơn vị</span>
                                    <span>{product.unitName || '—'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Giá nhập</span>
                                    <span>{product.importPrice?.toLocaleString()}đ</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Giá bán</span>
                                    <span>{product.exportPrice?.toLocaleString()}đ</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Tồn kho</span>
                                    <span>{product.stockQuantity} {product.unitName || ''}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Vị trí</span>
                                    <span>{product.location || '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: HIỂN THỊ TỪ INTERFACE PRODUCTATTRIBUTEGROUP */}
                <div className={`${styles.rightSpec} ${styles.specCard}`}>
                    <h3 className={styles.specTitle}>Thông số kỹ thuật</h3>
                    <table className={styles.specTable}>
                        <tbody>
                            {attributes?.attributes && attributes.attributes.length > 0 ? (
                                attributes.attributes.map((attr, index) => (
                                    <tr key={index}>
                                        <td className={styles.attrName}>{attr.name}</td>
                                        <td className={styles.attrValue}>
                                            {attr.value} {attr.unit || ''}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={2}>Không có thông số kỹ thuật.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <EditProductForm
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSuccess={() => {
                    setIsEditOpen(false);
                    fetchAllData();
                }}
                product={product}
            />
        </div>
    );
};

export default ProductDetailPage;