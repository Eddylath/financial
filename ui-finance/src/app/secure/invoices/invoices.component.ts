import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Translationi18nKey, Translations } from 'src/app/translations.constants';
import { InvoicesService } from './invoices.service';

@UntilDestroy()
@Component({
    selector: 'tu-invoices',
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent {
    businessDataForm!: FormGroup;

    formId = 'business-data-form';

    translations: Translationi18nKey = Translations;

    constructor(
        private fb: FormBuilder,
        private service: InvoicesService
    ) {}

    ngOnInit(): void {
        this.businessDataForm = this.fb.group({
            month: '',
            businessIds: '',
        });
    }

    onSubmit() {
        console.log(this.businessDataForm.value)
    }

    downloadReport() {
        this.service.downloadCsvReport()
            .pipe(
                untilDestroyed(this),
            )
            .subscribe({
                next: (data: any) => {
                    debugger
                    saveAs(data, 'gsy.csv')
                },
                error: (e) => {
                    debugger
                    console.log('Report failed', e);
                }
            })
    }
}
