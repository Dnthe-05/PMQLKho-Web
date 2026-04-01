import axiosClient from '../../API/axiosClient';
import { type Supplier } from '../../types/Supplier/supplier';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
// lấy danh sách nhà cung cấp
export const getSuppliers = async (searchText: string,isActive?: boolean | null): Promise<ApiResponse<Supplier[]>> => {
  return await axiosClient.get("/api/supplier", {
    params: { search: searchText,isActive: isActive }
  });
};
//thêm nhà cung cấp
export const createSupplier = async (supplierData: any): Promise<ApiResponse<any>> => {
  return await axiosClient.post("/api/supplier", supplierData);
};
