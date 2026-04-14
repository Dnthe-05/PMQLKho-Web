import axiosClient from '../../API/axiosClient';
import { type ProductAttributeGroup } from '../../types/ProductAttribute/productAttribute';

export interface BaseAttribute {
    id: number;
    name: string;
}


export interface PagedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// Cấu trúc ApiResponse bọc ngoài
export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}


export const getProducts = async (filters: any): Promise<any> => {
    const response = await axiosClient.get("/api/product", { params: filters });
    return response;
};

export const createProduct = async (data: any) => {
    const response = await axiosClient.post("/api/product", data);
    return response;
};

export const updateProduct = async (id: number, data: any) => {
    const response = await axiosClient.put(`/api/product/${id}`, data);
    return response;
};

export const deleteProduct = async (id: number) => {
    const response = await axiosClient.delete(`/api/product/${id}`);
    return response;
};


export const getCategories = async (params?: any) => {
    const response = await axiosClient.get("/api/category", { params });
    return response; // Trả về ApiResponse chứa data: PagedResponse
};

export const getBrands = async (params?: any) => {
    const response = await axiosClient.get("/api/brand", { params });
    return response;
};

export const getUnits = async (params?: any) => {
    const response = await axiosClient.get("/api/unit", { params });
    return response;
};

export const getAttributes = async (params?: any) => {
    const response = await axiosClient.get("/api/attribute", { params });
    return response;
};


export const getProductBySerial = async (serialCode: string) => {
    const response = await axiosClient.get(`/api/WarrantyCard/get-product-name/${serialCode}`);
    return response;
};


export const createAttribute = async (type: string, data: { name: string }) => {
    const response = await axiosClient.post(`/api/${type}`, data);
    return response.data; 
};

export const updateAttribute = async (type: string, id: number, data: { name: string }) => {
    const response = await axiosClient.put(`/api/${type}/${id}`, data);
    return response.data;
};

export const deleteAttribute = async (type: string, id: number) => {
    const response = await axiosClient.delete(`/api/${type}/${id}`);
    return response.data;
};

export const createBrand = async (data: { name: string }) => {
    const response = await axiosClient.post("/api/brand", data);
    return response.data; 
};

export const updateBrand = async (id: number, data: { name: string }) => {
    const response = await axiosClient.put(`/api/brand/${id}`, data);
    return response.data;
};

export const deleteBrand = async (id: number) => {
    const response = await axiosClient.delete(`/api/brand/${id}`);
    return response.data;
};

export const createCategory = async (data: { name: string }) => {
    const response = await axiosClient.post("/api/category", data);
    return response.data; 
};

export const updateCategory = async (id: number, data: { name: string }) => {
    const response = await axiosClient.put(`/api/category/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await axiosClient.delete(`/api/category/${id}`);
    return response.data;
};

export const createUnit = async (type: string, data: { name: string }) => {
    const response = await axiosClient.post(`/api/${type}`, data);
    return response.data; 
};

export const updateUnit = async (type: string, id: number, data: { name: string }) => {
    const response = await axiosClient.put(`/api/${type}/${id}`, data);
    return response.data;
};

export const deleteUnit = async (type: string, id: number) => {
    const response = await axiosClient.delete(`/api/${type}/${id}`);
    return response.data;

};
export const getProductAttributes = async (productId: number): Promise<ProductAttributeGroup> => {
    const response = await axiosClient.get(`/api/ProductAttribute/${productId}`);
    return response.data;
};
