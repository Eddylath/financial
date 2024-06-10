/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
    selector: 'tu-base-modal',
    templateUrl: './base-modal.component.html',
    styleUrls: ['./base-modal.component.scss'],
})
export class BaseModalComponent {
    @Input() data: any;

    @ViewChild('contentTemplate', {read: ViewContainerRef}) contentTemplate: any = ViewContainerRef;

    public close: Function = () => {};
}
