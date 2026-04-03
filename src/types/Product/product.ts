export interface Product {
    id: number;
    sku: string;           
    name: string;          
    image: string;         
    location: string;      

    importPrice: number;   
    exportPrice: number;   

    stockQuantity: number; 

    categoryName: string; 
    brandName: string;     
    unitName: string;      

    createdAt?: string;    
    updatedAt?: string;
    deletedAt?: string;
}