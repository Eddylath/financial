import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';

import { Translationi18nKey, Translations } from '../../../translations.constants';
import { AllStatuses } from '../../../basic-data.constants';
import { Lookup } from '../../../common.types';
import { BaseModalService } from '../../shared/services/base-modal.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { UtilityService } from '../../shared/services/utility.service';
import { CustomersService } from '../customers.service';
import { Contract, Customer } from '../customers.types';
import { AddContractComponent } from './add-contract/add-contract.component';

@UntilDestroy()
@Component({
    selector: 'tu-customer-contract-form',
    templateUrl: './customer-contract-form.component.html',
    styleUrls: ['./customer-contract-form.component.scss'],
})
export class CustomerContractFormComponent implements OnInit {
    @Input() customer: Customer | null = null;

    @ViewChild(AddContractComponent) contractComponent!: AddContractComponent;

    customerContractForm!: FormGroup;

    translations: Translationi18nKey = Translations;

    formId = 'customer-contract-form';

    isFormValid = false;

    allStatuses: Lookup[] = AllStatuses;

    constructor(
        private fb: FormBuilder,
        private snackBarService: SnackBarService,
        private modalService: BaseModalService,
        private service: CustomersService,
        private util: UtilityService,
    ) {}

    ngOnInit(): void {
        this.customerContractForm = this.fb.group({
            name: [this.customer?.name || '', Validators.required],
            businessId: this.customer?.businessId || '',
            primaryContact: this.customer?.primaryContact || '',
            contactEmail: [this.customer?.contactEmail || '', Validators.email],
        });

        this.onFormValueChange();
    }
    
    isDirty(): boolean {
        return this.customerContractForm.dirty;
    }

    onFormValueChange(): void {
        this.customerContractForm.valueChanges
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

        if (this.customerContractForm.status === 'VALID')
            this.isFormValid = true;
    }

    onCancel(): void {
        this.modalService.close();
    }

    isFieldInvalid(field: string): boolean {
        return !!this.customerContractForm.get(field)?.errors &&
        !!this.customerContractForm.get(field)?.touched; 
    }

    saveContractData(contract: Contract): void {
        this.service.saveContractData(contract)
            .pipe(
                untilDestroyed(this),
            )
            .subscribe({
                next: () => {
                    this.snackBarService.alignSnackBar(this.translations['customerForm']['contractSaved']);
                    this.modalService.closeModal();
                },
                error: (e) => {
                    this.snackBarService.alignSnackBar(e.message);
                }
            });
    }

    deleteContract(id: number): void {
        if(id) {
            this.service.deleteContractById(id)
                .pipe(
                    untilDestroyed(this),
                )
                .subscribe({
                    next: () => {
                        this.snackBarService.alignSnackBar(this.translations['customerForm']['contractDeleted']);
                        this.modalService.closeModal();
                    },
                    error: (e) => {
                        this.snackBarService.alignSnackBar(e.message);
                    }
                });
        }
        else {
            this.modalService.closeModal();
        }
    }

    onSubmit(): void {
        const payload = Object.assign({}, this.customer, this.customerContractForm.value);
        const contract = Object.assign({}, this.customer?.contract, payload.contract);

        payload.status = this.util.findSelectedObject(this.allStatuses, payload.status);
        
        delete payload.contract;

        this.service.saveCustomerData(this.util.removeEmptyValues(payload))
            .pipe(
                untilDestroyed(this),
            )
            .subscribe({
                next: (cust: Customer) => {
                    this.snackBarService.alignSnackBar(this.translations['customerForm']['customerSaved']);

                    if (!this.contractComponent.contractAdded) {
                        this.deleteContract(contract.id);
                        return;
                    }
            
                    if (!contract.id) {
                        contract.customerId = cust.id;
                    }

                    this.saveContractData(this.util.removeEmptyValues(contract));
                },
                error: (e) => {
                    this.snackBarService.alignSnackBar(e.message);
                }});
    }
}
