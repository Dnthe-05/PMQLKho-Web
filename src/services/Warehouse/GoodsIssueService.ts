import axiosClient from "../../API/axiosClient";

export interface GoodsIssueResponse {
  id: number;
  code: string;
  employeeId: number;
  employeeName?: string;
  customerId: number;
  customerName?: string;
  issueDate: string;
  note: string;
  phone: string;
  totalPrice: number;
  status: number;
  createdAt: string;
}

export interface GoodsIssueCreateDto {
  code: string;
  customerId?: number; // null nếu là khách lẻ
  guestFullName?: string;
  guestPhone?: string;
  guestAddress?: string;
  employeeId: number;
  note?: string;
  issueDate: string;
  serialNumbers: string[];
}

// Lấy danh sách phiếu xuất
export const getGoodsIssues = async (search: string) => {
  return await axiosClient.get("/api/goods-issue", {
    params: { searchTerm: search }
  });
};

// Tạo mới phiếu xuất kho (HÀM MỚI BỔ SUNG)
export const createGoodsIssue = async (payload: GoodsIssueCreateDto) => {
  return await axiosClient.post("/api/goods-issue", payload);
};

// Lấy chi tiết phiếu xuất theo ID
export const getGoodsIssueById = async (id: string | number) => {
  return await axiosClient.get(`/api/goods-issue/${id}`);
};

// Xóa (Hủy) phiếu xuất
export const deleteGoodsIssue = async (id: number) => {
  return await axiosClient.delete(`/api/goods-issue/${id}`);
};
export const updateGoodsIssue = async (id: number, payload: any) => {
  return await axiosClient.put(`/api/goods-issue/${id}`, payload);
};