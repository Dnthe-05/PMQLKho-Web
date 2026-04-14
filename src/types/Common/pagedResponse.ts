export interface PagedResponse<T> {
    items: T[];
    totalCount: number; // Sửa từ 'total' thành 'totalCount' cho giống Backend
    pageNumber: number;
    pageSize: number;
}