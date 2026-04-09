export interface ProductFilter {
    categoryId?: number; 
    brandId?: number;    
    unitId?: number;     
    isDeleted?: boolean; 
    searchTerm?: string;
    page?: number;
    limit?: number;
}