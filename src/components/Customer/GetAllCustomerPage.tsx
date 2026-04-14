import { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from '../../services/Customer/CustomerService';
import { type Customer } from '../../types/Customer/Customer';
import { type CustomerFilter } from '../../types/Customer/CustomerFilter';
import { useNavigate } from 'react-router-dom';
import CustomerTable from './CustomerTable';
import CustomerSidebar from './CustomerSidebar';

import AddCustomerForm from './AddCustomerForm'; 
import EditCustomerForm from './EditCustomerForm';
import ConfirmModal from '../ConfirmModal';

import Button from '../Common/Button';
import Pagination from '../Pagination';

const GetAllCustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<CustomerFilter>({ isActive: true });
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; 

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page: currentPage, limit: pageSize };
  
      const res: any = await getCustomers(params);

      const dataFromApi = res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
      const totalFromApi = res?.totalCount || res?.data?.totalCount || (Array.isArray(res) ? res.length : 0);
      
      if (Array.isArray(dataFromApi)) {
        setCustomers(dataFromApi);        
        setTotalItems(totalFromApi); 
      } else {
        setCustomers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi fetch khách hàng:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm, filters.isActive]);

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCustomerToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      const res: any = await deleteCustomer(customerToDelete);
      if (res) {
        alert("Xóa khách hàng thành công!");
        fetchCustomers();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsConfirmModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] gap-6 p-4">
   
      <CustomerSidebar filters={filters} onFilterChange={setFilters} />

      <div className="flex-1 flex flex-col gap-6"> 
    
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-md transition-all duration-300 focus-within:border-[#F23A3A] focus-within:shadow-[0_0_0_5px_rgba(242,58,58,0.1)] group">
              <span className="text-gray-400 mr-4 text-2xl group-focus-within:text-[#F23A3A] transition-colors">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm theo tên, SĐT, Email..." 
                className="bg-transparent border-none outline-none w-full text-base font-semibold text-gray-700 placeholder:text-gray-400 tracking-wide"
                value={filters.searchTerm || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters({ ...filters, searchTerm: val === "" ? undefined : val });
                }}
              />
            </div>
          </div>

          <Button text="Thêm khách hàng mới" onClick={() => setIsModalOpen(true)} />
        </div>
        
    
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <CustomerTable 
            data={customers} 
            loading={loading} 
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onView={(id) => navigate(`/khach-hang/chi-tiet/${id}`)}
            currentPage={currentPage}
            pageSize={pageSize}
          />
          
          {customers.length > 0 && (
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

    
      <AddCustomerForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => { fetchCustomers(); setIsModalOpen(false); }} 
      /> 

      <EditCustomerForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => { fetchCustomers(); setIsEditModalOpen(false); }}
        customer={selectedCustomer}
      />

      {/* Component Modal Xác nhận Xóa */}
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa khách hàng này không? Thao tác này sẽ đánh dấu khách hàng là đã xóa."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setCustomerToDelete(null);
        }}
      />
    </div>
  );
};

export default GetAllCustomerPage;