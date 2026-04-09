import axiosClient from "../../API/axiosClient";
import {type WarrantyList} from '../../types/Warranty/Warranty';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

//load ds bảo hành
export const getWarranties = async (searchText: string, status?: string): Promise<ApiResponse<WarrantyList[]>> => {
  const statusParam = status === 'all' ? null : status;
  
  return await axiosClient.get("/api/WarrantyCard", {
    params: { search: searchText, status: statusParam }
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