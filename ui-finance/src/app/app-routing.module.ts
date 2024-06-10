import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingPlansModule } from './secure/billing-plans/billing-plans.module';
import { CustomersModule } from './secure/customers/customers.module';
import { InvoicesModule } from './secure/invoices/invoices.module';
import { OverviewReportModule } from './secure/overview-report/overview-report.module';

const routes: Routes = [
    {path: '', redirectTo: 'overviewReport', pathMatch: 'full'},
    {path: 'customers', loadChildren: () => CustomersModule},
    {path: 'billingPlans', loadChildren: () => BillingPlansModule},
    {path: 'invoices', loadChildren: () => InvoicesModule},
    {path: 'overviewReport', loadChildren: () => OverviewReportModule},
    {path: '**', redirectTo: 'customers'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
