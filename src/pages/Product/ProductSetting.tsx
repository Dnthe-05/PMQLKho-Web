import React, { useState, useEffect } from 'react';
import { getCategories, getBrands, getUnits, getAttributes, type BaseAttribute } from '../../services/Product/productService';
import AttributeTable from '../../components/Product/AttributeTable';
import styles from '../../css/Product/ProductSetting.module.css';

type TabType = 'category' | 'brand' | 'unit' | 'attribute';

export default function ProductSetting() {
  const [activeTab, setActiveTab] = useState<TabType>('category');
  const [listData, setListData] = useState<BaseAttribute[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res: any;
      if (activeTab === 'category') res = await getCategories();
      else if (activeTab === 'brand') res = await getBrands();
      else if (activeTab === 'unit') res = await getUnits();
      else if (activeTab === 'attribute') res = await getAttributes(); 
      
      // Bóc tách dữ liệu nếu API có phân trang (trả về .items)
      const finalData = res?.items || res?.data?.items || res || [];
      setListData(finalData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setListData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [activeTab]);

  // Hàm hỗ trợ lấy nhãn hiển thị cho Title
  const getTabLabel = () => {
    switch (activeTab) {
      case 'category': return 'Danh mục';
      case 'brand': return 'Thương hiệu';
      case 'unit': return 'Đơn vị tính';
      case 'attribute': return 'Thuộc tính';
      default: return '';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* THANH TAB MENU THEO CSS MỚI */}
      <div className={styles.tabContainer}>
        {[
          { key: 'category', label: 'Danh mục' },
          { key: 'brand', label: 'Thương hiệu' },
          { key: 'unit', label: 'Đơn vị tính' },
          { key: 'attribute', label: 'Thuộc tính' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* BẢNG DỮ LIỆU ĐỘNG */}
      <AttributeTable 
        title={getTabLabel()} 
        data={listData}
        onAdd={() => console.log("Mở Modal Thêm mới cho " + activeTab)}
        onEdit={(item: BaseAttribute) => console.log("Sửa: ", item)}
        onDelete={(id: number) => console.log("Xóa ID: ", id)}
      />
      
      {loading && <p className="text-center mt-4 text-gray-500">Đang tải dữ liệu...</p>}
    </div>
  );
}