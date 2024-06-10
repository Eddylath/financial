import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { MaterialModule } from "../../material.module";
import { SharedModule } from "../shared/shared.module";
import { AddContractComponent } from "./customer-contract-form/add-contract/add-contract.component";
import { CustomerContractFormComponent } from "./customer-contract-form/customer-contract-form.component";
import { CustomerComponent } from "./customers.component";
import { TestContractComponent } from './test-contract/test-contract.component';

const routes: Routes = [
    {path: '', component: CustomerComponent}
];

@NgModule({
    declarations: [
        CustomerComponent,
        CustomerContractFormComponent,
        AddContractComponent,
        TestContractComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
})

export class CustomersModule { }
