import { useState, useEffect } from 'react';
import { getProducts } from '../../services/Product/productService';
import { type Product } from '../../types/Product/product';
import { type ProductFilter } from '../../types/Product/productFilter';
import { type ProductResponse } from '../../types/Product/productResponse';
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

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; 


const fetchProducts = async () => {
  setLoading(true);
  try {
    const params = { ...filters, page: currentPage, limit: pageSize };
    const res = await getProducts(params); 
    
    // Vì axiosClient và service đã bóc hết vỏ, res bây giờ chính là PagedProductResponseDto
    // Nó có cấu trúc: { items: [...], total: 10, page: 1, limit: 10 }
    
    if (res && Array.isArray(res.items)) {
      setProducts(res.items);        // Đổ mảng vào bảng
      setTotalItems(res.total || 0); // Cập nhật tổng để phân trang
    } else {
      setProducts([]);
      setTotalItems(0);
    }
  } catch (error) {
    console.error("Lỗi fetch:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  // Khi người dùng thực hiện lọc/tìm kiếm mới, tự động đưa về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] gap-6 p-4">
      {/* Sidebar lọc sản phẩm */}
      <ProductSidebar filters={filters} onFilterChange={setFilters} />

      <div className="flex-1 flex flex-col gap-6"> 
        
        {/* Thanh tìm kiếm và Nút thêm mới */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-md transition-all duration-300 focus-within:border-[#F23A3A] focus-within:shadow-[0_0_0_5px_rgba(242,58,58,0.1)] group">
              <span className="text-gray-400 mr-4 text-2xl group-focus-within:text-[#F23A3A] transition-colors">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm theo mã SKU, tên sản phẩm..." 
                className="bg-transparent border-none outline-none w-full text-base font-semibold text-gray-700 placeholder:text-gray-400 tracking-wide"
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
            </div>
          </div>

          {/* Nút bấm mở Modal thêm sản phẩm */}
          <Button 
            text="Thêm sản phẩm mới" 
            onClick={() => setIsModalOpen(true)} 
          />
        </div>
        
        {/* Khu vực Bảng dữ liệu & Phân trang */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ProductTable data={products} loading={loading} />
          
          {/* Chỉ hiện phân trang khi có dữ liệu */}
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

      {/* Form thêm sản phẩm mới (Modal) */}
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