export interface Customer {
    id: number;
    fullName?: string;
    phone?: string;
    email?: string;
    shippingAddress?: string;
    returnAddress?: string;
    createdAt?: string;
    deletedAt?: string;
}

export interface CustomerGoodsIssue {
  id: number;
  code: string;
  issueDate: string;
  totalPrice: number;
}

export interface CustomerWarrantyCard {
  id: number;
  code: string;
  receiveDate: string;
  returnDate: string;
  status: number;
}

export interface CustomerDetail extends Customer {
  goodsIssues: CustomerGoodsIssue[];
  warrantyCards: CustomerWarrantyCard[];
}