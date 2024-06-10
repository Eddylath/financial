import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppUrls, UrlPrefix } from '../../basic-data.constants';
import { ApiResponse } from '../../common.types';
import { Plan, Contract, Customer } from './customers.types';
import { TestContractPayload, TestContractResult } from './test-contract/test-contract.types';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {
    readonly contractCrud = UrlPrefix + AppUrls.customers.contractCrud;
    readonly customerCrud = UrlPrefix + AppUrls.customers.customerCrud;
    readonly billingPlansListUrl = UrlPrefix + AppUrls.customers.getBillingPlans;
    readonly testContractUrl = UrlPrefix + AppUrls.contract.testContract;

    constructor(
        private http: HttpClient
    ) { }

    getCustomersData(pageNumber: number, query: string, status: string): Observable<ApiResponse<Customer[]>> {
        let url = `${this.customerCrud}?`;

        if (pageNumber)
            url += `page=${pageNumber}&`;

        if (query)
            url += `searchKey=${query}&`;

        if (status)
            url += `status=${status}&`;

        return this.http.get<ApiResponse<Customer[]>>(url);
    }

    getBillingPlans(query: string): Observable<Plan[]> {
        return this.http.get<Plan[]>(`${this.billingPlansListUrl}?prefix=${query}`);
    }

    getCustomerContracts(custId: number): Observable<Contract[]> {
        return this.http.get<Contract[]>(`${this.contractCrud}?customerId=${custId}`)
    }

    saveCustomerData(data: Customer): Observable<Customer> {
        if (data.id) {
            return this.http.put<Customer>(`${this.customerCrud}/${data.id}`, data);
        }
        else {
            return this.http.post<Customer>(this.customerCrud, data);
        }
    }

    deleteContractById(id: number): Observable<void> {
        return this.http.delete<void>(this.contractCrud + `/${id}`);
    }

    saveContractData(data: Contract): Observable<Contract> {
        data.greaterOfPlans = this.preparePlanArrayForApi(data.greaterOfPlans as Plan[]);

        if (data.id) {
            return this.http.put<Contract>(`${this.contractCrud}/${data.id}`, data);
        }
        else {
            return this.http.post<Contract>(this.contractCrud, data);
        }
    }

    preparePlanArrayForApi(plans: Plan[]): number[][]{
        const changed: number[][] = [];

        let tempArr: number[] = [];

        plans.forEach((plan) => {
            if (plan.operationType === 'Plus') {
                changed.push(tempArr);
                tempArr = [];
            }

            tempArr.push(plan.id);
        })

        tempArr = tempArr.filter(Boolean)

        if(tempArr.length > 0)
            changed.push(tempArr);

        return changed;
    }

    preparePlanArrayForUi(plans: Plan[][]): Plan[] {
        plans.forEach((plan, index) => {
            plan.forEach((p, i) => {
                if (i==0 && index==0)
                    p.operationType = 'primary';
                else if (i==0) {
                    p.operationType = 'Plus';
                }
                else {
                    p.operationType = 'Or (greater of)';
                }
            })
        })

        return plans.flat();
    }

    testPlan(id: number, payload: TestContractPayload): Observable<TestContractResult> {
        return this.http.post<TestContractResult>(this.testContractUrl + `?contractId=${id}`, payload);
    }
}
