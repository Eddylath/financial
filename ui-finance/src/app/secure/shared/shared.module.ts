import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { MaterialModule } from "../../material.module";
import { BaseModalComponent } from "./components/base-modal/base-modal.component";
import { FormActionsComponent } from "./components/form-actions/form-actions.component";
import { UtcValueDirective } from "./directives/utc-value.directive";

@NgModule({
    declarations: [
        BaseModalComponent,
        FormActionsComponent,
        UtcValueDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
    ],
    exports: [FormActionsComponent,
        UtcValueDirective
    ],
})

export class SharedModule { }
