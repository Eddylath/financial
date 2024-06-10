import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CumulativePeriods } from '../../../../basic-data.constants';
import { Lookup } from '../../../../common.types';
import { dateRangeValidation } from '../../../shared/validations/date-range.validators';
import { numberRangeValidation } from '../../../shared/validations/number-range.validators';
import { Translationi18nKey, Translations } from '../../../../translations.constants';
import { AllPlans, DataFields } from '../../billing-plans.constants';
import { CostPlan, DataField } from '../../billing-plans.types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'tu-billing-plan-data-table',
    templateUrl: './billing-plan-data-table.component.html',
    styleUrls: ['./billing-plan-data-table.component.scss']
})
export class BillingPlanDataTableComponent implements OnInit {
    @Input() billingPlanForm!: FormGroup;

    translations: Translationi18nKey = Translations;

    fields: DataField[] = []

    dataFields: DataField[] = DataFields;

    cumulativePeriods: Lookup[] = CumulativePeriods;

    constructor (private fb: FormBuilder) { }

    ngOnInit(): void {
        this.billingPlanForm.addControl('costPlans', this.fb.array([]));
        this.onFormValueChange();
    }

    get costPlans() {
        return this.billingPlanForm.get('costPlans') as FormArray;
    }

    onFormValueChange(): void {
        this.billingPlanForm.get('modelName')?.valueChanges
        .pipe(
            untilDestroyed(this),
        ).subscribe(
            (newValue) => {
                this.setFields(newValue);
                this.addRow();
            }
        );
    }

    setFields(plan: string): void {
        this.costPlans.clear();

        if (plan !== AllPlans.CUMULATIVE_PLAN)
            this.billingPlanForm.removeControl('cumulativeType')
        else
            this.billingPlanForm.addControl('cumulativeType', this.fb.control('Quarterly'));

        this.fields = this.dataFields.filter((field) => {
            return field.modelsSupported.includes(plan);
        })
    }

    onPlanTypeInitialized(plan: string, costPlans: CostPlan[]): void {
        this.setFields(plan);
        costPlans.forEach((plan: CostPlan) => this.addRow(plan));
    }

    addRow(plan: CostPlan | null = null): void {
        const formGroup = this.fb.group({}, {
            validator: [
                dateRangeValidation('from', 'to'),
                numberRangeValidation('unitCountFrom', 'unitCountTo'),
                numberRangeValidation('fromDay', 'toDay')
            ]
        });

        this.fields.forEach(field => {
            const initialValue = plan?.[field.key] || (field.type === 'date' ? '' : 0)
            formGroup.addControl(field.key, this.fb.control(initialValue, Validators.required));
        });

        this.costPlans.push(formGroup);
    }

    isFieldInvalid(field: string, i: number): boolean {
        return !!this.costPlans.at(i).get(field)?.errors &&
        !!this.costPlans.at(i).get(field)?.touched;
    }

    deleteRow(index: number): void {
        this.costPlans.removeAt(index);
        this.billingPlanForm.markAsDirty();
    }
}
