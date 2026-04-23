export interface Employee {
    id: number;
    username?: string;
    fullName?: string;
    role?: number;
    createdAt?: string;
    deletedAt?: string;
    
}

export interface EmployeeGoodsIssue {
    id: number;
    code: string;
    issueDate: string;
    totalPrice: number;
}

export interface EmployeeGoodsReceipt {
    id: number;
    code: string;
    createdAt: string;
    totalPrice: number;
    status: number;
}

export interface EmployeeWarrantyCard {
    id: number;
    code: string;
    receiveDate: string;
    returnDate: string;
    status: number;
}

export interface EmployeeDetail extends Employee {
    goodsIssues: EmployeeGoodsIssue[];
    goodsReceipts: EmployeeGoodsReceipt[];
    warrantyCards: EmployeeWarrantyCard[];
}