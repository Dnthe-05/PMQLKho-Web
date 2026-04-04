export interface ProductFilter {
    categoryName?: string;
    brandName?: string;
    unitName?: string;
    isDeleted?: boolean; 
    searchTerm?: string;

    page?: number;
    limit?: number;
}