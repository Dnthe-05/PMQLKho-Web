import axiosClient from '../../API/axiosClient';
import { type EmployeeFilter } from '../../types/Employee/EmployeeFilter';
import { type PagedEmployeeResponse } from '../../types/Employee/EmployeeResponse';


export const getEmployees = async (filters: EmployeeFilter): Promise<PagedEmployeeResponse> => {
    const response = await axiosClient.get("/api/Employee", { params: filters });
    return response.data; 
};

export const createEmployee = async (data: any) => {
    return await axiosClient.post("/api/Employee", data);
};