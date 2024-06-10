import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';

import { AllStatuses, CumulativePeriods, Statuses } from '../../../basic-data.constants';
import { Lookup } from '../../../common.types';
import { Translationi18nKey, Translations } from '../../../translations.constants';
import { BaseModalService } from '../../shared/services/base-modal.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { UtilityService } from '../../shared/services/utility.service';
import { PlanTypes, BillingUnits } from '../billing-plans.constants';
import { BillingPlansService } from '../billing-plans.service';
import { BillingPlan } from '../billing-plans.types';
import { BillingPlanDataTableComponent } from './billing-plan-data-table/billing-plan-data-table.component';

@UntilDestroy()
@Component({
    selector: 'tu-billing-plan-form',
    templateUrl: './billing-plan-form.component.html',
    styleUrls: ['./billing-plan-form.component.scss']
})
export class BillingPlanFormComponent implements OnInit{
    @Input() planId: number | null = null;

    @ViewChild(BillingPlanDataTableComponent) tableComponent!: BillingPlanDataTableComponent;

    formId = 'billing-plan-form';

    translations: Translationi18nKey = Translations;

    planToEdit!: BillingPlan;

    billingPlanForm!: FormGroup;

    cumulativePeriods: Lookup[] = CumulativePeriods;

    billingUnits: Lookup[] = BillingUnits;

    planTypes: Lookup[] = PlanTypes;

    allStatuses: Lookup[] = AllStatuses;

    isFormValid = false;

    constructor(
        private fb: FormBuilder,
        private modalService: BaseModalService,
        private service: BillingPlansService,
        private snackBarService: SnackBarService,
        private util: UtilityService
    ) { }

    ngOnInit(): void {
        this.createPlan();

        if (this.planId) {
            this.service.getFullPlan(this.planId)
                .pipe(
                    untilDestroyed(this),
                )
                .subscribe({
                    next: (plan: BillingPlan) => {
                        plan.status = this.allStatuses.find((status) => status.value === plan.status)?.displayName as string;
                        plan.planType = this.planTypes.find((type) => type.value === plan.planType)?.displayName as string;
                        plan.billingUnit = this.billingUnits.find((type) => type.value === plan.billingUnit)?.displayName as string;
                        this.planToEdit = plan;
                        this.populateData(plan);
                    },
                    error: (e) => {
                        this.snackBarService.alignSnackBar(e.message);
                    }
                });
        }
    }

    createPlan(): void {
        this.billingPlanForm = this.fb.group({
            name: ['', Validators.required],
            billingUnit: ['', Validators.required],
            modelName: ['', Validators.required],
            status: Statuses.ACTIVE,
        });
        
        this.onFormValueChange();
    }

    populateData(plan: BillingPlan): void {
        this.billingPlanForm.patchValue({
            name: plan.name,
            billingUnit: plan.billingUnit,
            modelName: plan.planType,
            status: plan.status
        });

        this.billingPlanForm.get('modelName')?.disable();
 
        this.tableComponent.onPlanTypeInitialized(
            this.billingPlanForm.get('modelName')?.value,
            this.planToEdit.costPlans
        );
    }

    isDirty(): boolean {
        return this.billingPlanForm.dirty;
    }

    onFormValueChange(): void {
        this.billingPlanForm.valueChanges
            .pipe(
                untilDestroyed(this),
                debounceTime(100),
            )
            .subscribe(() => {
                this.checkFormValidity();
            });
    }

    checkFormValidity(): void {
        this.isFormValid = false;

        if (this.billingPlanForm.status === 'VALID')
            this.isFormValid = true;
    }

    onCancel(): void {
        this.modalService.close();
    }

    isFieldInvalid(field: string): boolean {
        return !!this.billingPlanForm.get(field)?.errors &&
            !!this.billingPlanForm.get(field)?.touched;
    }

    onSubmit(): void {
        const payload = Object.assign({}, this.planToEdit, this.billingPlanForm.value);

        payload.cumulativeType = this.util.findSelectedObject(
            this.cumulativePeriods,
            this.billingPlanForm.get('cumulativeType')?.value
        );
        payload.status = this.util.findSelectedObject(
            this.allStatuses,
            this.billingPlanForm.get('status')?.value
        );
        payload.billingUnit = this.util.findSelectedObject(
            this.billingUnits,
            this.billingPlanForm.get('billingUnit')?.value
        );

        const { modelName, planType, ...finalPayload } = payload;

        this.service.saveBillingPlan(finalPayload, modelName || planType)
            .pipe(
                untilDestroyed(this),
            )
            .subscribe({
                next: () => {
                    this.modalService.closeModal();
                    this.snackBarService.alignSnackBar(this.translations['billingPlanForm']['planSaved']);
                },
                error: (error) => {
                    this.snackBarService.alignSnackBar(error.message);
                }
            });
    }
}
