export type TestContractPayload = {
    date: Date;
    day: number;
    appointment: EntityRates,
    order: EntityRates,
    revenue: EntityRates,
    shipment: EntityRates,
    snowflake: EntityRates,
    tableau: EntityRates,
}

export type EntityRates = {
    currentUnits: number;
    cumulativeUnitsQuarterly: number;
    cumulativeUnitsMonthly: number;
    cumulativeUnitsAnnually: number;
}

export type TestContractResult = {
    totalAmount: number;
    plans: PlanWithAmount[][]
}

export type PlanWithAmount = {
    planId: number;
    planName: string;
    amount: number;
    applied: boolean;
}
