import { useState, useEffect } from 'react';
import { getSuppliers } from '../services/Supplier/supplierService';
import { type Supplier } from '../types/Supplier/supplier';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');  
  const [status, setStatus] = useState<boolean>(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

const loadData = async (searchText: string, statusValue: boolean) => {
  try {
    setLoading(true);
    const res = await getSuppliers(searchText, statusValue);
    
    if (Array.isArray(res)) {
      setSuppliers(res);
    } else if (res && (res as any).data) { 
      setSuppliers((res as any).data);
    }
    
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(query, status);
    }, 400);
    setCurrentPage(1);
    return () => clearTimeout(timer);
  }, [query, status]);

  return {
    suppliers,
    loading,
    query,
    setQuery,
    status,     
    setStatus,  
    currentPage, setCurrentPage,
    pageSize,
    refresh: () => loadData(query, status) 
  };
};