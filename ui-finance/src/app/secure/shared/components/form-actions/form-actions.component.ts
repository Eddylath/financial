import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { Translationi18nKey, Translations } from '../../../../translations.constants';

@Component({
    selector: 'tu-form-actions[formId]',
    templateUrl: './form-actions.component.html',
    styleUrls: ['./form-actions.component.scss'],
})
export class FormActionsComponent {
    @Input() formId!: string;

    @Input() formGroup!: FormGroup;

    @Input() valid = false;

    @Output() cancelForm: EventEmitter<void> = new EventEmitter<void>();

    @Output() submitForm: EventEmitter<void> = new EventEmitter<void>();

    translations: Translationi18nKey = Translations;

    markFormAsTouched(): void {
        if (this.formGroup) {
            this.formGroup.markAllAsTouched();
        }
    }
}
