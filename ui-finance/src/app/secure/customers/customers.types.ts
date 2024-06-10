export type Customer = {
    [key: string]: string | Contract | number | undefined;
    id?: number;
    name: string;
    primaryContact?: string;
    contactEmail?: string;
    status?: string;
    businessId?: number;
    contract?: Contract;
}

export type Contract = {
    id: number;
    contractStartDate: Date;
    contractEndDate: Date;
    contractName: string;
    businessId?: number;
    greaterOfPlans?: Plan[][] | Plan[] | number[][];
}

export type Plan = {
    id: number;
    name: string;
    operationType?: string;
}
