import axiosClient from "../../API/axiosClient";
import {type WarrantyList} from '../../types/Warranty/Warranty';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getWarranties = async (searchText: string, status?: string): Promise<ApiResponse<WarrantyList[]>> => {
  const statusParam = status === 'all' ? null : status;
  
  return await axiosClient.get("/api/WarrantyCard", {
    params: { search: searchText, status: statusParam }
  });
};