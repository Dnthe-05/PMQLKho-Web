export interface EmployeeFilter {
    searchTerm?: string;
    isActive?: boolean;    
    role?: number;
    page?: number;
    limit?: number; 
}