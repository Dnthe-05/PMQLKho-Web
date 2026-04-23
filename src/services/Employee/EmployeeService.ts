import axiosClient from '../../API/axiosClient';
import { type EmployeeFilter } from '../../types/Employee/EmployeeFilter';
import { type PagedEmployeeResponse } from '../../types/Employee/EmployeeResponse';
import { type EmployeeLoad } from '../../types/Employee/EmployeeLoad'; 

export const getEmployees = async (filters: EmployeeFilter): Promise<PagedEmployeeResponse> => {
    const response = await axiosClient.get("/api/Employee", { params: filters });
    return response.data; 
};

export const createEmployee = async (data: EmployeeLoad) => {
    const response = await axiosClient.post("/api/Employee", data);
    return response.data;
};

export const updateEmployee = async (id: number, data: EmployeeLoad) => {
    const response = await axiosClient.put(`/api/Employee/${id}`, data);
    return response.data;
};

export const deleteEmployee = async (id: number) => {
    const response = await axiosClient.delete(`/api/Employee/${id}`);
    return response.data;
};

export const getEmployeeById = async (id: number) => {
    const response = await axiosClient.get(`/api/Employee/${id}`);
    return response;
};