import axiosClient from '../../API/axiosClient';
import { type CustomerFilter } from '../../types/Customer/CustomerFilter';
import { type PagedCustomerResponse } from '../../types/Customer/CustomerResponse';
import { type CustomerLoad } from '../../types/Customer/CustomerLoad'; 
import { type CustomerDetail } from '../../types/Customer/Customer';

export const getCustomers = async (filters: CustomerFilter): Promise<PagedCustomerResponse> => {
    const response = await axiosClient.get("/api/Customer", { params: filters });
    return response.data; 
};

export const createCustomer = async (data: CustomerLoad) => {
    const response = await axiosClient.post("/api/Customer", data);
    return response.data;
};

export const updateCustomer = async (id: number, data: CustomerLoad) => {
    const response = await axiosClient.put(`/api/Customer/${id}`, data);
    return response.data;
};

export const deleteCustomer = async (id: number) => {
    const response = await axiosClient.delete(`/api/Customer/${id}`);
    return response.data;
};

export const getCustomerById = async (id: number): Promise<CustomerDetail> => {
  const response = await axiosClient.get(`/api/Customer/${id}`); 
  return response.data;
};