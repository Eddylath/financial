/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Translationi18nKey, Translations } from '../../../translations.constants';
import { BaseModalComponent } from '../components/base-modal/base-modal.component';

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class BaseModalService {

    public dialogRef: Record<string, MatDialogRef<any>> = {};

    translations: Translationi18nKey = Translations;

    public componentRef: any = {};

    readonly DEFAULT: string = 'default';

    constructor(
        public dialog: MatDialog,
    ) {}

    open(component: any, data: any, name: string = this.DEFAULT): MatDialogRef<any> {
        const watchLeaving = !!data.config?.watchLeaving;
        const modalConfig: MatDialogConfig = Object.assign({},
            data?.matDialogConfig || {},
            {
                hasBackdrop: watchLeaving, //adds an overlay behind the modal and restricts background actions
                disableClose: watchLeaving, //restricts closing on overlay actions
            });

        this.dialogRef[name] = this.dialog.open(BaseModalComponent, modalConfig);
        this.dialogRef[name].componentInstance.data = data.config;
        this.dialogRef[name].componentInstance.close = this.close.bind(this);
        this.dialogRef[name].componentInstance.watchLeaving = watchLeaving;

        this.renderComponent(component, data, name);

        return this.dialogRef[name];
    }

    close(data?: any, name: string = this.DEFAULT): void {
        if (
            this.dialogRef[name].componentInstance?.watchLeaving &&
            this.componentRef[name]?.instance?.isDirty() &&
            !confirm(this.translations['common']['abandonUnsavedChanges'])
        ) {
            return;
        }

        this.closeModal(data, name);
    }

    closeModal(data?: any, name: string = this.DEFAULT): void {
        if (this.dialogRef[name]) {
            this.dialogRef[name].close(data);
            delete this.dialogRef[name];
        }
    }

    renderComponent(component: any, data: any, name: string): void {
        this.dialogRef[name]
            .afterOpened()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                setTimeout(() => {
                    this.dialogRef[name].componentInstance.contentTemplate?.clear();
                    this.componentRef[name] = (
                        this.dialogRef[name].componentInstance.contentTemplate.createComponent(component)
                    );
                    Object.keys(data?.data || {}).forEach(element => {
                        /* setting output event emitters dynamically */
                        if (typeof data.data[element] === 'function') {
                            this.componentRef[name].instance[element]
                                .pipe(untilDestroyed(this))
                                .subscribe((res: any) => {
                                    data.data[element](res);
                                });
                        } else {
                            /* setting input params dynamically */
                            this.componentRef[name].instance[element] = data.data[element];
                        }
                    });

                    this.dialogRef[name].componentInstance.isLoading = false;
                }, 0);
            });
    }
}
