import { type Product } from "./product";

export interface ProductResponse {
    items: Product[]; 
    total: number;    
    page: number;     
    limit: number;    
}