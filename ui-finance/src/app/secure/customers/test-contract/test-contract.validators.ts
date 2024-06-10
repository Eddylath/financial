import * as moment from "moment";

import { FormControl } from "@angular/forms";
import { Contract } from "../customers.types";

export function validateBillingMonth(contract: Contract): (group: FormControl) => void {
    return (control: FormControl): {contractNotExists: boolean} | null => {
        const contractEndDate = moment.utc(contract.contractEndDate);
        const billingDate = moment.utc(control.value);

        if (billingDate.isAfter(contractEndDate)) {
            return {contractNotExists: true};
        }
        
        return null;
    };
}
