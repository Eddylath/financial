import * as moment from "moment";

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject, debounceTime, takeUntil } from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import { BaseModalService } from '../../../secure/shared/services/base-modal.service';
import { Lookup } from '../../../common.types';
import { SnackBarService } from '../../../secure/shared/services/snack-bar.service';
import { Translationi18nKey, Translations } from '../../../translations.constants';
import { BillingUnits } from '../../billing-plans/billing-plans.constants';
import { CustomersService } from '../customers.service';
import { TestContractResult } from './test-contract.types';
import { Contract } from '../customers.types';
import { validateBillingMonth } from './test-contract.validators';
import { MY_FORMATS } from './test-contract.constants';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
    selector: 'tu-test-contract',
    templateUrl: './test-contract.component.html',
    styleUrls: ['./test-contract.component.scss'],
    providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class TestContractComponent implements OnInit {
    @Input() contract!: Contract;

    contractStartDate!: moment.Moment;

    entities: Lookup[] = BillingUnits;

    userNote = '';

    columns: string[] = [
        'currentUnits',
        'cumulativeUnitsQuarterly',
        'cumulativeUnitsMonthly',
        'cumulativeUnitsAnnually'
    ];

    columnDisplayNames: string[] = [
        'Entity',
        'Current units',
        'Cumulative units quarterly',
        'Cumulative units monthly',
        'Cumulative units annually',
    ]

    testContractForm!: FormGroup;

    translations: Translationi18nKey = Translations;

    formId = 'test-contract-form';

    isFormValid = false;

    testContractResult!: TestContractResult;

    formValueChangesSubscription!: Subscription;

    private readonly unsubscribe$: Subject<void> = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private snackBar: SnackBarService,
        private modalService: BaseModalService,
        private service: CustomersService,
        private util: UtilityService
    ) {}

    ngOnInit(): void {
        this.contractStartDate = this.util.toUTC(moment(this.contract.contractStartDate));

        this.testContractForm = this.fb.group({
            date: ['', {
                validators: [
                    validateBillingMonth(this.contract),
                    Validators.required
                ]
            }],
            day: ['', Validators.min(0)],
        });

        this.entities.forEach((entity) => {
            this.testContractForm.addControl(entity.key || '', this.fb.group({
                currentUnits: [0, Validators.required],
                cumulativeUnitsMonthly: [0, Validators.required],
                cumulativeUnitsQuarterly: [0, Validators.required],
                cumulativeUnitsAnnually: [0, Validators.required],
            }));
        })
        
        this.onFormValueChange();
    }

    setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
        const endOfMonth = this.util.getLastDayOfMonth(normalizedMonthAndYear);
        const billingDate = this.util.toUTC(endOfMonth);
        const dayDiff = billingDate.diff(this.contractStartDate, 'days');
        datepicker.close();

        this.userNote = billingDate.format('DD MMMM, YYYY');
        
        this.testContractForm.get('date')?.setValue(billingDate);
        this.testContractForm.get('day')?.setValue(dayDiff);

        this.testContractForm.markAsDirty();
    }

    isDirty(): boolean {
        return this.testContractForm.dirty;
    }

    onFormValueChange(): void {
        this.formValueChangesSubscription = this.testContractForm.valueChanges
            .pipe(debounceTime(100))
            .subscribe(() => {
                this.checkFormValidity();
            });
    }

    checkFormValidity(): void {
        this.isFormValid = false;

        if (this.testContractForm.status === 'VALID') {
            this.isFormValid = true;
        }
    }

    onCancel(): void {
        this.modalService.close();
    }

    onSubmit(): void {
        this.service.testPlan(this.contract.id, this.testContractForm.value)
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe({
                next: (result: TestContractResult) => {
                    this.testContractResult = result;
                },
                error: (e) => {
                    this.snackBar.alignSnackBar(e.message);
                },
            });
    }

    isFieldInvalid(field: string, subfield: string | null = null): boolean {
        const a = subfield ? `.${subfield}` : '';
        return !!this.testContractForm.get(field + a)?.errors &&
        !!this.testContractForm.get(field + a)?.touched; 
    }
}
