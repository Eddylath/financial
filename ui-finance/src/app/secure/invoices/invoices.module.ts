import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "../../material.module";
import { SharedModule } from "../shared/shared.module";
import { InvoicesComponent } from "./invoices.component";

const routes: Routes = [
    {path: '', component: InvoicesComponent}
];

@NgModule({
    declarations: [
        InvoicesComponent,
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

export class InvoicesModule { }
