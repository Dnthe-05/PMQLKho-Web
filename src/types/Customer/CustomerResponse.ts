import { type Customer } from "./Customer";

export interface PagedCustomerResponse {
    items: Customer[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}