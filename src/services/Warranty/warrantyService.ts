import axiosClient from "../../API/axiosClient";
import {type WarrantyList} from '../../types/Warranty/Warranty';

export interface PagedData<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

//load ds bảo hành
export const getWarranties = async (searchText: string, status?: string, page: number = 1, pageSize?: number): Promise<ApiResponse<PagedData<WarrantyList>>> => {
  const statusParam = status === 'all' ? null : status;
  
  return await axiosClient.get("/api/WarrantyCard", {
    params: { search: searchText, status: statusParam,page: page,pageSize:pageSize }
  });
};

//tạo đơn bảo hành
export const createWarranty = async (warrantyData: any): Promise<ApiResponse<any>> => {
  return await axiosClient.post("/api/WarrantyCard", warrantyData);
};

//Chi tiết phiết bảo hành
export const getWarrantyById = async (id: number): Promise<ApiResponse<any>> => {
  return await axiosClient.get(`/api/WarrantyCard/${id}`);
};

//cập nhật phiếu bảo hành
export const updateWarranty = async (id: number, data:any): Promise<ApiResponse<any>> => {
  return await axiosClient.put(`/api/WarrantyCard/${id}`,data);
};

export const getProductBySerial = async (serialCode: string) => {
  return await axiosClient.get(`/api/WarrantyCard/get-product-name/${serialCode}`);
};

// Lấy lịch sử vòng đời máy
export const getProductLifecycle = async (serialCode: string) => {
  return await axiosClient.get(`/api/WarrantyCard/lifecycle/${serialCode}`);
};

// API đổi máy mới
export const exchangeMachine = async (data: {
  detailId: number;
  newSerialId: number;
  note: string;
  additionalCost: number;
}) => {
  return await axiosClient.post("/api/WarrantyCard/exchange", data);
};

//Cho mượn máy
export const loanMachine = async (data: {
  detailId: number;
  loanSerialId: number;
  note: string;
  returnDate:Date;
}) => {
  return await axiosClient.post("/api/WarrantyCard/loan", data);
};

//trả máy
export const ReturnloanMachine = async (detailId: number) => {
  return await axiosClient.post(`/api/WarrantyCard/return-loan/${detailId}`);
};

//Lấy danh sách Serial đang rảnh trong kho theo seri
export const getAvailableSerials = async (search?: string) => {
  return await axiosClient.get("/api/WarrantyCard/available-serials", {
    params: { search }
  });
};

export const getWarrantyWarnings = async (search: string = "", page: number = 1, pageSize: number = 10) => {
    return await axiosClient.get(`api/WarrantyCard/warnings`, {
        params: {
            search: search,
            page: page,
            pageSize: pageSize
        }
    });
}