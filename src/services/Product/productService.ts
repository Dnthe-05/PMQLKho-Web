import axiosClient from '../../API/axiosClient';


export const getProducts = async (filters: any): Promise<any> => {
    const response = await axiosClient.get("/api/product", { params: filters });

    return response.data; 
};

export const createProduct = async (data: any) => {
    return await axiosClient.post("/api/product", data);
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
    return await axiosClient.delete(`/api/product/${id}`);
};

export const updateProduct = async (id: number, data: any) => {
    return await axiosClient.put(`/api/product/${id}`, data);
}

export const getProductBySerial = async (serialCode: string) => {
  return await axiosClient.get(`/api/WarrantyCard/get-product-name/${serialCode}`);
};