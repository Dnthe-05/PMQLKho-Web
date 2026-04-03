import axiosClient from '../../API/axiosClient';
import {type Product } from '../../types/Product/product';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getProducts = async (
  search: string = "", 
  categoryName?: string, 
  brandName?: string
): Promise<ApiResponse<Product[]>> => {
  return await axiosClient.get("/api/product", {
    params: { 
      search, 
      categoryName, 
      brandName    
    }
  });
};