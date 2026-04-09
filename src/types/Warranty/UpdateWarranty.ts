export interface UpdateWarrantyDetailDTO {
  id?: number;
  serialNumberId: number;
  productName?: string;
  issueDescription: string;
  warrantyCost: number;
  sentToVendorDate?: string | null;
  receivedFromVendorDate?: string | null;
}

export interface UpdateWarrantyDTO {
  phone: string;
  customerName: string;
  address?: string;
  receiveLocation?: string;
  returnDate?: string | null;
  status: number;
  details: UpdateWarrantyDetailDTO[];
}