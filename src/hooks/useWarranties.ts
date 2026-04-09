import { useState, useEffect } from 'react';
import { getWarranties } from '../services/Warranty/warrantyService';
import {type WarrantyList } from '../types/Warranty/Warranty';

export const useWarranties = () => {
  const [warranties, setWarranties] = useState<WarrantyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

const loadData = async () => {
  setLoading(true);
  try {
    const response = await getWarranties(query, status,currentPage);
    
    if (response && response.data) {
        const pagedData = response.data;
        setWarranties(pagedData.items || []); 
        setTotalItems(pagedData.totalCount || 0);
        setPageSize(pagedData.pageSize || 10);
    } else {
        setWarranties([]);
        setTotalItems(0);
    }
  } catch (error) {
    console.error(error);
    setWarranties([]);
    setTotalItems(0);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  setCurrentPage(1);
}, [query, status]);

  useEffect(() => {
    const timer = setTimeout(() => {loadData();}, 400);
    return () => clearTimeout(timer);
  }, [query, status,currentPage]);

  return {
    warranties, loading,
    query, setQuery,
    status, setStatus,
    currentPage, setCurrentPage, pageSize,
    totalItems,
    refresh: loadData
  };
};