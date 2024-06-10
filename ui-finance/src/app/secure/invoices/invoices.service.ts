import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlPrefix, AppUrls } from 'src/app/basic-data.constants';

@Injectable({
	providedIn: 'root'
})
export class InvoicesService {
	readonly downloadReport = UrlPrefix + AppUrls.invoices.downloadReport;

	constructor(private http: HttpClient) { }

	downloadCsvReport(): Observable<any> {
		return this.http.get<any>(this.downloadReport);
	}
}
