import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs';

import { BaseModalService } from '../shared/services/base-modal.service';
import { Translationi18nKey, Translations } from '../../translations.constants';
import { MatTableDataSource } from '@angular/material/table';
import { BillingPlanFormComponent } from './billing-plan-form/billing-plan-form.component';
import { AllStatuses, PageSize } from '../../basic-data.constants';
import { BillingPlan } from './billing-plans.types';
import { BillingPlansService } from './billing-plans.service';
import { SnackBarService } from '../shared/services/snack-bar.service';
import { ApiResponse, Lookup } from '../../common.types';
import { BillingUnits, PlanTypes } from './billing-plans.constants';
import { UtilityService } from '../shared/services/utility.service';

@UntilDestroy()
@Component({
    selector: 'tu-billing-plans',
    templateUrl: './billing-plans.component.html',
    styleUrls: ['./billing-plans.component.scss']
})
export class BillingPlansComponent implements OnInit{
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    displayedColumns: string[] = [
        'name',
        'connectedBusiness',
        'status',
        'actions'
    ];

    billingPlans!: MatTableDataSource<BillingPlan>;

    billingPlansLength = 0;

    pageSize: number = PageSize;

      columnsToFilter: string[] = [
        'name',
        'connectedBusiness'
    ];
      
    translations: Translationi18nKey = Translations;

    customerFilters!: FormGroup;
    
    allStatuses: Lookup[] = AllStatuses;

    planTypes: Lookup[] = PlanTypes;

    billingUnits: Lookup[] = BillingUnits;
    
    constructor(
        private service: BillingPlansService,
        private snackBarService: SnackBarService,
        private baseModalService: BaseModalService,
        private fb: FormBuilder,
        private snackBar: SnackBarService,
        private util: UtilityService
    ) {}

    ngOnInit() {
        this.customerFilters = this.fb.group({
            searchQuery: '',
            statusFilter: '',
        });

        this.getPlans();

        this.onFormValueChange();
    }

    setPage(pageNumber: number) {
        this.paginator.pageIndex = pageNumber;
    }

    loadMoreData(
        e: PageEvent | null = null,
        isFilterChanged = false
    ) {
        this.getPlans(
            e?.pageIndex || 0,
            this.customerFilters.get('searchQuery')?.value,
            this.customerFilters.get('statusFilter')?.value,
            isFilterChanged
        );
    }

    getPlans(
        pageIndex = 0,
        query = '',
        status = '',
        isFilterChanged = false
    ): void {
        status = this.util.findSelectedObject(this.allStatuses, status);
        this.service.getBillingPlansData(pageIndex, query, status)
              .pipe(
                untilDestroyed(this)
              )
              .subscribe({
                  next: (response: ApiResponse<BillingPlan[]>) => {
                    this.billingPlansLength = response.totalElements;

                    response.content.forEach((plan: BillingPlan) => {
                        plan.status = this.allStatuses.find((status) => status.value === plan.status)?.displayName as string;
                    });

                      this.billingPlans = new MatTableDataSource<BillingPlan>(response.content as BillingPlan[]);

                    if (isFilterChanged)
                        this.setPage(0);
                  },
                  error: (e) => {
                    this.snackBar.alignSnackBar(e.message);
                }
            });
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
   
    deletePlan(rowElement: BillingPlan): void {
        this.service.deletePlanById(rowElement.id as number)
            .pipe(
                untilDestroyed(this),
            )
            .subscribe({
                next: () => {
                    this.snackBarService.alignSnackBar(this.translations['billingPlanForm']['planDeleted']);
                    this.getPlans();
                },
                error: (e) => {
                    this.snackBarService.alignSnackBar(e.message);
                }
            })
    }
    
    editPlan(rowElement: BillingPlan): void {
        this.createBillingPlan(true, rowElement);
    }
  
    createBillingPlan(edit = false, plan: BillingPlan | null = null): void {
        const key = edit ? 'editBillingPlan' : 'addBillingPlan';
        const modalData = {
            config: {
                title: this.translations['billingPlanForm'][key],
                smallWidth: true,
                watchLeaving: true,
            },
            data: {
                planId: plan?.id,
            },
        }

        this.baseModalService.open(BillingPlanFormComponent, modalData)
            .afterClosed()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                this.getPlans();
            });
      }
}
