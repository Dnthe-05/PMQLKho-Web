import { useState, useEffect } from 'react';
import { getSuppliers } from '../services/Supplier/supplierService';
import { type Supplier } from '../types/Supplier/supplier';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');  
  const [status, setStatus] = useState<boolean>(true); 

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getSuppliers(query, status, currentPage);
      
      if (res && res.data) {
        const pagedData = res.data;
        setSuppliers(pagedData.items || []);
        setTotalItems(pagedData.totalCount || 0);
        setPageSize(pagedData.pageSize || 10);
      } else {
        setSuppliers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu nhà cung cấp:", error);
      setSuppliers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [query, status, currentPage]);

  return {
    suppliers,
    loading,
    query,
    setQuery,
    status,     
    setStatus,  
    currentPage, 
    setCurrentPage,
    pageSize,
    totalItems,
    refresh: loadData 
  };
};