import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { UtilityService } from '../services/utility.service';

@Directive({
	selector: '[tuUtcValue]'
})
export class UtcValueDirective {
	constructor(
		private ngControl: NgControl,
		private util: UtilityService
	) { }

	@HostListener('dateChange', ['$event.target.value'])
	onInput(value: string): void {
		const localDate = new Date(value);

		const newDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

		this.ngControl.control?.setValue(newDate);
	}
}
