import { FormGroup } from "@angular/forms";
import * as moment from "moment";

export function dateRangeValidation(start: string, end: string): (group: FormGroup) => void {
    return (group: FormGroup) => {
        const startDate = moment(group.get(start)?.value);
        const endDate = moment(group.get(end)?.value);

        if (
            startDate.isValid() &&
            endDate.isValid() &&
            moment(startDate).isAfter(endDate)
        ) {
            group.get(start)?.setErrors({dateRangeError: true});
        }
        else if (group.get(start)?.errors?.['dateRangeError']) {
            group.get(start)?.setErrors(null);
        }
    };
}