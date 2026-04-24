import { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from '../../services/Employee/EmployeeService';
import { type Employee } from '../../types/Employee/Employee';
import { type EmployeeFilter } from '../../types/Employee/EmployeeFilter';
import { useNavigate } from 'react-router-dom';

import EmployeeTable from './EmployeeTable';
import EmployeeSidebar from './EmployeeSidebar';

import AddEmployeeForm from './AddEmployeeForm'; 
import EditEmployeeForm from './EditEmployeeForm';
import ConfirmModal from '../ConfirmModal';

import Button from '../Common/Button';
import Pagination from '../Pagination';

const GetAllEmployeePage = () => {

  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilter>({ isActive: true });
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; 



  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page: currentPage, limit: pageSize };
  
      const res: any = await getEmployees(params);

      const dataFromApi = res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
      const totalFromApi = res?.totalCount || res?.data?.totalCount || (Array.isArray(res) ? res.length : 0);
      
      if (Array.isArray(dataFromApi)) {
        setEmployees(dataFromApi);        
        setTotalItems(totalFromApi); 
      } else {
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

  
  useEffect(() => {
    fetchEmployees();
  }, [filters, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm, filters.isActive, filters.role]);

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setEmployeeToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee(employeeToDelete);
      
      alert("Xóa nhân viên thành công!");
      fetchEmployees();
      
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsConfirmModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] gap-6 p-4">
   
      <EmployeeSidebar filters={filters} onFilterChange={setFilters} />

      <div className="flex-1 flex flex-col gap-6"> 
    
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-md transition-all duration-300 focus-within:border-[#F23A3A] focus-within:shadow-[0_0_0_5px_rgba(242,58,58,0.1)] group">
              <span className="text-gray-400 mr-4 text-2xl group-focus-within:text-[#F23A3A] transition-colors">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm theo tên đăng nhập, họ tên..." 
                className="bg-transparent border-none outline-none w-full text-base font-semibold text-gray-700 placeholder:text-gray-400 tracking-wide"
                value={filters.searchTerm || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters({ ...filters, searchTerm: val === "" ? undefined : val });
                }}
              />
            </div>
          </div>

          <Button text="Thêm nhân viên mới" onClick={() => setIsModalOpen(true)} />
        </div>
        
    
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <EmployeeTable 
            data={employees} 
            loading={loading} 
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onView={(id) => navigate(`/nhan-vien/chi-tiet/${id}`)}
            currentPage={currentPage}
            pageSize={pageSize}
          />
          
          {employees.length > 0 && (
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

    
      <AddEmployeeForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => { fetchEmployees(); setIsModalOpen(false); }} 
      /> 

      <EditEmployeeForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => { fetchEmployees(); setIsEditModalOpen(false); }}
        employee={selectedEmployee}
      />

      {/* Component Modal Xác nhận Xóa */}
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa nhân viên này không? Thao tác này sẽ đưa nhân viên vào thùng rác."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setEmployeeToDelete(null);
        }}
      />
    </div>
  );
};

export default GetAllEmployeePage;