export type BillingPlan = {
    [key: string]: string | CostPlan[] | number | undefined;
    id?: number;
    name: string;
    billingUnit: string;
    planType: string;
    cumulativeType?: string;
    costPlans: CostPlan[];
    connectedBusiness?: string;
    status: string
}

export type CostPlan = {
    [key: string]: Date | number | undefined;
    from?: Date;
    to?: Date;
    unitCountFrom?: number;
    unitCountTo?: number;
    fromDay?: number;
    toDay?: number;
    max?: number;
    cumulativeCount?: number;
    fixedCost?: number;
    rate?: number;
    overageRate?: number;
}

export type DataField = {
    key: string;
    type: string;
    displayName: string;
    modelsSupported: string[];
    dollarify?: boolean;
    decimel?: boolean;
}
