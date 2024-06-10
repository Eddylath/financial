import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "../../material.module";
import { SharedModule } from "../shared/shared.module";
import { BillingPlanDataTableComponent } from "./billing-plan-form/billing-plan-data-table/billing-plan-data-table.component";
import { BillingPlanFormComponent } from "./billing-plan-form/billing-plan-form.component";
import { BillingPlansComponent } from "./billing-plans.component";

const routes: Routes = [
    {path: '', component: BillingPlansComponent}
];

@NgModule({
    declarations: [
        BillingPlansComponent,
        BillingPlanFormComponent,
        BillingPlanDataTableComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})

export class BillingPlansModule { }
