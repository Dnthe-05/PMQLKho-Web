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
  customerId?: number | null;
  guestFullName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  guestAddress?: string | null;
  employeeId: number;
  note?: string;
  issueDate: string;
  productGroups: ProductGroupDto[]; 
}

export interface ProductGroupDto {
  productId: number;
  price: number; 
  serials: string[];
}
// Lấy danh sách phiếu xuất
export const getGoodsIssues = async (search: string) => {
  return await axiosClient.get("/api/goods-issue", {
    params: { searchTerm: search }
  });
};
export interface GoodsIssueUpdateDto {
    note?: string;
    serialNumbers: string[]; // Danh sách serial tổng hợp từ UI
    productPrices: { productId: number, price: number }[]; // Thêm mảng này để gửi giá nhập từ UI
}
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
// Cập nhật phiếu xuất
export const updateGoodsIssue = async (id: number, payload: GoodsIssueUpdateDto) => {
    return await axiosClient.put(`/api/goods-issue/${id}`, payload);
};