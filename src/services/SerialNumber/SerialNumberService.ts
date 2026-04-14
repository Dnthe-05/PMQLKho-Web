import axiosClient from "../../API/axiosClient";

export interface ScanSerialResponseDto {
    serialNumber: string;
    productId: number;
    productName: string;
    importPrice: number;
    sku: string;
}

export const scanSerialNumber = async (serial: string) => {
    // Lưu ý: Đường dẫn này phải khớp với Controller của bạn ở Backend
    return await axiosClient.get<ScanSerialResponseDto>(`/api/SerialNumber/scan/${serial}`);
};