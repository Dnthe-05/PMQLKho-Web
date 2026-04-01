import axiosClient from '../../API/axiosClient';
import { type Supplier } from '../../types/Supplier/supplier';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getSuppliers = async (searchText: string,isActive?: boolean | null): Promise<ApiResponse<Supplier[]>> => {
  return await axiosClient.get("/api/supplier", {
    params: { search: searchText,isActive: isActive }
  });
};

