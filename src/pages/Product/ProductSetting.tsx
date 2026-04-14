import { useState, useEffect, useCallback } from 'react';
import { 
  getCategories, 
  getBrands, 
  getUnits, 
  getAttributes, 
  type BaseAttribute 
} from '../../services/Product/productService';
import AttributeTable from '../../components/Product/AttributeTable';
import styles from '../../css/Product/ProductSetting.module.css';
import Pagination from '../../components/Pagination';
import AttributeModal from '../../components/Product/AttributeModal';
import { createAttribute, updateAttribute, deleteAttribute } from '../../services/Product/productService';


type TabType = 'category' | 'brand' | 'unit' | 'attribute';

export default function ProductSetting() {
  const [activeTab, setActiveTab] = useState<TabType>('category');
  const [listData, setListData] = useState<BaseAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10; 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);


const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const params = { pageNumber: currentPage, pageSize: pageSize }; // Bỏ searchTerm ở đây
        let response: any;
        if (activeTab === 'category') response = await getCategories(params);
        else if (activeTab === 'brand') response = await getBrands(params);
        else if (activeTab === 'unit') response = await getUnits(params);
        else response = await getAttributes(params);

        const apiResponse = response;
        const pagedData = apiResponse.data;

        if (apiResponse.success && pagedData) {
            const items = pagedData.items || pagedData.Items;
            setListData(items || []); // listData sẽ giữ toàn bộ dữ liệu gốc từ server
            setTotalItems(pagedData.totalCount || pagedData.TotalCount);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
}, [activeTab, currentPage]);

  const filteredData = listData.filter(item => {
    const name = item.name || (item as any).Name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
});

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  useEffect(() => { 
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const getTabLabel = () => {
    switch (activeTab) {
      case 'category': return 'Danh mục';
      case 'brand': return 'Thương hiệu';
      case 'unit': return 'Đơn vị tính';
      case 'attribute': return 'Thuộc tính';
      default: return '';
    }
  };

  const handleSave = async (name: string) => {
    try {
      let res;
      if (selectedItem) {
        // Nếu có selectedItem là đang Sửa
        const id = selectedItem.id || selectedItem.Id;
        res = await updateAttribute(activeTab, id, { name });
      } else {
        // Không có là Thêm mới
        res = await createAttribute(activeTab, { name });
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchData(); // Cập nhật lại bảng ngay lập tức
      } else {
        alert(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  };
  const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Sư phụ hỏi lại: Con có chắc muốn xóa mục này không?");
        if (!confirmDelete) return;

        try {
            // activeTab chính là 'category', 'brand', 'unit', hoặc 'attribute'
            const res = await deleteAttribute(activeTab, id);
            
            if (res.success) {
                alert("Xóa thành công rồi đệ tử!");
                fetchData(); // Gọi lại hàm load dữ liệu để bảng cập nhật mới
            } else {
                alert(res.message || "Xóa thất bại rồi!");
            }
        } catch (error) {
            console.error("Lỗi xóa:", error);
            alert("Lỗi hệ thống, kiểm tra lại Backend nhé!");
        }
    };

  return (
    <div className="p-8 max-w-6xl mx-auto">
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

      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all ${loading ? 'opacity-60' : ''}`}>
        <AttributeTable 
          title={getTabLabel()} 
          data={filteredData}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAdd={() => {
          setSelectedItem(null); // Thêm mới thì item là null
          setIsModalOpen(true);
        }}
          onEdit={(item) => {
          setSelectedItem(item); // Sửa thì gán item vào
          setIsModalOpen(true);
        }}
          onDelete={handleDelete}
        />
        <AttributeModal 
        isOpen={isModalOpen}
        title={getTabLabel()}
        initialData={selectedItem ? { name: selectedItem.name || selectedItem.Name } : null}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        
      />
        
        {totalItems > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-center bg-white">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}