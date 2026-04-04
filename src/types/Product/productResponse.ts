import { type Product } from "./product";

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T; 
}