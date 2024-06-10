import { FormGroup } from "@angular/forms";

export function numberRangeValidation(start: string, end: string): (group: FormGroup) => void {
    return (group: FormGroup) => {
        const startNum = group.get(start)?.value;
        const endNum = group.get(end)?.value;

        if (
            startNum &&
            endNum &&
            startNum > endNum
        ) {
            group.get(start)?.setErrors({dateRangeError: true});
        }
        else {
            group.get(start)?.setErrors(null);
        }
    };
}