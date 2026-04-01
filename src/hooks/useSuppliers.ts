import { useState, useEffect } from 'react';
import { getSuppliers } from '../services/Supplier/supplierService';
import { type Supplier } from '../types/Supplier/supplier';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  
  const [status, setStatus] = useState<boolean>(true); 

  const loadData = async (searchText: string, statusValue: boolean) => {
    try {
      setLoading(true);
      // Gọi service với searchText và statusValue
      const res = await getSuppliers(searchText, statusValue);
      
      if (res.success) {
        setSuppliers(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Luôn truyền giá trị mới nhất của query và status
      loadData(query, status);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, status]); // Lắng nghe cả 2 thay đổi

  return {
    suppliers,
    loading,
    query,
    setQuery,
    status,     
    setStatus,  
    refresh: () => loadData(query, status) 
  };
};