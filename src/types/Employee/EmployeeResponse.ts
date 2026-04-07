import { type Employee } from "./Employee";

export interface PagedEmployeeResponse {
    items: Employee[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}