import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';

import { CustomerContractFormComponent } from './customer-contract-form/customer-contract-form.component';
import { BaseModalService } from '../shared/services/base-modal.service';
import { Translationi18nKey, Translations } from '../../translations.constants';
import { CustomersService } from './customers.service';
import { Plan, Contract, Customer } from './customers.types';
import { AllStatuses, PageSize } from '../../basic-data.constants';
import { ApiResponse, Lookup } from '../../common.types';
import { SnackBarService } from '../shared/services/snack-bar.service';
import { TestContractComponent } from './test-contract/test-contract.component';
import { UtilityService } from '../shared/services/utility.service';

@UntilDestroy()
@Component({
    selector: 'tu-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomerComponent implements OnInit{
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    displayedColumns: string[] = [
        'name',
        'businessId',
        'primaryContact',
        'contactEmail',
        'status',
        'actions',
    ];

    customersData!: MatTableDataSource<Customer>;

    customersLength = 0;

    pageSize: number = PageSize;

    columnsToFilter: string[] = [
        'name',
        'businessId',
    ];

    translations: Translationi18nKey = Translations;

    customerFilters!: FormGroup;

    allStatuses: Lookup[] = AllStatuses

    constructor(
        private service: CustomersService,
        private baseModalService: BaseModalService,
        private fb: FormBuilder,
        private snackBar: SnackBarService,
        private util: UtilityService
    ) {}

    ngOnInit(): void {
        this.customerFilters = this.fb.group({
            searchQuery: '',
            statusFilter: '',
        });

        this.getCustomers();

        this.onFormValueChange();
    }

    loadMoreData(
        e: PageEvent | null = null,
        isFilterChanged = false
    ): void {
        this.getCustomers(
            e?.pageIndex || 0,
            this.customerFilters.get('searchQuery')?.value,
            this.customerFilters.get('statusFilter')?.value,
            isFilterChanged
        );
    }

    setPage(pageNumber: number): void {
        this.paginator.pageIndex = pageNumber;
    }

    onFormValueChange(): void {
        this.customerFilters.valueChanges
            .pipe(
                untilDestroyed(this),
                debounceTime(100),
            )
            .subscribe(() => {
                this.loadMoreData(null, true);
            });
    }

    openTestModal(rowElement: Customer): void {
        if (rowElement.id) {
            this.service.getCustomerContracts(rowElement.id)
                .pipe(
                    untilDestroyed(this),
                )
                .subscribe({
                    next: (data: Contract[]) => {
                        if (data.length === 0) {
                            this.snackBar.alignSnackBar(this.translations['customerPage']['noContractAssociated']);
                        }
                        else {
                            const modalData = {
                                config: {
                                    title: 'Test Contract',
                                    watchLeaving: true,
                                },
                                data: {
                                    contract: data[0],
                                }
                            }
                    
                            this.baseModalService.open(TestContractComponent, modalData)
                        }
                    },
                    error: (e) => {
                        this.snackBar.alignSnackBar(e.message);
                    }
                });
        }
    }

    getCustomers(
        pageIndex = 0,
        query = '',
        status = '',
        isFilterChanged = false
    ): void {
        status = this.util.findSelectedObject(this.allStatuses, status);
        this.service.getCustomersData(pageIndex, query, status)
            .pipe(
                untilDestroyed(this),
            )
            .subscribe({
                next: (response: ApiResponse<Customer[]>) => {
                    this.customersLength = response.totalElements;

                    response.content.forEach((cust: Customer) => {
                        cust.status = this.allStatuses.find((status) => status.value === cust.status)?.displayName;
                    });

                    this.customersData = new MatTableDataSource<Customer>(response.content);

                    if (isFilterChanged)
                        this.setPage(0);
                },
                error: (e) => {
                    this.snackBar.alignSnackBar(e.message);
                },
            });
    }

    editCustomer(rowElement: Customer): void {
        if (rowElement.id) {
            this.service.getCustomerContracts(rowElement.id)
                .pipe(
                    untilDestroyed(this),
                )
                .subscribe({
                    next: (data: Contract[]) => {
                        if (data.length > 0) {
                            const contract = data[0];
                            contract.greaterOfPlans = this.service.preparePlanArrayForUi(contract.greaterOfPlans as Plan[][]);
                            rowElement.contract = contract;
                        }

                        this.createCustomerContract(true, rowElement);
                    },
                    error: (e) => {
                        this.snackBar.alignSnackBar(e.message);
                    }
                });
        }
    }

    createCustomerContract (edit = false, customer: Customer | null = null): void {
        const key = edit ? 'editCustomer' : 'addCustomer';

        const modalData = {
            config: {
                title: this.translations['customerForm'][key],
                watchLeaving: true,
            },
            data: {
                customer: customer,
            },
        }

        this.baseModalService.open(CustomerContractFormComponent, modalData)
            .afterClosed()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                this.getCustomers();
            });
    }
}
