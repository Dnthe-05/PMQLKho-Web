import { useState, useEffect } from 'react';
import { getEmployees } from '../../services/Employee/EmployeeService';
import { type Employee } from '../../types/Employee/Employee';
import { type EmployeeFilter } from '../../types/Employee/EmployeeFilter';

// Import các component chúng ta vừa tạo
import EmployeeTable from './EmployeeTable';
import EmployeeSidebar from './EmployeeSidebar';
// Tạm thời comment AddEmployeeForm vì chúng ta chưa tạo nó
import AddEmployeeForm from './AddEmployeeForm'; 

import Button from '../Common/Button';
import Pagination from '../Pagination';

const GetAllEmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Mặc định isActive = true như mô hình C# của bạn
  const [filters, setFilters] = useState<EmployeeFilter>({isActive: true});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; 

  // const fetchEmployees = async () => {
  //   setLoading(true);
  //   try {
  //     const params = { ...filters, page: currentPage, limit: pageSize };
  //     const res = await getEmployees(params);

  //     console.log("Dữ liệu API trả về:", res);
      
  //     // Chú ý: Dựa vào EmployeeResponse.ts ta đã định nghĩa, biến tổng là totalCount
  //    if (Array.isArray(res)) {
  //       // Trường hợp 1: API trả về trực tiếp một mảng (như trong hình console của bạn)
  //       setEmployees(res);        
  //       setTotalItems(res.length); // Vì không có totalCount nên ta lấy độ dài mảng
  //     } 
  //     else if (res && Array.isArray(res.items)) {
  //       // Trường hợp 2: API có phân trang, bọc trong object có thuộc tính items (dự phòng)
  //       setEmployees(res.items);        
  //       setTotalItems(res.totalCount || 0); 
  //     } 
  //     else {
  //       // Trường hợp lỗi hoặc mảng rỗng
  //       setEmployees([]);
  //       setTotalItems(0);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi fetch nhân viên:", error);
  //     setEmployees([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page: currentPage, limit: pageSize };
      // Ép kiểu any tạm thời để dễ kiểm tra các cấu trúc lồng nhau
      const res: any = await getEmployees(params);

      console.log("Dữ liệu API trả về:", res);
      
      // KIỂM TRA LINH HOẠT TẤT CẢ CÁC TRƯỜNG HỢP BACKEND
      if (res && res.data && Array.isArray(res.data.items)) {
        // Trường hợp 1: Chạy code C# mới (Có ApiResponse bọc ngoài PagedResult)
        setEmployees(res.data.items);        
        setTotalItems(res.data.totalCount || 0); 
      } 
      else if (res && Array.isArray(res.items)) {
        // Trường hợp 2: Chạy code C# (Có PagedResult nhưng không có ApiResponse)
        setEmployees(res.items);        
        setTotalItems(res.totalCount || 0); 
      } 
      else if (Array.isArray(res)) {
        // Trường hợp 3: Đang gọi nhầm Server cũ (Trả về thẳng mảng)
        setEmployees(res);        
        setTotalItems(res.length); 
      } 
      else {
        // Lỗi hoặc rỗng
        setEmployees([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi fetch nhân viên:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API mỗi khi filter hoặc trang thay đổi
  useEffect(() => {
    fetchEmployees();
  }, [filters, currentPage]);

  // Đưa về trang 1 khi người dùng đổi bộ lọc
useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm, filters.isActive, filters.role]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] gap-6 p-4">
      {/* Sidebar lọc nhân viên */}
      <EmployeeSidebar filters={filters} onFilterChange={setFilters} />

      <div className="flex-1 flex flex-col gap-6"> 
        
        {/* Thanh tìm kiếm và Nút thêm mới */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-md transition-all duration-300 focus-within:border-[#F23A3A] focus-within:shadow-[0_0_0_5px_rgba(242,58,58,0.1)] group">
              <span className="text-gray-400 mr-4 text-2xl group-focus-within:text-[#F23A3A] transition-colors">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm theo tên đăng nhập, họ tên..." 
                className="bg-transparent border-none outline-none w-full text-base font-semibold text-gray-700 placeholder:text-gray-400 tracking-wide"
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  searchTerm: e.target.value === "" ? undefined : e.target.value 
                })}
              />
            </div>
          </div>

          {/* Nút bấm mở Modal thêm nhân viên */}
          <Button 
            text="Thêm nhân viên mới" 
            onClick={() => setIsModalOpen(true)} 
          />
        </div>
        
        {/* Khu vực Bảng dữ liệu & Phân trang */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <EmployeeTable data={employees} loading={loading} />
          
          {/* Chỉ hiện phân trang khi có dữ liệu */}
          {employees.length > 0 && (
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

      {/* Form thêm nhân viên mới (Modal) */}
      <AddEmployeeForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          fetchEmployees(); 
          setIsModalOpen(false);
        }} 
      /> 
     
    </div>
  );
};

export default GetAllEmployeePage;