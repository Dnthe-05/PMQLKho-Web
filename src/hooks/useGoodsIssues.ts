import { useState, useEffect, useCallback } from "react";
import { getGoodsIssues, type GoodsIssueResponse } from "../services/Warehouse/GoodsIssueService";

export const useGoodsIssues = () => {
  const [issues, setIssues] = useState<GoodsIssueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Các trạng thái lọc và phân trang
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi service với các params tìm kiếm và trạng thái
      const res = await getGoodsIssues(query);
      
      // Xử lý bóc tách dữ liệu an toàn (PageDTO hoặc Array)
      const data = (res as any).items || (res as any).data || res;
      
      setIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phiếu xuất:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  // Tự động gọi lại khi thay đổi tìm kiếm hoặc bộ lọc
  useEffect(() => {
    fetchIssues();
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [query, status, fetchIssues]);

  return {
    issues,
    loading,
    query,
    setQuery,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    refresh: fetchIssues, // Hàm để các component con gọi load lại dữ liệu
  };
};