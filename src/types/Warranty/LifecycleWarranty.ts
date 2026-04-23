export interface LifecycleEvent {
    actionDate: string;
    actionName: number;
    description: string;
    customerName?: string;
}

export interface MachineLifecycle {
    serial: string;
    productName: string;
    totalWarrantyTimes: number;
    owners: string[];
    timeline: LifecycleEvent[];
}