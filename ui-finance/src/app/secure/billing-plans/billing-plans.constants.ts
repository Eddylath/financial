import { Lookup } from "../../common.types";
import { DataField } from "./billing-plans.types";

export const BillingUnits: Lookup[] = [
    {
        key: 'appointment',
        value: 'APPOINTMENTS',
        displayName: 'Appointments'
    },
    {
        key: 'order',
        value: 'ORDERS',
        displayName: 'Orders'
    },
    {
        key: 'revenue',
        value: 'REVENUE',
        displayName: 'Revenue'
    },
    {
        key: 'shipment',
        value: 'SHIPMENTS',
        displayName: 'Shipments'
    },
    {
        key: 'snowflake',
        value: 'SNOWFLAKE',
        displayName: 'Snowflake'
    },
    {
        key: 'tableau',
        value: 'TABLEAU_SEATS',
        displayName: 'Tableau seats'
    }
];

export const AllPlans = {
    CUMULATIVE_PLAN: 'Cumulative units',
    TIERED_ABSOLUTE: 'Tiered(absolute)',
    TIERED_RELATIVE: 'Tiered(relative)',
    VARIABLE_BY_RANGE: 'Variable by range'
};

export const PlanTypes: Lookup[] = [
    {
        value: 'CUMULATIVE',
        displayName: AllPlans.CUMULATIVE_PLAN
    },
    {
        value: 'TIERED_ABSOLUTE',
        displayName: AllPlans.TIERED_ABSOLUTE
    },
    {
        value: 'TIERED_RELATIVE',
        displayName: AllPlans.TIERED_RELATIVE
    },
    {
        value: 'VARIABLE_BY_RANGE',
        displayName: AllPlans.VARIABLE_BY_RANGE
    }
];

export const DataFields: DataField[] = [{
        key: 'from',
        displayName: 'From',
        type: 'date',
        modelsSupported: [AllPlans.TIERED_ABSOLUTE]
    },
    {
        key: 'unitCountFrom',
        displayName: 'Unit count from',
        type: 'number',
        modelsSupported: [AllPlans.VARIABLE_BY_RANGE]
    },
    {
        key: 'to',
        displayName: 'To',
        type: 'date',
        modelsSupported: [AllPlans.TIERED_ABSOLUTE]
    },
    {
        key: 'unitCountTo',
        displayName: 'Unit count to',
        type: 'number',
        modelsSupported: [AllPlans.VARIABLE_BY_RANGE]
    },
    {
        key: 'fromDay',
        displayName: 'From day',
        type: 'number',
        modelsSupported: [AllPlans.TIERED_RELATIVE]
    },
    {
        key: 'toDay',
        displayName: 'To day',
        type: 'number',
        modelsSupported: [AllPlans.TIERED_RELATIVE]
    },
    {
        key: 'max',
        displayName: 'Max',
        type: 'number',
        modelsSupported: [AllPlans.TIERED_ABSOLUTE, AllPlans.TIERED_RELATIVE]
    },
    {
        key: 'cumulativeCount',
        displayName: 'Cumulative count',
        type: 'number',
        modelsSupported: [AllPlans.CUMULATIVE_PLAN]
    },
    {
        key: 'fixedCost',
        displayName: 'Fixed cost',
        type: 'number',
        modelsSupported: [
            AllPlans.CUMULATIVE_PLAN,
            AllPlans.TIERED_ABSOLUTE,
            AllPlans.TIERED_RELATIVE,
            AllPlans.VARIABLE_BY_RANGE
        ],
        dollarify: true,
        decimel: true
    },
    {
        key: 'rate',
        displayName: 'Rate',
        type: 'number',
        modelsSupported: [AllPlans.CUMULATIVE_PLAN, AllPlans.VARIABLE_BY_RANGE],
        decimel: true
    },
    {
        key: 'overageRate',
        displayName: 'Overage rate',
        type: 'number',
        modelsSupported: [AllPlans.TIERED_ABSOLUTE, AllPlans.TIERED_RELATIVE],
        decimel: true
    }
];
