import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppUrls, UrlPrefix } from '../../basic-data.constants';
import { ApiResponse } from '../../common.types';
import { AllPlans } from './billing-plans.constants';
import { BillingPlan } from './billing-plans.types';

@Injectable({
    providedIn: 'root'
})
export class BillingPlansService {
    readonly billingPlansListUrl = UrlPrefix + AppUrls.billingPlans.getBillingPlans;
    readonly billingPlanCrud = UrlPrefix + AppUrls.billingPlans.planCrud;

    constructor(private http: HttpClient) { }

    getBillingPlansData(pageNumber: number, query: string, status: string): Observable<ApiResponse<BillingPlan[]>> {
        let url = `${this.billingPlansListUrl}?`;

        if (pageNumber)
            url += `page=${pageNumber}&`;

        if (query)
            url += `searchKey=${query}&`;

        if (status)
            url += `status=${status}&`;

        return this.http.get<ApiResponse<BillingPlan[]>>(url);
    }

    getFullPlan(id: number): Observable<BillingPlan> {
        return this.http.get<BillingPlan>(`${this.billingPlanCrud}/${id}`);
    }

    deletePlanById(id: number): Observable<void> {
        return this.http.delete<void>(`${this.billingPlanCrud}/${id}`);
    }

    saveBillingPlan(plan: BillingPlan, modelName: string): Observable<BillingPlan> {
        let planName = UrlPrefix;

        switch(modelName) {
            case AllPlans.CUMULATIVE_PLAN:
                planName += AppUrls.billingPlans.cumulativePlan;
                break;
            case AllPlans.TIERED_ABSOLUTE:
                planName += AppUrls.billingPlans.tieredAbsolutePlan;
                break;
            case AllPlans.TIERED_RELATIVE:
                planName += AppUrls.billingPlans.tieredRelativePlan;
                break;
            default:
                planName += AppUrls.billingPlans.variableByRangePlan;
        }

        if (plan.id)
            return this.http.put<BillingPlan>(`${planName}/${plan.id}`, plan);
        else
            return this.http.post<BillingPlan>(planName, plan);
    }
}
