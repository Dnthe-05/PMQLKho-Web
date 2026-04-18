import axiosClient from "../../API/axiosClient";

export interface GoodsReceiptDetailUpdateDto {
    productId: number;
    quantity: number;
    importPrice: number;
}

export interface GoodsReceiptUpdateDto {
    note?: string;
    status:number;
    //details: GoodsReceiptDetailUpdateDto[];
    productGroups: ProductSerialGroupDto[];
}

export interface GoodsReceiptResponse {
  id: number;
  code: string;
  supplierId?: number;
  supplierName?: string;
  employeeId?: number;
  employeeName?: string;
  note?: string;
  status?: number;
  createdAt?: string; 
  updatedAt?: string;
  totalItems: number; 
  totalPrice: number; 
  details?: any[];
  serialNumbers: string[];
}

/**
 * Lấy danh sách phiếu nhập kho có lọc theo Search và Status
 */
export const getGoodsReceipts = async (searchText: string, status?: string) => {
  // Chuẩn hóa status: nếu là 'all' thì gửi undefined để Backend bỏ qua filter này
  const statusParam = status === 'all' ? undefined : status;
  
  return await axiosClient.get<GoodsReceiptResponse[]>("/api/goods-receipt", {
    params: { 
      searchTerm: searchText, 
      status: statusParam 
    }
  });
};

/**
 * Lấy chi tiết 1 phiếu nhập kho theo ID
 */
export const getGoodsReceiptById = async (id: number) => {
  return await axiosClient.get<GoodsReceiptResponse>(`/api/goods-receipt/${id}`);
};

export interface GoodsReceiptDetailCreateDto {
    productId: number;
    importPrice: number;
    quantity: number;
}
export interface ProductSerialGroupDto {
    productId: number;
    serials: string[];
}
export interface GoodsReceiptCreateDto {
    code: string;           // Tương ứng public string Code
    supplierId: number;     // Tương ứng public int SupplierId
    employeeId: number;     // Tương ứng public int EmployeeId
    note?: string;          // Tương ứng public string? Note
    createdAt: string;      // Tương ứng public DateTime CreatedAt (JSON sẽ là string ISO)
    status: number;
    productGroups: ProductSerialGroupDto[]; // Tương ứng public List<string> SerialNumbers

}

export const createGoodsReceipt = async (data: GoodsReceiptCreateDto) => {
    return await axiosClient.post("/api/goods-receipt", data);
};

// Hàm Xóa (Delete)
export const deleteGoodsReceipt = async (id: number) => {
  return await axiosClient.delete(`/api/goods-receipt/${id}`);
};

// Hàm Sửa (Update)
export const updateGoodsReceipt = async (id: number, data: GoodsReceiptUpdateDto) => {
    return await axiosClient.put(`/api/goods-receipt/${id}`, data);
};