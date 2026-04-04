export interface WarrantyDetailDTO {
  serialNumberId: number;
  issueDescription?: string;
  sentToVendorDate?: string | null;
  receivedFromVendorDate?: string | null;
  warrantyCost?: number;
}

export interface CreateWarrantyDTO {
  customerId?: number | null;
  customerName?: string;
  phone?: string;
  address?: string;
  receiveLocation?: string;
  returnDate?: string | null;
  status?: number;
  details: WarrantyDetailDTO[];
}