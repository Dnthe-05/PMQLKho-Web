import { useState, useEffect, useCallback } from 'react';
import { getGoodsReceipts, type GoodsReceiptResponse } from '../services/Warehouse/GoodsReceiptService';

export function useGoodsReceipts() {
  const [receipts, setReceipts] = useState<GoodsReceiptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Search và Filter
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all'); 
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dùng useCallback để hàm refresh có thể gọi từ bên ngoài mà không gây re-render thừa
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi service với cả 2 tham số đã gộp
      const response = await getGoodsReceipts(query, status);
      
      // Xử lý bóc tách data từ AxiosResponse
      const result = (response as any).data?.data || response.data || [];
      setReceipts(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Lỗi fetch nhập kho:", error);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  }, [query, status]); // Chạy lại khi query hoặc status thay đổi

  useEffect(() => {
    // Kỹ thuật Debounce: Đợi người dùng dừng gõ 400ms mới gọi API
    const timer = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchData]);

  // Reset trang về 1 khi người dùng thay đổi tiêu chí tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [query, status]);

  return {
    receipts,
    loading,
    query,
    setQuery,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    refresh: fetchData
  };
}