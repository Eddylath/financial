export interface Translationi18nKey {
    [key: string]: Translationi18nValue;
}

export interface Translationi18nValue {
    [key: string]: string;
}

export const Translations: Translationi18nKey = {
    common: {
        abandonUnsavedChanges: 'You have unsaved changes. Are you sure you want to navigate away?',
        edit: 'Edit',
        clear: 'Clear',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        datePlaceholder: 'mm/dd/yyyy',
        monthPlaceholder: 'mm/yyyy',
        invalidFormTooltip: 'Press to see invalid fields',
        addRow: 'Add row',
        from: 'From',
        to: 'To',
        min: 'Min',
        max: 'Max',
        rate: 'Rate',
        averageRate: 'Average rate',
        search: 'Search',
        selectStatus: 'Select status',
        dollarify: '$',
        plus: '+',
    },
    home: {
        customers: 'Customers',
        invoices: 'Invoices',
        billingPlans: 'Billing plans',
        overviewReport: 'Overview report',
    },
    errorMessages: {
        dateRangeError: 'Cannot exceed end date',
    },
    customerPage: {
        name: 'Customer name',
        businessId: 'Business ID',
        primaryContact: 'Primary contact',
        contactEmail: 'Contact email',
        status: 'Account status',
        addCustomer: '+ Customer',
        search: 'Search customer name or ID',
        testContract: 'Test contract',
        noContractAssociated: 'No contract is associated with this customer',
    },
    billingPlanPage: {
        addBillingPlan: '+ Billing plan',
        name: 'Billing plan',
        connectedBusiness: 'Customers',
        status: 'Status',
        search: 'Search plan by name',
    },
    customerForm: {
        addCustomer: 'Add customer',
        editCustomer: 'Edit customer',
        name: 'Customer name',
        contractName: 'Contract name',
        businessId: 'Business ID',
        contractStartDate: 'Start date',
        contractEndDate: 'End date',
        primaryContact: 'Billing contact',
        contactEmail: 'Billing email',
        billingPlan: 'Billing plan',
        namePlaceholder: '(e.g. Acme Corp)',
        contractNamePlaceholder: '(e.g. Acme 2 years through 2024)',
        primaryContactPlaceholder: '(e.g. Susan Smith)',
        contactEmailPlaceholder: '(e.g. example@example.com)',
        addBillingPlan: 'Add plan',
        addContract: 'Add a contract',
        contractSaved: 'Contract saved successfully.',
        customerSaved: 'Customer data saved successfully.',
        contractDeleted: 'Contract deleted successfully.',
    },
    testContractForm: {
        date: 'Billing month',
        day: 'Day(s) since contract',
        testContract: 'Test contract',
        planName: 'Plan name',
        planCost: 'Plan cost',
        selected: 'Selected',
        totalAmount: 'Total amount:',
        userNote: 'You are selecting '
    },
    billingPlanForm: {
        addBillingPlan: 'Add billing plan',
        editBillingPlan: 'Edit billing plan',
        name: 'Billing plan name',
        namePlaceholder: '(e.g. Shipments - Tiered for 2024)',
        billingUnit: 'Billing units',
        planType: 'Billing model',
        planStatus: 'Plan status',
        planDeleted: 'Plan deleted successfully.',
        planSaved: 'Billing plan data saved successfully.',
        status: 'Plan status',
        addRow: 'Add row',
    }
};
