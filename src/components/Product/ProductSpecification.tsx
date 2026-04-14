import React from 'react';
import {type ProductAttributeGroup } from '../../types/ProductAttribute/productAttribute';
import styles from '../../css/Product/ProductSpecification.module.css';

interface Props {
  data: ProductAttributeGroup;
}

const ProductSpecification: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Thông số kỹ thuật chi tiết</h3>
        <p className={styles.productName}>{data.productName}</p>
      </div>

      <div className={styles.specTable}>
        {data.attributes && data.attributes.length > 0 ? (
          data.attributes.map((attr, index) => (
            <div key={index} className={styles.row}>
              <div className={styles.label}>{attr.name}</div>
              <div className={styles.value}>
                {attr.value} 
                {attr.unit && <span className={styles.unit}>{attr.unit}</span>}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noData}>
            <p>Sản phẩm này hiện chưa cập nhật thông số.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecification;