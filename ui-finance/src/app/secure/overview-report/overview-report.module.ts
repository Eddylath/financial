import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { OverviewReportComponent } from './overview-report.component';

const routes: Routes = [
    {path: '', component: OverviewReportComponent}
];


@NgModule({
	declarations: [
		OverviewReportComponent
	],
	imports: [
		RouterModule.forChild(routes)
	]
})
export class OverviewReportModule { }
