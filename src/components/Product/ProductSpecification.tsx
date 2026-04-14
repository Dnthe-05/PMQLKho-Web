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
        <h3 className={styles.title}>Thông số kỹ thuật</h3>
        <p className={styles.productName}>{data.productName}</p>
      </div>

      <div className={styles.specTable}>
        {data.attributes.length > 0 ? (
          data.attributes.map((attr, index) => (
            <div key={index} className={styles.row}>
              <div className={styles.label}>{attr.name}</div>
              <div className={styles.value}>
                {attr.value} <span className={styles.unit}>{attr.unit}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noData}>Sản phẩm này chưa có thuộc tính nào.</div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecification;