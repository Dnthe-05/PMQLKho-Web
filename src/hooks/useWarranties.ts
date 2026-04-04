import { useState, useEffect } from 'react';
import { getWarranties } from '../services/Warranty/warrantyService';
import {type WarrantyList } from '../types/Warranty/Warranty';

export const useWarranties = () => {
  const [warranties, setWarranties] = useState<WarrantyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

const loadData = async () => {
  setLoading(true);
  try {
    const response = await getWarranties(query, status);
    
    if (response && response.data) {
        setWarranties(response.data); 
    } else {
        setWarranties([]);
    }
  } catch (error) {
    console.error(error);
    setWarranties([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {loadData();}, 400);
    setCurrentPage(1);
    return () => clearTimeout(timer);
  }, [query, status]);

  return {
    warranties, loading,
    query, setQuery,
    status, setStatus,
    currentPage, setCurrentPage, pageSize,
    refresh: loadData
  };
};