import { useState, useEffect } from 'react';
import { getProducts } from '../../services/Product/productService';
import { type Product } from '../../types/Product/product';
import { type ProductFilter } from '../../types/Product/productFilter';
import AddProductForm from './AddProductform';
import ProductTable from './ProductTable';
import ProductSidebar from './ProductSidebar';
import Button from '../Common/Button';
import Pagination from '../Pagination';

const GetAllProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; 

  const fetchProducts = async () => {
  setLoading(true);
  try {
    const params = { ...filters, page: currentPage, limit: pageSize };
    const res = await getProducts(params); 

    // Kiểm tra xem dữ liệu nằm ở res.items hay res.data.items
    const dataFromApi = res?.items || res?.data?.items;
    const totalFromApi = res?.total || res?.data?.total || 0;
    
    if (Array.isArray(dataFromApi)) {
      setProducts(dataFromApi);
      setTotalItems(totalFromApi);
    } else {
      setProducts([]);
      setTotalItems(0);
    }
  } catch (error) {
    console.error("Lỗi fetch:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleEdit = (product: any) => {
    console.log("Mở modal sửa cho:", product);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      console.log("Gọi API xóa ID:", id);
    }
  };

  const handleRestore = async (id: number) => {
    console.log("Gọi API khôi phục ID:", id);
  };

  
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] gap-6 p-4">
      <ProductSidebar filters={filters} onFilterChange={setFilters} />

      <div className="flex-1 flex flex-col gap-6"> 
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-md transition-all duration-300 focus-within:border-[#F23A3A] group">
              <span className="text-gray-400 mr-4 text-2xl">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm theo mã SKU, tên sản phẩm..." 
                className="bg-transparent border-none outline-none w-full text-base font-semibold text-gray-700"
                value={filters.searchTerm || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters({ ...filters, searchTerm: val === "" ? undefined : val });
                }}
              />
            </div>
          </div>

          <Button 
            text="Thêm sản phẩm mới" 
            onClick={() => setIsModalOpen(true)} 
          />
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ProductTable 
            data={products} 
            loading={loading} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
          
          {products.length > 0 && (
            <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
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

      <AddProductForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          fetchProducts(); 
          setIsModalOpen(false);
        }} 
      />
    </div>
  );
};

export default GetAllProductPage;