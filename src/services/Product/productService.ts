import axiosClient from '../../API/axiosClient';
import { type Product } from '../../types/Product/product';
import { type ProductFilter } from '../../types/Product/productFilter';
import { type ProductResponse } from '../../types/Product/productResponse';

export const getProducts = async (filters: any): Promise<any> => {
    const response = await axiosClient.get("/api/product", { params: filters });

    return response.data; 
};

// Get data api from category
export const getCategories = async (): Promise<string[]> => {
    const response = await axiosClient.get("/api/category");
    return response.data; 
};

// Get data api brand
export const getBrands = async (): Promise<string[]> => {
    const response = await axiosClient.get("/api/brand");
    return response.data;
};

// Get data api unit
export const getUnits = async (): Promise<string[]> => {
    const response = await axiosClient.get("/api/unit");
    return response.data;
};

export const deleteProduct = async (id: number) => {
    return await axiosClient.patch(`/api/product/${id}`);
};