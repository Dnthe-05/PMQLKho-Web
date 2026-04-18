export interface LifecycleEvent {
    date: string;
    actionType: number;
    description: string;
    customer: string;
}

export interface MachineLifecycle {
    serial: string;
    productName: string;
    totalWarrantyTimes: number;
    owners: string[];
    timeline: LifecycleEvent[];
}