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