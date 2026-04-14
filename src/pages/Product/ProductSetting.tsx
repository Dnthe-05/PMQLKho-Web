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
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
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

  useEffect(() => {
    const loadCategoryOptions = async () => {
      if (activeTab !== 'category') return;

      try {
        const allItems: any[] = [];
        let pageNumber = 1;
        const pageSizeForList = 50;

        while (true) {
          const response: any = await getCategories({ pageNumber, pageSize: pageSizeForList });
          const pagedData = response.data || response;
          const items = pagedData?.items || pagedData?.Items || response.items || response || [];
          const nextItems = Array.isArray(items) ? items : [];
          allItems.push(...nextItems);

          const totalCount = pagedData?.totalCount || pagedData?.TotalCount;
          if (!nextItems.length) break;
          if (totalCount && allItems.length >= totalCount) break;

          pageNumber += 1;
          if (pageNumber > 20) break;
        }

        setCategoryOptions(allItems);
      } catch (error) {
        console.error('Không thể tải danh mục cha:', error);
      }
    };

    loadCategoryOptions();
  }, [activeTab]);

  const getTabLabel = () => {
    switch (activeTab) {
      case 'category': return 'Danh mục';
      case 'brand': return 'Thương hiệu';
      case 'unit': return 'Đơn vị tính';
      case 'attribute': return 'Thuộc tính';
      default: return '';
    }
  };

    const handleSave = async (payload: { name: string; parentId?: number | null; unit?: string }) => {
    try {
      const data: any = { name: payload.name };
      if (activeTab === 'category') {
        data.parentId = payload.parentId ?? null;
      }
      if (activeTab === 'attribute') {
        data.unit = payload.unit || '';
      }

      const itemId = selectedItem?.id || selectedItem?.Id;
      const res = selectedItem
        ? await updateAttribute(activeTab, itemId, data)
        : await createAttribute(activeTab, data);

      if (res) {
        setIsModalOpen(false);
        setSelectedItem(null);
        await fetchData();
        alert(selectedItem ? "Đã sửa thành công!" : "Đã tạo thành công!");
      } else {
        alert("Có lỗi từ phía máy chủ!");
      }
    } catch (error) {
      alert("Không thể kết nối tới server!");
    }
  };

  const handleEdit = async (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };
  const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có muốn xóa không?");
        if (!confirmDelete) return;

        try {
            const res = await deleteAttribute(activeTab, id);            
            alert("Xóa thành công!");
            setIsModalOpen(false);
            await fetchData(); 
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
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <AttributeModal 
          isOpen={isModalOpen}
          title={getTabLabel()}
          initialData={selectedItem ? {
            name: selectedItem.name || selectedItem.Name,
            parentId: selectedItem.parentId ?? selectedItem.ParentId ?? null,
            parentName: selectedItem.parentName || selectedItem.ParentName || selectedItem.parent?.name || '',
            unit: selectedItem.unit ?? selectedItem.Unit ?? '',
          } : null}
          parentOptions={
            activeTab === 'category'
              ? categoryOptions
                  .filter((item: any) => (item.id || item.Id) !== (selectedItem?.id || selectedItem?.Id))
                  .map((item: any) => ({ id: item.id || item.Id, name: item.name || item.Name }))
              : []
          }
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