import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';

import { OperationTypes } from '../../../../basic-data.constants';
import { dateRangeValidation } from '../../../shared/validations/date-range.validators';
import { Translationi18nKey, Translations } from '../../../../translations.constants';
import { CustomersService } from '../../customers.service';
import { Plan, Contract } from '../../customers.types';
import { validateBillingPlan } from './add-contract.validators';

@UntilDestroy()
@Component({
    selector: 'tu-add-contract',
    templateUrl: './add-contract.component.html',
    styleUrls: ['./add-contract.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddContractComponent implements OnInit{
    @Input() customerContractForm!: FormGroup;

    @Input() contract: Contract | undefined = undefined;

    @ViewChildren('input') inputs!: QueryList<ElementRef>;

    contractAdded = false;

    billingPlanArray: Plan[] = [];

    translations: Translationi18nKey = Translations;

    operationTypes: string[] = OperationTypes;

    constructor(
        private fb: FormBuilder,
        private service: CustomersService,
    ){}

    ngOnInit(): void {
        if (this.contract) {
            this.contractAdded = true;
            this.initializeContract();

            if (!this.contract.greaterOfPlans?.length) {
                this.initiatePlans();
            } else {
                this.contract.greaterOfPlans?.forEach((plan) => {
                    const currPlan = plan as Plan;
                    this.greaterOfPlans.push(this.fb.group({
                        operationType: currPlan.operationType,
                        id: currPlan.id,
                        name: currPlan.name
                    }));
                });
            }
        }
    }

    get greaterOfPlans() {
        return this.customerContractForm.get('contract.greaterOfPlans') as FormArray;
    }

    addBillingPlan(): void {
        this.greaterOfPlans.push(this.fb.group({
            operationType: this.operationTypes[0],
            id: '',
            name: ''
        }));
    }

    isFieldInvalid(
        field: string,
        group: AbstractControl | null = this.customerContractForm.get('contract')
    ): boolean {
        return !!group?.get(field)?.errors && !!group?.get(field)?.touched; 
    }

    planSelected(event: MatAutocompleteSelectedEvent, i:number): void {
        const selected = this.billingPlanArray.filter((plan) => plan.name === event.option.value)[0]
        this.greaterOfPlans.at(i).patchValue(selected);
        this.customerContractForm.markAsDirty();
    }

    onOperationTypeSelected(event: MatAutocompleteSelectedEvent, billingPlan: AbstractControl): void {
        billingPlan.patchValue({operationType: event.option.value});
        this.customerContractForm.markAsDirty();
    }

    searchQuery(i: number): void {
        const filterValue = this.inputs.toArray()[i].nativeElement.value.toLowerCase();

        this.service.getBillingPlans(filterValue)
            .pipe(
                untilDestroyed(this),
                debounceTime(100),
            )
            .subscribe(
                (data: Plan[]) => {
                    this.billingPlanArray = data.filter((plan) => {
                        return !this.customerContractForm.get('contract.greaterOfPlans')?.value.some(
                            (bp: Plan) => bp.id === plan.id
                        );
                    })
                },
            );
    }

    onInputBlur(i: number): void {
        let input = this.inputs.toArray()[i].nativeElement.value;
        if (!this.greaterOfPlans.value.some((plan: Plan) => plan.name === input)) {
            input = '';
            this.greaterOfPlans.at(i).patchValue({
                id: '',
                name: ''
            })
        }
    }

    initializeContract(): void {
        this.customerContractForm.addControl('contract', this.fb.group({
            contractName: [this.contract?.contractName || '', Validators.required],
            contractStartDate: [this.contract?.contractStartDate || '', Validators.required],
            contractEndDate: [this.contract?.contractEndDate || '', Validators.required],
            greaterOfPlans: this.fb.array([]),
        },
        {
            validator: [
                dateRangeValidation('contractStartDate', 'contractEndDate'),
                validateBillingPlan('name')
            ]
        }));
    }

    initiatePlans(): void {
        this.greaterOfPlans.push(this.fb.group({
            operationType: 'primary',
            id: '',
            name: ''
        }));
    }

    toggleContractForm(): void {
        this.contractAdded = !this.contractAdded;

        if (this.contractAdded) {
            this.initializeContract();
            this.initiatePlans();
        }
        else {
            this.customerContractForm.markAsDirty();
            this.customerContractForm.removeControl('contract');
            this.contract = undefined;
        }
    }

    removeNthPlan(i: number): void {
        this.greaterOfPlans.removeAt(i);
        this.customerContractForm.markAsDirty();
    }
}
