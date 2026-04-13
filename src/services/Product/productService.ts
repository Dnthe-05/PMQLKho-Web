import axiosClient from '../../API/axiosClient';


export interface BaseAttribute {
    id: number;
    name: string;
}

export const getProducts = async (filters: any): Promise<any> => {
    const response = await axiosClient.get("/api/product", { params: filters });

    return response.data; 
};

export const createProduct = async (data: any) => {
    return await axiosClient.post("/api/product", data);
};

export const getCategories = async (): Promise<any> => {
    const response = await axiosClient.get("/api/category");
    // Phải lấy .items nếu có phân trang, hoặc .data tùy cấu trúc axios
    return response.data.items || response.data; 
};

export const getBrands = async (): Promise<any> => {
    const response = await axiosClient.get("/api/brand");
    return response.data.items || response.data;
};

export const getUnits = async (): Promise<any> => {
    const response = await axiosClient.get("/api/unit");
    return response.data.items || response.data;
};

export const deleteProduct = async (id: number) => {

    return await axiosClient.delete(`/api/product/${id}`);
};

export const updateProduct = async (id: number, data: any) => {
    return await axiosClient.put(`/api/product/${id}`, data);
}

export const getProductBySerial = async (serialCode: string) => {
  return await axiosClient.get(`/api/WarrantyCard/get-product-name/${serialCode}`);

}

export const getAttributes = async (): Promise<BaseAttribute[]> => {
    const response = await axiosClient.get("/api/attribute");
    return response.data;
};