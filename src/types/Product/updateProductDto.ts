export interface UpdateProductDto {
    Name: string;
    SKU: string;
    Image: string;
    Location: string;
    ImportPrice: number;
    ExportPrice: number;
    StockQuantity: number;
    CategoryId: number;
    BrandId: number;
    UnitId: number;
}