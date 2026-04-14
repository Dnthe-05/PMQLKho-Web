import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {type ProductAttributeGroup } from '../../types/ProductAttribute/productAttribute';
import {getProductAttributes} from '../../services/Product/productService';
import ProductSpecification from '../../components/Product/ProductSpecification';
import styles from '../../css/Product/ProductDetailPage.module.css';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [attrData, setAttrData] = useState<ProductAttributeGroup | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const result = await getProductAttributes(parseInt(id));
                setAttrData(result);
            } catch (err: any) {
                // console.error("Lỗi khi tải chi tiết sản phẩm:", err);
                setError("Không thể tải thông số kỹ thuật. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className={styles.loading}>Đang tải thông số kỹ thuật...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!attrData) return <div className={styles.noData}>Không tìm thấy dữ liệu sản phẩm.</div>;

    return (
        <div className={styles.pageContainer}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                &larr; Quay lại danh sách
            </button>

            <h2 className={styles.pageTitle}>Chi tiết thuộc tính sản phẩm</h2>

            <div className={styles.content}>
                <ProductSpecification data={attrData} />
            </div>
        </div>
    );
};

export default ProductDetailPage;