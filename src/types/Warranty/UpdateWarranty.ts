export interface EditWarrantyItem {
  id?: number;
  serialNumberId: string;
  productId?: number;
  productName: string;
  issueDescription: string;
  warrantyCost: number;
  processingType: string;
  timelines: any[];
  sentToVendorDate: string;
  receivedFromVendorDate: string;
  isLoan?: boolean;
}

export interface UpdateWarrantyDTO {
  phone: string;
  customerName: string;
  returnLocation?:string;
  receiveLocation?: string;
  returnDate?: string | null;
  status: number;
  details: {
    id?: number;
    serialNumberId: number;
    issueDescription: string;
    warrantyCost: number;
    sentToVendorDate?: string | null;
    receivedFromVendorDate?: string | null;
  }[];
}