import { Lookup } from "./common.types";

export const UrlPrefix = 'https://stage-billing-api.turvo.net/'
// export const UrlPrefix = 'http://localhost:8080/'

export const PageSize = 10;

export const AppUrls = {
    customers: {
        customerCrud: 'customer',
        contractCrud: 'contract',
        getBillingPlans: 'plan/search',
    },
    billingPlans: {
        cumulativePlan: 'cumulativePlan',
        tieredAbsolutePlan: 'tieredAbsolute',
        tieredRelativePlan: 'tieredRelative',
        variableByRangePlan: 'variableByRangePlan',
        getBillingPlans: 'getAllPlans',
        planCrud: 'plan'
    },
    contract: {
        testContract: 'v2/calculate',
    },
    invoices: {
        downloadReport: 'calculate/csv'
    }
};

export const OperationTypes = ['Or (greater of)', 'Plus'];

export const AllStatuses: Lookup[] = [
    {
        value: 'ACTIVE',
        displayName: 'Active'
    },
    {
        value: 'INACTIVE',
        displayName: 'Inactive'
    }
];

export const Statuses = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
};

export const CumulativePeriods: Lookup[] = [
    {
        value: 'QUARTERLY',
        displayName: 'Quarterly'
    },
    {
        value: 'MONTHLY',
        displayName: 'Monthly'
    },
    {
        value: 'ANNUALLY',
        displayName: 'Annually'
    }
];
