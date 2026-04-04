export interface WarrantyList {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  receiveDate: string;
  returnDate?: string;
  status: number;
  totalCost: number;
}